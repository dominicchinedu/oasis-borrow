import { isNullish } from 'helpers/functions'
import { zero } from 'helpers/zero'

import { ManageVaultState } from './manageVault'

export type ManageVaultErrorMessage =
  | 'depositAmountExceedsCollateralBalance'
  | 'withdrawAmountExceedsFreeCollateral'
  | 'withdrawAmountExceedsFreeCollateralAtNextPrice'
  | 'generateAmountExceedsUsdvYieldFromTotalCollateral'
  | 'generateAmountExceedsUsdvYieldFromTotalCollateralAtNextPrice'
  | 'generateAmountExceedsDebtCeiling'
  | 'generateAmountLessThanDebtFloor'
  | 'paybackAmountExceedsUsdvBalance'
  | 'paybackAmountExceedsVaultDebt'
  | 'debtWillBeLessThanDebtFloor'
  | 'customCollateralAllowanceAmountExceedsMaxUint256'
  | 'customCollateralAllowanceAmountLessThanDepositAmount'
  | 'customUsdvAllowanceAmountExceedsMaxUint256'
  | 'customUsdvAllowanceAmountLessThanPaybackAmount'
  | 'depositingAllVlxBalance'
  | 'ledgerWalletContractDataDisabled'
  | 'withdrawCollateralOnVaultUnderDebtFloor'
  | 'depositCollateralOnVaultUnderDebtFloor'

export type ManageVaultWarningMessage =
  | 'potentialGenerateAmountLessThanDebtFloor'
  | 'debtIsLessThanDebtFloor'
  | 'vaultWillBeAtRiskLevelDanger'
  | 'vaultWillBeAtRiskLevelWarning'
  | 'vaultWillBeAtRiskLevelDangerAtNextPrice'
  | 'vaultWillBeAtRiskLevelWarningAtNextPrice'

export function validateErrors(state: ManageVaultState): ManageVaultState {
  const {
    stage,
    withdrawAmountExceedsFreeCollateral,
    withdrawAmountExceedsFreeCollateralAtNextPrice,
    generateAmountExceedsUsdvYieldFromTotalCollateral,
    generateAmountExceedsUsdvYieldFromTotalCollateralAtNextPrice,
    generateAmountLessThanDebtFloor,
    debtWillBeLessThanDebtFloor,
    isEditingStage,
    customCollateralAllowanceAmountExceedsMaxUint256,
    customCollateralAllowanceAmountLessThanDepositAmount,
    customUsdvAllowanceAmountExceedsMaxUint256,
    customUsdvAllowanceAmountLessThanPaybackAmount,
    depositAmountExceedsCollateralBalance,
    depositingAllVlxBalance,
    generateAmountExceedsDebtCeiling,
    paybackAmountExceedsUsdvBalance,
    paybackAmountExceedsVaultDebt,
    withdrawCollateralOnVaultUnderDebtFloor,
    depositCollateralOnVaultUnderDebtFloor,
  } = state

  const errorMessages: ManageVaultErrorMessage[] = []

  if (isEditingStage) {
    if (depositAmountExceedsCollateralBalance) {
      errorMessages.push('depositAmountExceedsCollateralBalance')
    }

    if (withdrawAmountExceedsFreeCollateral) {
      errorMessages.push('withdrawAmountExceedsFreeCollateral')
    }

    if (withdrawAmountExceedsFreeCollateralAtNextPrice) {
      errorMessages.push('withdrawAmountExceedsFreeCollateralAtNextPrice')
    }

    if (generateAmountExceedsUsdvYieldFromTotalCollateral) {
      errorMessages.push('generateAmountExceedsUsdvYieldFromTotalCollateral')
    }

    if (generateAmountExceedsUsdvYieldFromTotalCollateralAtNextPrice) {
      errorMessages.push('generateAmountExceedsUsdvYieldFromTotalCollateralAtNextPrice')
    }

    if (generateAmountExceedsDebtCeiling) {
      errorMessages.push('generateAmountExceedsDebtCeiling')
    }

    if (generateAmountLessThanDebtFloor) {
      errorMessages.push('generateAmountLessThanDebtFloor')
    }

    if (paybackAmountExceedsUsdvBalance) {
      errorMessages.push('paybackAmountExceedsUsdvBalance')
    }

    if (paybackAmountExceedsVaultDebt) {
      errorMessages.push('paybackAmountExceedsVaultDebt')
    }

    if (depositingAllVlxBalance) {
      errorMessages.push('depositingAllVlxBalance')
    }

    if (debtWillBeLessThanDebtFloor) {
      errorMessages.push('debtWillBeLessThanDebtFloor')
    }

    if (withdrawCollateralOnVaultUnderDebtFloor) {
      errorMessages.push('withdrawCollateralOnVaultUnderDebtFloor')
    }
    if (depositCollateralOnVaultUnderDebtFloor) {
      errorMessages.push('depositCollateralOnVaultUnderDebtFloor')
    }
  }

  if (stage === 'collateralAllowanceWaitingForConfirmation') {
    if (customCollateralAllowanceAmountExceedsMaxUint256) {
      errorMessages.push('customCollateralAllowanceAmountExceedsMaxUint256')
    }
    if (customCollateralAllowanceAmountLessThanDepositAmount) {
      errorMessages.push('customCollateralAllowanceAmountLessThanDepositAmount')
    }
  }

  if (stage === 'usdvAllowanceWaitingForConfirmation') {
    if (customUsdvAllowanceAmountExceedsMaxUint256) {
      errorMessages.push('customUsdvAllowanceAmountExceedsMaxUint256')
    }
    if (customUsdvAllowanceAmountLessThanPaybackAmount) {
      errorMessages.push('customUsdvAllowanceAmountLessThanPaybackAmount')
    }
  }

  if (
    stage === 'manageFailure' ||
    stage === 'proxyFailure' ||
    stage === 'usdvAllowanceFailure' ||
    stage === 'collateralAllowanceFailure'
  ) {
    if (state.txError?.name === 'VlxAppPleaseEnableContractData') {
      errorMessages.push('ledgerWalletContractDataDisabled')
    }
  }

  return { ...state, errorMessages }
}

export function validateWarnings(state: ManageVaultState): ManageVaultState {
  const {
    depositAmount,
    vault,
    ilkData,
    errorMessages,
    isEditingStage,
    vaultWillBeAtRiskLevelDanger,
    vaultWillBeAtRiskLevelDangerAtNextPrice,
    vaultWillBeAtRiskLevelWarning,
    vaultWillBeAtRiskLevelWarningAtNextPrice,
    maxGenerateAmountAtCurrentPrice,
  } = state

  const warningMessages: ManageVaultWarningMessage[] = []

  if (errorMessages.length) return { ...state, warningMessages }

  if (isEditingStage) {
    if (!isNullish(depositAmount) && maxGenerateAmountAtCurrentPrice.lt(ilkData.debtFloor)) {
      warningMessages.push('potentialGenerateAmountLessThanDebtFloor')
    }

    if (vault.debt.lt(ilkData.debtFloor) && vault.debt.gt(zero)) {
      warningMessages.push('debtIsLessThanDebtFloor')
    }

    if (vaultWillBeAtRiskLevelDanger) {
      warningMessages.push('vaultWillBeAtRiskLevelDanger')
    }

    if (vaultWillBeAtRiskLevelDangerAtNextPrice) {
      warningMessages.push('vaultWillBeAtRiskLevelDangerAtNextPrice')
    }

    if (vaultWillBeAtRiskLevelWarning) {
      warningMessages.push('vaultWillBeAtRiskLevelWarning')
    }

    if (vaultWillBeAtRiskLevelWarningAtNextPrice) {
      warningMessages.push('vaultWillBeAtRiskLevelWarningAtNextPrice')
    }
  }
  return { ...state, warningMessages }
}
