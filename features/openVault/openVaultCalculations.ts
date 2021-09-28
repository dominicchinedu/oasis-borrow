import { BigNumber } from 'bignumber.js'
import { zero } from 'helpers/zero'

import { OpenVaultState } from './openVault'

export interface OpenVaultCalculations {
  afterLiquidationPrice: BigNumber
  afterCollateralizationRatio: BigNumber
  afterCollateralizationRatioAtNextPrice: BigNumber
  usdvYieldFromDepositingCollateral: BigNumber
  usdvYieldFromDepositingCollateralAtNextPrice: BigNumber
  afterFreeCollateral: BigNumber
  maxDepositAmount: BigNumber
  maxDepositAmountUSD: BigNumber
  maxGenerateAmount: BigNumber
  maxGenerateAmountCurrentPrice: BigNumber
  maxGenerateAmountNextPrice: BigNumber
  afterCollateralBalance: BigNumber
}

export const defaultOpenVaultStateCalculations: OpenVaultCalculations = {
  maxDepositAmount: zero,
  maxDepositAmountUSD: zero,
  maxGenerateAmount: zero,
  maxGenerateAmountCurrentPrice: zero,
  maxGenerateAmountNextPrice: zero,
  afterCollateralizationRatio: zero,
  afterCollateralizationRatioAtNextPrice: zero,
  usdvYieldFromDepositingCollateral: zero,
  usdvYieldFromDepositingCollateralAtNextPrice: zero,
  afterLiquidationPrice: zero,
  afterFreeCollateral: zero,
  afterCollateralBalance: zero,
}

export function applyOpenVaultCalculations(state: OpenVaultState): OpenVaultState {
  const {
    depositAmount,
    depositAmountUSD,
    generateAmount,
    balanceInfo: { collateralBalance },
    priceInfo: { currentCollateralPrice, nextCollateralPrice },
    ilkData: { ilkDebtAvailable, liquidationRatio },
  } = state

  const depositAmountUSDAtNextPrice = depositAmount
    ? depositAmount.times(nextCollateralPrice)
    : zero

  const afterBackingCollateral = generateAmount
    ? generateAmount.times(liquidationRatio).div(currentCollateralPrice)
    : zero

  const afterFreeCollateral = depositAmount ? depositAmount.minus(afterBackingCollateral) : zero

  const maxDepositAmount = collateralBalance
  const maxDepositAmountUSD = collateralBalance.times(currentCollateralPrice)

  const usdvYieldFromDepositingCollateral = depositAmount
    ? depositAmount.times(currentCollateralPrice).div(liquidationRatio)
    : zero

  const usdvYieldFromDepositingCollateralAtNextPrice = depositAmount
    ? depositAmount.times(nextCollateralPrice).div(liquidationRatio)
    : zero

  const maxGenerateAmountCurrentPrice = usdvYieldFromDepositingCollateral.gt(ilkDebtAvailable)
    ? ilkDebtAvailable
    : usdvYieldFromDepositingCollateral

  const maxGenerateAmountNextPrice = usdvYieldFromDepositingCollateralAtNextPrice.gt(
    ilkDebtAvailable,
  )
    ? ilkDebtAvailable
    : usdvYieldFromDepositingCollateralAtNextPrice

  const maxGenerateAmount = BigNumber.minimum(
    maxGenerateAmountCurrentPrice,
    maxGenerateAmountNextPrice,
  )

  const afterCollateralizationRatio =
    generateAmount && depositAmountUSD && !generateAmount.isZero()
      ? depositAmountUSD.div(generateAmount)
      : zero

  const afterCollateralizationRatioAtNextPrice =
    generateAmount && !generateAmount.isZero()
      ? depositAmountUSDAtNextPrice.div(generateAmount)
      : zero

  const afterLiquidationPrice =
    generateAmount && depositAmount && depositAmount.gt(zero)
      ? generateAmount.times(liquidationRatio).div(depositAmount)
      : zero

  const afterCollateralBalance = depositAmount
    ? collateralBalance.minus(depositAmount)
    : collateralBalance

  return {
    ...state,
    maxDepositAmount,
    maxDepositAmountUSD,
    maxGenerateAmount,
    maxGenerateAmountCurrentPrice,
    maxGenerateAmountNextPrice,
    afterCollateralizationRatio,
    afterCollateralizationRatioAtNextPrice,
    usdvYieldFromDepositingCollateral,
    usdvYieldFromDepositingCollateralAtNextPrice,
    afterLiquidationPrice,
    afterFreeCollateral,
    afterCollateralBalance,
  }
}
