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
          answer: `vaults.velero.finance is the home for everything you want to accomplish with Usdv. A decentralized application that runs on the Velas blockchain, Velero enables you to Buy, Send, and Manage your Usdv all in one place.`,
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
            'Velero is currently free to use. However, you will have to pay transaction fees and, depending on the features you use, fees associated with Velero and other protocols, such as Stability or exchange fees.',
        },
        {
          question: 'Why do I need VLX to send or save my Usdv?',
          answer: `To complete any transaction on the Velas blockchain, you need to pay a transaction fee using VLX, its default token. This fee is referred to as 'gas', and much like the gas that powers your car, this gas fee powers your transaction.`,
        },
        {
          question: 'How can I contact the Velero team?',
          answer:
            'If you have any questions, reach out to us through our [Contact page](/contact) or on [Twitter](https://twitter.com/VeleroDAO).',
        },
      ],
    },
    {
      title: 'Security',
      id: 'security',
      questions: [
        {
          question: 'Is Velero Secure?',
          answer:
            'Security is our top priority. We stringently follow the best security practices, and regularly conduct smart contract and code audits. In addition, Velero code is open-source, giving everyone in the community the ability to pressure test and audit the core technology.',
        },
        {
          question: 'Can Velero access the funds in my account or wallet?',
          answer:
            'No. With Usdv, you - and only you - have access and control over your Usdv. Usdv uses blockchain technology to ensure the highest level of trust and transparency, and because of the way blockchain technology works, you ultimately get to decide just how secure you want it to be. This does mean you are your own security ultimately, so it is very important you keep access to your Usdv and Velero account secure.',
        },
      ],
    },
    {
      title: 'Buying Usdv',
      id: 'buying-usdv',
      questions: [
        {
          question: 'Where can I buy USDV?',
          answer: `You can buy USDV at [wagyuswap](https://www.wagyuswap.app/)`,
        },
      ],
    },
  ],
  cantFind: 'Can’t find what you’re looking for?',
  contactLink: 'Contact us here',
}
