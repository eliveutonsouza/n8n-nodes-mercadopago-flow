import { INodeProperties } from "n8n-workflow";

export function getNodeProperties(): INodeProperties[] {
  return [
    {
      displayName: "Resource",
      name: "resource",
      type: "options",
      noDataExpression: true,
      options: [
        {
          name: "PIX",
          value: "pix",
        },
        {
          name: "Plano",
          value: "plans",
        },
        {
          name: "Assinatura",
          value: "subscriptions",
        },
        {
          name: "Webhook",
          value: "webhooks",
        },
      ],
      default: "pix",
    },
    // PIX Operations
    {
      displayName: "Operation",
      name: "operation",
      type: "options",
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ["pix"],
        },
      },
      options: [
        {
          name: "Criar",
          value: "create",
          description: "Criar um pagamento PIX",
          action: "Criar pagamento PIX",
        },
        {
          name: "Consultar",
          value: "get",
          description: "Consultar um pagamento PIX",
          action: "Consultar pagamento PIX",
        },
        {
          name: "Reembolsar",
          value: "refund",
          description: "Reembolsar um pagamento PIX",
          action: "Reembolsar pagamento PIX",
        },
      ],
      default: "create",
    },
    // PIX Create Fields
    {
      displayName: "Valor",
      name: "amount",
      type: "number",
      required: true,
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["create"],
        },
      },
      default: 0,
      description: "Valor do pagamento em reais (ex: 10.50)",
    },
    {
      displayName: "Descrição",
      name: "description",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Descrição do pagamento",
    },
    {
      displayName: "E-mail do Pagador",
      name: "payerEmail",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["create"],
        },
      },
      default: "",
      description: "E-mail do pagador",
    },
    {
      displayName: "CPF/CNPJ do Pagador",
      name: "payerDocument",
      type: "string",
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["create"],
        },
      },
      default: "",
      description: "CPF ou CNPJ do pagador (apenas números)",
    },
    {
      displayName: "Nome do Pagador",
      name: "payerName",
      type: "string",
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Nome completo do pagador",
    },
    {
      displayName: "Data de Expiração",
      name: "expirationDate",
      type: "dateTime",
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Data e hora de expiração do QR Code PIX",
    },
    {
      displayName: "Referência Externa",
      name: "externalReference",
      type: "string",
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Referência externa para identificar o pagamento",
    },
    {
      displayName: "Chave de Idempotência",
      name: "idempotencyKey",
      type: "string",
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Chave única para garantir idempotência da requisição",
    },
    // PIX Get Fields
    {
      displayName: "ID do Pagamento",
      name: "paymentId",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["get"],
        },
      },
      default: "",
      description: "ID do pagamento a ser consultado",
    },
    // PIX Refund Fields
    {
      displayName: "ID do Pagamento",
      name: "paymentId",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["refund"],
        },
      },
      default: "",
      description: "ID do pagamento a ser reembolsado",
    },
    {
      displayName: "Valor do Reembolso",
      name: "refundAmount",
      type: "number",
      displayOptions: {
        show: {
          resource: ["pix"],
          operation: ["refund"],
        },
      },
      default: 0,
      description:
        "Valor do reembolso em reais (deixe vazio para reembolso total)",
    },
    // Plan Operations
    {
      displayName: "Operation",
      name: "operation",
      type: "options",
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ["plans"],
        },
      },
      options: [
        {
          name: "Criar",
          value: "create",
          description: "Criar um plano de assinatura",
          action: "Criar plano",
        },
        {
          name: "Consultar",
          value: "get",
          description: "Consultar um plano",
          action: "Consultar plano",
        },
        {
          name: "Listar",
          value: "list",
          description: "Listar planos",
          action: "Listar planos",
        },
        {
          name: "Atualizar",
          value: "update",
          description: "Atualizar um plano",
          action: "Atualizar plano",
        },
      ],
      default: "create",
    },
    // Plan Create Fields
    {
      displayName: "Nome do Plano",
      name: "reason",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Nome/descrição do plano",
    },
    {
      displayName: "Valor",
      name: "amount",
      type: "number",
      required: true,
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      default: 0,
      description: "Valor do plano em reais (ex: 99.99)",
    },
    {
      displayName: "Frequência",
      name: "frequency",
      type: "number",
      required: true,
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      default: 1,
      description: "Frequência de cobrança (ex: 1 para mensal)",
    },
    {
      displayName: "Tipo de Frequência",
      name: "frequencyType",
      type: "options",
      required: true,
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      options: [
        {
          name: "Dias",
          value: "days",
        },
        {
          name: "Meses",
          value: "months",
        },
      ],
      default: "months",
      description: "Tipo de frequência (dias ou meses)",
    },
    {
      displayName: "Moeda",
      name: "currencyId",
      type: "options",
      required: true,
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      options: [
        {
          name: "BRL - Real Brasileiro",
          value: "BRL",
        },
        {
          name: "ARS - Peso Argentino",
          value: "ARS",
        },
        {
          name: "CLP - Peso Chileno",
          value: "CLP",
        },
        {
          name: "MXN - Peso Mexicano",
          value: "MXN",
        },
        {
          name: "COP - Peso Colombiano",
          value: "COP",
        },
        {
          name: "PEN - Sol Peruano",
          value: "PEN",
        },
        {
          name: "UYU - Peso Uruguaio",
          value: "UYU",
        },
      ],
      default: "BRL",
      description: "Moeda do plano",
    },
    {
      displayName: "URL de Retorno",
      name: "backUrl",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      default: "https://www.mercadopago.com.br",
      description: "URL de retorno após o checkout",
    },
    {
      displayName: "Número de Repetições",
      name: "repetitions",
      type: "number",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      default: 0,
      description:
        "Número de ciclos da assinatura (deixe 0 ou vazio para assinatura ilimitada)",
    },
    {
      displayName: "Dia do Mês para Cobrança",
      name: "billingDay",
      type: "number",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      default: 0,
      description: "Dia do mês (1-28) em que a assinatura será cobrada",
    },
    {
      displayName: "Cobrança Proporcional",
      name: "billingDayProportional",
      type: "boolean",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      default: false,
      description:
        "Cobrar valor proporcional no primeiro ciclo baseado nos dias restantes",
    },
    {
      displayName: "Frequência do Trial",
      name: "freeTrialFrequency",
      type: "number",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      default: 0,
      description:
        "Frequência do período de trial grátis (deixe 0 para sem trial)",
    },
    {
      displayName: "Tipo de Frequência do Trial",
      name: "freeTrialFrequencyType",
      type: "options",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      options: [
        {
          name: "Dias",
          value: "days",
        },
        {
          name: "Meses",
          value: "months",
        },
      ],
      default: "months",
      description: "Tipo de frequência do período de trial",
    },
    {
      displayName: "Tipos de Pagamento Permitidos",
      name: "paymentTypes",
      type: "multiOptions",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      options: [
        {
          name: "Cartão de Crédito",
          value: "credit_card",
        },
        {
          name: "Cartão de Débito",
          value: "debit_card",
        },
      ],
      default: ["credit_card"],
      description: "Tipos de pagamento permitidos no checkout",
    },
    {
      displayName: "Meios de Pagamento Permitidos",
      name: "paymentMethods",
      type: "multiOptions",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["create"],
        },
      },
      options: [
        {
          name: "Visa",
          value: "visa",
        },
        {
          name: "Mastercard",
          value: "mastercard",
        },
        {
          name: "American Express",
          value: "amex",
        },
        {
          name: "Boleto",
          value: "bolbradesco",
        },
      ],
      default: [],
      description:
        "Meios de pagamento específicos permitidos (deixe vazio para permitir todos)",
    },
    // Plan Get/Update Fields
    {
      displayName: "ID do Plano",
      name: "planId",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["get", "update"],
        },
      },
      default: "",
      description: "ID do plano",
    },
    // Plan Update Fields
    {
      displayName: "Nome do Plano",
      name: "updateReason",
      type: "string",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["update"],
        },
      },
      default: "",
      description: "Novo nome/descrição do plano",
    },
    {
      displayName: "Valor",
      name: "updateAmount",
      type: "number",
      displayOptions: {
        show: {
          resource: ["plans"],
          operation: ["update"],
        },
      },
      default: 0,
      description: "Novo valor do plano em reais",
    },
    // Subscription Operations
    {
      displayName: "Operation",
      name: "operation",
      type: "options",
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ["subscriptions"],
        },
      },
      options: [
        {
          name: "Criar",
          value: "create",
          description: "Criar uma assinatura",
          action: "Criar assinatura",
        },
        {
          name: "Pausar",
          value: "pause",
          description: "Pausar uma assinatura",
          action: "Pausar assinatura",
        },
        {
          name: "Retomar",
          value: "resume",
          description: "Retomar uma assinatura pausada",
          action: "Retomar assinatura",
        },
        {
          name: "Cancelar",
          value: "cancel",
          description: "Cancelar uma assinatura",
          action: "Cancelar assinatura",
        },
        {
          name: "Consultar",
          value: "get",
          description: "Consultar uma assinatura",
          action: "Consultar assinatura",
        },
        {
          name: "Listar",
          value: "list",
          description: "Listar assinaturas",
          action: "Listar assinaturas",
        },
      ],
      default: "create",
    },
    // Subscription Create Fields
    {
      displayName: "ID do Plano",
      name: "planId",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: "",
      description: "ID do plano de assinatura",
    },
    {
      displayName: "E-mail do Pagador",
      name: "payerEmail",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: "",
      description: "E-mail do pagador",
    },
    {
      displayName: "Descrição da Assinatura",
      name: "reason",
      type: "string",
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Descrição ou motivo da assinatura (opcional)",
    },
    {
      displayName: "CPF/CNPJ do Pagador",
      name: "payerDocument",
      type: "string",
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: "",
      description: "CPF ou CNPJ do pagador",
    },
    {
      displayName: "Data de Início",
      name: "startDate",
      type: "dateTime",
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Data de início da assinatura",
    },
    {
      displayName: "Período de Trial (dias)",
      name: "trialPeriodDays",
      type: "number",
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: 0,
      description: "Número de dias de período de trial",
    },
    {
      displayName: "Token do Cartão",
      name: "cardTokenId",
      type: "string",
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: "",
      description:
        "Token do cartão de crédito (obtido via Mercado Pago Checkout no front-end). Se não fornecido, a assinatura será criada com status 'pending' e retornará um init_point para checkout",
    },
    {
      displayName: "Status da Assinatura",
      name: "subscriptionStatus",
      type: "options",
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      options: [
        {
          name: "Pending (sem cartão - retorna init_point)",
          value: "pending",
          description:
            "Assinatura pendente, retorna init_point para checkout (não requer card_token_id)",
        },
        {
          name: "Authorized (com cartão)",
          value: "authorized",
          description:
            "Assinatura ativa imediatamente (requer card_token_id obrigatório)",
        },
      ],
      default: "pending",
      description:
        "Status inicial da assinatura. 'pending' permite criar sem card_token_id e retorna init_point para checkout",
    },
    {
      displayName: "URL de Retorno",
      name: "backUrl",
      type: "string",
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: "",
      description:
        "URL de retorno após o checkout (opcional). Recomendado quando assinatura é criada com status 'pending' para redirecionar o cliente após o pagamento.",
    },
    {
      displayName: "Referência Externa",
      name: "externalReference",
      type: "string",
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["create"],
        },
      },
      default: "",
      description: "Referência externa para rastreamento (opcional)",
    },
    // Subscription Get/Cancel/Pause/Resume Fields
    {
      displayName: "ID da Assinatura",
      name: "subscriptionId",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["subscriptions"],
          operation: ["get", "cancel", "pause", "resume"],
        },
      },
      default: "",
      description: "ID da assinatura",
    },
    // Webhook Operations
    {
      displayName: "Operation",
      name: "operation",
      type: "options",
      noDataExpression: true,
      displayOptions: {
        show: {
          resource: ["webhooks"],
        },
      },
      options: [
        {
          name: "Registrar",
          value: "register",
          description: "Registrar um novo webhook",
          action: "Registrar webhook",
        },
        {
          name: "Listar",
          value: "list",
          description: "Listar webhooks",
          action: "Listar webhooks",
        },
        {
          name: "Excluir",
          value: "delete",
          description: "Excluir um webhook",
          action: "Excluir webhook",
        },
        {
          name: "Consultar",
          value: "get",
          description: "Consultar um webhook",
          action: "Consultar webhook",
        },
      ],
      default: "register",
    },
    // Webhook Fields
    {
      displayName: "URL",
      name: "url",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["webhooks"],
          operation: ["register"],
        },
      },
      default: "",
      description: "URL que receberá as notificações do webhook",
    },
    {
      displayName: "Eventos",
      name: "events",
      type: "multiOptions",
      displayOptions: {
        show: {
          resource: ["webhooks"],
          operation: ["register"],
        },
      },
      options: [
        {
          name: "payment.created",
          value: "payment",
        },
        {
          name: "payment.updated",
          value: "payment",
        },
        {
          name: "subscription.created",
          value: "subscription",
        },
        {
          name: "subscription.updated",
          value: "subscription",
        },
      ],
      default: ["payment"],
      description: "Eventos para os quais o webhook será notificado",
    },
    {
      displayName: "Descrição",
      name: "description",
      type: "string",
      displayOptions: {
        show: {
          resource: ["webhooks"],
          operation: ["register"],
        },
      },
      default: "",
      description: "Descrição do webhook",
    },
    {
      displayName: "ID do Webhook",
      name: "webhookId",
      type: "string",
      required: true,
      displayOptions: {
        show: {
          resource: ["webhooks"],
          operation: ["get", "delete"],
        },
      },
      default: "",
      description: "ID do webhook",
    },
  ];
}
