import { BigNumber } from 'bignumber.js'
import { BalanceInfo } from 'features/shared/balanceInfo'
import { zero } from 'helpers/zero'
import { Observable, of } from 'rxjs'

export interface MockBalanceInfoProps {
  _balance$?: Observable<BalanceInfo>
  collateralBalance?: BigNumber
  vlxBalance?: BigNumber
  usdvBalance?: BigNumber
  address?: string | undefined
}

const defaultCollateralBalance = new BigNumber('300')
const defaultVlxBalance = new BigNumber('20')
const defaultUsdvBalance = new BigNumber('1000')

export function mockBalanceInfo$({
  _balance$,
  collateralBalance = defaultCollateralBalance,
  vlxBalance = defaultVlxBalance,
  usdvBalance = defaultUsdvBalance,
  address = '0xVaultController',
}: MockBalanceInfoProps): Observable<BalanceInfo> {
  return (
    _balance$ ||
    of({
      collateralBalance: address ? collateralBalance : zero,
      vlxBalance: address ? vlxBalance : zero,
      usdvBalance: address ? usdvBalance : zero,
    })
  )
}
