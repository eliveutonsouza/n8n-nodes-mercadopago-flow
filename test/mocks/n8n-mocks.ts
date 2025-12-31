/**
 * Mocks do n8n-workflow para testes
 */

import { INodeExecutionData } from 'n8n-workflow';
import { MercadoPagoCredentials } from '../../nodes/PaymentMercadoPago/types';
import { mockCredentials } from './fixtures';

export interface MockExecuteFunctions {
	getNodeParameter: jest.Mock;
	getCredentials: jest.Mock;
	getInputData: jest.Mock;
	continueOnFail: jest.Mock;
	helpers: {
		requestWithAuthentication: {
			call: jest.Mock;
		};
	};
	[key: string]: any;
}

export function createMockExecuteFunctions(
	overrides: Partial<MockExecuteFunctions> = {},
): MockExecuteFunctions {
	const mockGetNodeParameter = jest.fn();
	const mockGetCredentials = jest.fn();
	const mockGetInputData = jest.fn();
	const mockContinueOnFail = jest.fn();
	const mockRequestWithAuthentication = jest.fn();

	return {
		getNodeParameter: mockGetNodeParameter,
		getCredentials: mockGetCredentials.mockResolvedValue(mockCredentials as MercadoPagoCredentials),
		getInputData: mockGetInputData.mockReturnValue([{ json: {} }] as INodeExecutionData[]),
		continueOnFail: mockContinueOnFail.mockReturnValue(false),
		helpers: {
			requestWithAuthentication: {
				call: mockRequestWithAuthentication,
			},
		},
		...overrides,
	};
}

export function createMockItem(itemIndex: number = 0): INodeExecutionData {
	return {
		json: {
			resource: 'pix',
			operation: 'create',
		},
		binary: {},
		pairedItem: {
			item: itemIndex,
		},
	};
}

