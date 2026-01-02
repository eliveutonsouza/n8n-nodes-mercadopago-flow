import { IExecuteFunctions } from "n8n-workflow";

/**
 * Interface comum para handlers de recursos
 */
export interface IResourceHandler {
	/**
	 * Lista de operações suportadas por este recurso
	 */
	operations: string[];

	/**
	 * Executa uma operação do recurso
	 * 
	 * @param executeFunctions - Funções de execução do n8n
	 * @param operation - Nome da operação a executar
	 * @param resource - Nome do recurso
	 * @returns Promise com o resultado da operação
	 */
	execute(
		executeFunctions: IExecuteFunctions,
		operation: string,
		resource: string
	): Promise<any>;
}

