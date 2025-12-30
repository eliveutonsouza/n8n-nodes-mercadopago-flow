/**
 * Configuração global do Jest
 * Executado antes de todos os testes
 */

// Configurações globais de teste
beforeEach(() => {
	// Limpar mocks antes de cada teste
	jest.clearAllMocks();
});

// Timeout padrão para testes
jest.setTimeout(10000);

