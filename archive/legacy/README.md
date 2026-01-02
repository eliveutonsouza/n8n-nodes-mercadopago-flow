# Código Legado

Esta pasta contém código da versão antiga do node (PaymentMercadoPago) que foi substituído pela nova estrutura modular (MercadoPago).

## Conteúdo

- `nodes/PaymentMercadoPago/` - Implementação antiga do node
- `credentials/PaymentMercadoPagoAPI.credentials.ts` - Credenciais antigas

## Nota

Alguns testes ainda podem referenciar esses arquivos para validação de compatibilidade. Se você precisar executar esses testes, certifique-se de que os imports estejam corretos apontando para `archive/legacy/`.

## Migração

O código foi migrado para:
- `nodes/MercadoPago/` - Nova implementação modular
- `credentials/MercadoPagoApi.credentials.ts` - Novas credenciais

A nova estrutura oferece:
- Recursos bem separados (Payments, Customers, Cards, Preferences, QR/Orders, POS, Stores, Chargebacks, OAuth, Payment Methods, Identification Types)
- Campos guiados (sem precisar colar JSON cru em tudo)
- Estrutura padrão de community node (credentials + generic functions + node)

