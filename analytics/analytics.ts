import * as mixpanelBrowser from 'mixpanel-browser'
import getConfig from 'next/config'

type MixpanelType = { track: (eventType: string, payload: any) => void } | typeof mixpanelBrowser
let mixpanel: MixpanelType = mixpanelBrowser

const env = getConfig()?.publicRuntimeConfig.mixpanelEnv || process.env.MIXPANEL_ENV

if (env !== 'production' && env !== 'staging') {
  mixpanel = {
    track: function (eventType: string, payload: any) {
      console.info('Mixpanel Event: ', eventType, payload)
    },
  }
}

const product = 'borrow'
export const INPUT_DEBOUNCE_TIME = 800

export enum Pages {
  VaultCreate = 'VaultCreate',
  IlksList = 'IlksList',
  LandingPage = 'LandingPage',
  OpenVaultOverview = 'OpenVaultOverview',
  VaultsOverview = 'VaultsOverview',
  ManageCollateral = 'ManageCollateral',
  ManageUsdv = 'Usdv',
}

export const trackingEvents = {
  pageView: (location: string) => {
    mixpanel.track('Pageview', {
      product,
      id: location,
    })
  },

  accountChange: (account: string, network: string, walletType: string) => {
    mixpanel.track('account-change', {
      account,
      network,
      product,
      walletType,
    })
  },

  searchToken: (
    page: Pages.LandingPage | Pages.OpenVaultOverview | Pages.VaultsOverview,
    query: string,
  ) => {
    mixpanel.track('input-change', {
      id: 'SearchToken',
      product,
      page,
      query,
      section: 'SelectCollateral',
    })
  },

  openVault: (page: Pages.LandingPage | Pages.OpenVaultOverview, ilk: string) => {
    mixpanel.track('btn-click', {
      id: 'OpenVault',
      product,
      ilk,
      page,
      section: 'SelectCollateral',
    })
  },

  createVaultDeposit: (firstCDP: boolean | undefined, amount: string) => {
    mixpanel.track('input-change', {
      id: 'Deposit',
      product,
      firstCDP,
      amount,
      page: Pages.VaultCreate,
      section: 'CreateVault',
    })
  },

  createVaultGenerate: (firstCDP: boolean | undefined, amount: string) => {
    mixpanel.track('input-change', {
      id: 'Generate',
      product,
      firstCDP,
      amount,
      page: Pages.VaultCreate,
      section: 'CreateVault',
    })
  },

  createVaultSetupProxy: (
    firstCDP: boolean | undefined,
    depositAmount: string,
    generateAmount: string,
  ) => {
    mixpanel.track('btn-click', {
      id: 'SetupProxy',
      product,
      firstCDP,
      depositAmount,
      generateAmount,
      page: Pages.VaultCreate,
      section: 'Configure',
    })
  },

  createProxy: (firstCDP: boolean | undefined) => {
    mixpanel.track('btn-click', {
      id: 'CreateProxy',
      product,
      firstCDP,
      page: Pages.VaultCreate,
      section: 'ProxyDeploy',
    })
  },

  pickAllowance: (firstCDP: boolean | undefined, type: string, amount: string) => {
    mixpanel.track('input-change', {
      id: 'PickAllowance',
      product,
      firstCDP,
      type,
      amount,
      page: Pages.VaultCreate,
      section: 'Allowance',
    })
  },

  setTokenAllowance: (firstCDP: boolean | undefined) => {
    mixpanel.track('btn-click', {
      id: 'SetAllowance',
      product,
      firstCDP,
      page: Pages.VaultCreate,
      section: 'Configure',
    })
  },

  approveAllowance: (firstCDP: boolean | undefined) => {
    mixpanel.track('btn-click', {
      id: 'ApproveAllowance',
      product,
      firstCDP,
      page: Pages.VaultCreate,
      section: 'Allowance',
    })
  },

  createVaultConfirm: (firstCDP: boolean | undefined) => {
    mixpanel.track('btn-click', {
      id: 'Confirm',
      product,
      firstCDP,
      page: Pages.VaultCreate,
      section: 'CreateVault',
    })
  },

  confirmVaultConfirm: (
    ilk: string,
    collateralAmount: string,
    usdvAmount: string,
    firstCDP: boolean | undefined,
  ) => {
    mixpanel.track('btn-click', {
      id: 'Confirm',
      product,
      ilk,
      collateralAmount,
      usdvAmount,
      firstCDP,
      page: Pages.VaultCreate,
      section: 'ConfirmVault',
    })
  },

  confirmVaultConfirmTransaction: (
    ilk: string,
    collateralAmount: string,
    usdvAmount: string,
    firstCDP: boolean | undefined,
    txHash: string,
  ) => {
    mixpanel.track('btn-click', {
      id: 'ConfirmTransaction',
      product,
      ilk,
      collateralAmount,
      usdvAmount,
      firstCDP,
      txHash,
      page: Pages.VaultCreate,
      section: 'ConfirmVault',
    })
  },

  confirmVaultEdit: (firstCDP: boolean | undefined) => {
    mixpanel.track('btn-click', {
      id: 'EditVault',
      product,
      firstCDP,
      page: Pages.VaultCreate,
      section: 'ConfirmVault',
    })
  },

  overviewManage: (vaultId: string, ilk: string) => {
    mixpanel.track('btn-click', {
      id: 'Manage',
      product,
      vaultId,
      ilk,
      page: Pages.VaultsOverview,
      section: 'Table',
    })
  },

  createNewVault: (firstCDP: boolean | undefined) => {
    mixpanel.track('btn-click', {
      id: 'createNewVault',
      product,
      firstCDP,
      section: 'NavBar',
    })
  },

  yourVaults: () => {
    mixpanel.track('btn-click', {
      id: 'YourVaults',
      product,
      section: 'NavBar',
    })
  },

  switchToUsdv: (ControllerIsConnected: boolean) => {
    mixpanel.track('btn-click', {
      id: 'SwitchToUsdv',
      product,
      ControllerIsConnected,
      page: Pages.ManageCollateral,
      section: 'Usdv',
    })
  },

  switchToCollateral: (ControllerIsConnected: boolean) => {
    mixpanel.track('btn-click', {
      id: 'SwitchToCollateral',
      product,
      ControllerIsConnected,
      page: Pages.ManageUsdv,
      section: 'Collateral',
    })
  },

  manageVaultDepositAmount: (
    page: Pages.ManageCollateral | Pages.ManageUsdv,
    amount: string,
    setMax: boolean,
  ) => {
    mixpanel.track('input-change', {
      id: 'DepositAmount',
      product,
      page,
      amount,
      setMax,
    })
  },

  manageVaultGenerateAmount: (
    page: Pages.ManageCollateral | Pages.ManageUsdv,
    amount: string,
    setMax: boolean,
  ) => {
    mixpanel.track('input-change', {
      id: 'GenerateAmount',
      product,
      page,
      amount,
      setMax,
    })
  },

  manageVaultWithdrawAmount: (
    page: Pages.ManageCollateral | Pages.ManageUsdv,
    amount: string,
    setMax: boolean,
  ) => {
    mixpanel.track('input-change', {
      id: 'WithdrawAmount',
      product,
      page,
      amount,
      setMax,
    })
  },

  manageVaultPaybackAmount: (
    page: Pages.ManageCollateral | Pages.ManageUsdv,
    amount: string,
    setMax: boolean,
  ) => {
    mixpanel.track('input-change', {
      id: 'PaybackAmount',
      product,
      page,
      amount,
      setMax,
    })
  },

  manageVaultConfirmVaultEdit: () => {
    mixpanel.track('btn-click', {
      id: 'EditVault',
      product,
      section: 'ConfirmVault',
    })
  },

  // Can we distinguish if went through collateral/usdvEditing?
  manageVaultConfirm: (
    page: Pages.ManageCollateral | Pages.ManageUsdv,
    ilk: string,
    collateralAmount: string,
    usdvAmount: string,
  ) => {
    mixpanel.track('btn-click', {
      id: 'Confirm',
      product,
      ilk,
      collateralAmount,
      usdvAmount,
      page,
      section: 'ConfirmVault',
    })
  },

  manageVaultConfirmTransaction: (
    page: Pages.ManageCollateral | Pages.ManageUsdv,
    ilk: string,
    collateralAmount: string,
    usdvAmount: string,
    txHash: string,
  ) => {
    mixpanel.track('btn-click', {
      id: 'ConfirmTransaction',
      product,
      ilk,
      collateralAmount,
      usdvAmount,
      txHash,
      page,
      section: 'ConfirmVault',
    })
  },

  manageCollateralPickAllowance: (type: string, amount: string) => {
    mixpanel.track('input-change', {
      id: 'PickAllowance',
      product,
      type,
      amount,
      page: Pages.ManageCollateral,
      section: 'Allowance',
    })
  },

  manageCollateralApproveAllowance: () => {
    mixpanel.track('btn-click', {
      id: 'ApproveAllowance',
      product,
      page: Pages.ManageCollateral,
      section: 'Allowance',
    })
  },

  manageUsdvPickAllowance: (type: string, amount: string) => {
    mixpanel.track('input-change', {
      id: 'PickAllowance',
      product,
      type,
      amount,
      page: Pages.ManageUsdv,
      section: 'Allowance',
    })
  },

  manageUsdvApproveAllowance: () => {
    mixpanel.track('btn-click', {
      id: 'ApproveAllowance',
      product,
      page: Pages.ManageUsdv,
      section: 'Allowance',
    })
  },

  // First Confirm button when the user is on Collateral and type into Deposit
  manageCollateralDepositConfirm: () => {
    mixpanel.track('btn-click', {
      id: 'Confirm',
      product,
      page: Pages.ManageCollateral,
      section: 'Deposit',
    })
  },

  // Confirm button when the user is on Collateral and type into Withdraw
  manageCollateralWithdrawConfirm: () => {
    mixpanel.track('btn-click', {
      id: 'Confirm',
      product,
      page: Pages.ManageCollateral,
      section: 'Withdraw',
    })
  },

  // First Confirm button when the user is on USDV and type into Generate
  manageUsdvGenerateConfirm: () => {
    mixpanel.track('btn-click', {
      id: 'Confirm',
      product,
      page: Pages.ManageUsdv,
      section: 'Generate',
    })
  },

  // Confirm button when the user is on USDV and type into Payback
  manageUsdvPaybackConfirm: () => {
    mixpanel.track('btn-click', {
      id: 'Confirm',
      product,
      page: Pages.ManageUsdv,
      section: 'Payback',
    })
  },
}

export type Tracker = typeof trackingEvents
