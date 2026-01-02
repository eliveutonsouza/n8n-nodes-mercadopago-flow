import { INodeProperties } from "n8n-workflow";

export function getNodeProperties(): INodeProperties[] {
	return [
		// Resource Selection
		{
			displayName: "Resource",
			name: "resource",
			type: "options",
			noDataExpression: true,
			options: [
				{
					name: "Pagamentos (Payments)",
					value: "payments",
				},
				{
					name: "PIX",
					value: "pix",
				},
				{
					name: "Clientes (Customers)",
					value: "customers",
				},
				{
					name: "Cartões (Cards)",
					value: "cards",
				},
				{
					name: "Preferências (Preferences)",
					value: "preferences",
				},
				{
					name: "Pedidos QR (QR Orders)",
					value: "qrOrders",
				},
				{
					name: "PDV (POS)",
					value: "pos",
				},
				{
					name: "Lojas (Stores)",
					value: "stores",
				},
				{
					name: "Chargebacks",
					value: "chargebacks",
				},
				{
					name: "OAuth",
					value: "oauth",
				},
				{
					name: "Métodos de Pagamento",
					value: "paymentMethods",
				},
				{
					name: "Tipos de Identificação",
					value: "identificationTypes",
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
				{ name: "Criar", value: "create", description: "Criar um pagamento PIX" },
				{ name: "Consultar", value: "get", description: "Consultar um pagamento PIX" },
				{ name: "Reembolsar", value: "refund", description: "Reembolsar um pagamento PIX" },
			],
			default: "create",
		},
		// Payments Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["payments"],
				},
			},
			options: [
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Listar", value: "list" },
				{ name: "Buscar", value: "search" },
				{ name: "Reembolsar", value: "refund" },
				{ name: "Capturar", value: "capture" },
				{ name: "Cancelar", value: "cancel" },
			],
			default: "create",
		},
		// Customers Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["customers"],
				},
			},
			options: [
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Atualizar", value: "update" },
				{ name: "Deletar", value: "delete" },
				{ name: "Listar", value: "list" },
				{ name: "Buscar", value: "search" },
			],
			default: "create",
		},
		// Cards Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["cards"],
				},
			},
			options: [
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Deletar", value: "delete" },
				{ name: "Listar", value: "list" },
			],
			default: "create",
		},
		// Preferences Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["preferences"],
				},
			},
			options: [
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Atualizar", value: "update" },
			],
			default: "create",
		},
		// QR Orders Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["qrOrders"],
				},
			},
			options: [
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Listar", value: "list" },
			],
			default: "create",
		},
		// POS Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["pos"],
				},
			},
			options: [
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Atualizar", value: "update" },
				{ name: "Deletar", value: "delete" },
				{ name: "Listar", value: "list" },
			],
			default: "create",
		},
		// Stores Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["stores"],
				},
			},
			options: [
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Atualizar", value: "update" },
				{ name: "Deletar", value: "delete" },
				{ name: "Listar", value: "list" },
			],
			default: "create",
		},
		// Chargebacks Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["chargebacks"],
				},
			},
			options: [
				{ name: "Consultar", value: "get" },
				{ name: "Listar", value: "list" },
				{ name: "Enviar Documentação", value: "upload_documentation" },
			],
			default: "get",
		},
		// OAuth Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["oauth"],
				},
			},
			options: [
				{ name: "Autorizar", value: "authorize" },
				{ name: "Renovar Token", value: "refresh_token" },
				{ name: "Obter Info do Usuário", value: "get_user_info" },
			],
			default: "authorize",
		},
		// Payment Methods Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["paymentMethods"],
				},
			},
			options: [
				{ name: "Listar", value: "list" },
			],
			default: "list",
		},
		// Identification Types Operations
		{
			displayName: "Operation",
			name: "operation",
			type: "options",
			noDataExpression: true,
			displayOptions: {
				show: {
					resource: ["identificationTypes"],
				},
			},
			options: [
				{ name: "Listar", value: "list" },
			],
			default: "list",
		},
		// Plans Operations
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
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Listar", value: "list" },
				{ name: "Atualizar", value: "update" },
			],
			default: "create",
		},
		// Subscriptions Operations
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
				{ name: "Criar", value: "create" },
				{ name: "Consultar", value: "get" },
				{ name: "Pausar", value: "pause" },
				{ name: "Retomar", value: "resume" },
				{ name: "Cancelar", value: "cancel" },
				{ name: "Listar", value: "list" },
			],
			default: "create",
		},
		// Webhooks Operations
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
				{ name: "Registrar", value: "register" },
				{ name: "Consultar", value: "get" },
				{ name: "Listar", value: "list" },
				{ name: "Deletar", value: "delete" },
			],
			default: "register",
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
			description: "Valor do reembolso em reais (deixe vazio para reembolso total)",
		},
		// Plans Create Fields
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
				{ name: "Dias", value: "days" },
				{ name: "Meses", value: "months" },
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
				{ name: "BRL - Real Brasileiro", value: "BRL" },
				{ name: "ARS - Peso Argentino", value: "ARS" },
				{ name: "CLP - Peso Chileno", value: "CLP" },
				{ name: "MXN - Peso Mexicano", value: "MXN" },
				{ name: "COP - Peso Colombiano", value: "COP" },
				{ name: "PEN - Sol Peruano", value: "PEN" },
				{ name: "UYU - Peso Uruguaio", value: "UYU" },
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
		// Plans Get Fields
		{
			displayName: "ID do Plano",
			name: "planId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["plans"],
					operation: ["get"],
				},
			},
			default: "",
			description: "ID do plano a ser consultado",
		},
		// Plans Update Fields
		{
			displayName: "ID do Plano",
			name: "planId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["plans"],
					operation: ["update"],
				},
			},
			default: "",
			description: "ID do plano a ser atualizado",
		},
		{
			displayName: "Nome do Plano",
			name: "reason",
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
		// Subscriptions Create Fields
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
			description: "⚠️ Token do cartão obtido via Mercado Pago Checkout no front-end. Veja: docs/FLUXO_ASSINATURA_FRONTEND.md",
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
			description: "CPF ou CNPJ do pagador (apenas números)",
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
			description: "Número de dias de trial grátis",
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
				{ name: "Autorizada (com token)", value: "authorized" },
				{ name: "Pendente (sem token - retorna init_point)", value: "pending" },
			],
			default: "pending",
			description: "Status inicial da assinatura",
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
			description: "URL de retorno após o checkout",
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
			description: "Descrição da assinatura",
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
			description: "Referência externa para identificar a assinatura",
		},
		// Subscriptions Get/Pause/Resume/Cancel Fields
		{
			displayName: "ID da Assinatura",
			name: "subscriptionId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["subscriptions"],
					operation: ["get", "pause", "resume", "cancel"],
				},
			},
			default: "",
			description: "ID da assinatura",
		},
		// Webhooks Register Fields
		{
			displayName: "URL do Webhook",
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
				{ name: "payment", value: "payment" },
				{ name: "subscription", value: "subscription" },
				{ name: "plan", value: "plan" },
			],
			default: ["payment"],
			description: "Eventos que o webhook deve escutar",
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
		// Webhooks Get/Delete Fields
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
		// Payments Create Fields (basic)
		{
			displayName: "Valor da Transação",
			name: "transactionAmount",
			type: "number",
			required: true,
			displayOptions: {
				show: {
					resource: ["payments"],
					operation: ["create"],
				},
			},
			default: 0,
			description: "Valor da transação",
		},
		{
			displayName: "Método de Pagamento",
			name: "paymentMethodId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["payments"],
					operation: ["create"],
				},
			},
			default: "",
			description: "ID do método de pagamento (ex: pix, credit_card)",
		},
		{
			displayName: "E-mail do Pagador",
			name: "payerEmail",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["payments"],
					operation: ["create"],
				},
			},
			default: "",
			description: "E-mail do pagador",
		},
		// Customers Create Fields (basic)
		{
			displayName: "E-mail",
			name: "email",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["customers"],
					operation: ["create"],
				},
			},
			default: "",
			description: "E-mail do cliente",
		},
		// Cards Create Fields
		{
			displayName: "ID do Cliente",
			name: "customerId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["cards"],
				},
			},
			default: "",
			description: "ID do cliente",
		},
		{
			displayName: "Token do Cartão",
			name: "token",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["cards"],
					operation: ["create"],
				},
			},
			default: "",
			description: "Token do cartão",
		},
		// QR Orders Create Fields
		{
			displayName: "Valor Total",
			name: "totalAmount",
			type: "number",
			required: true,
			displayOptions: {
				show: {
					resource: ["qrOrders"],
					operation: ["create"],
				},
			},
			default: 0,
			description: "Valor total do pedido",
		},
		{
			displayName: "Descrição",
			name: "description",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["qrOrders"],
					operation: ["create"],
				},
			},
			default: "",
			description: "Descrição do pedido",
		},
		{
			displayName: "ID do POS Externo",
			name: "externalPosId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["qrOrders"],
					operation: ["create"],
				},
			},
			default: "",
			description: "ID externo do ponto de venda",
		},
		{
			displayName: "Modo QR",
			name: "qrMode",
			type: "options",
			required: true,
			displayOptions: {
				show: {
					resource: ["qrOrders"],
					operation: ["create"],
				},
			},
			options: [
				{ name: "Estático", value: "static" },
				{ name: "Dinâmico", value: "dynamic" },
				{ name: "Híbrido", value: "hybrid" },
			],
			default: "static",
			description: "Modo do QR Code",
		},
		// POS Create Fields
		{
			displayName: "Nome",
			name: "name",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["pos"],
					operation: ["create"],
				},
			},
			default: "",
			description: "Nome do PDV",
		},
		{
			displayName: "Categoria",
			name: "category",
			type: "number",
			required: true,
			displayOptions: {
				show: {
					resource: ["pos"],
					operation: ["create"],
				},
			},
			default: 0,
			description: "Categoria do PDV",
		},
		{
			displayName: "ID da Loja",
			name: "storeId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["pos"],
					operation: ["create"],
				},
			},
			default: "",
			description: "ID da loja",
		},
		{
			displayName: "Valor Fixo",
			name: "fixedAmount",
			type: "boolean",
			required: true,
			displayOptions: {
				show: {
					resource: ["pos"],
					operation: ["create"],
				},
			},
			default: true,
			description: "Se o PDV tem valor fixo",
		},
		// Stores Create Fields
		{
			displayName: "Nome",
			name: "name",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["stores"],
					operation: ["create"],
				},
			},
			default: "",
			description: "Nome da loja",
		},
		{
			displayName: "ID do Usuário",
			name: "userId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["stores"],
					operation: ["create"],
				},
			},
			default: "",
			description: "ID do usuário do Mercado Pago",
		},
		// Chargebacks Get Fields
		{
			displayName: "ID do Chargeback",
			name: "chargebackId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["chargebacks"],
					operation: ["get"],
				},
			},
			default: "",
			description: "ID do chargeback",
		},
		// OAuth Authorize Fields
		{
			displayName: "Client ID",
			name: "clientId",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["oauth"],
					operation: ["authorize"],
				},
			},
			default: "",
			description: "Client ID da aplicação OAuth",
		},
		{
			displayName: "Client Secret",
			name: "clientSecret",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["oauth"],
					operation: ["authorize", "refresh_token"],
				},
			},
			default: "",
			description: "Client Secret da aplicação OAuth",
		},
		{
			displayName: "Code",
			name: "code",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["oauth"],
					operation: ["authorize"],
				},
			},
			default: "",
			description: "Código de autorização recebido no redirect",
		},
		{
			displayName: "Redirect URI",
			name: "redirectUri",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["oauth"],
					operation: ["authorize"],
				},
			},
			default: "",
			description: "URI de redirecionamento configurada na aplicação",
		},
		// OAuth Refresh Token Fields
		{
			displayName: "Refresh Token",
			name: "refreshToken",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["oauth"],
					operation: ["refresh_token"],
				},
			},
			default: "",
			description: "Refresh token para renovar o access token",
		},
		// Payment Methods List Fields
		{
			displayName: "Public Key",
			name: "publicKey",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["paymentMethods"],
					operation: ["list"],
				},
			},
			default: "",
			description: "Public Key do Mercado Pago",
		},
		// Identification Types List Fields
		{
			displayName: "Public Key",
			name: "publicKey",
			type: "string",
			required: true,
			displayOptions: {
				show: {
					resource: ["identificationTypes"],
					operation: ["list"],
				},
			},
			default: "",
			description: "Public Key do Mercado Pago",
		},
	];
}

