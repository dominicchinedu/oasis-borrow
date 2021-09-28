import { ManageVaultChange, ManageVaultState } from './manageVault'
import { allowanceDefaults } from './manageVaultAllowances'
import { depositAndGenerateDefaults, paybackAndWithdrawDefaults } from './manageVaultInput'

export const manageVaultFormDefaults: Partial<ManageVaultState> = {
  ...allowanceDefaults,
  ...depositAndGenerateDefaults,
  ...paybackAndWithdrawDefaults,
  showDepositAndGenerateOption: false,
  showPaybackAndWithdrawOption: false,
}

export type ManageVaultFormChange =
  | {
      kind: 'toggleDepositAndGenerateOption'
    }
  | {
      kind: 'togglePaybackAndWithdrawOption'
    }
  | {
      kind: 'resetDefaults'
    }

export function applyManageVaultForm(
  { kind }: ManageVaultChange,
  state: ManageVaultState,
): ManageVaultState {
  const {
    showDepositAndGenerateOption,
    showPaybackAndWithdrawOption,
    stage,
    depositAmount,
    generateAmount,
    withdrawAmount,
    paybackAmount,
  } = state
  const isCollateralStage = stage === 'collateralEditing'
  const isUsdvStage = stage === 'usdvEditing'

  const shouldClearGenerateAmount = showDepositAndGenerateOption && isCollateralStage
  const shouldClearDepositAmount = showDepositAndGenerateOption && isUsdvStage
  const shouldClearPaybackAmount = showPaybackAndWithdrawOption && isCollateralStage
  const shouldClearWithdrawAmount = showPaybackAndWithdrawOption && isUsdvStage

  const canToggleDepositAndGenerate =
    (isCollateralStage && depositAmount) || (isUsdvStage && generateAmount)
  const canTogglePaybackAndWithdraw =
    (isCollateralStage && withdrawAmount) || (isUsdvStage && paybackAmount)

  if (kind === 'toggleDepositAndGenerateOption' && canToggleDepositAndGenerate) {
    return {
      ...state,
      showDepositAndGenerateOption: !showDepositAndGenerateOption,
      ...(shouldClearGenerateAmount && { generateAmount: undefined }),
      ...(shouldClearDepositAmount && { depositAmount: undefined }),
    }
  }

  if (kind === 'togglePaybackAndWithdrawOption' && canTogglePaybackAndWithdraw) {
    return {
      ...state,
      showPaybackAndWithdrawOption: !showPaybackAndWithdrawOption,
      ...(shouldClearPaybackAmount && { paybackAmount: undefined }),
      ...(shouldClearWithdrawAmount && { withdrawAmount: undefined }),
    }
  }

  return state
}
