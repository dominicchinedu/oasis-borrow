import React from 'react'
import { Link } from 'theme-ui'

interface IEtherscanLink {
  children: React.ReactNode
  transactionHash: string
  network: string
}

export const EtherscanLink = ({ children, transactionHash, network }: IEtherscanLink) => {
  let url = ''
  if (network === 'velas') {
    url = `https://explorer.velas.com/tx/${transactionHash}`
  } else if (network === 'velastestnet') {
    url = `https://explorer.testnet.velas.com/tx/${transactionHash}`
  } else {
    const pathPrefix = network === 'main' ? '' : `${network}.`
    url = `https://${pathPrefix}etherscan.io/tx/${transactionHash}`
  }
  return (
    <Link target="_blank" href={url}>
      {children}
    </Link>
  )
}
