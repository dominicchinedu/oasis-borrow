import { ContentTypeSupport } from './support'

export const content: ContentTypeSupport = {
  title: 'FAQ',
  navigation: [
    { title: 'Utilizando vaults.velero.finance', id: 'using-oasis' },
    { title: 'Utilizando Usdv Wallet', id: 'using-usdvwallet' },
    { title: 'Segurança', id: 'security' },
    { title: 'Comprando Usdv', id: 'buying-usdv' },
  ],
  sections: [
    {
      title: 'Utilizando vaults.velero.finance',
      id: 'using-oasis',
      questions: [
        {
          question: 'Quais ativos posso usar como colateral?',
          answer: `Você pode usar os colaterais que são aprovados pela Governança do Velero, incluindo VLX e BTC envelopado ('wrapped BTC'). Você pode ver cada um dos tipos entrando no vaults.velero.finance, podendo checar inclusive a Taxa de Estabilidade e Ratio Mínimo de Colateralização.`,
        },

        {
          question: 'Quanto custa?',
          answer: `Abrir e gerir um Cofre (Vault) é grátis no vaults.velero.finance, exceto pelos custos com gás e Taxas de Estabilidade. A Taxa de Estabilidade é cobrada em cima da quantidade de Usdv gerada e é destinada diretamente ao Protocolo Velero.`,
        },

        {
          question: 'Como eu abro um Cofre (Vault)',
          answer: `Para abrir um Cofre, selecione o colateral e seu sub-tipo (ex. VLX-A) na página inicial (vaults.velero.finance), connecte sua carteira escolhida e siga as instruções.`,
        },

        {
          question: 'O que é a Taxa de Estabilidade?',
          answer: `A Taxa de Estabilidade é a taxa anual varíavel (mostrada em porcentagem) adicionada a sua dívida - que deverá ser paga. Ela pode ser vista como o custo para gerar Usdv, que é pago diretamente ao Protocolo Velero.`,
        },

        {
          question: 'Qual a diferença entre -A/-B/-C sub-tipos de Cofres?',
          answer: `Existem múltiplos tipos de Cofre para alguns colaterais. Cada tipo indicado pela letra tem seus próprios Ratios de Colateralização e Taxas de Estabilidade. Você pode escolher o tipo de Cofre que você preferir de acordo com suas necessidades e perfil de risco.`,
        },

        {
          question: 'O que é um Proxy? Por que eu preciso gerar um?',
          answer: `O Proxy é um contrato inteligente que facilita sua interação com protocolos, inclusive com o Velero. Ele auxilia na gestão do Cofre, geração de Usdv, entre outros. Você precisa fazer isso apenas uma vez por carteira e todos os seus cofres serão geridos pelo Proxy. Por favor, nunca envie seus fundos diretamente para o endereço do Proxy.`,
        },

        {
          question: 'Por que eu preciso aprovar tokens? O que é a permissão ("allowance")?',
          answer: `As permissões de tokens permitem você controlar quanto o contrato Proxy pode interagir em relação ao balanço de sua carteira. Isso permite que o Contrato Proxy pague Usdv ou interaja com os colaterais em sua carteira. Você precisará autorizar a permissão ("allowance") para cada token que deseja utilizar no vaults.velero.finance. Você pode configurar sua permisão ("allowance") para a quantia que você deseja usar cada vez ou para um valor maior, já pensando em futuras interações com vaults.velero.finance. Isso será apresentado para você dentro dos fluxos do vaults.velero.finance e você não terá que realizar ação alguma se você não encontrar avisos neste sentido.`,
        },

        {
          question: 'O que é o Ratio de Liquidação?',
          answer: `O Ratio de Liquidação é o Ratio Mínimo de Colateralização que você precisa manter para evitar que seu Cofre seja liquidado. Se seu Cofre for abaixo do Ratio Mínimo de Colateralização, seu Cofre pode ser liquidado e seu colateral vendido para pagar a dívida.`,
        },

        {
          question: 'O que é o Preço de Liquidação?',
          answer: `O Preço de Liquidação é o preço no qual seu Cofre estará em risco de liquidação baseado no 'Preço Atual' do Módulo de Segurança do Protocolo Velero. É um indicador útil para você descobrir se pode ser liquidado. Por favor, note que se o seu Cofre tiver uma Taxa de Estabilidade positiva (>0), seu preço de liquidação continuará aumentando, já que mais dívida é adicionada ao seu Cofre.`,
        },

        {
          question: 'O que é Penalidade de Liquidação?',
          answer: `A Penalidade de Liquidação é a quantia adicionada a sua dívida quando seu Cofre é liquidado. Cada colateral e sub-tipo (ex. VLX-A e VLX-B) podem ter suas próprias características de penalidades, determinadas pela Governança Velero. Essa penalidade também é paga diretamente ao Protocolo Velero e vaults.velero.finance não cobra taxas adicionais em casos de liquidação.`,
        },

        {
          question: 'O que é a Dívida Mínima do Cofre?',
          answer: `A Dívida Mínima do Cofre, também chamada de pó (dust), é a quantia mínima de Usdv que você precisa para abrir e manter um novo Cofre. Essa Dívida Mínima do Cofre é determinada pela Governança Velero e pode ser ajustada a qualquer momento. Se o mínimo for aumentado para um valor acima da sua dívida atual, você irá experenciar funcionalidade reduzida do seu Cofre até que você aumente sua dívida acima do mínimo novamente.`,
        },

        {
          question: 'O que é o próximo preço e como você sabe?',
          answer: `Dentro do Protocolo Velero, sempre existem 2 preços para o colateral; o preço atual e o próximo preço. Para proteger o sistema e usuários de ‘agentes maliciosos’ e quedas repentinas (flash crashes), o Protocolo Velero usa o 'Módulo de Segurança'. Isso significa que todos os preços utilizados pelo sistema são atrasados em uma hora e apenas atualizados uma vez por hora - aproximadamente no arredondar da hora. O próximo preço é o preço que entrará no sistema como 'Preço Atual'. É o Preço Atual que seu Cofre utiliza como referência, podendo apenas ser liquidado se o 'Preço Atual' estiver abaixo do seu 'Preço de Liquidação'. Isso também significa que você tem até uma hora para reagir se houver uma grande queda no preço e o próximo preço estiver abaixo do seu Preço de Liquidação.`,
        },

        {
          question: 'O que é gás?',
          answer: `Gás é unidade de medida utilizada para pagar por transações no blockchain do Velas. Os preços de gás são cobrados em VLX e você sempre precisará ter VLX em sua carteira para ser capaz de interagir com vaults.velero.finance. Essa taxa vai diretamente para os mineradores do Velas que mantém a rede do Velas funcionando. vaults.velero.finance não cobra taxas pelo uso de funcionalidades básicas do Cofre.`,
        },

        {
          question: 'Por que eu mudaria a velocidade da transação?',
          answer: `A velocidade na transação permite que você pague mais gás para ter sua transação minerada mais rapidamente. Se você estiver com pressa de, por exemplo, aumentar seu Ratio de Colateralização para evitar ser liquidado, você pode determinar uma velocidade mais rápida para esta transação.`,
        },

        {
          question: 'Como eu contato o time do Velero?',
          answer:
            'Se tiver alguma pergunta, nos [contate usando esta página](/usdvwallet/contact) ou nos mande uma mensagem no [Twitter](https://twitter.com/VeleroDAO).',
        },
      ],
    },
    {
      title: 'Utilizando Usdv Wallet',
      id: 'using-usdvwallet',
      questions: [
        {
          question: 'O que é a Usdv Wallet?',
          answer: `Usdv Wallet é a plataforma ideal para tudo que você deseja realizar com Usdv. Uma aplicação descentralizada no blockchain do Velas, Usdv Wallet possibilita a compra, envio e gestão do Usdv, tudo isso no mesmo lugar!`,
        },
        {
          question: 'O que é Usdv?',
          answer: `Usdv é uma forma melhor e mais inteligente de moeda virtual para todos. É a primeira moeda imparcial do mundo e seu valor é consistentemente atrelado ao dólar americano. Isso significa que ela não sofre com a volatilidade associada a várias outras moedas virtuais. Para conhecer mais sobre Usdv, leia nossa [breve introdução.](/usdvwallet/usdv).`,
        },
        {
          question: 'Preciso ter uma conta?',
          answer: `Não. Você não precisa criar uma nova conta para usar Usdv Wallet. Você pode começar com praticamente qualquer carteira do Velas, incluindo Metamask ou Coinbase Wallet. Além disso, você também pode usar o Magic.Link, onde você deve informar seu email e clicar no link de login direto que enviaremos para sua caixa de entrada.`,
        },
        {
          question: 'Serei cobrado pelo uso?',
          answer:
            'Nossa Usdv Wallet é atualmente grátis para uso. Contudo, você terá que pagar taxas da rede Velas e, dependendo das funcionalidades que use, taxas associadas ao Velero e outros protocolos, como Taxas de Estabilidade ou de corretoras de cripto.',
        },
        {
          question: 'Porque eu preciso de VLX para enviar ou poupar meu Usdv?',
          answer: `Para realizar qualquer transação no blockchain do Velas, você precisa pagar a taxa com VLX, a moeda virtual nativa da rede do Velas. Essa taxa é conhecida como 'gás', e de forma semelhante ao que acontece com o combustível que impulsiona seu carro, o gás na rede é necessário para sua transação ser realizada com sucesso. Em breve, nós desejamos adicionar uma funcionalidade que permite pagar as taxas do gás com a própria Usdv.`,
        },
        {
          question: 'Como posso contatar o time do Velero?',
          answer:
            'Se tiver alguma pergunta, nos [contate usando esta página](/usdvwallet/contact) ou nos mande uma mensagem no [Twitter](https://twitter.com/VeleroDAO).',
        },
      ],
    },
    {
      title: 'Segurança',
      id: 'security',
      questions: [
        {
          question: 'Velero é seguro?',
          answer:
            'A segurança é nossa prioridade número um. Nós seguimos rigidamente as melhores práticas de segurança e realizamos de forma constante auditorias em nosso código e contratos inteligentes. Além disso, o código do Velero é aberto, possibilitando que todos testem e auditem a tecnologia utilizada.',
        },
        {
          question: 'O Velero pode acessar meus fundos em minha conta ou carteira?',
          answer:
            'Não. Com Usdv, você - e apenas você - possui acesso e controle sobre seu Usdv. Usdv utiliza tecnologia blockchain para prover o nível máximo de confiança e transparência. Em razão dos mecanismos de funcionamento do blockchain, você decide seu próprio nível de segurança. Isso significa que você, em última instância, é responsável por sua própria segurança. Por isso, é muito importante que você mantenha seguro o acesso ao Usdv e à conta do Velero.',
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
  cantFind: 'Não consegue encontrar o que você está buscando?',
  contactLink: 'Nos contate aqui',
}
