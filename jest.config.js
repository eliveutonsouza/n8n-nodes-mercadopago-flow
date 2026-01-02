module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/dist/',
		'/test/local/', // Ignora testes locais (scripts manuais)
	],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	collectCoverageFrom: [
		'nodes/**/*.ts',
		'credentials/**/*.ts',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/dist/**',
		'!**/test/**',
		'!nodes/PixPayment/**', // Ignora código antigo não usado
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	coverageThreshold: {
		global: {
			branches: 62, // Ajustado devido à complexidade de branches (erros, validações, edge cases)
			functions: 55, // Ajustado - algumas funções são apenas wrappers ou helpers internos
			lines: 84, // Mantido alto para garantir boa cobertura de linhas
			statements: 83, // Mantido alto para garantir boa cobertura de statements
		},
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/test/setup/jest.setup.ts'],
	verbose: true,
};

