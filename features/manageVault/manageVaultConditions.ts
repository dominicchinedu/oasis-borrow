import { maxUint256 } from 'blockchain/calls/erc20'
import { isNullish } from 'helpers/functions'
import { UnreachableCaseError } from 'helpers/UnreachableCaseError'
import { zero } from 'helpers/zero'

import { ManageVaultStage, ManageVaultState } from './manageVault'

const defaultManageVaultStageCategories = {
  isEditingStage: false,
  isProxyStage: false,
  isCollateralAllowanceStage: false,
  isUsdvAllowanceStage: false,
  isManageStage: false,
}

export function applyManageVaultStageCategorisation(state: ManageVaultState) {
  switch (state.stage) {
    case 'collateralEditing':
    case 'usdvEditing':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isEditingStage: true,
      }
    case 'proxyWaitingForConfirmation':
    case 'proxyWaitingForApproval':
    case 'proxyInProgress':
    case 'proxyFailure':
    case 'proxySuccess':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isProxyStage: true,
      }
    case 'collateralAllowanceWaitingForConfirmation':
    case 'collateralAllowanceWaitingForApproval':
    case 'collateralAllowanceInProgress':
    case 'collateralAllowanceFailure':
    case 'collateralAllowanceSuccess':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isCollateralAllowanceStage: true,
      }
    case 'usdvAllowanceWaitingForConfirmation':
    case 'usdvAllowanceWaitingForApproval':
    case 'usdvAllowanceInProgress':
    case 'usdvAllowanceFailure':
    case 'usdvAllowanceSuccess':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isUsdvAllowanceStage: true,
      }

    case 'manageWaitingForConfirmation':
    case 'manageWaitingForApproval':
    case 'manageInProgress':
    case 'manageFailure':
    case 'manageSuccess':
      return {
        ...state,
        ...defaultManageVaultStageCategories,
        isManageStage: true,
      }
    default:
      throw new UnreachableCaseError(state.stage)
  }
}

export interface ManageVaultConditions {
  isEditingStage: boolean
  isProxyStage: boolean
  isCollateralAllowanceStage: boolean
  isUsdvAllowanceStage: boolean
  isManageStage: boolean

  canProgress: boolean
  canRegress: boolean

  depositAndWithdrawAmountsEmpty: boolean
  generateAndPaybackAmountsEmpty: boolean
  inputAmountsEmpty: boolean

  vaultWillBeAtRiskLevelWarning: boolean
  vaultWillBeAtRiskLevelDanger: boolean
  vaultWillBeUnderCollateralized: boolean

  vaultWillBeAtRiskLevelWarningAtNextPrice: boolean
  vaultWillBeAtRiskLevelDangerAtNextPrice: boolean
  vaultWillBeUnderCollateralizedAtNextPrice: boolean

  accountIsConnected: boolean
  accountIsController: boolean

  depositingAllVlxBalance: boolean
  depositAmountExceedsCollateralBalance: boolean
  withdrawAmountExceedsFreeCollateral: boolean
  withdrawAmountExceedsFreeCollateralAtNextPrice: boolean
  generateAmountExceedsUsdvYieldFromTotalCollateral: boolean
  generateAmountExceedsUsdvYieldFromTotalCollateralAtNextPrice: boolean
  generateAmountLessThanDebtFloor: boolean
  generateAmountExceedsDebtCeiling: boolean
  paybackAmountExceedsVaultDebt: boolean
  paybackAmountExceedsUsdvBalance: boolean

  debtWillBeLessThanDebtFloor: boolean
  isLoadingStage: boolean

  insufficientCollateralAllowance: boolean
  customCollateralAllowanceAmountEmpty: boolean
  customCollateralAllowanceAmountExceedsMaxUint256: boolean
  customCollateralAllowanceAmountLessThanDepositAmount: boolean

  insufficientUsdvAllowance: boolean
  customUsdvAllowanceAmountEmpty: boolean
  customUsdvAllowanceAmountExceedsMaxUint256: boolean
  customUsdvAllowanceAmountLessThanPaybackAmount: boolean
  withdrawCollateralOnVaultUnderDebtFloor: boolean
  depositCollateralOnVaultUnderDebtFloor: boolean
}

export const defaultManageVaultConditions: ManageVaultConditions = {
  ...defaultManageVaultStageCategories,
  canProgress: false,
  canRegress: false,

  vaultWillBeAtRiskLevelWarning: false,
  vaultWillBeAtRiskLevelDanger: false,
  vaultWillBeUnderCollateralized: false,

  vaultWillBeAtRiskLevelWarningAtNextPrice: false,
  vaultWillBeAtRiskLevelDangerAtNextPrice: false,
  vaultWillBeUnderCollateralizedAtNextPrice: false,

  depositAndWithdrawAmountsEmpty: true,
  generateAndPaybackAmountsEmpty: true,
  inputAmountsEmpty: true,

  accountIsConnected: false,
  accountIsController: false,

  depositingAllVlxBalance: false,
  depositAmountExceedsCollateralBalance: false,
  withdrawAmountExceedsFreeCollateral: false,
  withdrawAmountExceedsFreeCollateralAtNextPrice: false,
  generateAmountExceedsUsdvYieldFromTotalCollateral: false,
  generateAmountExceedsUsdvYieldFromTotalCollateralAtNextPrice: false,
  generateAmountLessThanDebtFloor: false,
  generateAmountExceedsDebtCeiling: false,
  paybackAmountExceedsVaultDebt: false,
  paybackAmountExceedsUsdvBalance: false,

  debtWillBeLessThanDebtFloor: false,
  isLoadingStage: false,

  insufficientCollateralAllowance: false,
  customCollateralAllowanceAmountEmpty: false,
  customCollateralAllowanceAmountExceedsMaxUint256: false,
  customCollateralAllowanceAmountLessThanDepositAmount: false,

  insufficientUsdvAllowance: false,
  customUsdvAllowanceAmountEmpty: false,
  customUsdvAllowanceAmountExceedsMaxUint256: false,
  customUsdvAllowanceAmountLessThanPaybackAmount: false,

  withdrawCollateralOnVaultUnderDebtFloor: false,
  depositCollateralOnVaultUnderDebtFloor: false,
}

export function applyManageVaultConditions(state: ManageVaultState): ManageVaultState {
  const {
    depositAmount,
    generateAmount,
    withdrawAmount,
    paybackAmount,
    afterCollateralizationRatio,
    afterCollateralizationRatioAtNextPrice,
    ilkData,
    vault,
    account,
    stage,
    selectedCollateralAllowanceRadio,
    selectedUsdvAllowanceRadio,
    collateralAllowanceAmount,
    usdvAllowanceAmount,
    collateralAllowance,
    usdvAllowance,
    shouldPaybackAll,
    balanceInfo: { collateralBalance, usdvBalance },
    isEditingStage,
    isCollateralAllowanceStage,
    isUsdvAllowanceStage,
    maxWithdrawAmountAtCurrentPrice,
    maxWithdrawAmountAtNextPrice,
    maxGenerateAmountAtCurrentPrice,
    maxGenerateAmountAtNextPrice,
    afterDebt,
  } = state

  const depositAndWithdrawAmountsEmpty = isNullish(depositAmount) && isNullish(withdrawAmount)
  const generateAndPaybackAmountsEmpty = isNullish(generateAmount) && isNullish(paybackAmount)

  const inputAmountsEmpty = depositAndWithdrawAmountsEmpty && generateAndPaybackAmountsEmpty

  const vaultWillBeAtRiskLevelDanger =
    !inputAmountsEmpty &&
    afterCollateralizationRatio.gte(ilkData.liquidationRatio) &&
    afterCollateralizationRatio.lte(ilkData.collateralizationDangerThreshold)

  const vaultWillBeAtRiskLevelDangerAtNextPrice =
    !vaultWillBeAtRiskLevelDanger &&
    !inputAmountsEmpty &&
    afterCollateralizationRatioAtNextPrice.gte(ilkData.liquidationRatio) &&
    afterCollateralizationRatioAtNextPrice.lte(ilkData.collateralizationDangerThreshold)

  const vaultWillBeAtRiskLevelWarning =
    !inputAmountsEmpty &&
    afterCollateralizationRatio.gt(ilkData.collateralizationDangerThreshold) &&
    afterCollateralizationRatio.lte(ilkData.collateralizationWarningThreshold)

  const vaultWillBeAtRiskLevelWarningAtNextPrice =
    !vaultWillBeAtRiskLevelWarning &&
    !inputAmountsEmpty &&
    afterCollateralizationRatioAtNextPrice.gt(ilkData.collateralizationDangerThreshold) &&
    afterCollateralizationRatioAtNextPrice.lte(ilkData.collateralizationWarningThreshold)

  const vaultWillBeUnderCollateralized =
    !inputAmountsEmpty &&
    afterCollateralizationRatio.lt(ilkData.liquidationRatio) &&
    !afterCollateralizationRatio.isZero()

  const vaultWillBeUnderCollateralizedAtNextPrice =
    !vaultWillBeUnderCollateralized &&
    !inputAmountsEmpty &&
    afterCollateralizationRatioAtNextPrice.lt(ilkData.liquidationRatio) &&
    !afterCollateralizationRatioAtNextPrice.isZero()

  const accountIsConnected = !!account
  const accountIsController = accountIsConnected ? account === vault.controller : true

  const depositAmountExceedsCollateralBalance = !!depositAmount?.gt(collateralBalance)

  const depositingAllVlxBalance = vault.token === 'VLX' && !!depositAmount?.eq(collateralBalance)

  const withdrawAmountExceedsFreeCollateral = !!withdrawAmount?.gt(maxWithdrawAmountAtCurrentPrice)

  const withdrawAmountExceedsFreeCollateralAtNextPrice =
    !withdrawAmountExceedsFreeCollateral && !!withdrawAmount?.gt(maxWithdrawAmountAtNextPrice)

  const generateAmountExceedsDebtCeiling = !!generateAmount?.gt(ilkData.ilkDebtAvailable)

  const generateAmountExceedsUsdvYieldFromTotalCollateral =
    !generateAmountExceedsDebtCeiling && !!generateAmount?.gt(maxGenerateAmountAtCurrentPrice)

  const generateAmountExceedsUsdvYieldFromTotalCollateralAtNextPrice =
    !generateAmountExceedsDebtCeiling &&
    !generateAmountExceedsUsdvYieldFromTotalCollateral &&
    !!generateAmount?.gt(maxGenerateAmountAtNextPrice)

  const generateAmountLessThanDebtFloor = !!(
    generateAmount &&
    !generateAmount.plus(vault.debt).isZero() &&
    generateAmount.plus(vault.debt).lt(ilkData.debtFloor)
  )

  const paybackAmountExceedsUsdvBalance = !!paybackAmount?.gt(usdvBalance)
  const paybackAmountExceedsVaultDebt = !!paybackAmount?.gt(vault.debt)

  const debtWillBeLessThanDebtFloor = !!(
    paybackAmount &&
    vault.debt.minus(paybackAmount).lt(ilkData.debtFloor) &&
    vault.debt.minus(paybackAmount).gt(zero) &&
    !shouldPaybackAll
  )

  const customCollateralAllowanceAmountEmpty =
    selectedCollateralAllowanceRadio === 'custom' && !collateralAllowanceAmount

  const customUsdvAllowanceAmountEmpty =
    selectedUsdvAllowanceRadio === 'custom' && !usdvAllowanceAmount

  const customCollateralAllowanceAmountExceedsMaxUint256 = !!(
    selectedCollateralAllowanceRadio === 'custom' && collateralAllowanceAmount?.gt(maxUint256)
  )

  const customCollateralAllowanceAmountLessThanDepositAmount = !!(
    selectedCollateralAllowanceRadio === 'custom' &&
    collateralAllowanceAmount &&
    depositAmount &&
    collateralAllowanceAmount.lt(depositAmount)
  )

  const customUsdvAllowanceAmountExceedsMaxUint256 = !!(
    selectedUsdvAllowanceRadio === 'custom' && usdvAllowanceAmount?.gt(maxUint256)
  )

  const customUsdvAllowanceAmountLessThanPaybackAmount = !!(
    selectedUsdvAllowanceRadio === 'custom' &&
    usdvAllowanceAmount &&
    paybackAmount &&
    usdvAllowanceAmount.lt(paybackAmount)
  )

  const insufficientCollateralAllowance =
    vault.token !== 'VLX' &&
    !!(
      depositAmount &&
      !depositAmount.isZero() &&
      (!collateralAllowance || depositAmount.gt(collateralAllowance))
    )

  const insufficientUsdvAllowance = !!(
    paybackAmount &&
    !paybackAmount.isZero() &&
    (!usdvAllowance || paybackAmount.plus(vault.debtOffset).gt(usdvAllowance))
  )

  const isLoadingStage = ([
    'proxyInProgress',
    'proxyWaitingForApproval',
    'collateralAllowanceWaitingForApproval',
    'collateralAllowanceInProgress',
    'usdvAllowanceWaitingForApproval',
    'usdvAllowanceInProgress',
    'manageInProgress',
    'manageWaitingForApproval',
  ] as ManageVaultStage[]).some((s) => s === stage)

  const withdrawCollateralOnVaultUnderDebtFloor =
    vault.debt.gt(zero) &&
    vault.debt.lt(ilkData.debtFloor) &&
    withdrawAmount !== undefined &&
    withdrawAmount.gt(zero) &&
    (paybackAmount === undefined || paybackAmount.lt(vault.debt))

  const depositCollateralOnVaultUnderDebtFloor =
    vault.debt.gt(zero) &&
    vault.debt.lt(ilkData.debtFloor) &&
    depositAmount !== undefined &&
    depositAmount.lt(ilkData.debtFloor) &&
    afterDebt.lt(ilkData.debtFloor)

  const editingProgressionDisabled =
    isEditingStage &&
    (inputAmountsEmpty ||
      !vault.controller ||
      !accountIsConnected ||
      vaultWillBeUnderCollateralized ||
      vaultWillBeUnderCollateralizedAtNextPrice ||
      debtWillBeLessThanDebtFloor ||
      depositAmountExceedsCollateralBalance ||
      withdrawAmountExceedsFreeCollateral ||
      withdrawAmountExceedsFreeCollateralAtNextPrice ||
      depositingAllVlxBalance ||
      generateAmountExceedsDebtCeiling ||
      generateAmountLessThanDebtFloor ||
      paybackAmountExceedsUsdvBalance ||
      paybackAmountExceedsVaultDebt ||
      withdrawCollateralOnVaultUnderDebtFloor ||
      depositCollateralOnVaultUnderDebtFloor)

  const collateralAllowanceProgressionDisabled =
    isCollateralAllowanceStage &&
    (customCollateralAllowanceAmountEmpty ||
      customCollateralAllowanceAmountExceedsMaxUint256 ||
      customCollateralAllowanceAmountLessThanDepositAmount)

  const usdvAllowanceProgressionDisabled =
    isUsdvAllowanceStage &&
    (customUsdvAllowanceAmountEmpty ||
      customUsdvAllowanceAmountExceedsMaxUint256 ||
      customUsdvAllowanceAmountLessThanPaybackAmount)

  const canProgress = !(
    isLoadingStage ||
    editingProgressionDisabled ||
    collateralAllowanceProgressionDisabled ||
    usdvAllowanceProgressionDisabled
  )

  const canRegress = ([
    'proxyWaitingForConfirmation',
    'proxyFailure',
    'collateralAllowanceWaitingForConfirmation',
    'collateralAllowanceFailure',
    'usdvAllowanceWaitingForConfirmation',
    'usdvAllowanceFailure',
    'manageWaitingForConfirmation',
    'manageFailure',
  ] as ManageVaultStage[]).some((s) => s === stage)

  return {
    ...state,
    canProgress,
    canRegress,

    depositAndWithdrawAmountsEmpty,
    generateAndPaybackAmountsEmpty,
    inputAmountsEmpty,

    vaultWillBeAtRiskLevelWarning,
    vaultWillBeAtRiskLevelWarningAtNextPrice,
    vaultWillBeAtRiskLevelDanger,
    vaultWillBeAtRiskLevelDangerAtNextPrice,
    vaultWillBeUnderCollateralized,
    vaultWillBeUnderCollateralizedAtNextPrice,

    accountIsConnected,
    accountIsController,
    depositingAllVlxBalance,
    generateAmountExceedsDebtCeiling,
    depositAmountExceedsCollateralBalance,
    withdrawAmountExceedsFreeCollateral,
    withdrawAmountExceedsFreeCollateralAtNextPrice,
    generateAmountExceedsUsdvYieldFromTotalCollateral,
    generateAmountExceedsUsdvYieldFromTotalCollateralAtNextPrice,
    generateAmountLessThanDebtFloor,
    paybackAmountExceedsUsdvBalance,
    paybackAmountExceedsVaultDebt,
    shouldPaybackAll,
    debtWillBeLessThanDebtFloor,
    isLoadingStage,

    insufficientCollateralAllowance,
    customCollateralAllowanceAmountEmpty,
    customCollateralAllowanceAmountExceedsMaxUint256,
    customCollateralAllowanceAmountLessThanDepositAmount,

    insufficientUsdvAllowance,
    customUsdvAllowanceAmountEmpty,
    customUsdvAllowanceAmountExceedsMaxUint256,
    customUsdvAllowanceAmountLessThanPaybackAmount,

    withdrawCollateralOnVaultUnderDebtFloor,
    depositCollateralOnVaultUnderDebtFloor,
  }
}
