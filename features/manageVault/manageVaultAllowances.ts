import { BigNumber } from 'bignumber.js'
import { maxUint256 } from 'blockchain/calls/erc20'

import { ManageVaultChange, ManageVaultState } from './manageVault'

export const allowanceDefaults: Partial<ManageVaultState> = {
  collateralAllowanceAmount: maxUint256,
  usdvAllowanceAmount: maxUint256,
}

interface UsdvAllowanceChange {
  kind: 'usdvAllowance'
  usdvAllowanceAmount?: BigNumber
}

interface UsdvAllowanceUnlimitedChange {
  kind: 'usdvAllowanceUnlimited'
}

interface UsdvAllowancePaybackChange {
  kind: 'usdvAllowanceAsPaybackAmount'
}

interface UsdvAllowanceReset {
  kind: 'usdvAllowanceReset'
}

interface CollateralAllowanceChange {
  kind: 'collateralAllowance'
  collateralAllowanceAmount?: BigNumber
}

interface CollateralAllowanceUnlimitedChange {
  kind: 'collateralAllowanceUnlimited'
}

interface CollateralAllowanceDepositChange {
  kind: 'collateralAllowanceAsDepositAmount'
}

interface CollateralAllowanceReset {
  kind: 'collateralAllowanceReset'
}

export type ManageVaultAllowanceChange =
  | UsdvAllowanceChange
  | UsdvAllowanceUnlimitedChange
  | UsdvAllowancePaybackChange
  | UsdvAllowanceReset
  | CollateralAllowanceChange
  | CollateralAllowanceUnlimitedChange
  | CollateralAllowanceDepositChange
  | CollateralAllowanceReset

export function applyManageVaultAllowance(
  change: ManageVaultChange,
  state: ManageVaultState,
): ManageVaultState {
  if (change.kind === 'collateralAllowance') {
    const { collateralAllowanceAmount } = change
    return {
      ...state,
      collateralAllowanceAmount,
    }
  }

  if (change.kind === 'collateralAllowanceAsDepositAmount') {
    const { depositAmount } = state
    return {
      ...state,
      selectedCollateralAllowanceRadio: 'depositAmount',
      collateralAllowanceAmount: depositAmount,
    }
  }

  if (change.kind === 'collateralAllowanceUnlimited') {
    return {
      ...state,
      selectedCollateralAllowanceRadio: 'unlimited',
      collateralAllowanceAmount: maxUint256,
    }
  }

  if (change.kind === 'collateralAllowanceReset') {
    return {
      ...state,
      selectedCollateralAllowanceRadio: 'custom',
      collateralAllowanceAmount: undefined,
    }
  }

  if (change.kind === 'usdvAllowance') {
    const { usdvAllowanceAmount } = change
    return {
      ...state,
      usdvAllowanceAmount,
    }
  }

  if (change.kind === 'usdvAllowanceAsPaybackAmount') {
    const {
      paybackAmount,
      vault: { debtOffset },
    } = state
    return {
      ...state,
      selectedUsdvAllowanceRadio: 'paybackAmount',
      usdvAllowanceAmount: paybackAmount!.plus(debtOffset),
    }
  }

  if (change.kind === 'usdvAllowanceUnlimited') {
    return {
      ...state,
      selectedUsdvAllowanceRadio: 'unlimited',
      usdvAllowanceAmount: maxUint256,
    }
  }

  if (change.kind === 'usdvAllowanceReset') {
    return {
      ...state,
      selectedUsdvAllowanceRadio: 'custom',
      usdvAllowanceAmount: undefined,
    }
  }

  return state
}
