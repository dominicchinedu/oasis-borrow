import { isNullish } from 'helpers/functions'

import { OpenVaultState } from './openVault'

export type OpenVaultErrorMessage =
  | 'depositAmountExceedsCollateralBalance'
  | 'depositingAllVlxBalance'
  | 'generateAmountExceedsUsdvYieldFromDepositingCollateral'
  | 'generateAmountExceedsUsdvYieldFromDepositingCollateralAtNextPrice'
  | 'generateAmountExceedsDebtCeiling'
  | 'generateAmountLessThanDebtFloor'
  | 'customAllowanceAmountExceedsMaxUint256'
  | 'customAllowanceAmountLessThanDepositAmount'
  | 'ledgerWalletContractDataDisabled'

export function validateErrors(state: OpenVaultState): OpenVaultState {
  const {
    depositAmount,
    balanceInfo,
    stage,
    isEditingStage,
    depositingAllVlxBalance,
    generateAmountExceedsUsdvYieldFromDepositingCollateral,
    generateAmountExceedsUsdvYieldFromDepositingCollateralAtNextPrice,
    generateAmountExceedsDebtCeiling,
    generateAmountLessThanDebtFloor,
    customAllowanceAmountExceedsMaxUint256,
    customAllowanceAmountLessThanDepositAmount,
  } = state
  const errorMessages: OpenVaultErrorMessage[] = []

  if (isEditingStage) {
    if (depositAmount?.gt(balanceInfo.collateralBalance)) {
      errorMessages.push('depositAmountExceedsCollateralBalance')
    }

    if (depositingAllVlxBalance) {
      errorMessages.push('depositingAllVlxBalance')
    }

    if (generateAmountExceedsUsdvYieldFromDepositingCollateral) {
      errorMessages.push('generateAmountExceedsUsdvYieldFromDepositingCollateral')
    }

    if (generateAmountExceedsUsdvYieldFromDepositingCollateralAtNextPrice) {
      errorMessages.push('generateAmountExceedsUsdvYieldFromDepositingCollateralAtNextPrice')
    }

    if (generateAmountExceedsDebtCeiling) {
      errorMessages.push('generateAmountExceedsDebtCeiling')
    }

    if (generateAmountLessThanDebtFloor) {
      errorMessages.push('generateAmountLessThanDebtFloor')
    }
  }

  if (stage === 'allowanceWaitingForConfirmation') {
    if (customAllowanceAmountExceedsMaxUint256) {
      errorMessages.push('customAllowanceAmountExceedsMaxUint256')
    }
    if (customAllowanceAmountLessThanDepositAmount) {
      errorMessages.push('customAllowanceAmountLessThanDepositAmount')
    }
  }

  if (stage === 'openFailure' || stage === 'proxyFailure' || stage === 'allowanceFailure') {
    if (state.txError?.name === 'VlxAppPleaseEnableContractData') {
      errorMessages.push('ledgerWalletContractDataDisabled')
    }
  }

  return { ...state, errorMessages }
}

export type OpenVaultWarningMessage =
  | 'potentialGenerateAmountLessThanDebtFloor'
  | 'vaultWillBeAtRiskLevelDanger'
  | 'vaultWillBeAtRiskLevelWarning'
  | 'vaultWillBeAtRiskLevelDangerAtNextPrice'
  | 'vaultWillBeAtRiskLevelWarningAtNextPrice'

export function validateWarnings(state: OpenVaultState): OpenVaultState {
  const {
    depositAmount,
    errorMessages,
    usdvYieldFromDepositingCollateral,
    ilkData,
    isEditingStage,
    vaultWillBeAtRiskLevelDanger,
    vaultWillBeAtRiskLevelDangerAtNextPrice,
    vaultWillBeAtRiskLevelWarning,
    vaultWillBeAtRiskLevelWarningAtNextPrice,
  } = state

  const warningMessages: OpenVaultWarningMessage[] = []

  if (errorMessages.length) return { ...state, warningMessages }

  if (isEditingStage) {
    if (!isNullish(depositAmount) && usdvYieldFromDepositingCollateral.lt(ilkData.debtFloor)) {
      warningMessages.push('potentialGenerateAmountLessThanDebtFloor')
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
