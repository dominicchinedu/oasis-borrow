import { INPUT_DEBOUNCE_TIME, Pages, Tracker } from 'analytics/analytics'
import BigNumber from 'bignumber.js'
import { zero } from 'helpers/zero'
import { isEqual } from 'lodash'
import { merge, Observable, zip } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators'

import { ManageVaultState } from './manageVault'

type GenerateAmountChange = {
  kind: 'generateAmountChange'
  value: { amount: BigNumber; setMax: boolean }
}

type DepositAmountChange = {
  kind: 'depositAmountChange'
  value: { amount: BigNumber; setMax: boolean }
}

type PaybackAmountChange = {
  kind: 'paybackAmountChange'
  value: { amount: BigNumber; setMax: boolean }
}

type WithdrawAmountChange = {
  kind: 'withdrawAmountChange'
  value: { amount: BigNumber; setMax: boolean }
}

type AllowanceChange = {
  kind: 'collateralAllowanceChange' | 'usdvAllowanceChange'
  value: {
    type:
      | Pick<ManageVaultState, 'selectedUsdvAllowanceRadio'>
      | Pick<ManageVaultState, 'selectedCollateralAllowanceRadio'>
    amount: BigNumber
  }
}

type ManageVaultConfirm = {
  kind: 'manageVaultConfirm'
  value: {
    ilk: string
    collateralAmount: BigNumber
    usdvAmount: BigNumber
  }
}

type ManageVaultConfirmTransaction = {
  kind: 'manageVaultConfirmTransaction'
  value: {
    ilk: string
    collateralAmount: BigNumber
    usdvAmount: BigNumber
    txHash: string
  }
}

export function createManageVaultAnalytics$(
  manageVaultState$: Observable<ManageVaultState>,
  tracker: Tracker,
) {
  const stageChanges = manageVaultState$.pipe(
    map((state) => state.stage),
    filter((stage) => stage === 'usdvEditing' || stage === 'collateralEditing'),
    distinctUntilChanged(isEqual),
  )

  const depositAmountChanges: Observable<DepositAmountChange> = manageVaultState$.pipe(
    map(({ depositAmount, maxDepositAmount }) => ({
      amount: depositAmount,
      setMax: depositAmount?.eq(maxDepositAmount),
    })),
    filter((value) => !!value.amount),
    distinctUntilChanged(isEqual),
    debounceTime(INPUT_DEBOUNCE_TIME),
    map((value) => ({
      kind: 'depositAmountChange',
      value,
    })),
  )

  const generateAmountChanges: Observable<GenerateAmountChange> = manageVaultState$.pipe(
    map(({ generateAmount, maxGenerateAmount }) => ({
      amount: generateAmount,
      setMax: generateAmount?.eq(maxGenerateAmount),
    })),
    filter((value) => !!value.amount),
    distinctUntilChanged(isEqual),
    debounceTime(INPUT_DEBOUNCE_TIME),
    map((value) => ({
      kind: 'generateAmountChange',
      value,
    })),
  )

  const paybackAmountChanges: Observable<PaybackAmountChange> = manageVaultState$.pipe(
    map(({ paybackAmount, maxPaybackAmount }) => ({
      amount: paybackAmount,
      setMax: paybackAmount?.eq(maxPaybackAmount),
    })),
    filter((value) => !!value.amount),
    distinctUntilChanged(isEqual),
    debounceTime(INPUT_DEBOUNCE_TIME),
    map((value) => ({
      kind: 'paybackAmountChange',
      value,
    })),
  )

  const withdrawAmountChanges: Observable<WithdrawAmountChange> = manageVaultState$.pipe(
    map(({ withdrawAmount, maxWithdrawAmount }) => ({
      amount: withdrawAmount,
      setMax: withdrawAmount?.eq(maxWithdrawAmount),
    })),
    filter((value) => !!value.amount),
    distinctUntilChanged(isEqual),
    debounceTime(INPUT_DEBOUNCE_TIME),
    map((value) => ({
      kind: 'withdrawAmountChange',
      value,
    })),
  )

  const collateralAllowanceTypeChanges: Observable<Pick<
    ManageVaultState,
    'selectedCollateralAllowanceRadio'
  >> = manageVaultState$.pipe(
    filter((state) => state.stage === 'collateralAllowanceWaitingForConfirmation'),
    map((state) => state.selectedCollateralAllowanceRadio),
    distinctUntilChanged(isEqual),
  )

  const collateralAllowanceAmountChanges: Observable<BigNumber> = manageVaultState$.pipe(
    map((state) => state.collateralAllowanceAmount),
    filter((amount) => !!amount),
    distinctUntilChanged(isEqual),
    debounceTime(INPUT_DEBOUNCE_TIME),
  )

  const collateralAllowanceChanges: Observable<AllowanceChange> = zip(
    collateralAllowanceTypeChanges,
    collateralAllowanceAmountChanges,
  ).pipe(
    map(([type, amount]) => ({
      kind: 'collateralAllowanceChange',
      value: {
        type,
        amount,
      },
    })),
  )

  const usdvAllowanceTypeChanges: Observable<Pick<
    ManageVaultState,
    'selectedUsdvAllowanceRadio'
  >> = manageVaultState$.pipe(
    filter((state) => state.stage === 'usdvAllowanceWaitingForConfirmation'),
    map((state) => state.selectedUsdvAllowanceRadio),
    distinctUntilChanged(isEqual),
  )

  const usdvAllowanceAmountChanges: Observable<BigNumber> = manageVaultState$.pipe(
    map((state) => state.usdvAllowanceAmount),
    filter((amount) => !!amount),
    distinctUntilChanged(isEqual),
    debounceTime(INPUT_DEBOUNCE_TIME),
  )

  const usdvAllowanceChanges: Observable<AllowanceChange> = zip(
    usdvAllowanceTypeChanges,
    usdvAllowanceAmountChanges,
  ).pipe(
    map(([type, amount]) => ({
      kind: 'usdvAllowanceChange',
      value: {
        type,
        amount,
      },
    })),
  )

  const manageVaultConfirm: Observable<ManageVaultConfirm> = manageVaultState$.pipe(
    filter((state) => state.stage === 'manageWaitingForApproval'),
    map(({ vault: { ilk }, depositAmount, withdrawAmount, generateAmount, paybackAmount }) => ({
      kind: 'manageVaultConfirm',
      value: {
        ilk: ilk,
        collateralAmount:
          depositAmount || (withdrawAmount ? withdrawAmount.times(new BigNumber(-1)) : zero),
        usdvAmount:
          generateAmount || (paybackAmount ? paybackAmount.times(new BigNumber(-1)) : zero),
      },
    })),
    distinctUntilChanged(isEqual),
  )

  const manageVaultConfirmTransaction: Observable<ManageVaultConfirmTransaction> = manageVaultState$.pipe(
    filter((state) => state.stage === 'manageInProgress'),
    map(
      ({
        vault: { ilk },
        depositAmount,
        withdrawAmount,
        generateAmount,
        paybackAmount,
        manageTxHash,
      }) => ({
        kind: 'manageVaultConfirmTransaction',
        value: {
          ilk: ilk,
          collateralAmount:
            depositAmount || (withdrawAmount ? withdrawAmount.times(new BigNumber(-1)) : zero),
          usdvAmount:
            generateAmount || (paybackAmount ? paybackAmount.times(new BigNumber(-1)) : zero),
          txHash: manageTxHash,
        },
      }),
    ),
    distinctUntilChanged(isEqual),
  )

  return stageChanges
    .pipe(
      switchMap((stage) =>
        merge(
          merge(
            depositAmountChanges,
            generateAmountChanges,
            paybackAmountChanges,
            withdrawAmountChanges,
            collateralAllowanceChanges,
            usdvAllowanceChanges,
          ),
          merge(manageVaultConfirm, manageVaultConfirmTransaction),
        ).pipe(
          tap((event) => {
            const page = stage === 'usdvEditing' ? Pages.ManageUsdv : Pages.ManageCollateral
            switch (event.kind) {
              case 'depositAmountChange':
                tracker.manageVaultDepositAmount(
                  page,
                  event.value.amount.toString(),
                  event.value.setMax,
                )
                break
              case 'generateAmountChange':
                tracker.manageVaultGenerateAmount(
                  page,
                  event.value.amount.toString(),
                  event.value.setMax,
                )
                break
              case 'paybackAmountChange':
                tracker.manageVaultPaybackAmount(
                  page,
                  event.value.amount.toString(),
                  event.value.setMax,
                )
                break
              case 'withdrawAmountChange':
                tracker.manageVaultWithdrawAmount(
                  page,
                  event.value.amount.toString(),
                  event.value.setMax,
                )
                break
              case 'collateralAllowanceChange':
                tracker.manageCollateralPickAllowance(
                  event.value.type.toString(),
                  event.value.amount.toString(),
                )
                break
              case 'usdvAllowanceChange':
                tracker.manageUsdvPickAllowance(
                  event.value.type.toString(),
                  event.value.amount.toString(),
                )
                break
              case 'manageVaultConfirm':
                tracker.manageVaultConfirm(
                  page,
                  event.value.ilk,
                  event.value.collateralAmount.toString(),
                  event.value.usdvAmount.toString(),
                )
                break
              case 'manageVaultConfirmTransaction':
                tracker.manageVaultConfirmTransaction(
                  page,
                  event.value.ilk,
                  event.value.collateralAmount.toString(),
                  event.value.usdvAmount.toString(),
                  event.value.txHash,
                )
                break
              default:
                throw new Error('Unhandled Scenario')
            }
          }),
        ),
      ),
    )
    .pipe()
}
