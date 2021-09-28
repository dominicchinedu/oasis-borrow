import { maxUint256 } from 'blockchain/calls/erc20'
import { TxHelpers } from 'components/AppContext'
import { zero } from 'helpers/zero'
import { Observable } from 'rxjs'

import { ManageVaultChange, ManageVaultEditingStage, ManageVaultState } from './manageVault'
import { manageVaultFormDefaults } from './manageVaultForm'
import {
  manageVaultDepositAndGenerate,
  manageVaultWithdrawAndPayback,
} from './manageVaultTransactions'

export type ManageVaultTransitionChange =
  | {
      kind: 'toggleEditing'
    }
  | {
      kind: 'progressEditing'
    }
  | {
      kind: 'progressProxy'
    }
  | {
      kind: 'progressCollateralAllowance'
    }
  | {
      kind: 'backToEditing'
    }
  | {
      kind: 'resetToEditing'
    }
  | {
      kind: 'regressCollateralAllowance'
    }
  | {
      kind: 'regressUsdvAllowance'
    }

export function applyManageVaultTransition(
  change: ManageVaultChange,
  state: ManageVaultState,
): ManageVaultState {
  if (change.kind === 'toggleEditing') {
    const { stage } = state
    const currentEditing = stage
    const otherEditing = (['collateralEditing', 'usdvEditing'] as ManageVaultEditingStage[]).find(
      (editingStage) => editingStage !== currentEditing,
    ) as ManageVaultEditingStage
    return {
      ...state,
      ...manageVaultFormDefaults,
      stage: otherEditing,
      originalEditingStage: otherEditing,
    }
  }

  if (change.kind === 'backToEditing') {
    const { originalEditingStage } = state
    return {
      ...state,
      stage: originalEditingStage,
    }
  }

  if (change.kind === 'regressCollateralAllowance') {
    const { originalEditingStage, stage } = state

    return {
      ...state,
      ...(stage === 'collateralAllowanceFailure'
        ? { stage: 'collateralAllowanceWaitingForConfirmation' }
        : {
            stage: originalEditingStage,
            collateralAllowanceAmount: maxUint256,
            selectedCollateralAllowanceRadio: 'unlimited',
          }),
    }
  }

  if (change.kind === 'regressUsdvAllowance') {
    const { originalEditingStage, stage } = state

    return {
      ...state,
      ...(stage === 'usdvAllowanceFailure'
        ? { stage: 'usdvAllowanceWaitingForConfirmation' }
        : {
            stage: originalEditingStage,
            usdvAllowanceAmount: maxUint256,
          selectedUsdvAllowanceRadio: 'unlimited',
          }),
    }
  }

  if (change.kind === 'resetToEditing') {
    const { originalEditingStage } = state
    return {
      ...state,
      ...manageVaultFormDefaults,
      stage: originalEditingStage,
    }
  }

  if (change.kind === 'progressEditing') {
    const {
      errorMessages,
      proxyAddress,
      depositAmount,
      paybackAmount,
      collateralAllowance,
      usdvAllowance,
      vault: { token, debtOffset },
    } = state
    const canProgress = !errorMessages.length
    const hasProxy = !!proxyAddress

    const isDepositZero = depositAmount ? depositAmount.eq(zero) : true
    const isPaybackZero = paybackAmount ? paybackAmount.eq(zero) : true

    const depositAmountLessThanCollateralAllowance =
      collateralAllowance && depositAmount && collateralAllowance.gte(depositAmount)

    const paybackAmountLessThanUsdvAllowance =
      usdvAllowance && paybackAmount && usdvAllowance.gte(paybackAmount.plus(debtOffset))

    const hasCollateralAllowance =
      token === 'VLX' ? true : depositAmountLessThanCollateralAllowance || isDepositZero

    const hasUsdvAllowance = paybackAmountLessThanUsdvAllowance || isPaybackZero

    if (canProgress) {
      if (!hasProxy) {
        return { ...state, stage: 'proxyWaitingForConfirmation' }
      }
      if (!hasCollateralAllowance) {
        return { ...state, stage: 'collateralAllowanceWaitingForConfirmation' }
      }
      if (!hasUsdvAllowance) {
        return { ...state, stage: 'usdvAllowanceWaitingForConfirmation' }
      }
      return { ...state, stage: 'manageWaitingForConfirmation' }
    }
  }

  if (change.kind === 'progressProxy') {
    const {
      originalEditingStage,
      depositAmount,
      paybackAmount,
      collateralAllowance,
      usdvAllowance,
      vault: { token, debtOffset },
    } = state
    const isDepositZero = depositAmount ? depositAmount.eq(zero) : true
    const isPaybackZero = paybackAmount ? paybackAmount.eq(zero) : true

    const depositAmountLessThanCollateralAllowance =
      collateralAllowance && depositAmount && collateralAllowance.gte(depositAmount)
    const paybackAmountLessThanUsdvAllowance =
      usdvAllowance && paybackAmount && usdvAllowance.gte(paybackAmount.plus(debtOffset))
    const hasCollateralAllowance =
      token === 'VLX' ? true : depositAmountLessThanCollateralAllowance || isDepositZero
    const hasUsdvAllowance = paybackAmountLessThanUsdvAllowance || isPaybackZero

    if (!hasCollateralAllowance) {
      return { ...state, stage: 'collateralAllowanceWaitingForConfirmation' }
    }
    if (!hasUsdvAllowance) {
      return { ...state, stage: 'usdvAllowanceWaitingForConfirmation' }
    }
    return { ...state, stage: originalEditingStage }
  }

  if (change.kind === 'progressCollateralAllowance') {
    const {
      originalEditingStage,
      paybackAmount,
      usdvAllowance,
      vault: { debtOffset },
    } = state
    const isPaybackZero = paybackAmount ? paybackAmount.eq(zero) : true
    const paybackAmountLessThanUsdvAllowance =
      usdvAllowance && paybackAmount && usdvAllowance.gte(paybackAmount.plus(debtOffset))
    const hasUsdvAllowance = paybackAmountLessThanUsdvAllowance || isPaybackZero

    if (!hasUsdvAllowance) {
      return { ...state, stage: 'usdvAllowanceWaitingForConfirmation' }
    }
    return { ...state, stage: originalEditingStage }
  }

  return state
}

export function progressManage(
  txHelpers$: Observable<TxHelpers>,
  state: ManageVaultState,
  change: (ch: ManageVaultChange) => void,
) {
  const { depositAmount, generateAmount } = state
  const isDepositAndGenerate = depositAmount || generateAmount

  if (isDepositAndGenerate) {
    return manageVaultDepositAndGenerate(txHelpers$, change, state)
  } else {
    return manageVaultWithdrawAndPayback(txHelpers$, change, state)
  }
}
