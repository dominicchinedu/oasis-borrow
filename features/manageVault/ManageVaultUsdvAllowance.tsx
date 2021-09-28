import { getToken } from 'blockchain/tokensMetadata'
import { Radio } from 'components/forms/Radio'
import { TxStatusCardProgress, TxStatusCardSuccess } from 'features/openVault/TxStatusCard'
import { BigNumberInput } from 'helpers/BigNumberInput'
import { formatAmount, formatCryptoBalance } from 'helpers/formatters/format'
import { handleNumericInput } from 'helpers/input'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { createNumberMask } from 'text-mask-addons'
import { Grid, Text } from 'theme-ui'

import { ManageVaultState } from './manageVault'

export function ManageVaultUsdvAllowance({
  stage,
  usdvAllowanceAmount,
  paybackAmount,
  updateUsdvAllowanceAmount,
  setUsdvAllowanceAmountUnlimited,
  setUsdvAllowanceAmountToPaybackAmount,
  resetUsdvAllowanceAmount,
  selectedUsdvAllowanceRadio,
}: ManageVaultState) {
  const canSelectRadio = stage === 'usdvAllowanceWaitingForConfirmation'

  const { t } = useTranslation()

  const isUnlimited = selectedUsdvAllowanceRadio === 'unlimited'
  const isPayback = selectedUsdvAllowanceRadio === 'paybackAmount'
  const isCustom = selectedUsdvAllowanceRadio === 'custom'

  return (
    <Grid>
      {canSelectRadio && (
        <>
          <Radio
            onChange={setUsdvAllowanceAmountUnlimited!}
            name="manage-vault-usdv-allowance"
            checked={isUnlimited}
          >
            <Text variant="paragraph3" sx={{ fontWeight: 'semiBold', my: '18px' }}>
              {t('unlimited-allowance')}
            </Text>
          </Radio>
          <Radio
            onChange={setUsdvAllowanceAmountToPaybackAmount!}
            name="manage-vault-usdv-allowance"
            checked={isPayback}
          >
            <Text variant="paragraph3" sx={{ fontWeight: 'semiBold', my: '18px' }}>
              {t('usdv-paying-back', { amount: formatCryptoBalance(paybackAmount!) })}
            </Text>
          </Radio>
          <Radio onChange={resetUsdvAllowanceAmount!} name="allowance-open-form" checked={isCustom}>
            <Grid columns="2fr 2fr 1fr" sx={{ alignItems: 'center', my: 2 }}>
              <Text variant="paragraph3" sx={{ fontWeight: 'semiBold' }}>
                {t('custom')}
              </Text>
              <BigNumberInput
                sx={{
                  p: 1,
                  borderRadius: 'small',
                  borderColor: 'light',
                  width: '100px',
                  fontSize: 1,
                  px: 3,
                  py: '12px',
                }}
                disabled={!isCustom}
                value={
                  usdvAllowanceAmount && isCustom
                    ? formatAmount(usdvAllowanceAmount, getToken('USDV').symbol)
                    : null
                } USDV
                mask={createNumberMask({
                  allowDecimal: true,
                  decimalLimit: getToken('USDV').digits,
                  prefix: '',
                })}
                onChange={handleNumericInput(updateUsdvAllowanceAmount!)}
              />
              <Text sx={{ fontSize: 1 }}>USDV</Text>
            </Grid>
          </Radio>
        </>
      )}
    </Grid>
  )
}

export function ManageVaultUsdvAllowanceStatus({
  stage,
  usdvAllowanceTxHash,
  etherscan,
}: ManageVaultState) {
  const { t } = useTranslation()

  if (stage === 'usdvAllowanceInProgress') {
    return (
      <TxStatusCardProgress
        text={t('setting-allowance-for', { token: 'USDV' })}
        etherscan={etherscan!}
        txHash={usdvAllowanceTxHash!}
      />
    )
  }
  if (stage === 'usdvAllowanceSuccess') {
    return (
      <TxStatusCardSuccess
        text={t('set-allowance-for', { token: 'USDV' })}
        etherscan={etherscan!}
        txHash={usdvAllowanceTxHash!}
      />
    )
  }
  return null
}
