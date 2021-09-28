import { BigNumber } from 'bignumber.js'
import { combineLatest, Observable, of } from 'rxjs'
import { map } from 'rxjs/internal/operators/map'

import { zero } from '../../helpers/zero'

export interface BalanceInfo {
  collateralBalance: BigNumber
  vlxBalance: BigNumber
  usdvBalance: BigNumber
}

export function createBalanceInfo$(
  balance$: (token: string, address: string) => Observable<BigNumber>,
  token: string,
  address: string | undefined,
): Observable<BalanceInfo> {
  return combineLatest(
    address ? balance$(token, address) : of(zero),
    address ? balance$('VLX', address) : of(zero),
    address ? balance$('USDV', address) : of(zero),
  ).pipe(
    map(([collateralBalance, vlxBalance, usdvBalance]) => ({
      collateralBalance,
      vlxBalance,
      usdvBalance: usdvBalance,
    })),
  )
}

export interface BalanceInfoChange {
  kind: 'balanceInfo'
  balanceInfo: BalanceInfo
}

export function balanceInfoChange$(
  balanceInfo$: (token: string, account: string | undefined) => Observable<BalanceInfo>,
  token: string,
  account: string | undefined,
): Observable<BalanceInfoChange> {
  return balanceInfo$(token, account).pipe(
    map((balanceInfo) => ({
      kind: 'balanceInfo',
      balanceInfo,
    })),
  )
}
