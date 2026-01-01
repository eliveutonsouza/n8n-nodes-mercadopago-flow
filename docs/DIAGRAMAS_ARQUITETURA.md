# Diagramas de Arquitetura - Mercado Pago n8n Node

Este documento apresenta a arquitetura visual completa do node n8n para Mercado Pago, mostrando como os dois universos de pagamento (Assinatura com cartão e PIX) coexistem sem se cruzar.

## Regra de Ouro Visual

- **Cartão → preapproval** (assinatura nativa)
- **PIX → payment** (recorrência manual)
- **Eles nunca se cruzam**

---

## Visão Macro - Cartão e PIX Coexistindo

```mermaid
flowchart TD
    U[Usuário] --> F[Checkout Frontend]

    %% FLUXO CARTÃO
    F -->|Cartão| MPJS[Mercado Pago JS SDK]
    MPJS -->|card_token_id| N8N[n8n Webhook]
    N8N -->|POST /preapproval| MP1[Mercado Pago API]
    MP1 -->|preapproval_id| N8N
    MP1 -->|Webhooks Recorrentes| N8N
    N8N --> SYS[Sistema / SaaS]

    %% FLUXO PIX
    F -->|PIX| N8N
    N8N -->|POST /v1/payments pix| MP2[Mercado Pago API]
    MP2 -->|qr_code| F
    MP2 -->|Webhooks Payment| N8N
    N8N --> SYS

    %% ESTILO
    classDef cardFlow fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    classDef pixFlow fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef system fill:#f3e5f5,stroke:#4a148c,stroke-width:2px

    class MPJS,N8N,MP1 cardFlow
    class N8N,MP2 pixFlow
    class SYS system
```

**Observação**: Os dois fluxos são completamente independentes. O n8n atua como orquestrador, mas cada fluxo usa endpoints diferentes do Mercado Pago.

---

## Fluxo 1 - Assinatura Recorrente (Cartão)

Este é o único fluxo de assinatura nativa do Mercado Pago.

### Diagrama Completo

```mermaid
flowchart TD
    subgraph precondicao["1️⃣ Pré-condição (Uma vez)"]
        ADMIN[Admin / Backend / n8n]
        ADMIN -->|POST /preapproval_plan| PLAN[preapproval_plan_id]
        PLAN -->|Define: valor, frequência, moeda| PLAN_STORED[Plano Armazenado]
    end

    subgraph checkout["2️⃣ Checkout Transparente (Frontend)"]
        USER[Usuário]
        USER -->|Preenche formulário| CARD_FORM[Formulário de Cartão]
        CARD_FORM -->|Tokenização segura| MP_SDK[Mercado Pago JS SDK]
        MP_SDK -->|Gera| CARD_TOKEN[card_token_id]
    end

    subgraph envio["3️⃣ Envio para n8n"]
        CARD_TOKEN -->|Webhook n8n| N8N_WEBHOOK[n8n Recebe]
        N8N_WEBHOOK -->|Pacote mínimo:| DATA[card_token_id<br/>payer_email<br/>preapproval_plan_id]
    end

    subgraph criacao["4️⃣ Criação da Assinatura"]
        DATA -->|POST /preapproval| MP_API[Mercado Pago API]
        MP_API -->|Resposta:| RESULT[status: authorized/pending<br/>preapproval_id]
        RESULT -->|Assinatura criada| SUCCESS[✅ Assinatura Nascida]
    end

    subgraph webhooks["5️⃣ Webhooks de Eventos Recorrentes"]
        MP_API -->|Eventos automáticos| WEBHOOK_EVENTS[Webhook Events]
        WEBHOOK_EVENTS -->|Cobrança aprovada| N8N_PROCESS[n8n Processa]
        WEBHOOK_EVENTS -->|Falha| N8N_PROCESS
        WEBHOOK_EVENTS -->|Cancelamento| N8N_PROCESS
        WEBHOOK_EVENTS -->|Pausa| N8N_PROCESS
        N8N_PROCESS -->|Atualiza status| SYSTEM_UPDATE[Sistema Atualizado]
    end

    subgraph sistema["6️⃣ Seu Sistema"]
        SYSTEM_UPDATE -->|Armazena:| DB[Banco / SaaS]
        DB -->|Dados:| DB_DATA[status da assinatura<br/>datas<br/>histórico]
    end

    PLAN_STORED -.->|Usado em| DATA
    SUCCESS --> WEBHOOK_EVENTS

    %% ESTILO
    classDef precond fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    classDef checkout fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef n8n fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef mp fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef system fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px

    class ADMIN,PLAN,PLAN_STORED precond
    class USER,CARD_FORM,MP_SDK,CARD_TOKEN checkout
    class N8N_WEBHOOK,DATA,N8N_PROCESS n8n
    class MP_API,RESULT,SUCCESS,WEBHOOK_EVENTS mp
    class SYSTEM_UPDATE,DB,DB_DATA system
```

### O que NÃO existe neste fluxo

- ❌ `POST /payments` (isso é para PIX)
- ❌ PIX
- ❌ Payment ID (aqui usamos preapproval_id)

### Pontos Críticos

1. **Pré-condição**: O plano é criado UMA vez, não no checkout
2. **Tokenização**: Acontece apenas no frontend, nenhum pagamento é criado ainda
3. **Criação da Assinatura**: Acontece no n8n via `POST /preapproval`
4. **Webhooks**: Você não controla a cobrança, apenas reage a ela
5. **Automação**: O Mercado Pago gerencia a recorrência automaticamente

---

## Fluxo 2 - PIX (Recorrência Manual)

Agora entramos no território onde você é responsável pela recorrência.

### Diagrama Completo

```mermaid
flowchart TD
    subgraph checkout_pix["1️⃣ Checkout PIX (Frontend)"]
        USER_PIX[Usuário]
        USER_PIX -->|Escolhe PIX| PIX_OPTION[Opção PIX]
        PIX_OPTION -->|Webhook n8n| N8N_PIX[n8n Recebe]
        N8N_PIX -->|Nada de plano aqui| NOTE[⚠️ Sem plano]
    end

    subgraph criacao_pix["2️⃣ Criação do Pagamento PIX"]
        N8N_PIX -->|POST /v1/payments| MP_PIX_API[Mercado Pago API]
        MP_PIX_API -->|payment_method_id: pix| MP_PIX_API
        MP_PIX_API -->|Resposta:| PIX_RESULT[payment_id<br/>qr_code<br/>qr_code_base64]
    end

    subgraph retorno["3️⃣ Retorno ao Frontend"]
        PIX_RESULT -->|Envia para| FRONTEND[Frontend]
        FRONTEND -->|Exibe| QR_CODE[QR Code]
        FRONTEND -->|Exibe| COPY_PASTE[Copia e Cola]
        USER_PIX -->|Usuário paga| PAYMENT_DONE[✅ Pagamento Realizado]
    end

    subgraph webhook_pix["4️⃣ Webhook de Pagamento Aprovado"]
        PAYMENT_DONE -->|Mercado Pago notifica| MP_WEBHOOK[Webhook]
        MP_WEBHOOK -->|Evento:| WEBHOOK_DATA[payment.status = approved]
        WEBHOOK_DATA -->|n8n recebe| N8N_WEBHOOK_PIX[n8n Processa]
    end

    subgraph assinatura_logica["5️⃣ Assinatura Lógica (Não Mercado Pago)"]
        N8N_WEBHOOK_PIX -->|Sua lógica| YOUR_SYSTEM[Seu Sistema]
        YOUR_SYSTEM -->|Ações:| ACTIONS[Ativa plano<br/>Salva data de vencimento<br/>Agenda próxima cobrança]
        ACTIONS -->|⚠️ Assinatura é SUA| LOGIC_SUB[Assinatura Lógica Criada]
    end

    subgraph proximo_ciclo["6️⃣ Próximo Ciclo"]
        SCHEDULER[Scheduler n8n / Cron]
        SCHEDULER -->|Verifica vencimento| CHECK[Verifica Vencimento]
        CHECK -->|Cria novo PIX| NEW_PIX[POST /v1/payments]
        NEW_PIX -->|Novo QR Code| FRONTEND
        FRONTEND -->|Loop recomeça| USER_PIX
    end

    subgraph cancelamento["7️⃣ Cancelamento / Atraso"]
        YOUR_SYSTEM -->|Decisão:| DECISION[Seu sistema decide]
        DECISION -->|Ações:| ACTIONS_CANCEL[Bloquear acesso<br/>Reenviar cobrança<br/>Notificar usuário]
        ACTIONS_CANCEL -->|⚠️ Mercado Pago não ajuda| MANUAL[Você é o adulto da sala]
    end

    LOGIC_SUB --> SCHEDULER
    PAYMENT_DONE --> MP_WEBHOOK

    %% ESTILO
    classDef pix fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef n8n fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef mp fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef system fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef warning fill:#ffebee,stroke:#c62828,stroke-width:3px

    class USER_PIX,PIX_OPTION,QR_CODE,COPY_PASTE pix
    class N8N_PIX,N8N_WEBHOOK_PIX,SCHEDULER,CHECK n8n
    class MP_PIX_API,PIX_RESULT,MP_WEBHOOK,WEBHOOK_DATA,NEW_PIX mp
    class YOUR_SYSTEM,ACTIONS,LOGIC_SUB,DECISION,ACTIONS_CANCEL system
    class NOTE,MANUAL warning
```

### O que NÃO existe neste fluxo

- ❌ `preapproval_plan_id` (não há plano no Mercado Pago)
- ❌ `preapproval` (isso é para cartão)
- ❌ Recorrência automática do Mercado Pago

### Pontos Críticos

1. **Sem Plano**: Nada de plano aqui, apenas pagamento único
2. **Recorrência Manual**: Você controla quando criar o próximo pagamento
3. **Assinatura Lógica**: A assinatura existe no seu sistema, não no Mercado Pago
4. **Scheduler**: Você precisa agendar a próxima cobrança
5. **Responsabilidade**: Você é responsável por bloqueios, notificações e reenvios

---

## Comparação Final - Realidade Nua

```mermaid
graph LR
    subgraph assinatura_cartao["ASSINATURA CARTÃO"]
        AC1[✔ Automática]
        AC2[✔ Webhooks nativos]
        AC3[✘ Sem PIX]
    end

    subgraph pix_recorrencia["PIX RECORRÊNCIA"]
        P1[✔ Simples]
        P2[✔ Muito usado no Brasil]
        P3[✘ Recorrência é manual]
        P4[✘ Sem preapproval]
    end

    ASSINATURA[Assinatura Cartão] --> assinatura_cartao
    PIX[PIX] --> pix_recorrencia
```

### Tabela Comparativa

| Característica | Assinatura (Cartão) | PIX (Recorrência Manual) |
|----------------|---------------------|--------------------------|
| **Endpoint** | `POST /preapproval` | `POST /v1/payments` |
| **Plano** | Obrigatório (`preapproval_plan_id`) | Não existe |
| **Recorrência** | Automática (Mercado Pago) | Manual (você controla) |
| **Webhooks** | Nativos para eventos recorrentes | Apenas para pagamento único |
| **Tokenização** | `card_token_id` (frontend) | Não aplicável |
| **QR Code** | Não aplicável | `qr_code` e `qr_code_base64` |
| **Controle** | Mercado Pago gerencia | Você gerencia |
| **Complexidade** | Média (setup inicial) | Baixa (pagamento único) |

---

## Onde Entra o Node n8n

O node n8n expõe operações distintas, não misturadas:

```mermaid
graph TD
    NODE[Mercado Pago Node]
    
    NODE --> PLAN[Resource: Plan]
    NODE --> SUB[Resource: Subscription]
    NODE --> PAYMENT[Resource: Payment]
    NODE --> WEBHOOK[Resource: Webhook]
    
    PLAN --> PLAN_OPS[Criar Plano<br/>Consultar<br/>Listar<br/>Atualizar]
    
    SUB --> SUB_OPS[Criar Assinatura<br/>Cancelar<br/>Pausar<br/>Retomar<br/>Consultar<br/>Listar]
    
    PAYMENT --> PAYMENT_OPS[Criar Pagamento PIX<br/>Consultar<br/>Reembolsar]
    
    WEBHOOK --> WEBHOOK_OPS[Registrar<br/>Listar<br/>Consultar<br/>Excluir<br/>Parse Handler]
    
    %% REGRA CRÍTICA
    SUB -.->|NUNCA mistura com| PAYMENT
    PAYMENT -.->|NUNCA mistura com| SUB
```

### Regra Arquitetural

**Misturar "assinatura" com "payment" no mesmo caminho é pedir erro.**

Cada Resource tem sua ontologia:
- **Plan** = Regra de cobrança
- **Subscription** = Contrato recorrente (cartão)
- **Payment** = Evento único (PIX)
- **Webhook** = Notificações

---

## Pensamento Final (Arquitetura)

O Mercado Pago não é confuso. Ele é literal demais.

Cada endpoint representa uma ontologia diferente:

- `payment` = evento único
- `preapproval` = contrato
- `plan` = regra

Quando você respeita isso, tudo flui. Quando mistura, ele responde com silêncio e erro genérico.

### Diagrama de Ontologias

```mermaid
graph TD
    subgraph ontologias["Ontologias do Mercado Pago"]
        PAYMENT_ONT[payment<br/>Evento Único<br/>POST /v1/payments]
        PREAPPROVAL_ONT[preapproval<br/>Contrato<br/>POST /preapproval]
        PLAN_ONT[plan<br/>Regra<br/>POST /preapproval_plan]
    end
    
    PAYMENT_ONT -->|Usado para| PIX_USE[PIX]
    PREAPPROVAL_ONT -->|Usado para| CARD_USE[Assinatura Cartão]
    PLAN_ONT -->|Usado para| PLAN_USE[Definir Regras]
    
    PLAN_USE -->|Referenciado por| PREAPPROVAL_ONT
    
    %% NUNCA SE CRUZAM
    PAYMENT_ONT -.->|NUNCA| PREAPPROVAL_ONT
    PREAPPROVAL_ONT -.->|NUNCA| PAYMENT_ONT
```

---

## Referências

- [Documentação Oficial - Assinaturas](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/subscriptions)
- [Documentação Oficial - Pagamentos PIX](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards)
- [API Reference - Preapproval](https://www.mercadopago.com.br/developers/pt/reference/subscriptions/_preapproval/post)
- [API Reference - Payments](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post)

