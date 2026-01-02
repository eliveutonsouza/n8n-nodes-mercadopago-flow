export interface MercadoPagoApiCredentials {
  accessToken: string;
  baseUrl?: string;
}

export interface MercadoPagoError {
  message: string;
  error?: string;
  status?: number;
  cause?: Array<{
    code: string;
    description: string;
    data?: string;
    field?: string;
  }>;
}

export interface Payment {
  id: string;
  status: string;
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  description: string;
  payment_method_id: string;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
    first_name?: string;
    last_name?: string;
  };
  point_of_interaction?: {
    transaction_data?: {
      qr_code?: string;
      qr_code_base64?: string;
      ticket_url?: string;
    };
  };
  date_created: string;
  date_approved?: string;
  date_last_updated: string;
  external_reference?: string;
}

export interface Subscription {
  id: string;
  status: string;
  reason?: string;
  external_reference?: string;
  preapproval_plan_id?: string;
  card_id?: string;
  payment_method_id?: string;
  payer_email: string;
  payer_id?: string;
  back_url?: string;
  init_point?: string;
  sandbox_init_point?: string;
  collector_id?: number;
  application_id?: number;
  status_detail?: string;
  date_created: string;
  last_modified: string;
  start_date?: string;
  end_date?: string;
  charged_quantity?: number;
  currency_id?: string;
  recurring_application_id?: number;
  operation_type?: string;
}

export interface Plan {
  id: string;
  status: string;
  reason: string;
  auto_recurring: {
    frequency: number;
    frequency_type: string;
    transaction_amount: number;
    currency_id: string;
  };
  payment_methods_allowed?: {
    payment_types?: Array<{ id: string }>;
    payment_methods?: Array<{ id: string }>;
  };
  date_created?: string;
  last_modified?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  application_id?: number;
  status?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  identification?: {
    type: string;
    number: string;
  };
  phone?: {
    area_code?: string;
    number?: string;
  };
  address?: {
    zip_code?: string;
    street_name?: string;
    street_number?: number;
  };
  date_created?: string;
  date_last_updated?: string;
}

export interface Card {
  id: string;
  customer_id: string;
  first_six_digits: string;
  last_four_digits: string;
  expiration_month: number;
  expiration_year: number;
  cardholder: {
    name: string;
    identification: {
      type: string;
      number: string;
    };
  };
  payment_method: {
    id: string;
    name: string;
    payment_type_id: string;
  };
  date_created: string;
  date_last_updated: string;
}

export interface Preference {
  id: string;
  client_id?: string;
  collector_id?: number;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    description?: string;
    category_id?: string;
  }>;
  payer?: {
    email: string;
    name?: string;
    surname?: string;
    phone?: {
      area_code: string;
      number: string;
    };
    identification?: {
      type: string;
      number: string;
    };
    address?: {
      street_name: string;
      street_number: number;
      zip_code: string;
    };
  };
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: string;
  payment_methods?: {
    excluded_payment_types?: Array<{ id: string }>;
    excluded_payment_methods?: Array<{ id: string }>;
    installments?: number;
    default_payment_method_id?: string;
  };
  notification_url?: string;
  statement_descriptor?: string;
  external_reference?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
  init_point?: string;
  sandbox_init_point?: string;
  date_created?: string;
  last_updated?: string;
}

export interface NormalizedResponse {
  provider: "mercado_pago";
  type: string;
  id: string;
  status: string;
  amount?: number;
  currency?: string;
  createdAt: string;
  raw: any;
  [key: string]: any;
}
