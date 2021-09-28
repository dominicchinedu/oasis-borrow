import { BigNumber } from 'bignumber.js'
import { OraclePriceData } from 'blockchain/prices'
import { combineLatest, Observable, of } from 'rxjs'
import { map, shareReplay, switchMap } from 'rxjs/operators'

export interface PriceInfo {
  currentCollateralPrice: BigNumber
  currentVlxPrice: BigNumber
  nextCollateralPrice: BigNumber
  nextVlxPrice: BigNumber

  dateLastCollateralPrice?: Date
  dateNextCollateralPrice?: Date
  dateLastVlxPrice?: Date
  dateNextVlxPrice?: Date

  isStaticCollateralPrice: boolean
  isStaticVlxPrice: boolean

  collateralPricePercentageChange: BigNumber
  vlxPricePercentageChange: BigNumber
}

export function createPriceInfo$(
  oraclePriceData$: (token: string) => Observable<OraclePriceData>,
  token: string,
): Observable<PriceInfo> {
  return combineLatest(oraclePriceData$(token), oraclePriceData$('VLX')).pipe(
    switchMap(
      ([
        {
          currentPrice: currentCollateralPrice,
          nextPrice: nextCollateralPrice,
          isStaticPrice: isStaticCollateralPrice,
          currentPriceUpdate: dateLastCollateralPrice,
          nextPriceUpdate: dateNextCollateralPrice,
          percentageChange: collateralPricePercentageChange,
        },
        {
          currentPrice: currentVlxPrice,
          nextPrice: nextVlxPrice,
          isStaticPrice: isStaticVlxPrice,
          currentPriceUpdate: dateLastVlxPrice,
          nextPriceUpdate: dateNextVlxPrice,
          percentageChange: vlxPricePercentageChange,
        },
      ]) =>
        of({
          currentCollateralPrice,
          currentVlxPrice,
          nextCollateralPrice,
          nextVlxPrice,

          dateLastCollateralPrice,
          dateNextCollateralPrice,
          dateLastVlxPrice,
          dateNextVlxPrice,

          isStaticCollateralPrice,
          isStaticVlxPrice,

          collateralPricePercentageChange,
          vlxPricePercentageChange,
        }),
    ),
    shareReplay(1),
  )
}

export interface PriceInfoChange {
  kind: 'priceInfo'
  priceInfo: PriceInfo
}

export function priceInfoChange$(
  priceInfo$: (token: string) => Observable<PriceInfo>,
  token: string,
): Observable<PriceInfoChange> {
  return priceInfo$(token).pipe(
    map((priceInfo) => ({
      kind: 'priceInfo',
      priceInfo,
    })),
  )
}
