import { ContentTypeSupport } from './support'

export const content: ContentTypeSupport = {
  title: 'FAQ',
  navigation: [
    { title: 'Using vaults.velero.finance', id: 'using-oasis' },
    { title: 'Security', id: 'security' },
    { title: 'Buying Usdv', id: 'buying-usdv' },
  ],
  sections: [
    {
      title: 'Using vaults.velero.finance',
      id: 'using-oasis',
      questions: [
        {
          question: 'What is vaults.velero.finance?',
          answer: `vaults.velero.finance is the home for everything you want to accomplish with Usdv. A decentralized application that runs on the Velas blockchain, Oasis enables you to Buy, Send, and Manage your Usdv all in one place.`,
        },
        {
          question: 'What is Usdv?',
          answer: `Usdv is a better, smarter digital currency for everyone. It is the world’s first unbiased currency and its value consistently tracks the US Dollar, which means it doesn't suffer from the volatility associated with many other digital currencies. To learn more about Usdv, read our [short primer](/usdv).`,
        },
        {
          question: 'Do I need an account?',
          answer: `No. You do not need to create a new account to use vaults.velero.finance. You can get started with almost any Velas wallet, including Metamask or Coinbase Wallet, or you can use our new Magic.Link feature -- where you provide an email address, click a link in the email we send you in response, and you're logged in.`,
        },
        {
          question: 'Will I be charged fees?',
          answer:
            'Oasis is currently free to use. However, you will have to pay transaction fees and, depending on the features you use, fees associated with Velero and other protocols, such as Stability or exchange fees.',
        },
        {
          question: 'Why do I need VLX to send or save my Usdv?',
          answer: `To complete any transaction on the Velas blockchain, you need to pay a transaction fee using VLX, its default token. This fee is referred to as 'gas', and much like the gas that powers your car, this gas fee powers your transaction.`,
        },
        {
          question: 'How can I contact the Oasis team?',
          answer:
            'If you have any questions, reach out to us through our [Contact page](/contact) or on [Twitter](https://twitter.com/oasisdotapp).',
        },
      ],
    },
    {
      title: 'Security',
      id: 'security',
      questions: [
        {
          question: 'Is Oasis Secure?',
          answer:
            'Security is our top priority. We stringently follow the best security practices, and regularly conduct smart contract and code audits. In addition, Oasis code is open-source, giving everyone in the community the ability to pressure test and audit the core technology.',
        },
        {
          question: 'Can Oasis access the funds in my account or wallet?',
          answer:
            'No. With Usdv, you - and only you - have access and control over your Usdv. Usdv uses blockchain technology to ensure the highest level of trust and transparency, and because of the way blockchain technology works, you ultimately get to decide just how secure you want it to be. This does mean you are your own security ultimately, so it is very important you keep access to your Usdv and Oasis account secure.',
        },
      ],
    },
    {
      title: 'Buying Usdv',
      id: 'buying-usdv',
      questions: [
        {
          question: 'Can I buy Usdv while using vaults.velero.finance?',
          answer: `Yes! Through connections with our partners, you can buy Usdv in over 100 countries around the world, including Europe, the US, parts of Latin America. We have partnered with three registered third-party providers - Latamex, Wyre and Moonpay - to facilitate user purchases of  Usdv using a range of debit or credit cards or bank transfers. Just connect to the app and hit the 'Buy Usdv' button to see applicable providers for you.`,
        },
        {
          question: 'Is there a limit on how much Usdv I can buy?',
          answer:
            'Yes, and it can vary depending on which third-party provider you use and what country you are in. Full details can be found on using the links; [Latamex Limits](https://latamex.zendesk.com/hc/es/articles/360037752631--Cu%C3%A1les-son-los-l%C3%ADmites-de-operaci%C3%B3n-), [Moonpay](https://support.moonpay.io/hc/en-gb/articles/360011931637-What-are-your-purchase-limits-) and [Wyre](https://support.sendwyre.com/en/articles/4457158-card-processing-faqs)',
        },
        {
          question: 'What is the minimum amount I can buy?',
          answer: `Like the maximum limits, there are also minimum amounts which are dependant on the third-party provider and location. Latamex: Argentina: 2000 ARS, Brazil: 80.00 BRL, Mexico: 270.00 MXN Moonpay: Minimum order is 20 Usdv Wyre: Minimum order is 20 Usdv`,
        },
        {
          question: 'Who are the fees going to?',
          answer: `vaults.velero.finance doesn't take any of the fees when you buy Usdv or VLX through one of our partner providers. The fee you pay goes solely and directly to the third-party provider.`,
        },
        {
          question: 'Can I buy VLX on Oasis to pay for my transaction fees?',
          answer:
            'Yes. Just like buying Usdv, you can start the same process as you would to buy Usdv, choose your third-party provider, and each offers an option to change Usdv for VLX when you start the process.',
        },
      ],
    },
  ],
  cantFind: 'Can’t find what you’re looking for?',
  contactLink: 'Contact us here',
}
