module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['@typescript-eslint', 'eslint-plugin-n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	env: {
		node: true,
		es6: true,
		jest: true,
	},
	rules: {
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
			},
		],
		'no-console': 'off',
	},
	ignorePatterns: [
		'node_modules/',
		'dist/',
		'coverage/',
		'*.js',
		'!jest.config.js',
		'!gulpfile.js',
		'test/local/',
	],
};

