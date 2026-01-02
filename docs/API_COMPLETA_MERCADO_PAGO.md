# Mercado Pago Developers API

## 📑 Sumário


---

1. Introduction
2. Checkout Pro
3. Checkout Bricks
4. Checkout API
5. QR Code
5. Point
6. Oauth

## Overview

This collection includes the APIs needed to implement Mercado Pago's main products.

Each folder contains a complete list of API resources needed to implement each particular product (Checkout Pro, Checkout API, In store payments, etc).

## Prerequisites

You will need an account (live or test) to access your credentiales to make API calls.

Make sure to create your account and access your credentials following this guide.

## 🚀 How to Use


Visit our developer's site and check the full documentation for the product you want to implement in order to get the foundations needed to use this collection.

Get your credentials ready and fork the "Integration" environment. Set the variables you need (Public Key, Access Token, etc.) for the specific product you want to test. Fork the collection and start testing our APIs

IMPORTANT: fork it in a PRIVATE workspace. Your credentials and sensitive information must stay private at all times. If you think your credentials may have been exposed, refresh them. 
## 🔗 Extra Resources


---

Check out our Developer's site﻿
See our API Reference for a full resource list

## Checkout Pro

In this folder you will find all the API calls needed to integrate Mercado Pago's Checkout Pro.

Make sure to:

Read the testing documentation
﻿Create a test user and get the credentials﻿
Select the Environment "Integration"
Set the access token of the test user created as the value for access_token
Some collection variables will be automatically completed ad you go (preference id, payment id). For others, you may to need to set collection variables as you go to test all resources (merchant order id)

### Preferences

A Preference is set of information that allows you to configure a product or service that you want to charge, such as price and quantity, as well as other settings related to the defined payment flow.

#### POST Create Preference

**Endpoint:** `https://api.mercadopago.com/checkout/preferences`

Generate a preference with the information of a product or service and obtain the necessary URL to start the payment flow.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
    "auto_return": "approved",
    "back_urls": {
        "success": "https://httpbin.org/get?back_url=success",
        "failure": "https://httpbin.org/get?back_url=failure",
        "pending": "https://httpbin.org/get?back_url=pending"
    },
    "statement_descriptor": "TestStore",
    "binary_mode": false,
    "external_reference": "IWD1238971",
    "items": [
        {
            "id": "010983098",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000,
            "description": "Description of my product",
            "category_id": "retail"
        }
    ],
    "payer": {
        "email": "test_user_12398378192@testuser.com",
        "name": "Juan",
        "surname": "Lopez",
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "identification":{
            "type": "DNI",
            "number": "12345678"
        },
        "address": {
            "street_name": "Street",
            "street_number": 123,
            "zip_code": "1406"
        }
    },
    "payment_methods": {
        "excluded_payment_types": [],
        "excluded_payment_methods": [],
        "installments": 12,
        "default_payment_method_id": "account_money"
    },
    "notification_url": "https://www.your-site.com/webhook",
    "expires": true,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
}
Example
Create Preference
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "auto_return": "approved",
  "back_urls": {
    "success": "https://www.httpbin.org/get?back_url=success",
    "failure": "https://www.httpbin.org/get?back_url=failure",
    "pending": "https://www.httpbin.org/get?back_url=pending"
  },
  "statement_descriptor": "TestStore",
  "binary_mode": false,
  "external_reference": "IWD1238971",
  "items": [
    {
      "id": "010983098",
      "title": "My Product",
      "quantity": 1,
      "unit_price": 2000,
      "description": "Description of my product",
      "category_id": "retail"
    }
  ],
  "payer": {
    "email": "test_user_12398378192@testuser.com",
    "name": "Juan",
    "surname": "Lopez",
    "phone": {
      "area_code": "11",
      "number": "1523164589"
    },
    "identification": {
      "type": "DNI",
      "number": "12345678"
    },
    "address": {
      "street_name": "Street",
      "street_number": 123,
      "zip_code": "1406"
    }
  },
  "payment_methods": {
    "excluded_payment_types": [],
    "excluded_payment_methods": [],
    "installments": 12,
    "default_payment_method_id": "account_money"
  },
  "notification_url": "https://www.your-site.com/webhook",
  "expires": true,
  "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
  "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/checkout/preferences", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "additional_info": "",
    "auto_return": "approved",
    "back_urls": {
        "failure": "https://www.httpbin.org/get?back_url=failure",
        "pending": "https://www.httpbin.org/get?back_url=pending",
        "success": "https://www.httpbin.org/get?back_url=success"
    },
    "binary_mode": false,
    "client_id": "2826441017868072",
    "collector_id": 1117105806,
    "coupon_code": null,
    "coupon_labels": null,
    "date_created": "2024-02-05T08:18:54.471-04:00",
    "date_of_expiration": null,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00",
    "expires": true,
    "external_reference": "IWD1238971",
    "id": "1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d",
    "internal_metadata": null,
    "items": [
        {
            "id": "010983098",
            "category_id": "retail",
            "currency_id": "ARS",
            "description": "Description of my product",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "marketplace": "MP-MKT-2826441017868072",
    "marketplace_fee": 0,
    "metadata": {},
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "payer": {
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "address": {
            "zip_code": "1406",
            "street_name": "Street",
            "street_number": "123"
        },
        "email": "test_user_12398378192@testuser.com",
        "identification": {
            "number": "12345678",
            "type": "DNI"
        },
        "name": "Juan",
        "surname": "Lopez",
        "date_created": null,
        "last_purchase": null
    },
    "payment_methods": {
        "default_card_id": null,
        "default_payment_method_id": "account_money",
        "excluded_payment_methods": [
            {
                "id": ""
            }
        ],
        "excluded_payment_types": [
            {
                "id": ""
            }
        ],
        "installments": 12,
        "default_installments": null
    },
    "processing_modes": null,
    "product_id": null,
    "redirect_urls": {
        "failure": "",
        "pending": "",
        "success": ""
    },
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d",
    "site_id": "MLA",
    "shipments": {
        "default_shipping_method": null,
        "receiver_address": {
            "zip_code": "",
            "street_name": "",
            "street_number": null,
            "floor": "",
            "apartment": "",
            "city_name": null,
            "state_name": null,
            "country_name": null
        }
    },
    "statement_descriptor": "TestStore",
    "total_amount": null,
    "last_updated": null
}
#### POST Create Preference - Tickets and Entertainment

**Endpoint:** `https://api.mercadopago.com/checkout/preferences`

Generate a preference with the information of a product or service and obtain the necessary URL to start the payment flow.

---

Send specific information for fraud prevention in the Entertainment industry.

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
    "auto_return": "approved",
    "back_urls": {
        "success": "https://httpbin.org/get?back_url=success",
        "failure": "https://httpbin.org/get?back_url=failure",
        "pending": "https://httpbin.org/get?back_url=pending"
    },
    "statement_descriptor": "TestStore",
    "binary_mode": false,
    "external_reference": "IWD1238971",
    "items": [
        {
            "id": "010983098",
            "title": "Event Ticket",
            "quantity": 1,
            "unit_price": 2000,
            "description": "Description of my product",
            "category_id": "entertainment",
            "category_descriptor":{
                "event_date": "2024-03-12T20:00:00.000-04:00"
                }
        }
    ],
    "payer": {
        "email": "test_user_12398378192@testuser.com",
        "name": "Juan",
        "surname": "Lopez",
        "registration_date": "2021-02-09T14:10:40.224-04:00",
        "authetication_type": "gmail",
        "is_prime_user": true,
        "is_first_purchase_online": false,
        "last_purchase": "2022-03-12T12:58:41.425-04:00",
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "identification":{
            "type": "DNI",
            "number": "12345678"
        },
        "address": {
            "street_name": "Street",
            "street_number": 123,
            "zip_code": "1406"
        }
    },
    "payment_methods": {
        "excluded_payment_types": [],
        "excluded_payment_methods": [],
        "installments": 12,
        "default_payment_method_id": "account_money"
    },
    "notification_url": "https://www.your-site.com/webhook",
    "expires": true,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
}
Example
Create Preference - Tickets and Entertainment
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = "{\n    \"auto_return\": \"approved\",\n    \"back_urls\": {\n        \"success\": \"https://www.httpbin.org/get?back_url=success\",\n        \"failure\": \"https://www.httpbin.org/get?back_url=failure\",\n        \"pending\": \"https://www.httpbin.org/get?back_url=pending\"\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"binary_mode\": false,\n    \"external_reference\": \"IWD1238971\",\n    \"items\": [\n        {\n            \"id\": \"010983098\",\n            \"title\": \"Event Ticket\",\n            \"quantity\": 1,\n            \"unit_price\": 2000,\n            \"description\": \"Description of my product\",\n            \"category_id\": \"entertainment\",\n            \"category_descriptor\":{\n                \"event_date\": \"2024-03-12T20:00:00.000-04:00\"\n                }\n        }\n    ],\n    \"payer\": {\n        \"email\": \"test_user_12398378192@testuser.com\",\n        \"name\": \"Juan\",\n        \"surname\": \"Lopez\",\n        \"registration_date\": \"2021-02-09T14:10:40.224-04:00\",\n        \"authetication_type\": \"gmail\",\n        \"is_prime_user\": true,\n        \"is_first_purchase_online\": false,\n        \"last_purchase\": \"2022-03-12T12:58:41.425-04:00\"\n        \"phone\": {\n            \"area_code\": \"11\",\n            \"number\": \"1523164589\"\n        },\n        \"identification\":{\n            \"type\": \"DNI\",\n            \"number\": \"12345678\"\n        },\n        \"address\": {\n            \"street_name\": \"Street\",\n            \"street_number\": 123,\n            \"zip_code\": \"1406\"\n        }\n    },\n    \"payment_methods\": {\n        \"excluded_payment_types\": [],\n        \"excluded_payment_methods\": [],\n        \"installments\": 12,\n        \"default_payment_method_id\": \"account_money\"\n    },\n    \"notification_url\": \"https://www.your-site.com/webhook\",\n    \"expires\": true,\n    \"expiration_date_from\": \"2024-01-01T12:00:00.000-04:00\",\n    \"expiration_date_to\": \"2024-12-31T12:00:00.000-04:00\"\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/checkout/preferences", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (0)
View More
```

{
    "additional_info": "",
    "auto_return": "approved",
    "back_urls": {
        "failure": "https://www.httpbin.org/get?back_url=failure",
        "pending": "https://www.httpbin.org/get?back_url=pending",
        "success": "https://www.httpbin.org/get?back_url=success"
    },
    "binary_mode": false,
    "client_id": "2826441017868072",
    "collector_id": 1117105806,
    "coupon_code": null,
    "coupon_labels": null,
    "date_created": "2024-10-25T08:39:07.061-04:00",
    "date_of_expiration": null,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00",
    "expires": true,
    "external_reference": "IWD1238971",
    "id": "1117105806-f3bf9a54-eb99-4ea0-9ec5-c0a7b759c0af",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-f3bf9a54-eb99-4ea0-9ec5-c0a7b759c0af",
    "internal_metadata": null,
    "items": [
        {
            "id": "010983098",
            "category_id": "entertainment",
            "category_descriptor": {
                "event_date": "2024-03-12T20:00:00.000-04:00"
            },
            "currency_id": "ARS",
            "description": "Description of my product",
            "title": "Event Ticket",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "marketplace": "MP-MKT-2826441017868072",
    "marketplace_fee": 0,
    "metadata": {},
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "payer": {
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "address": {
            "zip_code": "1406",
            "street_name": "Street",
            "street_number": "123"
        },
        "email": "test_user_12398378192@testuser.com",
        "identification": {
            "number": "12345678",
            "type": "DNI"
        },
        "name": "Juan",
        "surname": "Lopez",
        "date_created": null,
        "is_prime_user": true,
        "is_first_purchase_online": false,
        "last_purchase": "2022-03-12T12:58:41.425-04:00"
    },
    "payment_methods": {
        "default_card_id": null,
        "default_payment_method_id": "account_money",
        "excluded_payment_methods": [
            {
                "id": ""
            }
        ],
        "excluded_payment_types": [
            {
                "id": ""
            }
        ],
        "installments": 12,
        "default_installments": null
    },
    "processing_modes": null,
    "product_id": null,
    "redirect_urls": {
        "failure": "",
        "pending": "",
        "success": ""
    },
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-f3bf9a54-eb99-4ea0-9ec5-c0a7b759c0af",
    "site_id": "MLA",
    "shipments": {
        "default_shipping_method": null,
        "receiver_address": {
            "zip_code": "",
            "street_name": "",
            "street_number": null,
            "floor": "",
            "apartment": "",
            "city_name": null,
            "state_name": null,
            "country_name": null
        }
    },
    "statement_descriptor": "TestStore",
    "total_amount": null,
    "last_updated": null,
    "financing_group": ""
}
#### POST Create Preference - Tourism

**Endpoint:** `https://api.mercadopago.com/checkout/preferences`

Generate a preference with the information of a product or service and obtain the necessary URL to start the payment flow.

---

Send specific information for fraud prevention in the Tourism industry.

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
    "auto_return": "approved",
    "back_urls": {
        "success": "http://httpbin.org/get?back_url=success",
        "failure": "http://httpbin.org/get?back_url=failure",
        "pending": "http://httpbin.org/get?back_url=pending"
    },
    "statement_descriptor": "TestStore",
    "binary_mode": false,
    "external_reference": "IWD1238971",
    "items": [
        {
            "id": "010983098",
            "title": "Airline ticket",
            "quantity": 1,
            "unit_price": 2000,
            "description": "Description of my product",
            "category_id": "Travels",
            "category_descriptor":{
                "passenger": {
                    "first_name": "Juan",
                    "last_name": "Perez",
                    "identification":{
                        "type": "DNI",
                        "number": "1523164589"
                    },
                "route":{
                    "departure": "Ezeiza",
                    "destination": "Miami",
                    "departure_date_time": "2024-03-11T20:00:00.000-03:00",
                    "arrival_date_time": "2024-03-12T04:00:00.000-03:00",
                    "company": "American Airlines"
                     }
                    }
                }
        }
    ],
    "payer": {
        "email": "test_user_12398378192@testuser.com",
        "name": "Juan",
        "surname": "Lopez",
        "registration_date": "2021-02-09T14:10:40.224-04:00",
        "authetication_type": "gmail",
        "is_prime_user": true,
        "is_first_purchase_online": false,
        "last_purchase": "2022-03-12T12:58:41.425-04:00",
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "identification":{
            "type": "DNI",
            "number": "12345678"
        },
        "address": {
            "street_name": "Street",
            "street_number": 123,
            "zip_code": "1406"
        }
    },
    "payment_methods": {
        "excluded_payment_types": [],
        "excluded_payment_methods": [],
        "installments": 12,
        "default_payment_method_id": "account_money"
    },
    "notification_url": "https://www.your-site.com/webhook",
    "expires": true,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
}
Example
Create Preference - Tourism
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "auto_return": "approved",
  "back_urls": {
    "success": "https://www.httpbin.org/get?back_url=success",
    "failure": "httpss://www.httpbin.org/get?back_url=failure",
    "pending": "https://www.httpbin.org/get?back_url=pending"
  },
  "statement_descriptor": "TestStore",
  "binary_mode": false,
  "external_reference": "IWD1238971",
  "items": [
    {
      "id": "010983098",
      "title": "Event Ticket",
      "quantity": 1,
      "unit_price": 2000,
      "description": "Description of my product",
      "category_id": "entertainment",
      "category_descriptor": {
        "passenger": {
          "first_name": "Juan",
          "last_name": "Perez",
          "identification": {
            "type": "DNI",
            "number": "1523164589"
          },
          "route": {
            "departure": "Ezeiza",
            "destination": "Miami",
            "departure_date_time": "2024-03-11T20:00:00.000-03:00",
            "arrival_date_time": "2024-03-12T04:00:00.000-03:00",
            "company": "American Airlines"
          }
        }
      }
    }
  ],
  "payer": {
    "email": "test_user_12398378192@testuser.com",
    "name": "Juan",
    "surname": "Lopez",
    "registration_date": "2021-02-09T14:10:40.224-04:00",
    "authetication_type": "gmail",
    "is_prime_user": true,
    "is_first_purchase_online": false,
    "last_purchase": "2022-03-12T12:58:41.425-04:00",
    "phone": {
      "area_code": "11",
      "number": "1523164589"
    },
    "identification": {
      "type": "DNI",
      "number": "12345678"
    },
    "address": {
      "street_name": "Street",
      "street_number": 123,
      "zip_code": "1406"
    }
  },
  "payment_methods": {
    "excluded_payment_types": [],
    "excluded_payment_methods": [],
    "installments": 12,
    "default_payment_method_id": "account_money"
  },
  "notification_url": "https://www.your-site.com/webhook",
  "expires": true,
  "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
  "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/checkout/preferences", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "additional_info": "",
    "auto_return": "approved",
    "back_urls": {
        "failure": "https://www.httpbin.org/get?back_url=failure",
        "pending": "https://www.httpbin.org/get?back_url=pending",
        "success": "https://www.httpbin.org/get?back_url=success"
    },
    "binary_mode": false,
    "client_id": "2826441017868072",
    "collector_id": 1117105806,
    "coupon_code": null,
    "coupon_labels": null,
    "date_created": "2024-10-25T08:56:15.929-04:00",
    "date_of_expiration": null,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00",
    "expires": true,
    "external_reference": "IWD1238971",
    "id": "1117105806-6e2ebc54-b3db-4374-9b8a-e9c39670d25b",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-6e2ebc54-b3db-4374-9b8a-e9c39670d25b",
    "internal_metadata": null,
    "items": [
        {
            "id": "010983098",
            "category_id": "entertainment",
            "category_descriptor": {
                "passenger": {
                    "first_name": "Juan",
                    "identification": {
                        "number": "1523164589",
                        "type": "DNI"
                    },
                    "last_name": "Perez",
                    "route": {
                        "arrival_date_time": "2024-03-12T04:00:00.000-03:00",
                        "company": "American Airlines",
                        "departure": "Ezeiza",
                        "departure_date_time": "2024-03-11T20:00:00.000-03:00",
                        "destination": "Miami"
                    }
                }
            },
            "currency_id": "ARS",
            "description": "Description of my product",
            "title": "Event Ticket",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "marketplace": "MP-MKT-2826441017868072",
    "marketplace_fee": 0,
    "metadata": {},
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "payer": {
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "address": {
            "zip_code": "1406",
            "street_name": "Street",
            "street_number": "123"
        },
        "email": "test_user_12398378192@testuser.com",
        "identification": {
            "number": "12345678",
            "type": "DNI"
        },
        "name": "Juan",
        "surname": "Lopez",
        "date_created": null,
        "is_prime_user": true,
        "is_first_purchase_online": false,
        "last_purchase": "2022-03-12T12:58:41.425-04:00"
    },
    "payment_methods": {
        "default_card_id": null,
        "default_payment_method_id": "account_money",
        "excluded_payment_methods": [
            {
                "id": ""
            }
        ],
        "excluded_payment_types": [
            {
                "id": ""
            }
        ],
        "installments": 12,
        "default_installments": null
    },
    "processing_modes": null,
    "product_id": null,
    "redirect_urls": {
        "failure": "",
        "pending": "",
        "success": ""
    },
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-6e2ebc54-b3db-4374-9b8a-e9c39670d25b",
    "site_id": "MLA",
    "shipments": {
        "default_shipping_method": null,
        "receiver_address": {
            "zip_code": "",
            "street_name": "",
            "street_number": null,
            "floor": "",
            "apartment": "",
            "city_name": null,
            "state_name": null,
            "country_name": null
        }
    },
    "statement_descriptor": "TestStore",
    "total_amount": null,
    "last_updated": null,
    "financing_group": ""
}
#### GET Get Preference

**Endpoint:** `https://api.mercadopago.com/checkout/preferences/:preferenceId`

Check all the information for a preference with the ID of your choice.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
preferenceId
(Required) ID of the Preference

Example
Get Preference
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/checkout/preferences/:preferenceId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "additional_info": "",
    "auto_return": "approved",
    "back_urls": {
        "failure": "https://httpbin.org/get?back_url=failure",
        "pending": "https://httpbin.org/get?back_url=pending",
        "success": "https://httpbin.org/get?back_url=success"
    },
    "binary_mode": false,
    "client_id": "2826441017868072",
    "collector_id": 1117105806,
    "coupon_code": null,
    "coupon_labels": null,
    "date_created": "2024-02-05T08:15:54.079-04:00",
    "date_of_expiration": null,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00",
    "expires": true,
    "external_reference": "IWD1238971",
    "id": "1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "internal_metadata": null,
    "items": [
        {
            "id": "010983098",
            "category_id": "retail",
            "currency_id": "ARS",
            "description": "Description of my product",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "marketplace": "MP-MKT-2826441017868072",
    "marketplace_fee": 0,
    "metadata": {},
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "payer": {
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "address": {
            "zip_code": "1406",
            "street_name": "Street",
            "street_number": "123"
        },
        "email": "test_user_12398378192@testuser.com",
        "identification": {
            "number": "12345678",
            "type": "DNI"
        },
        "name": "Juan",
        "surname": "Lopez",
        "date_created": null,
        "last_purchase": null
    },
    "payment_methods": {
        "default_card_id": null,
        "default_payment_method_id": "account_money",
        "excluded_payment_methods": [
            {
                "id": ""
            }
        ],
        "excluded_payment_types": [
            {
                "id": ""
            }
        ],
        "installments": 12,
        "default_installments": null
    },
    "processing_modes": null,
    "product_id": null,
    "redirect_urls": {
        "failure": "",
        "pending": "",
        "success": ""
    },
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "site_id": "MLA",
    "shipments": {
        "default_shipping_method": null,
        "receiver_address": {
            "zip_code": "",
            "street_name": "",
            "street_number": null,
            "floor": "",
            "apartment": "",
            "city_name": null,
            "state_name": null,
            "country_name": null
        }
    },
    "statement_descriptor": "TestStore",
    "total_amount": null,
    "last_updated": null
}
#### ✏️ PUT Update Preference

**Endpoint:** `https://api.mercadopago.com/checkout/preferences/:preferenceId`

Renew the details of a payment preference. Indicate the ID of the preference and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
preferenceId
(Required) ID of the preference

Body
raw (json)
View More
```

{
    "expiration_date_to": "2025-01-01T00:00:00.000-03:00"
}

//For full list of attributes that can be updated, refer to https://www.mercadopago.com.ar/developers/en/reference/preferences/_checkout_preferences_id/put
Example
Update Preference
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = "{\n    \"expiration_date_to\": \"2024-02-29T00:00:00.000-03:00\"\n}\n\n//For full list of attributes that can be updated, refer to https://www.mercadopago.com.ar/developers/en/reference/preferences/_checkout_preferences_id/put";

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/checkout/preferences/:preferenceId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "additional_info": "",
    "auto_return": "approved",
    "back_urls": {
        "failure": "https://httpbin.org/get?back_url=failure",
        "pending": "https://httpbin.org/get?back_url=pending",
        "success": "https://httpbin.org/get?back_url=success"
    },
    "binary_mode": false,
    "client_id": "2826441017868072",
    "collector": {
        "tags": [
            "normal",
            "test_user",
            "messages_as_seller"
        ],
        "operator_id": null
    },
    "collector_id": 1117105806,
    "coupon_code": null,
    "coupon_labels": null,
    "date_created": "2024-02-05T08:15:54.079-04:00",
    "created_by_app": "traffic-layer",
    "created_source": "public",
    "date_of_expiration": null,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-02-29T00:00:00.000-03:00",
    "expires": true,
    "external_reference": "IWD#1238971",
    "headers": [],
    "id": "1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "internal_metadata": null,
    "items": [
        {
            "id": "010983098",
            "category_id": "retail",
            "currency_id": "ARS",
            "description": "Description of my product",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "live_mode": true,
    "marketplace": "MP-MKT-2826441017868072",
    "marketplace_fee": 0,
    "metadata": {},
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "payer": {
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "address": {
            "zip_code": "1406",
            "street_name": "Street",
            "street_number": "123"
        },
        "email": "test_user_12398378192@testuser.com",
        "identification": {
            "number": "12345678",
            "type": "DNI"
        },
        "name": "Juan",
        "surname": "Lopez",
        "date_created": null,
        "last_purchase": null
    },
    "payment_methods": {
        "default_card_id": null,
        "default_payment_method_id": "account_money",
        "excluded_payment_methods": [
            {
                "id": ""
            }
        ],
        "excluded_payment_types": [
            {
                "id": ""
            }
        ],
        "installments": 12,
        "default_installments": null
    },
    "processing_modes": null,
    "product_id": null,
    "purpose": "",
    "redirect_urls": {
        "failure": "",
        "pending": "",
        "success": ""
    },
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "site_id": "MLA",
    "shipments": {
        "default_shipping_method": null,
        "receiver_address": {
            "zip_code": "",
            "street_name": "",
            "street_number": null,
            "floor": "",
            "apartment": "",
            "city_name": null,
            "state_name": null,
            "country_name": null
        }
    },
    "statement_descriptor": "TestStore",
    "total_amount": 2000,
    "last_updated": "2024-02-05T08:22:58.104-04:00"
}
### Payments

In Checkout Pro you will use the Payments API to obtain the full details of the transaction (status, payment method, charged details, etc.)

The payment ID will be received through server-to-server notifications, or via the Merchant Order.

#### 📥 GET Get Payment

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

See all the information of a payment through the payment ID.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Example
Get Payment
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "accounts_info": null,
    "acquirer_reconciliation": [],
    "additional_info": {
        "authentication_code": null,
        "available_balance": null,
        "ip_address": "xxxx",
        "items": [
            {
                "category_id": "retail",
                "description": "Description of my product",
                "id": "010983098",
                "picture_url": null,
                "quantity": "1",
                "title": "My Product",
                "unit_price": "2000"
            }
        ],
        "nsu_processadora": null,
        "payer": {
            "address": {
                "street_name": "Street",
                "street_number": "123",
                "zip_code": "1406"
            },
            "first_name": "Juan",
            "last_name": "Lopez",
            "phone": {
                "area_code": "11",
                "number": "1523164589"
            }
        }
    },
    "authorization_code": "301299",
    "binary_mode": false,
    "brand_id": null,
    "build_version": "3.36.3",
    "call_for_authorize_id": null,
    "captured": true,
    "card": {
        "bin": "50317557",
        "cardholder": {
            "identification": {
                "number": "12123123",
                "type": "DNI"
            },
            "name": "APRO"
        },
        "date_created": "2024-02-05T08:59:30.000-04:00",
        "date_last_updated": "2024-02-05T08:59:30.000-04:00",
        "expiration_month": 11,
        "expiration_year": 2025,
        "first_six_digits": "503175",
        "id": null,
        "last_four_digits": "0604"
    },
    "charges_details": [
        {
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "amounts": {
                "original": 82,
                "refunded": 0
            },
            "client_id": 0,
            "date_created": "2024-02-05T08:59:30.000-04:00",
            "id": "71628481137-001",
            "last_updated": "2024-02-05T08:59:30.000-04:00",
            "metadata": {},
            "name": "mercadopago_fee",
            "refund_charges": [],
            "reserve_id": null,
            "type": "fee"
        }
    ],
    "collector_id": 1117105806,
    "corporation_id": null,
    "counter_currency": null,
    "coupon_amount": 0,
    "currency_id": "ARS",
    "date_approved": "2024-02-05T08:59:31.000-04:00",
    "date_created": "2024-02-05T08:59:30.000-04:00",
    "date_last_updated": "2024-02-05T08:59:53.000-04:00",
    "date_of_expiration": null,
    "deduction_schema": "PROACTIVE_6",
    "description": "My Product",
    "differential_pricing_id": null,
    "external_reference": "IWD1238971",
    "fee_details": [
        {
            "amount": 82,
            "fee_payer": "collector",
            "type": "mercadopago_fee"
        }
    ],
    "financing_group": null,
    "id": 71628481137,
    "installments": 1,
    "integrator_id": null,
    "issuer_id": "3",
    "live_mode": true,
    "marketplace_owner": 1117105806,
    "merchant_account_id": null,
    "merchant_number": null,
    "metadata": {},
    "money_release_date": "2024-02-23T08:59:31.000-04:00",
    "money_release_schema": null,
    "money_release_status": "pending",
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "order": {
        "id": "15512612126",
        "type": "mercadopago"
    },
    "payer": {
        "email": "test_user_12398378192@testuser.com",
        "entity_type": null,
        "first_name": null,
        "id": "1537275505",
        "identification": {
            "number": null,
            "type": null
        },
        "last_name": null,
        "operator_id": null,
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "type": null
    },
    "payment_method": {
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        },
        "id": "master",
        "issuer_id": "3",
        "type": "credit_card"
    },
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "platform_id": null,
    "point_of_interaction": {
        "business_info": {
            "branch": null,
            "sub_unit": "checkout_pro",
            "unit": "online_payments"
        },
        "transaction_data": {
            "e2e_id": null
        },
        "type": "CHECKOUT"
    },
    "pos_id": null,
    "processing_mode": "aggregator",
    "refunds": [],
    "shipping_amount": 0,
    "sponsor_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "status": "approved",
    "status_detail": "accredited",
    "store_id": null,
    "tags": null,
    "taxes_amount": 0,
    "transaction_amount": 2000,
    "transaction_amount_refunded": 0,
    "transaction_details": {
        "acquirer_reference": null,
        "external_resource_url": null,
        "financial_institution": null,
        "installment_amount": 2000,
        "net_received_amount": 1918,
        "overpaid_amount": 0,
        "payable_deferral_period": null,
        "payment_method_reference_id": null,
        "total_paid_amount": 2000
    }
}
### Merchant Orders

The merchant order is created when the payer selects to pay inside a Checkout Pro. It's an abstraction of an order and a checkout flow.

Makes it easier to keep track of payment intents inside a checkout flow (ie. a rejection and a second approved transaction) and checkouts completed with multiple payment methods (ie. two credit cards).

You will know the merchant order ID from a server-to-server notification.

#### GET Get Merchant Order

**Endpoint:** `https://api.mercadopago.com/merchant_orders/:merchantOrderId`

Check the payment information and order status for a product or service with the ID of the order you want.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
merchantOrderId
(Required) Id of the merchant order

Example
Get Merchant Order
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/merchant_orders/:merchantOrderId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": 15512612126,
    "status": "closed",
    "external_reference": "IWD1238971",
    "preference_id": "1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "payments": [
        {
            "id": 71628481137,
            "transaction_amount": 2000,
            "total_paid_amount": 2000,
            "shipping_cost": 0,
            "currency_id": "ARS",
            "status": "approved",
            "status_detail": "accredited",
            "operation_type": "regular_payment",
            "date_approved": "2024-02-05T08:59:31.000-04:00",
            "date_created": "2024-02-05T08:59:30.000-04:00",
            "last_modified": "2024-02-05T08:59:31.000-04:00",
            "amount_refunded": 0
        }
    ],
    "shipments": [],
    "payouts": [],
    "collector": {
        "id": 1117105806,
        "email": "",
        "nickname": "TETE8280276"
    },
    "marketplace": "MP-MKT-2826441017868072",
    "notification_url": "https://www.your-site.com/webhook",
    "date_created": "2024-02-05T08:59:29.869-04:00",
    "last_updated": "2024-02-05T08:59:31.308-04:00",
    "sponsor_id": null,
    "shipping_cost": 0,
    "total_amount": 2000,
    "site_id": "MLA",
    "paid_amount": 2000,
    "refunded_amount": 0,
    "payer": {
        "id": 1537275505,
        "email": ""
    },
    "items": [
        {
            "id": "010983098",
            "category_id": "retail",
            "currency_id": "ARS",
            "description": "Description of my product",
            "picture_url": null,
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "cancelled": false,
    "additional_info": "",
    "application_id": null,
    "is_test": false,
    "order_status": "paid"
}
### Refunds, Cancellations & Chargebacks

Manage your payments. Make a total or partial refund, cancel a pre authorized payment or manage a chargeback.

There may be restrictions to partial refunds depending on site of operation or payment method.

### Refunds and Cancellations

A refund can happen when a charge has been made to the customer, meaning there is an approved payment.

Cancellations happen when a purchase is made, but the payments has not yet been approved (payments status pendind or in_process)

#### 📤 POST Refund Payment (Total)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId/refunds`

Create Full Refund for a specific payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Example
Refund Payment (Total)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId/refunds", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 1627096680,
    "payment_id": 72048446488,
    "amount": 10,
    "metadata": {
        "status_detail": null
    },
    "source": {
        "name": "Test Test",
        "id": "1117105806",
        "type": "collector"
    },
    "date_created": "2024-02-08T16:04:03.000-04:00",
    "expiration_date": null,
    "unique_sequence_number": null,
    "refund_mode": "standard",
    "adjustment_amount": 0,
    "status": "approved",
    "reason": null,
    "labels": [],
    "amount_refunded_to_payer": 10,
    "additional_data": null,
    "e2e_id": null,
    "partition_details": []
}
#### POST Refund Payment (Partial)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId/refunds`

Create partial refund for a specific payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```json
{
    "amount": {{amount}}
}
Example
Refund Payment (Partial)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"amount\": 10\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId/refunds", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "id": 1627096680,
    "payment_id": 72048446488,
    "amount": 10,
    "metadata": {
        "status_detail": null
    },
    "source": {
        "id": "1117105806",
        "name": "Test Test",
        "type": "collector"
    },
    "date_created": "2024-02-08T16:04:03.438-04:00",
    "expiration_date": null,
    "unique_sequence_number": null,
    "refund_mode": "standard",
    "adjustment_amount": 0,
    "status": "approved",
    "reason": null,
    "labels": [],
    "amount_refunded_to_payer": 10,
    "additional_data": null,
    "e2e_id": null,
    "partition_details": []
}
#### PUT Cancel Payment

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Cancel a payment. Works for pre-authorized and pending payments.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```json
{
    "status": "cancelled"
}
Example
Cancel Payment
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"status\": \"cancelled\"\n}";

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 72072190362,
    "date_created": "2024-02-08T16:16:26.000-04:00",
    "date_approved": null,
    "date_last_updated": "2024-02-08T16:16:37.466-04:00",
    "date_of_expiration": null,
    "money_release_date": null,
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "cancelled",
    "status_detail": "by_collector",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.37.0",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": null,
        "identification": {
            "number": null,
            "type": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 0,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [],
    "charges_details": [
        {
            "id": "72072190362-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-08T16:16:26.000-04:00",
            "last_updated": "2024-02-08T16:16:26.000-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": false,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-08T16:16:26.000-04:00",
        "date_last_updated": "2024-02-08T16:16:26.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
Chargebacks
How to manage chargebacks. You will know the chargeback id from a server-to-server notification about the chargeback, or via the payment (from a change of status).

#### GET Get Chargeback

**Endpoint:** `https://api.mercadopago.com/v1/chargebacks/:chargebackId`

Check all the information related to a chargeback for your product or service with the ID of the chargeback.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
chargebackId
{{chargeback_id}}
(Required) Id of the chargeback

#### POST Chargeback - Upload documentation

**Endpoint:** `https://api.mercadopago.com/v1/chargebacks/:chargebackId/documentation`

Submit documentation for a chargeback dispute.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
chargebackId
{{chargeback_id}}
(Required) Id of the chargeback

Body
form-data
files[]
@/path/to/file/file1.png
files[]
@/path/to/file/file2.pdf
Marketplace model
The Split payments solution is designed to provide Payment Service Provider (PSP) services to sellers in marketplace models. Marketplaces are e-commerce platforms that connect sellers and buyers, offering a unified environment for online sales, expanding reach, and conversion.

The API call is made with an access token obtained through the Oauth process. The variable seller_access_token represents this particular access token. For more information refer to the Split Payments documentation﻿

Requires the implementation of Oauth

#### POST Create Preference - Marketplace Fee

**Endpoint:** `https://api.mercadopago.com/checkout/preferences`

Create a preference with Marketplace model. Gives the ability to charge a marketplace_fee

---

Authorization
Bearer Token
Token
{{seller_access_token}}
Body
raw (json)
View More
```json
{
    "auto_return": "approved",
    "back_urls": {
        "success": "https://www.httpbin.org/get?back_url=success",
        "failure": "https://www.httpbin.org/get?back_url=failure",
        "pending": "https://www.httpbin.org/get?back_url=pending"
    },
    "statement_descriptor": "TestStore",
    "binary_mode": false,
    "external_reference": "IWD#1238971",
    "marketplace_fee": 150,
    "items": [
        {
            "id": "010983098",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000,
            "description": "Description of my product",
            "category_id": "retail"
        }
    ],
    "payer": {
        "email": "test_user_12398378192@testuser.com",
        "name": "Juan",
        "surname": "Lopez",
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "identification":{
            "type": "DNI",
            "number": "12345678"
        },
        "address": {
            "street_name": "Street",
            "street_number": 123,
            "zip_code": "1406"
        }
    },
    "payment_methods": {
        "excluded_payment_types": [],
        "excluded_payment_methods": [],
        "installments": 12,
        "default_payment_method_id": "account_money"
    },
    "notification_url": "https://www.your-site.com/webhook",
    "expires": true,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
}
## 🧱 Checkout Bricks

Checkout Bricks is a set of UI modules that come front-end ready and optimized for better usability and conversion. Each Brick can be used independently or together, forming the experience of a complete checkout. Nevertheless, you will need to interact with Mercado Pago services in your backend. Here you can find the different API's needed to implement Checkout Bricks.

Make sure to:

Read the testing documentation
Create an account and get the testing credentials﻿
Select the Environment "Integration"
Set the "public_key" and "access_token" variables with the test credentials
You may to need to set collection variables as you go to test all resources (payment id, customer id, card id, etc.)

### Payments

Create payments with cards (credit, debit, prepaid). There is multiple examples for different industries and categories. All the payer and Items information is used for fraud prevention reasons, make sure to send it as detailes as possible.

An Idempotency Key (sent as header) is required when creating or updating a payment. In this collection the header is automatically generated.

You can also search payments with their corresponding ID or External Reference.

#### 📤 POST Create Payment (card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment with all the required information. Remember to add the item's details and the payer's information.

---

An Idempotency Key is mandatory when creating a payment

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "master",
    "issuer_id": "3",
    "token": {{card_token_id}},
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": 1,
                "unit_price": 1000.50
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": "-1",
            "is_first_purchase_online": "-1",
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }

    }
}
Example
Create Payment (card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": true,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"issuer_id\": \"3\",\n    \"token\": \"{{card_token_id}}\",\n    \"external_reference\": \"PKJNWD1231\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1231\"\n    },\n    \"payer\": {\n        \"first_name\": \"Juan\",\n        \"last_name\": \"Perez\",\n        \"email\": \"test_user_12345@testuser.com\",\n        \"identification\": {\n            \"type\": \"DNI\",\n            \"number\": \"12123123\"\n        }\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Apple\",\n                \"description\": \"Apple Airpods Pro\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/apple/airpods_pro\",\n                \"category_id\": \"electronics\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": \"-1\",\n            \"is_first_purchase_online\": \"-1\",\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n        \n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 71851514358,
    "date_created": "2024-02-05T12:50:46.707-04:00",
    "date_approved": "2024-02-05T12:50:47.458-04:00",
    "date_last_updated": "2024-02-05T12:50:47.458-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-02-23T12:50:47.458-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.36.3",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "71851514358-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-05T12:50:46.709-04:00",
            "last_updated": "2024-02-05T12:50:46.709-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-05T12:50:47.000-04:00",
        "date_last_updated": "2024-02-05T12:50:47.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
#### 📤 POST Create Payment - Tourism (card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment with all the information needed. In the tourism industry, detailed information about route and passangers is required.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "master",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Ticket",
                "description": "EZE - RDJ",
                "picture_url": "https://www.yoursite.com/pictures/plane",
                "category_id": "travels",
                "quantity": 1,
                "unit_price": 1000.50,
                "category_descriptor": {
                    "passenger": {
                        "first_name": "Juan",
                        "last_name": "Perez"
                    },
                    "route":{
                        "departure": "Ezeiza",
                        "destination": "Rio de Janeiro",
                        "company": "Aero Charter",
                        "departure_date_time": "2024-09-12T12:58:41.425-04:00",
                        "arrival_date_time": "2024-09-13T06:58:41.425-04:00"
                    }
                }
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": true,
            "is_first_purchase_online": true,
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }
    }
}
Example
Create Payment - Tourism (card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": true,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"token\": \"{{card_token_id}}\",\n    \"external_reference\": \"PKJNWD1231\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1231\"\n    },\n    \"payer\": {\n        \"first_name\": \"Juan\",\n        \"last_name\": \"Perez\",\n        \"email\": \"test_user_12345@testuser.com\",\n        \"identification\": {\n            \"type\": \"DNI\",\n            \"number\": \"12123123\"\n        }\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Ticket\",\n                \"description\": \"EZE - RDJ\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/plane\",\n                \"category_id\": \"travels\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50,\n                \"category_descriptor\": {\n                    \"passenger\": {\n                        \"first_name\": \"Juan\",\n                        \"last_name\": \"Perez\"\n                    },\n                    \"route\":{\n                        \"departure\": \"Ezeiza\",\n                        \"destination\": \"Rio de Janeiro\",\n                        \"company\": \"Aero Charter\",\n                        \"departure_date_time\": \"2024-09-12T12:58:41.425-04:00\",\n                        \"arrival_date_time\": \"2024-09-13T06:58:41.425-04:00\"\n                    }\n                }\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": true,\n            \"is_first_purchase_online\": true,\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 86439176322,
    "date_created": "2024-08-29T07:45:33.087-04:00",
    "date_approved": "2024-08-29T07:45:34.095-04:00",
    "date_last_updated": "2024-08-29T07:45:34.095-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-09-16T07:45:34.095-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.67.0-rc-2",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Ticket",
                "description": "EZE - RDJ",
                "picture_url": "https://www.yoursite.com/pictures/plane",
                "category_id": "travels",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": "30121999",
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "86439176322-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-08-29T07:45:33.089-04:00",
            "last_updated": "2024-08-29T07:45:33.089-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {
                "source": "rule-engine"
            },
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-08-29T07:45:33.000-04:00",
        "date_last_updated": "2024-08-29T07:45:33.000-04:00",
        "country": null,
        "tags": null,
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "123456789",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": "Merchant Services"
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "release_info": null,
    "tags": null
}
#### 📤 POST Create Payment - Tickets and Entertainment (card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment with all the information needed. In the entertainment industry, detailed information about event date is required.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "master",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Concert",
                "description": "Concert Tickets",
                "picture_url": "https://www.yoursite.com/pictures/concert/tickets",
                "category_id": "Tickets",
                "quantity": 1,
                "unit_price": 1000.50,
                "event_date": "2025-06-20T19:00:00.000-04:00" 
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": true,
            "is_first_purchase_online": true,
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }
    }
}
Example
Create Payment - Tickets and Entertainment (card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": true,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"token\": \"{{card_token_id}}\",\n    \"external_reference\": \"PKJNWD1231\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1231\"\n    },\n    \"payer\": {\n        \"first_name\": \"Juan\",\n        \"last_name\": \"Perez\",\n        \"email\": \"test_user_12345@testuser.com\",\n        \"identification\": {\n            \"type\": \"DNI\",\n            \"number\": \"12123123\"\n        }\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Concert\",\n                \"description\": \"Concert Tickets\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/concert/tickets\",\n                \"category_id\": \"Tickets\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50,\n                \"event_date\": \"2025-06-20T19:00:00.000-04:00\" // for Home and Electronics categories.\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": true,\n            \"is_first_purchase_online\": true,\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 86439466666,
    "date_created": "2024-08-29T07:53:56.603-04:00",
    "date_approved": "2024-08-29T07:53:57.605-04:00",
    "date_last_updated": "2024-08-29T07:53:57.605-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-09-16T07:53:57.605-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.67.0-rc-2",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Concert",
                "description": "Concert Tickets",
                "picture_url": "https://www.yoursite.com/pictures/concert/tickets",
                "category_id": "Tickets",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": "30121999",
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "86439466666-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-08-29T07:53:56.605-04:00",
            "last_updated": "2024-08-29T07:53:56.605-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {
                "source": "rule-engine"
            },
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-08-29T07:53:56.000-04:00",
        "date_last_updated": "2024-08-29T07:53:56.000-04:00",
        "country": null,
        "tags": null,
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "123456789",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": "Merchant Services"
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "release_info": null,
    "tags": null
}
#### 📥 GET Get Payment by ID

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

See all the information of a payment through the payment ID.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Example
Get Payment by ID
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "accounts_info": null,
    "acquirer_reconciliation": [],
    "additional_info": {
        "authentication_code": null,
        "available_balance": null,
        "items": [
            {
                "category_id": "electronics",
                "description": "Apple Airpods Pro",
                "id": "1941",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "quantity": "1",
                "title": "Apple",
                "unit_price": "1000.5"
            }
        ],
        "nsu_processadora": null,
        "payer": {
            "address": {
                "street_name": "Av. 9 de Julio",
                "street_number": "1150",
                "zip_code": "1406"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }
    },
    "authorization_code": "301299",
    "binary_mode": false,
    "brand_id": null,
    "build_version": "3.36.3",
    "call_for_authorize_id": null,
    "captured": true,
    "card": {
        "bin": "50317557",
        "cardholder": {
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            },
            "name": "APRO"
        },
        "date_created": "2024-02-05T12:50:47.000-04:00",
        "date_last_updated": "2024-02-05T12:50:47.000-04:00",
        "expiration_month": 11,
        "expiration_year": 2025,
        "first_six_digits": "503175",
        "id": null,
        "last_four_digits": "0604"
    },
    "charges_details": [
        {
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "client_id": 0,
            "date_created": "2024-02-05T12:50:46.000-04:00",
            "id": "71851514358-001",
            "last_updated": "2024-02-05T12:50:46.000-04:00",
            "metadata": {},
            "name": "mercadopago_fee",
            "refund_charges": [],
            "reserve_id": null,
            "type": "fee"
        }
    ],
    "collector_id": 1117105806,
    "corporation_id": null,
    "counter_currency": null,
    "coupon_amount": 0,
    "currency_id": "ARS",
    "date_approved": "2024-02-05T12:50:47.000-04:00",
    "date_created": "2024-02-05T12:50:46.000-04:00",
    "date_last_updated": "2024-02-05T12:50:49.000-04:00",
    "date_of_expiration": null,
    "deduction_schema": "PROACTIVE_6",
    "description": "Compra en Test Store",
    "differential_pricing_id": null,
    "external_reference": "PKJNWD1231",
    "fee_details": [
        {
            "amount": 41.02,
            "fee_payer": "collector",
            "type": "mercadopago_fee"
        }
    ],
    "financing_group": null,
    "id": 71851514358,
    "installments": 1,
    "integrator_id": null,
    "issuer_id": "3",
    "live_mode": true,
    "marketplace_owner": null,
    "merchant_account_id": null,
    "merchant_number": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "money_release_date": "2024-02-23T12:50:47.000-04:00",
    "money_release_schema": null,
    "money_release_status": "pending",
    "notification_url": "https://www.yoursite.com/webhooks",
    "operation_type": "regular_payment",
    "order": {},
    "payer": {
        "email": "test_user_12345@testuser.com",
        "entity_type": null,
        "first_name": null,
        "id": "1640286694",
        "identification": {
            "number": "12123123",
            "type": "DNI"
        },
        "last_name": null,
        "operator_id": null,
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "type": null
    },
    "payment_method": {
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        },
        "id": "master",
        "issuer_id": "3",
        "type": "credit_card"
    },
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "platform_id": null,
    "point_of_interaction": {
        "business_info": {
            "branch": null,
            "sub_unit": "default",
            "unit": "online_payments"
        },
        "transaction_data": {},
        "type": "UNSPECIFIED"
    },
    "pos_id": null,
    "processing_mode": "aggregator",
    "refunds": [],
    "shipping_amount": 0,
    "sponsor_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "status": "approved",
    "status_detail": "accredited",
    "store_id": null,
    "tags": null,
    "taxes_amount": 0,
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "transaction_details": {
        "acquirer_reference": null,
        "external_resource_url": null,
        "financial_institution": null,
        "installment_amount": 1000.5,
        "net_received_amount": 959.48,
        "overpaid_amount": 0,
        "payable_deferral_period": null,
        "payment_method_reference_id": null,
        "total_paid_amount": 1000.5
    }
}
#### GET Get Payment by External Reference

**Endpoint:** `https://api.mercadopago.com/v1/payments/search?external_reference=`

See all the information of a payment through the external reference.

---

Authorization
Bearer Token
Token
{{access_token}}
Query Params
external_reference
(Required) External reference of the payment

Example
Get Payment by External Reference
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/search?external_reference=", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "results": [
        {
            "metadata": {
                "order_number": "order_PKJNWD1231"
            },
            "corporation_id": null,
            "operation_type": "pos_payment",
            "point_of_interaction": {
                "business_info": {
                    "unit": "online_payments",
                    "branch": null,
                    "sub_unit": "default"
                },
                "transaction_data": {},
                "type": "UNSPECIFIED"
            },
            "fee_details": [
                {
                    "amount": 41.02,
                    "fee_payer": "collector",
                    "type": "mercadopago_fee"
                }
            ],
            "notification_url": "https://www.yoursite.com/webhooks",
            "date_approved": "2024-02-05T12:50:47.000-04:00",
            "money_release_schema": null,
            "payer": {
                "entity_type": null,
                "identification": {
                    "number": "12123123",
                    "type": "DNI"
                },
                "phone": {
                    "number": null,
                    "extension": null,
                    "area_code": null
                },
                "operator_id": null,
                "last_name": null,
                "id": "1640286694",
                "type": null,
                "first_name": null,
                "email": "test_user_12345@testuser.com"
            },
            "transaction_details": {
                "total_paid_amount": 1000.5,
                "acquirer_reference": null,
                "installment_amount": 1000.5,
                "financial_institution": null,
                "net_received_amount": 959.48,
                "overpaid_amount": 0,
                "external_resource_url": null,
                "payable_deferral_period": null,
                "payment_method_reference_id": null
            },
            "statement_descriptor": "Mercadopago*fake",
            "call_for_authorize_id": null,
            "installments": 1,
            "pos_id": null,
            "external_reference": "PKJNWD1231",
            "date_of_expiration": null,
            "charges_details": [
                {
                    "refund_charges": [],
                    "last_updated": "2024-02-05T12:50:46.000-04:00",
                    "metadata": {},
                    "amounts": {
                        "original": 41.02,
                        "refunded": 0
                    },
                    "date_created": "2024-02-05T12:50:46.000-04:00",
                    "name": "mercadopago_fee",
                    "reserve_id": null,
                    "accounts": {
                        "from": "collector",
                        "to": "mp"
                    },
                    "id": "71851514358-001",
                    "type": "fee",
                    "client_id": 0
                }
            ],
            "id": 71851514358,
            "payment_type_id": "credit_card",
            "payment_method": {
                "issuer_id": "3",
                "data": {
                    "routing_data": {
                        "merchant_account_id": "5924780738444"
                    }
                },
                "id": "master",
                "type": "credit_card"
            },
            "order": {},
            "counter_currency": null,
            "money_release_status": "pending",
            "brand_id": null,
            "status_detail": "accredited",
            "tags": null,
            "differential_pricing_id": null,
            "additional_info": {
                "authentication_code": null,
                "nsu_processadora": null,
                "available_balance": null,
                "items": [
                    {
                        "quantity": "1",
                        "category_id": "electronics",
                        "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                        "description": "Apple Airpods Pro",
                        "id": "1941",
                        "title": "Apple",
                        "unit_price": "1000.5"
                    }
                ],
                "payer": {
                    "address": {
                        "street_number": "1150",
                        "street_name": "Av. 9 de Julio",
                        "zip_code": "1406"
                    },
                    "registration_date": "2023-08-06T09:25:04.000-03:00",
                    "phone": {
                        "number": "987654321",
                        "area_code": "11"
                    },
                    "last_name": "Perez",
                    "first_name": "Juan"
                }
            },
            "live_mode": true,
            "marketplace_owner": null,
            "card": {
                "first_six_digits": "503175",
                "expiration_year": 2025,
                "bin": "50317557",
                "date_created": "2024-02-05T12:50:47.000-04:00",
                "expiration_month": 11,
                "id": null,
                "cardholder": {
                    "identification": {
                        "number": "19119119100",
                        "type": "DNI"
                    },
                    "name": "APRO"
                },
                "last_four_digits": "0604",
                "date_last_updated": "2024-02-05T12:50:47.000-04:00"
            },
            "integrator_id": null,
            "status": "approved",
            "accounts_info": null,
            "transaction_amount_refunded": 0,
            "transaction_amount": 1000.5,
            "description": "Compra en Test Store",
            "financing_group": null,
            "money_release_date": "2024-02-23T12:50:47.000-04:00",
            "merchant_number": null,
            "refunds": [],
            "expanded": {
                "present_meta_data": "",
                "gateway": {
                    "buyer_fee": 0,
                    "finance_charge": 0,
                    "date_created": "2024-02-05T12:50:47.000-04:00",
                    "merchant": null,
                    "reference": "{\"merchant_number\":30121999}",
                    "statement_descriptor": "Mercadopago*fake",
                    "issuer_id": "3",
                    "usn": null,
                    "installments": 1,
                    "soft_descriptor": "TESTSTORE",
                    "authorization_code": "301299",
                    "payment_id": 71851514358,
                    "profile_id": "g2_firstdata-ipg_firstdata_24780738",
                    "options": "[{\"collector_id\":1117105806},{\"payment_operation_type\":\"pos_payment\"},{\"plan\":{}},{\"has_wallet_id\":false},{\"regulation\":{\"legal_name\":\"Test Test\",\"address_street\":\"Test Address\",\"address_door_number\":123,\"zip\":\"1414\",\"city\":\"Palermo\",\"country\":\"ARG\",\"document_number\":\"32659430\",\"document_type\":\"DNI\",\"region_code\":\"AR\",\"region_code_iso\":\"AR-C\",\"fiscal_condition\":\"Consumidor Final\",\"mcc\":\"5199\"}},{\"security_code_data\":{\"ads_remove_cvv\":false}}]",
                    "connection": "firstdata-ipg",
                    "id": "43880765664_7b7f737d7679737e6f7f",
                    "operation": "purchase"
                }
            },
            "authorization_code": "301299",
            "captured": true,
            "collector_id": 1117105806,
            "merchant_account_id": null,
            "taxes_amount": 0,
            "date_last_updated": "2024-02-05T12:50:49.000-04:00",
            "coupon_amount": 0,
            "store_id": null,
            "build_version": "3.36.3",
            "date_created": "2024-02-05T12:50:46.000-04:00",
            "acquirer_reconciliation": [],
            "sponsor_id": null,
            "shipping_amount": 0,
            "issuer_id": "3",
            "payment_method_id": "master",
            "binary_mode": false,
            "platform_id": null,
            "deduction_schema": "PROACTIVE_6",
            "processing_mode": "aggregator",
            "currency_id": "ARS",
            "shipping_cost": 0
        }
    ],
    "paging": {
        "total": 1,
        "limit": 30,
        "offset": 0
    }
}
#### 📤 POST [Brasil] Create Payment (PIX)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment with PIX (Only Brasil)

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 12.34,
    "date_of_expiration": "2019-12-25T19:30:00.000-03:00",
    "payment_method_id": "pix",
    "external_reference": "1234",
    "notification_url": "{{notification_url}}",
    "metadata": {
        "order_number": "order_1724857044"
    },
    "description": "PEDIDO NOVO - VIDEOGAME",
    "payer": {
        "first_name": "Joao",
        "last_name": "Silva",
        "email": "{{test_user_1724857044@testuser.com}}",
        "identification": {
            "type": "CPF",
            "number": "{{CPF_19119119100}}"
        },
        "address": {
            "zip_code": "06233-200",
            "street_name": "Av. das Nações Unidas",
            "street_number": "3003",
            "neighborhood": "Bonfim",
            "city": "Osasco",
            "federal_unit": "SP"
        }
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Ingresso Antecipado",
                "description": "Natal Iluminado 2019",
                "picture_url": null,
                "category_id": "Tickets",
                "quantity": 1,
                "unit_price": 100.00,
                "event_date": "2019-12-25T19:30:00.000-03:00"
            }
        ],
        "payer": {
            "first_name": "Nome",
            "last_name": "Sobrenome",
            "is_prime_user": "1",
            "is_first_purchase_online": "1",
            "last_purchase": "2019-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "06233-200",
                "street_name": "Av. das Nações Unidas",
                "street_number": "3003"
            },
            "registration_date": "2013-08-06T09:25:04.000-03:00"
        },
        "shipments": {
            "express_shipment": "0",
            "pick_up_on_seller": "1",
            "receiver_address": {
                "zip_code": "95630000",
                "street_name": "são Luiz",
                "street_number": "15",
                "floor": "12",
                "apartment": "123"
            }
        }
    }
}
#### POST [Brasil] Create Payment (boleto)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Generate a payment with Boleta (Only Brasil)

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
    "transaction_amount": 12.34,
    "date_of_expiration": "",
    "sponsor_id": null,
    "application_fee": null,
    "payment_method_id": "bolbradesco",
    "external_reference": "1724857151",
    "notification_url": "{{notification_url}}",
    "metadata": {
        "order_number": "order_1724857151"
    },
    "description": "PEDIDO NOVO - VIDEOGAME",
    "payer": {
        "first_name": "Joao",
        "last_name": "Silva",
        "email": "{{test_user_1724857151@testuser.com}}",
        "identification": {
            "type": "CPF",
            "number": "{{19119119100}}"
        },
        "address": {
            "zip_code": "06233-200",
            "street_name": "Av. das Nações Unidas",
            "street_number": "3003",
            "neighborhood": "Bonfim",
            "city": "Osasco",
            "federal_unit": "SP"
        }
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Ingresso Antecipado",
                "description": "Natal Iluminado 2019",
                "picture_url": null,
                "category_id": "Tickets",
                "quantity": 1,
                "unit_price": 100.00,
                "event_date": "2019-12-25T19:30:00.000-03:00"
            }
        ],
        "payer": {
            "first_name": "Nome",
            "last_name": "Sobrenome",
            "is_prime_user": "1",
            "is_first_purchase_online": "1",
            "last_purchase": "2019-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "06233-200",
                "street_name": "Av. das Nações Unidas",
                "street_number": "3003"
            },
            "registration_date": "2013-08-06T09:25:04.000-03:00"
        },
        "shipments": {
            "express_shipment": "0",
            "pick_up_on_seller": "1",
            "receiver_address": {
                "zip_code": "95630000",
                "street_name": "são Luiz",
                "street_number": "15",
                "floor": "12",
                "apartment": "123"
            }
        }
    }
}
### Payments (auth + capture)

Create an authorization for a payment and late capture the full or a partial amount.

Available for credit cards.

Availability of this feature may vary depending on operation site.

#### 📤 POST Create Payment (card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create an authorized payment. If the payment is authorized, the funds will be pre-approved and a later action to capture the funds is necessary. Remember to add the payment details and the payer's information.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": false,
    "binary_mode": false,
    "payment_method_id": "master",
    "issuer_id": "3",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": 1,
                "unit_price": 1000.50
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": "-1",
            "is_first_purchase_online": "-1",
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }

    }
}
Example
Create Payment (card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": false,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"issuer_id\": \"3\",\n    \"token\": \"{{card_token_id}}\",\n    \"external_reference\": \"PKJNWD1233\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1232\"\n    },\n    \"payer\": {\n        \"first_name\": \"Juan\",\n        \"last_name\": \"Perez\",\n        \"email\": \"test_user_12345@testuser.com\",\n        \"identification\": {\n            \"type\": \"DNI\",\n            \"number\": \"12123123\"\n        }\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Apple\",\n                \"description\": \"Apple Airpods Pro\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/apple/airpods_pro\",\n                \"category_id\": \"electronics\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": \"-1\",\n            \"is_first_purchase_online\": \"-1\",\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n        \n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 71644421005,
    "date_created": "2024-02-05T13:08:30.212-04:00",
    "date_approved": null,
    "date_last_updated": "2024-02-05T13:08:30.749-04:00",
    "date_of_expiration": null,
    "money_release_date": null,
    "money_release_status": "pending",
    "operation_type": "pos_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "authorized",
    "status_detail": "pending_capture",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.36.3",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": null,
        "identification": {
            "number": null,
            "type": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1232"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1233",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 0,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [],
    "charges_details": [
        {
            "id": "71644421005-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-05T13:08:30.215-04:00",
            "last_updated": "2024-02-05T13:08:30.215-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": false,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-05T13:08:30.000-04:00",
        "date_last_updated": "2024-02-05T13:08:30.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
#### ✏️ PUT Capture Payment (Total)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Capture a pre-authorized payment total amount.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```

{
    "capture": true
}
Example
Capture Payment (Total)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = JSON.stringify({
  "capture": true
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": 86439942806,
    "date_created": "2024-08-29T08:02:45.000-04:00",
    "date_approved": "2024-08-29T08:03:02.404-04:00",
    "date_last_updated": "2024-08-29T08:03:02.409-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-09-16T08:03:02.404-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.67.0-rc-2",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "86439942806-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-08-29T08:02:45.000-04:00",
            "last_updated": "2024-08-29T08:02:45.000-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {
                "source": "rule-engine"
            },
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-08-29T08:02:45.000-04:00",
        "date_last_updated": "2024-08-29T08:02:45.000-04:00",
        "country": null,
        "tags": null,
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "123456789",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": "Merchant Services"
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "release_info": null,
    "tags": null
}
#### ✏️ PUT Capture Payment (Partial)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Capture a pre-authorized payment partial amount.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) ID of the payment

Body
raw (json)
```

{
    "transaction_amount": 100,
    "capture": true
}
Example
Capture Payment (Partial)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = JSON.stringify({
  "transaction_amount": 100,
  "capture": true
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": 86440270850,
    "date_created": "2024-08-29T08:08:10.000-04:00",
    "date_approved": "2024-08-29T08:08:30.716-04:00",
    "date_last_updated": "2024-08-29T08:08:30.722-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-09-16T08:08:30.716-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.67.0-rc-2",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 100,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 95.9,
        "total_paid_amount": 100,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 100,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 4.1,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "86440270850-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-08-29T08:08:10.000-04:00",
            "last_updated": "2024-08-29T08:08:10.000-04:00",
            "amounts": {
                "original": 4.1,
                "refunded": 0
            },
            "metadata": {
                "source": "rule-engine"
            },
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-08-29T08:08:10.000-04:00",
        "date_last_updated": "2024-08-29T08:08:10.000-04:00",
        "country": null,
        "tags": null,
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "123456789",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": "Merchant Services"
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "release_info": null,
    "tags": null
}
#### ✏️ PUT Cancel Pre Authorization

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Cancel pre-authorized payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```

{
    "status": "cancelled"
}
Example
Cancel Pre Authorization
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = JSON.stringify({
  "status": "cancelled"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": 71646366305,
    "date_created": "2024-02-05T13:40:55.000-04:00",
    "date_approved": null,
    "date_last_updated": "2024-02-05T13:41:11.312-04:00",
    "date_of_expiration": null,
    "money_release_date": null,
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "cancelled",
    "status_detail": "by_collector",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.36.3",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": null,
        "identification": {
            "number": null,
            "type": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1237",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 0,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [],
    "charges_details": [
        {
            "id": "71646366305-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-05T13:40:55.000-04:00",
            "last_updated": "2024-02-05T13:40:55.000-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": false,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-05T13:40:56.000-04:00",
        "date_last_updated": "2024-02-05T13:40:56.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
Mercado Pago Account (Checkout Pro)
In this folder you will find all the API calls needed to integrate Mercado Pago's Checkout Pro with Checkout Bricks.

You may to need to set collection variables as you go to test all resources (preference id, payment id, merchant order id)

### Preferences

A Preference is set of information that allows you to configure a product or service that you want to charge, such as price and quantity, as well as other settings related to the defined payment flow.

#### 📤 POST Create Preference

**Endpoint:** `https://api.mercadopago.com/checkout/preferences`

Generate a preference with the information of a product or service and obtain the necessary URL to start the payment flow.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "auto_return": "approved",
    "back_urls": {
        "success": "https://httpbin.org/get?back_url=success",
        "failure": "https://httpbin.org/get?back_url=failure",
        "pending": "https://httpbin.org/get?back_url=pending"
    },
    "statement_descriptor": "TestStore",
    "binary_mode": false,
    "external_reference": "IWD1238971",
    "items": [
        {
            "id": "010983098",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000,
            "description": "Description of my product",
            "category_id": "retail"
        }
    ],
    "payer": {
        "email": "test_user_12398378192@testuser.com",
        "name": "Juan",
        "surname": "Lopez",
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "identification":{
            "type": "DNI",
            "number": "12345678"
        },
        "address": {
            "street_name": "Street",
            "street_number": 123,
            "zip_code": "1406"
        }
    },
    "payment_methods": {
        "excluded_payment_types": [],
        "excluded_payment_methods": [],
        "installments": 12,
        "default_payment_method_id": "account_money"
    },
    "notification_url": "https://www.your-site.com/webhook",
    "expires": true,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
}
Example
Create Preference
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "auto_return": "approved",
  "back_urls": {
    "success": "https://www.httpbin.org/get?back_url=success",
    "failure": "https://www.httpbin.org/get?back_url=failure",
    "pending": "https://www.httpbin.org/get?back_url=pending"
  },
  "statement_descriptor": "TestStore",
  "binary_mode": false,
  "external_reference": "IWD1238971",
  "items": [
    {
      "id": "010983098",
      "title": "My Product",
      "quantity": 1,
      "unit_price": 2000,
      "description": "Description of my product",
      "category_id": "retail"
    }
  ],
  "payer": {
    "email": "test_user_12398378192@testuser.com",
    "name": "Juan",
    "surname": "Lopez",
    "phone": {
      "area_code": "11",
      "number": "1523164589"
    },
    "identification": {
      "type": "DNI",
      "number": "12345678"
    },
    "address": {
      "street_name": "Street",
      "street_number": 123,
      "zip_code": "1406"
    }
  },
  "payment_methods": {
    "excluded_payment_types": [],
    "excluded_payment_methods": [],
    "installments": 12,
    "default_payment_method_id": "account_money"
  },
  "notification_url": "https://www.your-site.com/webhook",
  "expires": true,
  "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
  "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/checkout/preferences", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "additional_info": "",
    "auto_return": "approved",
    "back_urls": {
        "failure": "https://www.httpbin.org/get?back_url=failure",
        "pending": "https://www.httpbin.org/get?back_url=pending",
        "success": "https://www.httpbin.org/get?back_url=success"
    },
    "binary_mode": false,
    "client_id": "2826441017868072",
    "collector_id": 1117105806,
    "coupon_code": null,
    "coupon_labels": null,
    "date_created": "2024-02-05T08:18:54.471-04:00",
    "date_of_expiration": null,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00",
    "expires": true,
    "external_reference": "IWD1238971",
    "id": "1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d",
    "internal_metadata": null,
    "items": [
        {
            "id": "010983098",
            "category_id": "retail",
            "currency_id": "ARS",
            "description": "Description of my product",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "marketplace": "MP-MKT-2826441017868072",
    "marketplace_fee": 0,
    "metadata": {},
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "payer": {
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "address": {
            "zip_code": "1406",
            "street_name": "Street",
            "street_number": "123"
        },
        "email": "test_user_12398378192@testuser.com",
        "identification": {
            "number": "12345678",
            "type": "DNI"
        },
        "name": "Juan",
        "surname": "Lopez",
        "date_created": null,
        "last_purchase": null
    },
    "payment_methods": {
        "default_card_id": null,
        "default_payment_method_id": "account_money",
        "excluded_payment_methods": [
            {
                "id": ""
            }
        ],
        "excluded_payment_types": [
            {
                "id": ""
            }
        ],
        "installments": 12,
        "default_installments": null
    },
    "processing_modes": null,
    "product_id": null,
    "redirect_urls": {
        "failure": "",
        "pending": "",
        "success": ""
    },
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-2af0cd77-25ba-46c7-a66a-b16e8d6b7e6d",
    "site_id": "MLA",
    "shipments": {
        "default_shipping_method": null,
        "receiver_address": {
            "zip_code": "",
            "street_name": "",
            "street_number": null,
            "floor": "",
            "apartment": "",
            "city_name": null,
            "state_name": null,
            "country_name": null
        }
    },
    "statement_descriptor": "TestStore",
    "total_amount": null,
    "last_updated": null
}
#### 📥 GET Get Preference

**Endpoint:** `https://api.mercadopago.com/checkout/preferences/:preferenceId`

Check all the information for a preference with the ID of your choice.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
preferenceId
(Required) ID of the Preference

Example
Get Preference
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/checkout/preferences/:preferenceId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "additional_info": "",
    "auto_return": "approved",
    "back_urls": {
        "failure": "https://httpbin.org/get?back_url=failure",
        "pending": "https://httpbin.org/get?back_url=pending",
        "success": "https://httpbin.org/get?back_url=success"
    },
    "binary_mode": false,
    "client_id": "2826441017868072",
    "collector_id": 1117105806,
    "coupon_code": null,
    "coupon_labels": null,
    "date_created": "2024-02-05T08:15:54.079-04:00",
    "date_of_expiration": null,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00",
    "expires": true,
    "external_reference": "IWD1238971",
    "id": "1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "internal_metadata": null,
    "items": [
        {
            "id": "010983098",
            "category_id": "retail",
            "currency_id": "ARS",
            "description": "Description of my product",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "marketplace": "MP-MKT-2826441017868072",
    "marketplace_fee": 0,
    "metadata": {},
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "payer": {
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "address": {
            "zip_code": "1406",
            "street_name": "Street",
            "street_number": "123"
        },
        "email": "test_user_12398378192@testuser.com",
        "identification": {
            "number": "12345678",
            "type": "DNI"
        },
        "name": "Juan",
        "surname": "Lopez",
        "date_created": null,
        "last_purchase": null
    },
    "payment_methods": {
        "default_card_id": null,
        "default_payment_method_id": "account_money",
        "excluded_payment_methods": [
            {
                "id": ""
            }
        ],
        "excluded_payment_types": [
            {
                "id": ""
            }
        ],
        "installments": 12,
        "default_installments": null
    },
    "processing_modes": null,
    "product_id": null,
    "redirect_urls": {
        "failure": "",
        "pending": "",
        "success": ""
    },
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "site_id": "MLA",
    "shipments": {
        "default_shipping_method": null,
        "receiver_address": {
            "zip_code": "",
            "street_name": "",
            "street_number": null,
            "floor": "",
            "apartment": "",
            "city_name": null,
            "state_name": null,
            "country_name": null
        }
    },
    "statement_descriptor": "TestStore",
    "total_amount": null,
    "last_updated": null
}
#### PUT Update Preference

**Endpoint:** `https://api.mercadopago.com/checkout/preferences/:preferenceId`

Renew the details of a payment preference. Indicate the ID of the preference and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
preferenceId
(Required) ID of the preference

Body
raw (json)
View More
```json
{
    "expiration_date_to": "2025-01-01T00:00:00.000-03:00"
}

//For full list of attributes that can be updated, refer to https://www.mercadopago.com.ar/developers/en/reference/preferences/_checkout_preferences_id/put
Example
Update Preference
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = "{\n    \"expiration_date_to\": \"2024-02-29T00:00:00.000-03:00\"\n}\n\n//For full list of attributes that can be updated, refer to https://www.mercadopago.com.ar/developers/en/reference/preferences/_checkout_preferences_id/put";

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/checkout/preferences/:preferenceId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "additional_info": "",
    "auto_return": "approved",
    "back_urls": {
        "failure": "https://httpbin.org/get?back_url=failure",
        "pending": "https://httpbin.org/get?back_url=pending",
        "success": "https://httpbin.org/get?back_url=success"
    },
    "binary_mode": false,
    "client_id": "2826441017868072",
    "collector": {
        "tags": [
            "normal",
            "test_user",
            "messages_as_seller"
        ],
        "operator_id": null
    },
    "collector_id": 1117105806,
    "coupon_code": null,
    "coupon_labels": null,
    "date_created": "2024-02-05T08:15:54.079-04:00",
    "created_by_app": "traffic-layer",
    "created_source": "public",
    "date_of_expiration": null,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-02-29T00:00:00.000-03:00",
    "expires": true,
    "external_reference": "IWD#1238971",
    "headers": [],
    "id": "1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "internal_metadata": null,
    "items": [
        {
            "id": "010983098",
            "category_id": "retail",
            "currency_id": "ARS",
            "description": "Description of my product",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "live_mode": true,
    "marketplace": "MP-MKT-2826441017868072",
    "marketplace_fee": 0,
    "metadata": {},
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "payer": {
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "address": {
            "zip_code": "1406",
            "street_name": "Street",
            "street_number": "123"
        },
        "email": "test_user_12398378192@testuser.com",
        "identification": {
            "number": "12345678",
            "type": "DNI"
        },
        "name": "Juan",
        "surname": "Lopez",
        "date_created": null,
        "last_purchase": null
    },
    "payment_methods": {
        "default_card_id": null,
        "default_payment_method_id": "account_money",
        "excluded_payment_methods": [
            {
                "id": ""
            }
        ],
        "excluded_payment_types": [
            {
                "id": ""
            }
        ],
        "installments": 12,
        "default_installments": null
    },
    "processing_modes": null,
    "product_id": null,
    "purpose": "",
    "redirect_urls": {
        "failure": "",
        "pending": "",
        "success": ""
    },
    "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "site_id": "MLA",
    "shipments": {
        "default_shipping_method": null,
        "receiver_address": {
            "zip_code": "",
            "street_name": "",
            "street_number": null,
            "floor": "",
            "apartment": "",
            "city_name": null,
            "state_name": null,
            "country_name": null
        }
    },
    "statement_descriptor": "TestStore",
    "total_amount": 2000,
    "last_updated": "2024-02-05T08:22:58.104-04:00"
}
### Payments

In Checkout Pro you will use the Payments API to obtain the full details of the transaction (status, payment method, charged details, etc.)

The payment ID will be received through server-to-server notifications, or via the Merchant Order.

#### GET Get Payment

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

See all the information of a payment through the payment ID.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Example
Get Payment
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "accounts_info": null,
    "acquirer_reconciliation": [],
    "additional_info": {
        "authentication_code": null,
        "available_balance": null,
        "ip_address": "xxxx",
        "items": [
            {
                "category_id": "retail",
                "description": "Description of my product",
                "id": "010983098",
                "picture_url": null,
                "quantity": "1",
                "title": "My Product",
                "unit_price": "2000"
            }
        ],
        "nsu_processadora": null,
        "payer": {
            "address": {
                "street_name": "Street",
                "street_number": "123",
                "zip_code": "1406"
            },
            "first_name": "Juan",
            "last_name": "Lopez",
            "phone": {
                "area_code": "11",
                "number": "1523164589"
            }
        }
    },
    "authorization_code": "301299",
    "binary_mode": false,
    "brand_id": null,
    "build_version": "3.36.3",
    "call_for_authorize_id": null,
    "captured": true,
    "card": {
        "bin": "50317557",
        "cardholder": {
            "identification": {
                "number": "12123123",
                "type": "DNI"
            },
            "name": "APRO"
        },
        "date_created": "2024-02-05T08:59:30.000-04:00",
        "date_last_updated": "2024-02-05T08:59:30.000-04:00",
        "expiration_month": 11,
        "expiration_year": 2025,
        "first_six_digits": "503175",
        "id": null,
        "last_four_digits": "0604"
    },
    "charges_details": [
        {
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "amounts": {
                "original": 82,
                "refunded": 0
            },
            "client_id": 0,
            "date_created": "2024-02-05T08:59:30.000-04:00",
            "id": "71628481137-001",
            "last_updated": "2024-02-05T08:59:30.000-04:00",
            "metadata": {},
            "name": "mercadopago_fee",
            "refund_charges": [],
            "reserve_id": null,
            "type": "fee"
        }
    ],
    "collector_id": 1117105806,
    "corporation_id": null,
    "counter_currency": null,
    "coupon_amount": 0,
    "currency_id": "ARS",
    "date_approved": "2024-02-05T08:59:31.000-04:00",
    "date_created": "2024-02-05T08:59:30.000-04:00",
    "date_last_updated": "2024-02-05T08:59:53.000-04:00",
    "date_of_expiration": null,
    "deduction_schema": "PROACTIVE_6",
    "description": "My Product",
    "differential_pricing_id": null,
    "external_reference": "IWD1238971",
    "fee_details": [
        {
            "amount": 82,
            "fee_payer": "collector",
            "type": "mercadopago_fee"
        }
    ],
    "financing_group": null,
    "id": 71628481137,
    "installments": 1,
    "integrator_id": null,
    "issuer_id": "3",
    "live_mode": true,
    "marketplace_owner": 1117105806,
    "merchant_account_id": null,
    "merchant_number": null,
    "metadata": {},
    "money_release_date": "2024-02-23T08:59:31.000-04:00",
    "money_release_schema": null,
    "money_release_status": "pending",
    "notification_url": "https://www.your-site.com/webhook",
    "operation_type": "regular_payment",
    "order": {
        "id": "15512612126",
        "type": "mercadopago"
    },
    "payer": {
        "email": "test_user_12398378192@testuser.com",
        "entity_type": null,
        "first_name": null,
        "id": "1537275505",
        "identification": {
            "number": null,
            "type": null
        },
        "last_name": null,
        "operator_id": null,
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "type": null
    },
    "payment_method": {
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        },
        "id": "master",
        "issuer_id": "3",
        "type": "credit_card"
    },
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "platform_id": null,
    "point_of_interaction": {
        "business_info": {
            "branch": null,
            "sub_unit": "checkout_pro",
            "unit": "online_payments"
        },
        "transaction_data": {
            "e2e_id": null
        },
        "type": "CHECKOUT"
    },
    "pos_id": null,
    "processing_mode": "aggregator",
    "refunds": [],
    "shipping_amount": 0,
    "sponsor_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "status": "approved",
    "status_detail": "accredited",
    "store_id": null,
    "tags": null,
    "taxes_amount": 0,
    "transaction_amount": 2000,
    "transaction_amount_refunded": 0,
    "transaction_details": {
        "acquirer_reference": null,
        "external_resource_url": null,
        "financial_institution": null,
        "installment_amount": 2000,
        "net_received_amount": 1918,
        "overpaid_amount": 0,
        "payable_deferral_period": null,
        "payment_method_reference_id": null,
        "total_paid_amount": 2000
    }
}
### Merchant Orders

The merchant order is created when the payer selects to pay inside a Checkout Pro. It's an abstraction of an order and a checkout flow.

Makes it easier to keep track of payment intents inside a checkout flow (ie. a rejection and a second approved transaction) and checkouts completed with multiple payment methods (ie. two credit cards).

You will know the merchant order ID from a server-to-server notification.

#### 📥 GET Get Merchant Order

**Endpoint:** `https://api.mercadopago.com/merchant_orders/:merchantOrderId`

Check the payment information and order status for a product or service with the ID of the order you want.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
merchantOrderId
(Required) Id of the merchant order

Example
Get Merchant Order
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/merchant_orders/:merchantOrderId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 15512612126,
    "status": "closed",
    "external_reference": "IWD1238971",
    "preference_id": "1117105806-00098503-2ad5-4c5f-b3bf-b2bab8647bc3",
    "payments": [
        {
            "id": 71628481137,
            "transaction_amount": 2000,
            "total_paid_amount": 2000,
            "shipping_cost": 0,
            "currency_id": "ARS",
            "status": "approved",
            "status_detail": "accredited",
            "operation_type": "regular_payment",
            "date_approved": "2024-02-05T08:59:31.000-04:00",
            "date_created": "2024-02-05T08:59:30.000-04:00",
            "last_modified": "2024-02-05T08:59:31.000-04:00",
            "amount_refunded": 0
        }
    ],
    "shipments": [],
    "payouts": [],
    "collector": {
        "id": 1117105806,
        "email": "",
        "nickname": "TETE8280276"
    },
    "marketplace": "MP-MKT-2826441017868072",
    "notification_url": "https://www.your-site.com/webhook",
    "date_created": "2024-02-05T08:59:29.869-04:00",
    "last_updated": "2024-02-05T08:59:31.308-04:00",
    "sponsor_id": null,
    "shipping_cost": 0,
    "total_amount": 2000,
    "site_id": "MLA",
    "paid_amount": 2000,
    "refunded_amount": 0,
    "payer": {
        "id": 1537275505,
        "email": ""
    },
    "items": [
        {
            "id": "010983098",
            "category_id": "retail",
            "currency_id": "ARS",
            "description": "Description of my product",
            "picture_url": null,
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000
        }
    ],
    "cancelled": false,
    "additional_info": "",
    "application_id": null,
    "is_test": false,
    "order_status": "paid"
}
### Customers & Cards

Create Customers and associate Cards to them. All information will be safely stored in Mercado Pago's PCI vault.
With this integration you can show saved cards on your site for a better checkout experience.

### Customers

A customer represents a user of your service / application.

It is mandatory to create a customer to add saved cards.

IMPORTANT: The customer is associated only to the application (account) that generated it, meaning it is encapsulated for a specific integration. It does not hold any ties to a customer of Mercado Pago or other integrations.

#### POST Create Customer

**Endpoint:** `https://api.mercadopago.com/v1/customers`

Create a customer with all its data and save the cards used to simplify the payment process.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
    "email": "test_payer_1234@testuser.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": {
        "area_code": "11",
        "number": "987654321"
    },
    "identification": {
        "type": "DNI",
        "number": "12123123"
    },
    "default_address": "Home",
    "address": {
        "id": "Home",
        "zip_code": "1406",
        "street_name": "Av. 9 de Julio",
        "street_number": 1500,
        "city": {
            "name": "Buenos Aires"
        }
    },
    "date_registered": "2000-01-18",
    "description": "Description del user"
}
Example
Create Customer
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "email": "test_payer_1234@testuser.com",
  "first_name": "Test",
  "last_name": "User",
  "phone": {
    "area_code": "11",
    "number": "987654321"
  },
  "identification": {
    "type": "DNI",
    "number": "12123123"
  },
  "default_address": "Home",
  "address": {
    "id": "Home",
    "zip_code": "1406",
    "street_name": "Av. 9 de Julio",
    "street_number": 1500,
    "city": {
      "name": "Buenos Aires"
    }
  },
  "date_registered": "2000-01-18",
  "description": "Description del user"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "id": "1670445614-6R4OLYVlnY2C00",
    "email": "test_payer_1234@testuser.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": {
        "area_code": "11",
        "number": "987654321"
    },
    "identification": {
        "type": "DNI",
        "number": "12123123"
    },
    "address": {
        "id": "1355962743",
        "zip_code": "1406",
        "street_name": "Av. 9 de Julio",
        "street_number": 1500
    },
    "date_registered": "2000-01-18T00:00:00.000-04:00",
    "description": "Description del user",
    "date_created": "2024-02-05T15:46:44.840-04:00",
    "date_last_updated": "2024-02-05T15:46:44.840-04:00",
    "default_card": null,
    "default_address": "1355962743",
    "cards": [],
    "addresses": [
        {
            "apartment": null,
            "city": {
                "id": null,
                "name": "Buenos Aires"
            },
            "comments": null,
            "country": {
                "id": "AR",
                "name": "Argentina"
            },
            "date_created": "2024-02-05T15:46:44.785-04:00",
            "date_last_updated": null,
            "floor": null,
            "id": "1355962743",
            "municipality": {
                "id": null,
                "name": null
            },
            "name": null,
            "neighborhood": {
                "id": null,
                "name": null
            },
            "normalized": true,
            "phone": null,
            "state": {
                "id": "AR-C",
                "name": "Capital Federal"
            },
            "street_name": "Av. 9 de Julio",
            "street_number": 1500,
            "verifications": {
                "shipment": {
                    "errors": [],
                    "success": true
                }
            },
            "zip_code": "1406"
        }
    ],
    "live_mode": true,
    "user_id": 1670445614,
    "merchant_id": 1117105806,
    "client_id": 2826441017868072,
    "status": "active"
}
#### GET Get Customer

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId`

Check all the information of a client created with the client ID of your choice.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Id of the customer

Example
Get Customer
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": "1670445614-6R4OLYVlnY2C00",
    "email": "test_payer_1234@testuser.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": {
        "area_code": "11",
        "number": "987654321"
    },
    "identification": {
        "type": "DNI",
        "number": "12123123"
    },
    "address": {
        "id": "1355962743",
        "zip_code": "1406",
        "street_name": "Av. 9 de Julio",
        "street_number": 1500
    },
    "date_registered": "2000-01-18T00:00:00.000-04:00",
    "description": "Description del user",
    "date_created": "2024-02-05T15:46:44.840-04:00",
    "date_last_updated": "2024-02-05T15:46:44.840-04:00",
    "metadata": {
        "source_sync": "source_k"
    },
    "default_card": null,
    "default_address": "1355962743",
    "cards": [],
    "addresses": [
        {
            "apartment": null,
            "city": {
                "id": null,
                "name": "Buenos Aires"
            },
            "comments": null,
            "country": {
                "id": "AR",
                "name": "Argentina"
            },
            "date_created": "2024-02-05T15:46:44.785-04:00",
            "date_last_updated": null,
            "floor": null,
            "id": "1355962743",
            "municipality": {
                "id": null,
                "name": null
            },
            "name": null,
            "neighborhood": {
                "id": null,
                "name": null
            },
            "normalized": true,
            "phone": null,
            "state": {
                "id": "AR-C",
                "name": "Capital Federal"
            },
            "street_name": "Av. 9 de Julio",
            "street_number": 1500,
            "verifications": {
                "shipment": {
                    "errors": [],
                    "success": true
                }
            },
            "zip_code": "1406"
        }
    ],
    "live_mode": true
}
#### 📥 GET Get Customer by Email

**Endpoint:** `https://api.mercadopago.com/v1/customers/search?email=`

Find all customer information using the email filter.

---

Authorization
Bearer Token
Token
{{access_token}}
Query Params
email
(Required) Customer email

Example
Get Customer by Email
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/search?email=test_payer_1234@testuser.com", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "paging": {
        "limit": 10,
        "offset": 0,
        "total": 1
    },
    "results": [
        {
            "address": {
                "id": "1355962743",
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": 1500,
                "city": {
                    "id": null,
                    "name": "Buenos Aires"
                }
            },
            "addresses": [
                {
                    "apartment": null,
                    "city": {
                        "id": null,
                        "name": "Buenos Aires"
                    },
                    "comments": null,
                    "country": {
                        "id": "AR",
                        "name": "Argentina"
                    },
                    "date_created": "2024-02-05T15:46:44.785-04:00",
                    "date_last_updated": null,
                    "floor": null,
                    "id": "1355962743",
                    "municipality": {
                        "id": null,
                        "name": null
                    },
                    "name": null,
                    "neighborhood": {
                        "id": null,
                        "name": null
                    },
                    "normalized": true,
                    "phone": null,
                    "state": {
                        "id": "AR-C",
                        "name": "Capital Federal"
                    },
                    "street_name": "Av. 9 de Julio",
                    "street_number": 1500,
                    "verifications": {
                        "shipment": {
                            "errors": [],
                            "success": true
                        }
                    },
                    "zip_code": "1406"
                }
            ],
            "cards": [],
            "date_created": "2024-02-05T15:46:44.840-04:00",
            "date_last_updated": "2024-02-05T15:46:44.840-04:00",
            "date_registered": "2000-01-18T00:00:00.000-04:00",
            "default_address": "1355962743",
            "default_card": null,
            "description": "Description del user",
            "email": "test_payer_1234@testuser.com",
            "first_name": "Test",
            "id": "1670445614-6R4OLYVlnY2C00",
            "identification": {
                "type": "DNI",
                "number": "12123123"
            },
            "last_name": "User",
            "live_mode": true,
            "metadata": {
                "source_sync": "source_k"
            },
            "phone": {
                "area_code": "11",
                "number": "987654321"
            }
        }
    ]
}
#### PUT Update Customer

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId`

Renew the data of a customer. Indicate the customer ID and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) ID of the customer

Body
raw (json)
View More
```json
{
    "first_name": "New",
    "last_name": "Name",
    "phone": {
        "area_code": "27",
        "number": "999887766"
    },
    "identification": {
        "type": "DNI",
        "number": "12123124"
    },
    "date_registered": "2000-01-18",
    "description": "Description del user"
}
Example
Update Customer
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "phone": {
    "area_code": "11",
    "number": "999887766"
  },
  "identification": {
    "type": "DNI",
    "number": "12123124"
  },
  "date_registered": "2000-01-18",
  "description": "Description del user"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": "1670445614-6R4OLYVlnY2C00",
    "email": "test_payer_1234@testuser.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": {
        "area_code": "11",
        "number": "999887766"
    },
    "identification": {
        "type": "DNI",
        "number": "12123124"
    },
    "address": {
        "id": "1355962743",
        "zip_code": "1406",
        "street_name": "Av. 9 de Julio",
        "street_number": 1500
    },
    "date_registered": "2000-01-18T00:00:00.000-04:00",
    "description": "Description del user",
    "date_created": "2024-02-05T15:46:44.840-04:00",
    "date_last_updated": "2024-02-05T15:50:24.359-04:00",
    "metadata": {
        "source_sync": "source_k"
    },
    "default_card": null,
    "default_address": "1355962743",
    "cards": [],
    "addresses": [
        {
            "apartment": null,
            "city": {
                "id": null,
                "name": "Buenos Aires"
            },
            "comments": null,
            "country": {
                "id": "AR",
                "name": "Argentina"
            },
            "date_created": "2024-02-05T15:46:44.785-04:00",
            "date_last_updated": null,
            "floor": null,
            "id": "1355962743",
            "municipality": {
                "id": null,
                "name": null
            },
            "name": null,
            "neighborhood": {
                "id": null,
                "name": null
            },
            "normalized": true,
            "phone": null,
            "state": {
                "id": "AR-C",
                "name": "Capital Federal"
            },
            "street_name": "Av. 9 de Julio",
            "street_number": 1500,
            "verifications": {
                "shipment": {
                    "errors": [],
                    "success": true
                }
            },
            "zip_code": "1406"
        }
    ],
    "live_mode": false,
    "user_id": 1670445614,
    "merchant_id": 1117105806,
    "client_id": 2826441017868072,
    "status": "active"
}
### Cards

Represents a saved card in Mercado Pago's PCI vault. Must always be related to a customer ID.

API's allow for full management of cards (add, get, delete, update).

IMPORTANT: Your integration will only have access to the cards collected in your application and created with your credentials.

#### POST Add Credit Card

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards`

Securely store on our servers the card reference used by the customer in the payment to avoid asking for all the data in future transactions.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Customer ID

Body
raw (json)
```json
{
    "token": "{{card_token_id}}",
    "payment_method_id": "visa"
}
Example
Add Credit Card
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "token": "{{card_token_id}}",
  "payment_method_id": "master"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId/cards", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "additional_info": {
        "request_public": "true",
        "api_client_application": "traffic-layer",
        "api_client_scope": "mpapi-pci-tl"
    },
    "card_number_id": null,
    "cardholder": {
        "name": "APRO",
        "identification": {
            "number": "19119119100",
            "type": "DNI"
        }
    },
    "customer_id": "1670445614-6R4OLYVlnY2C00",
    "date_created": "2024-02-05T15:54:31.000-04:00",
    "date_last_updated": "2024-02-05T15:54:31.000-04:00",
    "expiration_month": 11,
    "expiration_year": 2025,
    "first_six_digits": "503175",
    "id": "9392738686",
    "issuer": {
        "id": 3,
        "name": "Mastercard"
    },
    "last_four_digits": "0604",
    "live_mode": true,
    "payment_method": {
        "id": "master",
        "name": "Mastercard",
        "payment_type_id": "credit_card",
        "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
        "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
    },
    "security_code": {
        "length": 3,
        "card_location": "back"
    },
    "user_id": "1670445614"
}
#### GET Get Customer Card

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId`

Check the reference information for a saved card associated with a customer.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) ID of the customer

cardId
{{card_id}}
(Required) Id of the card

Example
Get Customer Card
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "cardholder": {
        "name": "APRO",
        "identification": {
            "number": "19119119100",
            "type": "DNI"
        }
    },
    "customer_id": "1670445614-6R4OLYVlnY2C00",
    "date_created": "2024-02-05T15:54:31.000-04:00",
    "date_last_updated": "2024-02-05T15:54:31.000-04:00",
    "expiration_month": 11,
    "expiration_year": 2025,
    "first_six_digits": "503175",
    "id": "9392738686",
    "issuer": {
        "id": 3,
        "name": "Mastercard"
    },
    "last_four_digits": "0604",
    "live_mode": true,
    "payment_method": {
        "id": "master",
        "name": "Mastercard",
        "payment_type_id": "credit_card",
        "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
        "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
    },
    "security_code": {
        "length": 3,
        "card_location": "back"
    },
    "user_id": "1670445614"
}
#### 🗑️ DELETE Delete Customer Card

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId`

Delete the data of a card associated with a customer whenever you need to.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Customer ID

cardId
{{card_id}}
(Required) Card ID

Example
Delete Customer Card
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = "";

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "additional_info": {
        "request_public": "",
        "api_client_application": "",
        "api_client_scope": ""
    },
    "card_number_id": null,
    "cardholder": {
        "name": "APRO",
        "identification": {
            "number": "12123123",
            "type": "DNI"
        }
    },
    "customer_id": "1670445614-6R4OLYVlnY2C00",
    "date_created": "2024-02-05T15:54:31.000-04:00",
    "date_last_updated": "2024-02-05T16:12:23.887-04:00",
    "expiration_month": 11,
    "expiration_year": 2025,
    "first_six_digits": "503175",
    "id": "9392738686",
    "issuer": {
        "id": 3,
        "name": "Mastercard"
    },
    "last_four_digits": "0604",
    "live_mode": true,
    "payment_method": {
        "id": "master",
        "name": "Mastercard",
        "payment_type_id": "credit_card",
        "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
        "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
    },
    "security_code": {
        "length": 3,
        "card_location": "back"
    },
    "user_id": "1670445614"
}
#### GET Get All Customer Cards

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards`

Consult a client's saved cards in order to be able to show them when making a payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Customer ID

Example
Get All Customer Cards
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId/cards", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
[
    {
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        },
        "customer_id": "1670445614-6R4OLYVlnY2C00",
        "date_created": "2024-02-05T15:54:31.000-04:00",
        "date_last_updated": "2024-02-05T15:54:31.000-04:00",
        "expiration_month": 11,
        "expiration_year": 2025,
        "first_six_digits": "503175",
        "id": "9392738686",
        "issuer": {
            "id": 3,
            "name": "Mastercard"
        },
        "last_four_digits": "0604",
        "live_mode": true,
        "payment_method": {
            "id": "master",
            "name": "Mastercard",
            "payment_type_id": "credit_card",
            "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
            "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
        },
        "security_code": {
            "length": 3,
            "card_location": "back"
        },
        "user_id": "1670445614"
    }
]
#### ✏️ PUT Update Customer Card

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId`

Renew the details of a card associated with a customer. Indicate the IDs and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Customer ID

cardId
{{card_id}}
(Required) Card ID

Body
raw (json)
```

{
    "cardholder": {
        "name": "CONT",
        "identification": {
            "number": "12123123",
            "type": "DNI"
        }
    }
}
Example
Update Customer Card
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "cardholder": {
    "name": "APRO",
    "identification": {
      "number": "12123123",
      "type": "DNI"
    }
  }
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/{{customer_id}}/cards/{{card_id}}", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "cardholder": {
        "name": "APRO",
        "identification": {
            "number": "12123123",
            "type": "DNI"
        }
    },
    "customer_id": "1670445614-6R4OLYVlnY2C00",
    "date_created": "2024-02-05T15:54:31.000-04:00",
    "date_last_updated": "2024-02-05T16:00:44.256-04:00",
    "expiration_month": 11,
    "expiration_year": 2025,
    "first_six_digits": "503175",
    "id": "9392738686",
    "issuer": {
        "id": 3,
        "name": "Mastercard"
    },
    "last_four_digits": "0604",
    "live_mode": true,
    "payment_method": {
        "id": "master",
        "name": "Mastercard",
        "payment_type_id": "credit_card",
        "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
        "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
    },
    "security_code": {
        "length": 3,
        "card_location": "back"
    },
    "user_id": "1670445614"
}
### Payments

Create a payment with a saved card / customer. The customer id must be sent when creating a payment with a saved card.

#### 📤 POST Create Payment existing customer(card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment referencing to an already saved customer

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "visa",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "id": "{{customer_id}}"
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": 1,
                "unit_price": 1000.50
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": "-1",
            "is_first_purchase_online": "-1",
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }

    }
}
Example
Create Payment existing customer(card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": true,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"issuer_id\": \"3\",\n    \"token\": {{card_token_id}},\n    \"external_reference\": \"PKJNWD1231\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1231\"\n    },\n    \"payer\": {\n        \"id\": \"1670445614-6R4OLYVlnY2C00\"\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Apple\",\n                \"description\": \"Apple Airpods Pro\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/apple/airpods_pro\",\n                \"category_id\": \"electronics\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": \"-1\",\n            \"is_first_purchase_online\": \"-1\",\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n        \n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 71654379887,
    "date_created": "2024-02-05T16:10:43.534-04:00",
    "date_approved": "2024-02-05T16:10:44.029-04:00",
    "date_last_updated": "2024-02-05T16:10:44.029-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-02-23T16:10:44.029-04:00",
    "money_release_status": "pending",
    "operation_type": "recurring_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.36.3",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1670445614-6R4OLYVlnY2C00",
        "operator_id": null,
        "email": "test_payer_1234@testuser.com",
        "identification": {
            "type": null,
            "number": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD#1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "71654379887-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-05T16:10:43.537-04:00",
            "last_updated": "2024-02-05T16:10:43.537-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": "9392738686",
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": null,
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-05T16:10:43.000-04:00",
        "date_last_updated": "2024-02-05T16:10:43.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "12123123",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "preapproval",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
Zero Dollar Auth
ZDA allows you to validate a credit or debit card withouth making effective charges to the client. This eliminates the the need to make a trial charge and refund, improving overall customer experience.

Make sure to read the documentation.

Available for Visa and Mastercard credit, debit and prepaid cards, only in Argentina, Brazil, Chile and Colombia.

#### 📤 POST Card Validation (with customer id)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Validate a card with a zero value transaction (for a previously saved customer)

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
```

{
    "token": "{{card_token_id}}",
    "payment_method_id": "master",
    "payer": {
        "id": {{customer_id}},
        "type" : "customer"
    },
    "description": "Validacion de tarjeta ZDA master",
    "transaction_amount": 0
}
#### POST Card validation (with email)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Validate a card with a zero value transaction (with an email)

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
```json
{
    "token": "{{card_token_id}}",
    "payment_method_id": "master",
    "payer": {
        "email": "test_user_8787@testuser.com",
        "type" : "guest"
    },
    "description": "Validacion tarjeta zero dollar auth master",
    "transaction_amount": 0
}
### Refunds, Cancellations & Chargebacks

Manage your payments. Make a total or partial refund, cancel a pre authorized payment or manage a chargeback.

There may be restrictions to partial refunds depending on site of operation or payment method.

### Refunds and Cancellations

A refund can happen when a charge has been made to the customer, meaning there is an approved payment.

Cancellations happen when a purchase is made, but the payments has not yet been approved (payments status pendind or in_process)

#### 📤 POST Refund Payment (Total)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId/refunds`

Create Full Refund for a specific payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Example
Refund Payment (Total)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId/refunds", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 1627096680,
    "payment_id": 72048446488,
    "amount": 10,
    "metadata": {
        "status_detail": null
    },
    "source": {
        "name": "Test Test",
        "id": "1117105806",
        "type": "collector"
    },
    "date_created": "2024-02-08T16:04:03.000-04:00",
    "expiration_date": null,
    "unique_sequence_number": null,
    "refund_mode": "standard",
    "adjustment_amount": 0,
    "status": "approved",
    "reason": null,
    "labels": [],
    "amount_refunded_to_payer": 10,
    "additional_data": null,
    "e2e_id": null,
    "partition_details": []
}
#### POST Refund Payment (Partial)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId/refunds`

Create partial refund for a specific payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```json
{
    "amount": {{amount}}
}
Example
Refund Payment (Partial)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"amount\": 10\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId/refunds", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "id": 1627096680,
    "payment_id": 72048446488,
    "amount": 10,
    "metadata": {
        "status_detail": null
    },
    "source": {
        "id": "1117105806",
        "name": "Test Test",
        "type": "collector"
    },
    "date_created": "2024-02-08T16:04:03.438-04:00",
    "expiration_date": null,
    "unique_sequence_number": null,
    "refund_mode": "standard",
    "adjustment_amount": 0,
    "status": "approved",
    "reason": null,
    "labels": [],
    "amount_refunded_to_payer": 10,
    "additional_data": null,
    "e2e_id": null,
    "partition_details": []
}
#### PUT Cancel Payment

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Cancel a payment. Works for pre-authorized and pending payments.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```json
{
    "status": "cancelled"
}
Example
Cancel Payment
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"status\": \"cancelled\"\n}";

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 72072190362,
    "date_created": "2024-02-08T16:16:26.000-04:00",
    "date_approved": null,
    "date_last_updated": "2024-02-08T16:16:37.466-04:00",
    "date_of_expiration": null,
    "money_release_date": null,
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "cancelled",
    "status_detail": "by_collector",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.37.0",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": null,
        "identification": {
            "number": null,
            "type": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 0,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [],
    "charges_details": [
        {
            "id": "72072190362-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-08T16:16:26.000-04:00",
            "last_updated": "2024-02-08T16:16:26.000-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": false,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-08T16:16:26.000-04:00",
        "date_last_updated": "2024-02-08T16:16:26.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
Chargebacks
How to manage chargebacks. You will know the chargeback id from a server-to-server notification about the chargeback, or via the payment (from a change of status).

#### GET Get Chargeback

**Endpoint:** `https://api.mercadopago.com/v1/chargebacks/:chargebackId`

Check all the information related to a chargeback for your product or service with the ID of the chargeback.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
chargebackId
{{chargeback_id}}
(Required) Id of the chargeback

#### POST Chargeback - Upload documentation

**Endpoint:** `https://api.mercadopago.com/v1/chargebacks/:chargebackId/documentation`

Submit documentation for a chargeback dispute.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
chargebackId
{{chargeback_id}}
(Required) Id of the chargeback

Body
form-data
files[]
@/path/to/file/file1.png
files[]
@/path/to/file/file2.pdf
Marketplace model
The Split payments solution is designed to provide Payment Service Provider (PSP) services to sellers in marketplace models. Marketplaces are e-commerce platforms that connect sellers and buyers, offering a unified environment for online sales, expanding reach, and conversion.

The API call is made with an access token obtained through the Oauth process. The variable seller_access_token represents this particular access token. For more information refer to the Split Payments documentation﻿

Requires the implementation of Oauth

#### POST Create Preference - Marketplace Fee

**Endpoint:** `https://api.mercadopago.com/checkout/preferences`

Create a preference for Checkout Pro implementation, adding a marketplace fee to the transaction.

---

Authorization
Bearer Token
Token
{{seller_access_token}}
Body
raw (json)
View More
```json
{
    "auto_return": "approved",
    "back_urls": {
        "success": "http://httpbin.org/get?back_url=success",
        "failure": "http://httpbin.org/get?back_url=failure",
        "pending": "http://httpbin.org/get?back_url=pending"
    },
    "statement_descriptor": "TestStore",
    "binary_mode": false,
    "external_reference": "IWD#1238971",
    "marketplace_fee": 150,
    "items": [
        {
            "id": "010983098",
            "title": "My Product",
            "quantity": 1,
            "unit_price": 2000,
            "description": "Description of my product",
            "category_id": "retail"
        }
    ],
    "payer": {
        "email": "test_user_12398378192@testuser.com",
        "name": "Juan",
        "surname": "Lopez",
        "phone": {
            "area_code": "11",
            "number": "1523164589"
        },
        "identification":{
            "type": "DNI",
            "number": "12345678"
        },
        "address": {
            "street_name": "Street",
            "street_number": 123,
            "zip_code": "1406"
        }
    },
    "payment_methods": {
        "excluded_payment_types": [],
        "excluded_payment_methods": [],
        "installments": 12,
        "default_payment_method_id": "account_money"
    },
    "notification_url": "https://www.your-site.com/webhook",
    "expires": true,
    "expiration_date_from": "2024-01-01T12:00:00.000-04:00",
    "expiration_date_to": "2024-12-31T12:00:00.000-04:00"
}
#### 📤 POST Create Payment (card) - Marketplace Fee

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment using maketplace model, allowing a marketplace fee (application fee) in the transaction

---

Authorization
Bearer Token
Token
{{seller_access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "application_fee": 150,
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "visa",
    "issuer_id": "130",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD#1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD#1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": 1,
                "unit_price": 1000.50
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": "-1",
            "is_first_purchase_online": "-1",
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }

    }
}
## Checkout API

Mercado Pago's Transparent Checkout (or Checkout API) allows the entire checkout process, from filling in user data to making the payment, to take place in a single environment, without the need to redirect to a page outside your store.

For a full documentation, refer to our Developer's Site.

Make sure to:

Read the testing documentation
Create an account and get the testing credentials﻿
Select the Environment "Integration"
Set the "public_key" and "access_token" variables with the test credentials
You may to need to set collection variables as you go to test all resources (payment id, customer id, card id, etc.)

Payment Methods
Payment Methods API's gives information about the configuration for a certain card BIN. You can find information about the type of card, issuing bank and installments configured for a particular BIN.

#### GET Get Payment Method

**Endpoint:** `https://api.mercadopago.com/v1/payment_methods/search?public_key={{public_key}}&bins=&marketplace=NONE&id=`

Consult the available payment methods for a certain BIN and obtain a list with the details of each one and its properties.

---

Query Params
public_key
{{public_key}}
(Required) Public key of the application

bins
(Optional) Bin of the card to search

marketplace
NONE
(Required) Must always be NONE

id
(Optional) ID of the payment method to search

Example
Get Payment Method
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payment_methods/search?public_key={{public_key}}&marketplace=NONE&bins=503175", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "paging": {
        "total": 1,
        "limit": 30,
        "offset": 0
    },
    "results": [
        {
            "financial_institutions": [],
            "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
            "payer_costs": [
                {
                    "installment_rate": 0,
                    "discount_rate": 0,
                    "min_allowed_amount": 3,
                    "labels": [
                        "CFT_0,00%|TEA_0,00%"
                    ],
                    "installments": 1,
                    "reimbursement_rate": null,
                    "max_allowed_amount": 5000000,
                    "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
                },
                {
                    "installment_rate": 0,
                    "discount_rate": 0,
                    "min_allowed_amount": 3,
                    "labels": [
                        "interest_deduction_by_collector",
                        "CFT_0,00%|TEA_0,00%"
                    ],
                    "installments": 2,
                    "reimbursement_rate": 0,
                    "max_allowed_amount": 5000000,
                    "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
                },
                {
                    "installment_rate": 0,
                    "discount_rate": 0,
                    "min_allowed_amount": 3,
                    "labels": [
                        "interest_deduction_by_collector",
                        "CFT_0,00%|TEA_0,00%"
                    ],
                    "installments": 3,
                    "reimbursement_rate": null,
                    "max_allowed_amount": 5000000,
                    "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
                },
                {
                    "installment_rate": 0,
                    "discount_rate": 0,
                    "min_allowed_amount": 3,
                    "labels": [
                        "recommended_installment",
                        "interest_deduction_by_collector",
                        "CFT_0,00%|TEA_0,00%"
                    ],
                    "installments": 6,
                    "reimbursement_rate": null,
                    "max_allowed_amount": 5000000,
                    "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
                },
                {
                    "installment_rate": 84.29,
                    "discount_rate": 0,
                    "min_allowed_amount": 3,
                    "labels": [
                        "CFT_400,00%|TEA_295,00%"
                    ],
                    "installments": 9,
                    "reimbursement_rate": null,
                    "max_allowed_amount": 5000000,
                    "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
                },
                {
                    "installment_rate": 113.5,
                    "discount_rate": 0,
                    "min_allowed_amount": 3,
                    "labels": [
                        "CFT_390,00%|TEA_290,00%"
                    ],
                    "installments": 12,
                    "reimbursement_rate": null,
                    "max_allowed_amount": 5000000,
                    "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
                },
                {
                    "installment_rate": 180.78,
                    "discount_rate": 0,
                    "min_allowed_amount": 3,
                    "labels": [
                        "CFT_390,00%|TEA_293,00%"
                    ],
                    "installments": 18,
                    "reimbursement_rate": null,
                    "max_allowed_amount": 5000000,
                    "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
                },
                {
                    "installment_rate": 254.62,
                    "discount_rate": 0,
                    "min_allowed_amount": 3,
                    "labels": [
                        "CFT_390,00%|TEA_294,00%"
                    ],
                    "installments": 24,
                    "reimbursement_rate": null,
                    "max_allowed_amount": 5000000,
                    "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
                }
            ],
            "issuer": {
                "default": true,
                "name": "Mastercard",
                "id": 3
            },
            "total_financial_cost": 0,
            "min_accreditation_days": 0,
            "max_accreditation_days": 2,
            "merchant_account_id": null,
            "id": "master",
            "payment_type_id": "credit_card",
            "accreditation_time": 2880,
            "settings": [
                {
                    "security_code": {
                        "mode": "mandatory",
                        "card_location": "back",
                        "length": 3
                    },
                    "card_number": {
                        "length": 16,
                        "validation": "standard"
                    },
                    "bin": {
                        "pattern": "^(5|(2(221|222|223|224|225|226|227|228|229|23|24|25|26|27|28|29|3|4|5|6|70|71|720)))",
                        "installments_pattern": "^(?!(554730|525855|547883|553461|540573|539522|539500|525562|539520|539508|539481|539479|515771|521219|521246|223143|223046|223226|223236|223269|234051|511657|519168|520812|522513|523793|523863|524728|526773|528104|528433|530815|530877|531929|533305|533324|533331|534090|536523|537012|540615|541097|542744|544512|544683|551743|555264|555755|555840|555848|558777|559137|230570|230709|230724|230895|230933|230937|511658|512258|512834|516656|519020|519879|522428|522713|525337|530516|531984|537067|538172|542734|542755|547320|549807|550480|552999|554630|559219|501092|528824))",
                        "exclusion_pattern": "^(555889|504639|504570|542878|532383|515070|515073|560718|551314|526497|524313|559926|559109|559100|557917|551200|541409|539110|536671|536670|536560|533888|533871|533860|533423|531179|531141|530779|522128|518787|515845|505865|505864|505863|232004|557069|555902|536196|532309|531441|530815|522684|501108|501107|501104|230867|230688|593628|592501|593626|514256|514586|526461|511309|514285|501059|557909|589633|553839|553777|553771|551792|528733|549180|528745|517562|511849|557648|546367|501070|601782|508143|501085|501074|501073|501071|501068|501066|589671|588729|501089|501083|501082|501081|501080|501075|501067|501062|501061|501060|501058|501057|501056|501055|501054|501053|501051|501049|501047|501045|501043|501041|501040|501039|501038|501029|501028|501027|501026|501025|501024|501023|501021|501020|501018|501016|501015|589657|589562|501105|557039|562397|566694|566783|568382|569322|504363|504338|504777|511673|514365|534935|222980|504520|544069|527558|511657|535456|535584|535585|250058|547526|514758|511080|514908|525559|542405|553474|553525|554763|557575|558418|558495|559442|527571|544768|504656|501063|504780|527341|511913|588800|546308|22345147)"
                    }
                }
            ],
            "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
            "bins": [],
            "marketplace": "NONE",
            "deferred_capture": "supported",
            "agreements": [],
            "labels": [
                "recommended_method",
                "zero_dollar_auth"
            ],
            "financing_deals": {
                "legals": null,
                "installments": null,
                "expiration_date": null,
                "start_date": null,
                "status": "deactive"
            },
            "name": "Mastercard",
            "site_id": "MLA",
            "processing_mode": "aggregator",
            "additional_info_needed": [
                "cardholder_name",
                "cardholder_identification_type",
                "cardholder_identification_number",
                "issuer_id"
            ],
            "status": "active"
        }
    ]
}
#### 📥 GET Get Installments

**Endpoint:** `https://api.mercadopago.com/v1/payment_methods/installments?public_key={{public_key}}&bin=&amount=&payment_method_id=`

Consult the available installments for a certain BIN and amount combination.

---

Query Params
public_key
{{public_key}}
(Required) Public key of the appliaction

bin
(Optional) Bin of the card to search

amount
(Required) Amount of the sale

payment_method_id
(Required) ID of the payment method

Example
Get Installments
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payment_methods/installments?public_key={{public_key}}&bin=503175&amount=20000", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

[
    {
        "payment_method_id": "master",
        "payment_type_id": "credit_card",
        "issuer": {
            "id": "3",
            "name": "Mastercard",
            "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
            "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
        },
        "processing_mode": "aggregator",
        "merchant_account_id": null,
        "payer_costs": [
            {
                "installments": 1,
                "installment_rate": 0,
                "discount_rate": 0,
                "reimbursement_rate": null,
                "labels": [
                    "CFT_0,00%|TEA_0,00%"
                ],
                "installment_rate_collector": [
                    "MERCADOPAGO"
                ],
                "min_allowed_amount": 3,
                "max_allowed_amount": 5000000,
                "recommended_message": "1 cuota de $ 20.000,00 ($ 20.000,00)",
                "installment_amount": 20000,
                "total_amount": 20000,
                "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
            },
            {
                "installments": 2,
                "installment_rate": 0,
                "discount_rate": 0,
                "reimbursement_rate": 0,
                "labels": [
                    "interest_deduction_by_collector",
                    "CFT_0,00%|TEA_0,00%"
                ],
                "installment_rate_collector": [
                    "MERCADOPAGO"
                ],
                "min_allowed_amount": 3,
                "max_allowed_amount": 5000000,
                "recommended_message": "2 cuotas de $ 10.000,00 ($ 20.000,00)",
                "installment_amount": 10000,
                "total_amount": 20000,
                "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
            },
            {
                "installments": 3,
                "installment_rate": 0,
                "discount_rate": 0,
                "reimbursement_rate": null,
                "labels": [
                    "recommended_installment",
                    "interest_deduction_by_collector",
                    "CFT_0,00%|TEA_0,00%"
                ],
                "installment_rate_collector": [
                    "MERCADOPAGO"
                ],
                "min_allowed_amount": 3,
                "max_allowed_amount": 5000000,
                "recommended_message": "3 cuotas de $ 6.666,67 ($ 20.000,00)",
                "installment_amount": 6666.67,
                "total_amount": 20000,
                "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
            },
            {
                "installments": 6,
                "installment_rate": 58.92,
                "discount_rate": 0,
                "reimbursement_rate": null,
                "labels": [
                    "CFT_440,00%|TEA_318,00%",
                    "recommended_interest_installment_with_some_banks"
                ],
                "installment_rate_collector": [
                    "MERCADOPAGO"
                ],
                "min_allowed_amount": 3,
                "max_allowed_amount": 5000000,
                "recommended_message": "6 cuotas de $ 5.297,33 ($ 31.784,00)",
                "installment_amount": 5297.33,
                "total_amount": 31784,
                "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
            },
            {
                "installments": 9,
                "installment_rate": 84.29,
                "discount_rate": 0,
                "reimbursement_rate": null,
                "labels": [
                    "CFT_400,00%|TEA_295,00%"
                ],
                "installment_rate_collector": [
                    "MERCADOPAGO"
                ],
                "min_allowed_amount": 3,
                "max_allowed_amount": 5000000,
                "recommended_message": "9 cuotas de $ 4.095,33 ($ 36.858,00)",
                "installment_amount": 4095.33,
                "total_amount": 36858,
                "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
            },
            {
                "installments": 12,
                "installment_rate": 113.5,
                "discount_rate": 0,
                "reimbursement_rate": null,
                "labels": [
                    "CFT_390,00%|TEA_290,00%"
                ],
                "installment_rate_collector": [
                    "MERCADOPAGO"
                ],
                "min_allowed_amount": 3,
                "max_allowed_amount": 5000000,
                "recommended_message": "12 cuotas de $ 3.558,33 ($ 42.700,00)",
                "installment_amount": 3558.33,
                "total_amount": 42700,
                "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
            },
            {
                "installments": 18,
                "installment_rate": 180.78,
                "discount_rate": 0,
                "reimbursement_rate": null,
                "labels": [
                    "CFT_390,00%|TEA_293,00%"
                ],
                "installment_rate_collector": [
                    "MERCADOPAGO"
                ],
                "min_allowed_amount": 3,
                "max_allowed_amount": 5000000,
                "recommended_message": "18 cuotas de $ 3.119,78 ($ 56.156,00)",
                "installment_amount": 3119.78,
                "total_amount": 56156,
                "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
            },
            {
                "installments": 24,
                "installment_rate": 254.62,
                "discount_rate": 0,
                "reimbursement_rate": null,
                "labels": [
                    "CFT_390,00%|TEA_294,00%"
                ],
                "installment_rate_collector": [
                    "MERCADOPAGO"
                ],
                "min_allowed_amount": 3,
                "max_allowed_amount": 5000000,
                "recommended_message": "24 cuotas de $ 2.955,17 ($ 70.924,00)",
                "installment_amount": 2955.17,
                "total_amount": 70924,
                "payment_method_option_id": "1.AQokODllZjQyNjktYjAzMy00OWU1LWJhMWQtNDE0NjQyNTM3MzY4EJaFuevHLg"
            }
        ],
        "agreements": null
    }
]
Identification Types
Get the available identification types supported for your site of operation and it's properties.

The site of operation is inferred from the credentials.

#### GET Get Identification types

**Endpoint:** `https://api.mercadopago.com/v1/identification_types?public_key={{public_key}}`

Consult all the types of documents available by country and get a list with the ID and details of each one.

---

Query Params
public_key
{{public_key}}
(Required) Public key of the application

Example
Get Identification types
Request
View More
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/identification_types?public_key={{public_key}}", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
[
    {
        "id": "DNI",
        "name": "DNI",
        "type": "number",
        "min_length": 7,
        "max_length": 8
    },
    {
        "id": "CI",
        "name": "Cédula",
        "type": "number",
        "min_length": 1,
        "max_length": 9
    },
    {
        "id": "LC",
        "name": "L.C.",
        "type": "number",
        "min_length": 6,
        "max_length": 7
    },
    {
        "id": "LE",
        "name": "L.E.",
        "type": "number",
        "min_length": 6,
        "max_length": 7
    },
    {
        "id": "Otro",
        "name": "Otro",
        "type": "number",
        "min_length": 5,
        "max_length": 20
    }
]
### Payments

Create payments with cards (credit, debit, prepaid), and other payment methods. There is multiple examples for different industries and categories. All the payer and Items information is used for fraud prevention reasons, make sure to send it as detailes as possible.

An Idempotency Key (sent as header) is required when creating or updating a payment. In this collection the header is automatically generated.

You can also search payments with their corresponding ID or External Reference.

#### 📤 POST Create Payment (card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment with all the required information. Remember to add the item's details and the payer's information.

---

An Idempotency Key is mandatory when creating a payment

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "master",
    "issuer_id": "3",
    "token": {{card_token_id}},
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": 1,
                "unit_price": 1000.50
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": "-1",
            "is_first_purchase_online": "-1",
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }

    }
}
Example
Create Payment (card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": true,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"issuer_id\": \"3\",\n    \"token\": \"{{card_token_id}}\",\n    \"external_reference\": \"PKJNWD1231\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1231\"\n    },\n    \"payer\": {\n        \"first_name\": \"Juan\",\n        \"last_name\": \"Perez\",\n        \"email\": \"test_user_12345@testuser.com\",\n        \"identification\": {\n            \"type\": \"DNI\",\n            \"number\": \"12123123\"\n        }\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Apple\",\n                \"description\": \"Apple Airpods Pro\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/apple/airpods_pro\",\n                \"category_id\": \"electronics\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": \"-1\",\n            \"is_first_purchase_online\": \"-1\",\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n        \n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 71851514358,
    "date_created": "2024-02-05T12:50:46.707-04:00",
    "date_approved": "2024-02-05T12:50:47.458-04:00",
    "date_last_updated": "2024-02-05T12:50:47.458-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-02-23T12:50:47.458-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.36.3",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "71851514358-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-05T12:50:46.709-04:00",
            "last_updated": "2024-02-05T12:50:46.709-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-05T12:50:47.000-04:00",
        "date_last_updated": "2024-02-05T12:50:47.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
#### 📤 POST Create Payment - Tourism (card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment with all the information needed. In the tourism industry, detailed information about route and passangers is required.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "master",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Ticket",
                "description": "EZE - RDJ",
                "picture_url": "https://www.yoursite.com/pictures/plane",
                "category_id": "travels",
                "quantity": 1,
                "unit_price": 1000.50,
                "category_descriptor": {
                    "passenger": {
                        "first_name": "Juan",
                        "last_name": "Perez"
                    },
                    "route":{
                        "departure": "Ezeiza",
                        "destination": "Rio de Janeiro",
                        "company": "Aero Charter",
                        "departure_date_time": "2024-09-12T12:58:41.425-04:00",
                        "arrival_date_time": "2024-09-13T06:58:41.425-04:00"
                    }
                }
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": true,
            "is_first_purchase_online": true,
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }
    }
}
Example
Create Payment - Tourism (card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": true,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"token\": \"{{card_token_id}}\",\n    \"external_reference\": \"PKJNWD1231\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1231\"\n    },\n    \"payer\": {\n        \"first_name\": \"Juan\",\n        \"last_name\": \"Perez\",\n        \"email\": \"test_user_12345@testuser.com\",\n        \"identification\": {\n            \"type\": \"DNI\",\n            \"number\": \"12123123\"\n        }\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Ticket\",\n                \"description\": \"EZE - RDJ\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/plane\",\n                \"category_id\": \"travels\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50,\n                \"category_descriptor\": {\n                    \"passenger\": {\n                        \"first_name\": \"Juan\",\n                        \"last_name\": \"Perez\"\n                    },\n                    \"route\":{\n                        \"departure\": \"Ezeiza\",\n                        \"destination\": \"Rio de Janeiro\",\n                        \"company\": \"Aero Charter\",\n                        \"departure_date_time\": \"2024-09-12T12:58:41.425-04:00\",\n                        \"arrival_date_time\": \"2024-09-13T06:58:41.425-04:00\"\n                    }\n                }\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": true,\n            \"is_first_purchase_online\": true,\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 86439176322,
    "date_created": "2024-08-29T07:45:33.087-04:00",
    "date_approved": "2024-08-29T07:45:34.095-04:00",
    "date_last_updated": "2024-08-29T07:45:34.095-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-09-16T07:45:34.095-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.67.0-rc-2",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Ticket",
                "description": "EZE - RDJ",
                "picture_url": "https://www.yoursite.com/pictures/plane",
                "category_id": "travels",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": "30121999",
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "86439176322-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-08-29T07:45:33.089-04:00",
            "last_updated": "2024-08-29T07:45:33.089-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {
                "source": "rule-engine"
            },
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-08-29T07:45:33.000-04:00",
        "date_last_updated": "2024-08-29T07:45:33.000-04:00",
        "country": null,
        "tags": null,
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "123456789",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": "Merchant Services"
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "release_info": null,
    "tags": null
}
#### 📤 POST Create Payment - Tickets and Entertainment (card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment with all the information needed. In the entertainment industry, detailed information about event date is required.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "master",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Concert",
                "description": "Concert Tickets",
                "picture_url": "https://www.yoursite.com/pictures/concert/tickets",
                "category_id": "Tickets",
                "quantity": 1,
                "unit_price": 1000.50,
                "event_date": "2025-06-20T19:00:00.000-04:00" // for Home and Electronics categories.
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": true,
            "is_first_purchase_online": true,
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }
    }
}
Example
Create Payment - Tickets and Entertainment (card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": true,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"token\": \"{{card_token_id}}\",\n    \"external_reference\": \"PKJNWD1231\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1231\"\n    },\n    \"payer\": {\n        \"first_name\": \"Juan\",\n        \"last_name\": \"Perez\",\n        \"email\": \"test_user_12345@testuser.com\",\n        \"identification\": {\n            \"type\": \"DNI\",\n            \"number\": \"12123123\"\n        }\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Concert\",\n                \"description\": \"Concert Tickets\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/concert/tickets\",\n                \"category_id\": \"Tickets\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50,\n                \"event_date\": \"2025-06-20T19:00:00.000-04:00\" // for Home and Electronics categories.\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": true,\n            \"is_first_purchase_online\": true,\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 86439466666,
    "date_created": "2024-08-29T07:53:56.603-04:00",
    "date_approved": "2024-08-29T07:53:57.605-04:00",
    "date_last_updated": "2024-08-29T07:53:57.605-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-09-16T07:53:57.605-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.67.0-rc-2",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Concert",
                "description": "Concert Tickets",
                "picture_url": "https://www.yoursite.com/pictures/concert/tickets",
                "category_id": "Tickets",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": "30121999",
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "86439466666-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-08-29T07:53:56.605-04:00",
            "last_updated": "2024-08-29T07:53:56.605-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {
                "source": "rule-engine"
            },
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-08-29T07:53:56.000-04:00",
        "date_last_updated": "2024-08-29T07:53:56.000-04:00",
        "country": null,
        "tags": null,
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "123456789",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": "Merchant Services"
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "release_info": null,
    "tags": null
}
#### 📤 POST [Brasil] Create Payment (PIX)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment with PIX (Only Brasil)

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 12.34,
    "date_of_expiration": "2019-12-25T19:30:00.000-03:00",
    "payment_method_id": "pix",
    "external_reference": "1234",
    "notification_url": "{{notification_url}}",
    "metadata": {
        "order_number": "order_1724857044"
    },
    "description": "PEDIDO NOVO - VIDEOGAME",
    "payer": {
        "first_name": "Joao",
        "last_name": "Silva",
        "email": "{{test_user_1724857044@testuser.com}}",
        "identification": {
            "type": "CPF",
            "number": "{{CPF_19119119100}}"
        },
        "address": {
            "zip_code": "06233-200",
            "street_name": "Av. das Nações Unidas",
            "street_number": "3003",
            "neighborhood": "Bonfim",
            "city": "Osasco",
            "federal_unit": "SP"
        }
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Ingresso Antecipado",
                "description": "Natal Iluminado 2019",
                "picture_url": null,
                "category_id": "Tickets",
                "quantity": 1,
                "unit_price": 100.00,
                "event_date": "2019-12-25T19:30:00.000-03:00"
            }
        ],
        "payer": {
            "first_name": "Nome",
            "last_name": "Sobrenome",
            "is_prime_user": "1",
            "is_first_purchase_online": "1",
            "last_purchase": "2019-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "06233-200",
                "street_name": "Av. das Nações Unidas",
                "street_number": "3003"
            },
            "registration_date": "2013-08-06T09:25:04.000-03:00"
        },
        "shipments": {
            "express_shipment": "0",
            "pick_up_on_seller": "1",
            "receiver_address": {
                "zip_code": "95630000",
                "street_name": "são Luiz",
                "street_number": "15",
                "floor": "12",
                "apartment": "123"
            }
        }
    }
}
#### POST [Brasil] Create Payment (boleto)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Generate a payment with Boleta (Only Brasil)

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
    "transaction_amount": 12.34,
    "date_of_expiration": "",
    "sponsor_id": null,
    "application_fee": null,
    "payment_method_id": "bolbradesco",
    "external_reference": "1724857151",
    "notification_url": "{{notification_url}}",
    "metadata": {
        "order_number": "order_1724857151"
    },
    "description": "PEDIDO NOVO - VIDEOGAME",
    "payer": {
        "first_name": "Joao",
        "last_name": "Silva",
        "email": "{{test_user_1724857151@testuser.com}}",
        "identification": {
            "type": "CPF",
            "number": "{{19119119100}}"
        },
        "address": {
            "zip_code": "06233-200",
            "street_name": "Av. das Nações Unidas",
            "street_number": "3003",
            "neighborhood": "Bonfim",
            "city": "Osasco",
            "federal_unit": "SP"
        }
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Ingresso Antecipado",
                "description": "Natal Iluminado 2019",
                "picture_url": null,
                "category_id": "Tickets",
                "quantity": 1,
                "unit_price": 100.00,
                "event_date": "2019-12-25T19:30:00.000-03:00"
            }
        ],
        "payer": {
            "first_name": "Nome",
            "last_name": "Sobrenome",
            "is_prime_user": "1",
            "is_first_purchase_online": "1",
            "last_purchase": "2019-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "06233-200",
                "street_name": "Av. das Nações Unidas",
                "street_number": "3003"
            },
            "registration_date": "2013-08-06T09:25:04.000-03:00"
        },
        "shipments": {
            "express_shipment": "0",
            "pick_up_on_seller": "1",
            "receiver_address": {
                "zip_code": "95630000",
                "street_name": "são Luiz",
                "street_number": "15",
                "floor": "12",
                "apartment": "123"
            }
        }
    }
}
#### 📤 POST [Colombia] Create Payment (PSE Avanza)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment for PSE Avanza payment methods. Only available for Colombia.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "external_reference": 11234,
    "transaction_amount": 25000,
    "payment_method_id": "pse",
    "transaction_details": {
        "financial_institution": "1009"
    },
    "payer": {
        "email": "test_user_1138736585@testuser.com",
        "entity_type": "individual",
        "identification": {
            "type": "nit",
            "number": "1232390059"
        },
        "first_name": "Juan",
        "last_name": "Perez",
        "phone": {
            "area_code": "5511",
            "number": "44230008"
        },
        "address": {
            "zip_code": "050015",
            "street_name": "Calle 41",
            "street_number": "97",
            "neighborhood": "La candelaria",
            "city": "Medellín"
        }
    },
    "additional_info": {
        "ip_address": "192.168.1.1"
    },
    "callback_url": "https://www.your-site.com",
    "notification_url": "https://www.your-site.com"
}
#### GET Get Payment by ID

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

See all the information of a payment through the payment ID.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Example
Get Payment by ID
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "accounts_info": null,
    "acquirer_reconciliation": [],
    "additional_info": {
        "authentication_code": null,
        "available_balance": null,
        "items": [
            {
                "category_id": "electronics",
                "description": "Apple Airpods Pro",
                "id": "1941",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "quantity": "1",
                "title": "Apple",
                "unit_price": "1000.5"
            }
        ],
        "nsu_processadora": null,
        "payer": {
            "address": {
                "street_name": "Av. 9 de Julio",
                "street_number": "1150",
                "zip_code": "1406"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }
    },
    "authorization_code": "301299",
    "binary_mode": false,
    "brand_id": null,
    "build_version": "3.36.3",
    "call_for_authorize_id": null,
    "captured": true,
    "card": {
        "bin": "50317557",
        "cardholder": {
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            },
            "name": "APRO"
        },
        "date_created": "2024-02-05T12:50:47.000-04:00",
        "date_last_updated": "2024-02-05T12:50:47.000-04:00",
        "expiration_month": 11,
        "expiration_year": 2025,
        "first_six_digits": "503175",
        "id": null,
        "last_four_digits": "0604"
    },
    "charges_details": [
        {
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "client_id": 0,
            "date_created": "2024-02-05T12:50:46.000-04:00",
            "id": "71851514358-001",
            "last_updated": "2024-02-05T12:50:46.000-04:00",
            "metadata": {},
            "name": "mercadopago_fee",
            "refund_charges": [],
            "reserve_id": null,
            "type": "fee"
        }
    ],
    "collector_id": 1117105806,
    "corporation_id": null,
    "counter_currency": null,
    "coupon_amount": 0,
    "currency_id": "ARS",
    "date_approved": "2024-02-05T12:50:47.000-04:00",
    "date_created": "2024-02-05T12:50:46.000-04:00",
    "date_last_updated": "2024-02-05T12:50:49.000-04:00",
    "date_of_expiration": null,
    "deduction_schema": "PROACTIVE_6",
    "description": "Compra en Test Store",
    "differential_pricing_id": null,
    "external_reference": "PKJNWD1231",
    "fee_details": [
        {
            "amount": 41.02,
            "fee_payer": "collector",
            "type": "mercadopago_fee"
        }
    ],
    "financing_group": null,
    "id": 71851514358,
    "installments": 1,
    "integrator_id": null,
    "issuer_id": "3",
    "live_mode": true,
    "marketplace_owner": null,
    "merchant_account_id": null,
    "merchant_number": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "money_release_date": "2024-02-23T12:50:47.000-04:00",
    "money_release_schema": null,
    "money_release_status": "pending",
    "notification_url": "https://www.yoursite.com/webhooks",
    "operation_type": "regular_payment",
    "order": {},
    "payer": {
        "email": "test_user_12345@testuser.com",
        "entity_type": null,
        "first_name": null,
        "id": "1640286694",
        "identification": {
            "number": "12123123",
            "type": "DNI"
        },
        "last_name": null,
        "operator_id": null,
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "type": null
    },
    "payment_method": {
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        },
        "id": "master",
        "issuer_id": "3",
        "type": "credit_card"
    },
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "platform_id": null,
    "point_of_interaction": {
        "business_info": {
            "branch": null,
            "sub_unit": "default",
            "unit": "online_payments"
        },
        "transaction_data": {},
        "type": "UNSPECIFIED"
    },
    "pos_id": null,
    "processing_mode": "aggregator",
    "refunds": [],
    "shipping_amount": 0,
    "sponsor_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "status": "approved",
    "status_detail": "accredited",
    "store_id": null,
    "tags": null,
    "taxes_amount": 0,
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "transaction_details": {
        "acquirer_reference": null,
        "external_resource_url": null,
        "financial_institution": null,
        "installment_amount": 1000.5,
        "net_received_amount": 959.48,
        "overpaid_amount": 0,
        "payable_deferral_period": null,
        "payment_method_reference_id": null,
        "total_paid_amount": 1000.5
    }
}
#### 📥 GET Get Payment by External Reference

**Endpoint:** `https://api.mercadopago.com/v1/payments/search?external_reference=`

See all the information of a payment through the external reference.

---

Authorization
Bearer Token
Token
{{access_token}}
Query Params
external_reference
(Required) External reference of the payment

Example
Get Payment by External Reference
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/search?external_reference=", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "results": [
        {
            "metadata": {
                "order_number": "order_PKJNWD1231"
            },
            "corporation_id": null,
            "operation_type": "pos_payment",
            "point_of_interaction": {
                "business_info": {
                    "unit": "online_payments",
                    "branch": null,
                    "sub_unit": "default"
                },
                "transaction_data": {},
                "type": "UNSPECIFIED"
            },
            "fee_details": [
                {
                    "amount": 41.02,
                    "fee_payer": "collector",
                    "type": "mercadopago_fee"
                }
            ],
            "notification_url": "https://www.yoursite.com/webhooks",
            "date_approved": "2024-02-05T12:50:47.000-04:00",
            "money_release_schema": null,
            "payer": {
                "entity_type": null,
                "identification": {
                    "number": "12123123",
                    "type": "DNI"
                },
                "phone": {
                    "number": null,
                    "extension": null,
                    "area_code": null
                },
                "operator_id": null,
                "last_name": null,
                "id": "1640286694",
                "type": null,
                "first_name": null,
                "email": "test_user_12345@testuser.com"
            },
            "transaction_details": {
                "total_paid_amount": 1000.5,
                "acquirer_reference": null,
                "installment_amount": 1000.5,
                "financial_institution": null,
                "net_received_amount": 959.48,
                "overpaid_amount": 0,
                "external_resource_url": null,
                "payable_deferral_period": null,
                "payment_method_reference_id": null
            },
            "statement_descriptor": "Mercadopago*fake",
            "call_for_authorize_id": null,
            "installments": 1,
            "pos_id": null,
            "external_reference": "PKJNWD1231",
            "date_of_expiration": null,
            "charges_details": [
                {
                    "refund_charges": [],
                    "last_updated": "2024-02-05T12:50:46.000-04:00",
                    "metadata": {},
                    "amounts": {
                        "original": 41.02,
                        "refunded": 0
                    },
                    "date_created": "2024-02-05T12:50:46.000-04:00",
                    "name": "mercadopago_fee",
                    "reserve_id": null,
                    "accounts": {
                        "from": "collector",
                        "to": "mp"
                    },
                    "id": "71851514358-001",
                    "type": "fee",
                    "client_id": 0
                }
            ],
            "id": 71851514358,
            "payment_type_id": "credit_card",
            "payment_method": {
                "issuer_id": "3",
                "data": {
                    "routing_data": {
                        "merchant_account_id": "5924780738444"
                    }
                },
                "id": "master",
                "type": "credit_card"
            },
            "order": {},
            "counter_currency": null,
            "money_release_status": "pending",
            "brand_id": null,
            "status_detail": "accredited",
            "tags": null,
            "differential_pricing_id": null,
            "additional_info": {
                "authentication_code": null,
                "nsu_processadora": null,
                "available_balance": null,
                "items": [
                    {
                        "quantity": "1",
                        "category_id": "electronics",
                        "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                        "description": "Apple Airpods Pro",
                        "id": "1941",
                        "title": "Apple",
                        "unit_price": "1000.5"
                    }
                ],
                "payer": {
                    "address": {
                        "street_number": "1150",
                        "street_name": "Av. 9 de Julio",
                        "zip_code": "1406"
                    },
                    "registration_date": "2023-08-06T09:25:04.000-03:00",
                    "phone": {
                        "number": "987654321",
                        "area_code": "11"
                    },
                    "last_name": "Perez",
                    "first_name": "Juan"
                }
            },
            "live_mode": true,
            "marketplace_owner": null,
            "card": {
                "first_six_digits": "503175",
                "expiration_year": 2025,
                "bin": "50317557",
                "date_created": "2024-02-05T12:50:47.000-04:00",
                "expiration_month": 11,
                "id": null,
                "cardholder": {
                    "identification": {
                        "number": "19119119100",
                        "type": "DNI"
                    },
                    "name": "APRO"
                },
                "last_four_digits": "0604",
                "date_last_updated": "2024-02-05T12:50:47.000-04:00"
            },
            "integrator_id": null,
            "status": "approved",
            "accounts_info": null,
            "transaction_amount_refunded": 0,
            "transaction_amount": 1000.5,
            "description": "Compra en Test Store",
            "financing_group": null,
            "money_release_date": "2024-02-23T12:50:47.000-04:00",
            "merchant_number": null,
            "refunds": [],
            "expanded": {
                "present_meta_data": "",
                "gateway": {
                    "buyer_fee": 0,
                    "finance_charge": 0,
                    "date_created": "2024-02-05T12:50:47.000-04:00",
                    "merchant": null,
                    "reference": "{\"merchant_number\":30121999}",
                    "statement_descriptor": "Mercadopago*fake",
                    "issuer_id": "3",
                    "usn": null,
                    "installments": 1,
                    "soft_descriptor": "TESTSTORE",
                    "authorization_code": "301299",
                    "payment_id": 71851514358,
                    "profile_id": "g2_firstdata-ipg_firstdata_24780738",
                    "options": "[{\"collector_id\":1117105806},{\"payment_operation_type\":\"pos_payment\"},{\"plan\":{}},{\"has_wallet_id\":false},{\"regulation\":{\"legal_name\":\"Test Test\",\"address_street\":\"Test Address\",\"address_door_number\":123,\"zip\":\"1414\",\"city\":\"Palermo\",\"country\":\"ARG\",\"document_number\":\"32659430\",\"document_type\":\"DNI\",\"region_code\":\"AR\",\"region_code_iso\":\"AR-C\",\"fiscal_condition\":\"Consumidor Final\",\"mcc\":\"5199\"}},{\"security_code_data\":{\"ads_remove_cvv\":false}}]",
                    "connection": "firstdata-ipg",
                    "id": "43880765664_7b7f737d7679737e6f7f",
                    "operation": "purchase"
                }
            },
            "authorization_code": "301299",
            "captured": true,
            "collector_id": 1117105806,
            "merchant_account_id": null,
            "taxes_amount": 0,
            "date_last_updated": "2024-02-05T12:50:49.000-04:00",
            "coupon_amount": 0,
            "store_id": null,
            "build_version": "3.36.3",
            "date_created": "2024-02-05T12:50:46.000-04:00",
            "acquirer_reconciliation": [],
            "sponsor_id": null,
            "shipping_amount": 0,
            "issuer_id": "3",
            "payment_method_id": "master",
            "binary_mode": false,
            "platform_id": null,
            "deduction_schema": "PROACTIVE_6",
            "processing_mode": "aggregator",
            "currency_id": "ARS",
            "shipping_cost": 0
        }
    ],
    "paging": {
        "total": 1,
        "limit": 30,
        "offset": 0
    }
}
### Payments (auth + capture)

Create an authorization for a payment and late capture the full or a partial amount.

Available for credit cards.

Availability of this feature may vary depending on operation site.

#### POST Create Payment (card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create an authorized payment. If the payment is authorized, the funds will be pre-approved and a later action to capture the funds is necessary. Remember to add the payment details and the payer's information.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": false,
    "binary_mode": false,
    "payment_method_id": "master",
    "issuer_id": "3",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": 1,
                "unit_price": 1000.50
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": "-1",
            "is_first_purchase_online": "-1",
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }

    }
}
Example
Create Payment (card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": false,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"issuer_id\": \"3\",\n    \"token\": \"{{card_token_id}}\",\n    \"external_reference\": \"PKJNWD1233\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1232\"\n    },\n    \"payer\": {\n        \"first_name\": \"Juan\",\n        \"last_name\": \"Perez\",\n        \"email\": \"test_user_12345@testuser.com\",\n        \"identification\": {\n            \"type\": \"DNI\",\n            \"number\": \"12123123\"\n        }\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Apple\",\n                \"description\": \"Apple Airpods Pro\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/apple/airpods_pro\",\n                \"category_id\": \"electronics\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": \"-1\",\n            \"is_first_purchase_online\": \"-1\",\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n        \n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "id": 71644421005,
    "date_created": "2024-02-05T13:08:30.212-04:00",
    "date_approved": null,
    "date_last_updated": "2024-02-05T13:08:30.749-04:00",
    "date_of_expiration": null,
    "money_release_date": null,
    "money_release_status": "pending",
    "operation_type": "pos_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "authorized",
    "status_detail": "pending_capture",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.36.3",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": null,
        "identification": {
            "number": null,
            "type": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1232"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1233",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 0,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [],
    "charges_details": [
        {
            "id": "71644421005-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-05T13:08:30.215-04:00",
            "last_updated": "2024-02-05T13:08:30.215-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": false,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-05T13:08:30.000-04:00",
        "date_last_updated": "2024-02-05T13:08:30.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
#### PUT Capture Payment (Total)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Capture a pre-authorized payment total amount.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```json
{
    "capture": true
}
Example
Capture Payment (Total)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = JSON.stringify({
  "capture": true
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 86439942806,
    "date_created": "2024-08-29T08:02:45.000-04:00",
    "date_approved": "2024-08-29T08:03:02.404-04:00",
    "date_last_updated": "2024-08-29T08:03:02.409-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-09-16T08:03:02.404-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.67.0-rc-2",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "86439942806-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-08-29T08:02:45.000-04:00",
            "last_updated": "2024-08-29T08:02:45.000-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {
                "source": "rule-engine"
            },
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-08-29T08:02:45.000-04:00",
        "date_last_updated": "2024-08-29T08:02:45.000-04:00",
        "country": null,
        "tags": null,
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "123456789",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": "Merchant Services"
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "release_info": null,
    "tags": null
}
#### PUT Capture Payment (Partial)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Capture a pre-authorized payment partial amount.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) ID of the payment

Body
raw (json)
```json
{
    "transaction_amount": 100,
    "capture": true
}
Example
Capture Payment (Partial)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = JSON.stringify({
  "transaction_amount": 100,
  "capture": true
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 86440270850,
    "date_created": "2024-08-29T08:08:10.000-04:00",
    "date_approved": "2024-08-29T08:08:30.716-04:00",
    "date_last_updated": "2024-08-29T08:08:30.722-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-09-16T08:08:30.716-04:00",
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.67.0-rc-2",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 100,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 95.9,
        "total_paid_amount": 100,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 100,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 4.1,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "86440270850-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-08-29T08:08:10.000-04:00",
            "last_updated": "2024-08-29T08:08:10.000-04:00",
            "amounts": {
                "original": 4.1,
                "refunded": 0
            },
            "metadata": {
                "source": "rule-engine"
            },
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-08-29T08:08:10.000-04:00",
        "date_last_updated": "2024-08-29T08:08:10.000-04:00",
        "country": null,
        "tags": null,
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "123456789",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": "Merchant Services"
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "release_info": null,
    "tags": null
}
#### PUT Cancel Pre Authorization

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Cancel pre-authorized payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```json
{
    "status": "cancelled"
}
Example
Cancel Pre Authorization
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = JSON.stringify({
  "status": "cancelled"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 71646366305,
    "date_created": "2024-02-05T13:40:55.000-04:00",
    "date_approved": null,
    "date_last_updated": "2024-02-05T13:41:11.312-04:00",
    "date_of_expiration": null,
    "money_release_date": null,
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "cancelled",
    "status_detail": "by_collector",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.36.3",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": null,
        "identification": {
            "number": null,
            "type": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1237",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 0,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [],
    "charges_details": [
        {
            "id": "71646366305-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-05T13:40:55.000-04:00",
            "last_updated": "2024-02-05T13:40:55.000-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": false,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-05T13:40:56.000-04:00",
        "date_last_updated": "2024-02-05T13:40:56.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
### Customers & Cards

Create Customers and associate Cards to them. All information will be safely stored in Mercado Pago's PCI vault.
With this integration you can show saved cards on your site for a better checkout experience.

### Customers

A customer represents a user of your service / application.

It is mandatory to create a customer to add saved cards.

IMPORTANT: The customer is associated only to the application (account) that generated it, meaning it is encapsulated for a specific integration. It does not hold any ties to a customer of Mercado Pago or other integrations.

#### POST Create Customer

**Endpoint:** `https://api.mercadopago.com/v1/customers`

Create a customer with all its data and save the cards used to simplify the payment process.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
    "email": "test_payer_1234@testuser.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": {
        "area_code": "11",
        "number": "987654321"
    },
    "identification": {
        "type": "DNI",
        "number": "12123123"
    },
    "default_address": "Home",
    "address": {
        "id": "Home",
        "zip_code": "1406",
        "street_name": "Av. 9 de Julio",
        "street_number": 1500,
        "city": {
            "name": "Buenos Aires"
        }
    },
    "date_registered": "2000-01-18",
    "description": "Description del user"
}
Example
Create Customer
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "email": "test_payer_1234@testuser.com",
  "first_name": "Test",
  "last_name": "User",
  "phone": {
    "area_code": "11",
    "number": "987654321"
  },
  "identification": {
    "type": "DNI",
    "number": "12123123"
  },
  "default_address": "Home",
  "address": {
    "id": "Home",
    "zip_code": "1406",
    "street_name": "Av. 9 de Julio",
    "street_number": 1500,
    "city": {
      "name": "Buenos Aires"
    }
  },
  "date_registered": "2000-01-18",
  "description": "Description del user"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "id": "1670445614-6R4OLYVlnY2C00",
    "email": "test_payer_1234@testuser.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": {
        "area_code": "11",
        "number": "987654321"
    },
    "identification": {
        "type": "DNI",
        "number": "12123123"
    },
    "address": {
        "id": "1355962743",
        "zip_code": "1406",
        "street_name": "Av. 9 de Julio",
        "street_number": 1500
    },
    "date_registered": "2000-01-18T00:00:00.000-04:00",
    "description": "Description del user",
    "date_created": "2024-02-05T15:46:44.840-04:00",
    "date_last_updated": "2024-02-05T15:46:44.840-04:00",
    "default_card": null,
    "default_address": "1355962743",
    "cards": [],
    "addresses": [
        {
            "apartment": null,
            "city": {
                "id": null,
                "name": "Buenos Aires"
            },
            "comments": null,
            "country": {
                "id": "AR",
                "name": "Argentina"
            },
            "date_created": "2024-02-05T15:46:44.785-04:00",
            "date_last_updated": null,
            "floor": null,
            "id": "1355962743",
            "municipality": {
                "id": null,
                "name": null
            },
            "name": null,
            "neighborhood": {
                "id": null,
                "name": null
            },
            "normalized": true,
            "phone": null,
            "state": {
                "id": "AR-C",
                "name": "Capital Federal"
            },
            "street_name": "Av. 9 de Julio",
            "street_number": 1500,
            "verifications": {
                "shipment": {
                    "errors": [],
                    "success": true
                }
            },
            "zip_code": "1406"
        }
    ],
    "live_mode": true,
    "user_id": 1670445614,
    "merchant_id": 1117105806,
    "client_id": 2826441017868072,
    "status": "active"
}
#### GET Get Customer

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId`

Check all the information of a client created with the client ID of your choice.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Id of the customer

Example
Get Customer
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": "1670445614-6R4OLYVlnY2C00",
    "email": "test_payer_1234@testuser.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": {
        "area_code": "11",
        "number": "987654321"
    },
    "identification": {
        "type": "DNI",
        "number": "12123123"
    },
    "address": {
        "id": "1355962743",
        "zip_code": "1406",
        "street_name": "Av. 9 de Julio",
        "street_number": 1500
    },
    "date_registered": "2000-01-18T00:00:00.000-04:00",
    "description": "Description del user",
    "date_created": "2024-02-05T15:46:44.840-04:00",
    "date_last_updated": "2024-02-05T15:46:44.840-04:00",
    "metadata": {
        "source_sync": "source_k"
    },
    "default_card": null,
    "default_address": "1355962743",
    "cards": [],
    "addresses": [
        {
            "apartment": null,
            "city": {
                "id": null,
                "name": "Buenos Aires"
            },
            "comments": null,
            "country": {
                "id": "AR",
                "name": "Argentina"
            },
            "date_created": "2024-02-05T15:46:44.785-04:00",
            "date_last_updated": null,
            "floor": null,
            "id": "1355962743",
            "municipality": {
                "id": null,
                "name": null
            },
            "name": null,
            "neighborhood": {
                "id": null,
                "name": null
            },
            "normalized": true,
            "phone": null,
            "state": {
                "id": "AR-C",
                "name": "Capital Federal"
            },
            "street_name": "Av. 9 de Julio",
            "street_number": 1500,
            "verifications": {
                "shipment": {
                    "errors": [],
                    "success": true
                }
            },
            "zip_code": "1406"
        }
    ],
    "live_mode": true
}
#### 📥 GET Get Customer by Email

**Endpoint:** `https://api.mercadopago.com/v1/customers/search?email=`

Find all customer information using the email filter.

---

Authorization
Bearer Token
Token
{{access_token}}
Query Params
email
(Required) Customer email

Example
Get Customer by Email
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/search?email=test_payer_1234@testuser.com", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "paging": {
        "limit": 10,
        "offset": 0,
        "total": 1
    },
    "results": [
        {
            "address": {
                "id": "1355962743",
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": 1500,
                "city": {
                    "id": null,
                    "name": "Buenos Aires"
                }
            },
            "addresses": [
                {
                    "apartment": null,
                    "city": {
                        "id": null,
                        "name": "Buenos Aires"
                    },
                    "comments": null,
                    "country": {
                        "id": "AR",
                        "name": "Argentina"
                    },
                    "date_created": "2024-02-05T15:46:44.785-04:00",
                    "date_last_updated": null,
                    "floor": null,
                    "id": "1355962743",
                    "municipality": {
                        "id": null,
                        "name": null
                    },
                    "name": null,
                    "neighborhood": {
                        "id": null,
                        "name": null
                    },
                    "normalized": true,
                    "phone": null,
                    "state": {
                        "id": "AR-C",
                        "name": "Capital Federal"
                    },
                    "street_name": "Av. 9 de Julio",
                    "street_number": 1500,
                    "verifications": {
                        "shipment": {
                            "errors": [],
                            "success": true
                        }
                    },
                    "zip_code": "1406"
                }
            ],
            "cards": [],
            "date_created": "2024-02-05T15:46:44.840-04:00",
            "date_last_updated": "2024-02-05T15:46:44.840-04:00",
            "date_registered": "2000-01-18T00:00:00.000-04:00",
            "default_address": "1355962743",
            "default_card": null,
            "description": "Description del user",
            "email": "test_payer_1234@testuser.com",
            "first_name": "Test",
            "id": "1670445614-6R4OLYVlnY2C00",
            "identification": {
                "type": "DNI",
                "number": "12123123"
            },
            "last_name": "User",
            "live_mode": true,
            "metadata": {
                "source_sync": "source_k"
            },
            "phone": {
                "area_code": "11",
                "number": "987654321"
            }
        }
    ]
}
#### PUT Update Customer

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId`

Renew the data of a customer. Indicate the customer ID and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) ID of the customer

Body
raw (json)
View More
```json
{
    "first_name": "New",
    "last_name": "Name",
    "phone": {
        "area_code": "27",
        "number": "999887766"
    },
    "identification": {
        "type": "DNI",
        "number": "12123124"
    },
    "date_registered": "2000-01-18",
    "description": "Description del user"
}
Example
Update Customer
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "phone": {
    "area_code": "11",
    "number": "999887766"
  },
  "identification": {
    "type": "DNI",
    "number": "12123124"
  },
  "date_registered": "2000-01-18",
  "description": "Description del user"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": "1670445614-6R4OLYVlnY2C00",
    "email": "test_payer_1234@testuser.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": {
        "area_code": "11",
        "number": "999887766"
    },
    "identification": {
        "type": "DNI",
        "number": "12123124"
    },
    "address": {
        "id": "1355962743",
        "zip_code": "1406",
        "street_name": "Av. 9 de Julio",
        "street_number": 1500
    },
    "date_registered": "2000-01-18T00:00:00.000-04:00",
    "description": "Description del user",
    "date_created": "2024-02-05T15:46:44.840-04:00",
    "date_last_updated": "2024-02-05T15:50:24.359-04:00",
    "metadata": {
        "source_sync": "source_k"
    },
    "default_card": null,
    "default_address": "1355962743",
    "cards": [],
    "addresses": [
        {
            "apartment": null,
            "city": {
                "id": null,
                "name": "Buenos Aires"
            },
            "comments": null,
            "country": {
                "id": "AR",
                "name": "Argentina"
            },
            "date_created": "2024-02-05T15:46:44.785-04:00",
            "date_last_updated": null,
            "floor": null,
            "id": "1355962743",
            "municipality": {
                "id": null,
                "name": null
            },
            "name": null,
            "neighborhood": {
                "id": null,
                "name": null
            },
            "normalized": true,
            "phone": null,
            "state": {
                "id": "AR-C",
                "name": "Capital Federal"
            },
            "street_name": "Av. 9 de Julio",
            "street_number": 1500,
            "verifications": {
                "shipment": {
                    "errors": [],
                    "success": true
                }
            },
            "zip_code": "1406"
        }
    ],
    "live_mode": false,
    "user_id": 1670445614,
    "merchant_id": 1117105806,
    "client_id": 2826441017868072,
    "status": "active"
}
### Cards

Represents a saved card in Mercado Pago's PCI vault. Must always be related to a customer ID.

API's allow for full management of cards (add, get, delete, update).

IMPORTANT: Your integration will only have access to the cards collected in your application and created with your credentials.

#### POST Add Credit Card

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards`

Securely store on our servers the card reference used by the customer in the payment to avoid asking for all the data in future transactions.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Customer ID

Body
raw (json)
```json
{
    "token": "{{card_token_id}}",
    "payment_method_id": "visa"
}
Example
Add Credit Card
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "token": "{{card_token_id}}",
  "payment_method_id": "master"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId/cards", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "additional_info": {
        "request_public": "true",
        "api_client_application": "traffic-layer",
        "api_client_scope": "mpapi-pci-tl"
    },
    "card_number_id": null,
    "cardholder": {
        "name": "APRO",
        "identification": {
            "number": "19119119100",
            "type": "DNI"
        }
    },
    "customer_id": "1670445614-6R4OLYVlnY2C00",
    "date_created": "2024-02-05T15:54:31.000-04:00",
    "date_last_updated": "2024-02-05T15:54:31.000-04:00",
    "expiration_month": 11,
    "expiration_year": 2025,
    "first_six_digits": "503175",
    "id": "9392738686",
    "issuer": {
        "id": 3,
        "name": "Mastercard"
    },
    "last_four_digits": "0604",
    "live_mode": true,
    "payment_method": {
        "id": "master",
        "name": "Mastercard",
        "payment_type_id": "credit_card",
        "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
        "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
    },
    "security_code": {
        "length": 3,
        "card_location": "back"
    },
    "user_id": "1670445614"
}
#### GET Get Customer Card

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId`

Check the reference information for a saved card associated with a customer.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) ID of the customer

cardId
{{card_id}}
(Required) Id of the card

Example
Get Customer Card
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "cardholder": {
        "name": "APRO",
        "identification": {
            "number": "19119119100",
            "type": "DNI"
        }
    },
    "customer_id": "1670445614-6R4OLYVlnY2C00",
    "date_created": "2024-02-05T15:54:31.000-04:00",
    "date_last_updated": "2024-02-05T15:54:31.000-04:00",
    "expiration_month": 11,
    "expiration_year": 2025,
    "first_six_digits": "503175",
    "id": "9392738686",
    "issuer": {
        "id": 3,
        "name": "Mastercard"
    },
    "last_four_digits": "0604",
    "live_mode": true,
    "payment_method": {
        "id": "master",
        "name": "Mastercard",
        "payment_type_id": "credit_card",
        "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
        "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
    },
    "security_code": {
        "length": 3,
        "card_location": "back"
    },
    "user_id": "1670445614"
}
#### 🗑️ DELETE Delete Customer Card

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId`

Delete the data of a card associated with a customer whenever you need to.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Customer ID

cardId
{{card_id}}
(Required) Card ID

Example
Delete Customer Card
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = "";

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "additional_info": {
        "request_public": "",
        "api_client_application": "",
        "api_client_scope": ""
    },
    "card_number_id": null,
    "cardholder": {
        "name": "APRO",
        "identification": {
            "number": "12123123",
            "type": "DNI"
        }
    },
    "customer_id": "1670445614-6R4OLYVlnY2C00",
    "date_created": "2024-02-05T15:54:31.000-04:00",
    "date_last_updated": "2024-02-05T16:12:23.887-04:00",
    "expiration_month": 11,
    "expiration_year": 2025,
    "first_six_digits": "503175",
    "id": "9392738686",
    "issuer": {
        "id": 3,
        "name": "Mastercard"
    },
    "last_four_digits": "0604",
    "live_mode": true,
    "payment_method": {
        "id": "master",
        "name": "Mastercard",
        "payment_type_id": "credit_card",
        "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
        "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
    },
    "security_code": {
        "length": 3,
        "card_location": "back"
    },
    "user_id": "1670445614"
}
#### GET Get All Customer Cards

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards`

Consult a client's saved cards in order to be able to show them when making a payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Customer ID

Example
Get All Customer Cards
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/:customerId/cards", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
[
    {
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        },
        "customer_id": "1670445614-6R4OLYVlnY2C00",
        "date_created": "2024-02-05T15:54:31.000-04:00",
        "date_last_updated": "2024-02-05T15:54:31.000-04:00",
        "expiration_month": 11,
        "expiration_year": 2025,
        "first_six_digits": "503175",
        "id": "9392738686",
        "issuer": {
            "id": 3,
            "name": "Mastercard"
        },
        "last_four_digits": "0604",
        "live_mode": true,
        "payment_method": {
            "id": "master",
            "name": "Mastercard",
            "payment_type_id": "credit_card",
            "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
            "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
        },
        "security_code": {
            "length": 3,
            "card_location": "back"
        },
        "user_id": "1670445614"
    }
]
#### ✏️ PUT Update Customer Card

**Endpoint:** `https://api.mercadopago.com/v1/customers/:customerId/cards/:cardId`

Renew the details of a card associated with a customer. Indicate the IDs and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
customerId
{{customer_id}}
(Required) Customer ID

cardId
{{card_id}}
(Required) Card ID

Body
raw (json)
```

{
    "cardholder": {
        "name": "CONT",
        "identification": {
            "number": "12123123",
            "type": "DNI"
        }
    }
}
Example
Update Customer Card
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "cardholder": {
    "name": "APRO",
    "identification": {
      "number": "12123123",
      "type": "DNI"
    }
  }
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/customers/{{customer_id}}/cards/{{card_id}}", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "cardholder": {
        "name": "APRO",
        "identification": {
            "number": "12123123",
            "type": "DNI"
        }
    },
    "customer_id": "1670445614-6R4OLYVlnY2C00",
    "date_created": "2024-02-05T15:54:31.000-04:00",
    "date_last_updated": "2024-02-05T16:00:44.256-04:00",
    "expiration_month": 11,
    "expiration_year": 2025,
    "first_six_digits": "503175",
    "id": "9392738686",
    "issuer": {
        "id": 3,
        "name": "Mastercard"
    },
    "last_four_digits": "0604",
    "live_mode": true,
    "payment_method": {
        "id": "master",
        "name": "Mastercard",
        "payment_type_id": "credit_card",
        "thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png",
        "secure_thumbnail": "https://http2.mlstatic.com/storage/logos-api-admin/0daa1670-5c81-11ec-ae75-df2bef173be2-xl@2x.png"
    },
    "security_code": {
        "length": 3,
        "card_location": "back"
    },
    "user_id": "1670445614"
}
### Payments

Create a payment with a saved card / customer. The customer id must be sent when creating a payment with a saved card.

#### 📤 POST Create Payment existing customer(card)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment referencing to an already saved customer

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "visa",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "payer": {
        "id": "{{customer_id}}"
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": 1,
                "unit_price": 1000.50
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": "-1",
            "is_first_purchase_online": "-1",
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }

    }
}
Example
Create Payment existing customer(card)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"transaction_amount\": 1000.50, // Chile and Colombia does not support decimals\n    \"installments\": 1,\n    \"capture\": true,\n    \"binary_mode\": false,\n    \"payment_method_id\": \"master\",\n    \"issuer_id\": \"3\",\n    \"token\": {{card_token_id}},\n    \"external_reference\": \"PKJNWD1231\",\n    \"notification_url\": \"https://www.yoursite.com/webhooks\",\n    \"metadata\": {\n        \"order_number\": \"order_PKJNWD1231\"\n    },\n    \"payer\": {\n        \"id\": \"1670445614-6R4OLYVlnY2C00\"\n    },\n    \"statement_descriptor\": \"TestStore\",\n    \"description\": \"Compra en Test Store\",\n    \"additional_info\": {\n        \"items\": [\n            {\n                \"id\": \"1941\",\n                \"title\": \"Apple\",\n                \"description\": \"Apple Airpods Pro\",\n                \"picture_url\": \"https://www.yoursite.com/pictures/apple/airpods_pro\",\n                \"category_id\": \"electronics\",\n                \"quantity\": 1,\n                \"unit_price\": 1000.50\n            }\n        ],\n        \"payer\": {\n            \"first_name\": \"Juan\",\n            \"last_name\": \"Perez\",\n            \"is_prime_user\": \"-1\",\n            \"is_first_purchase_online\": \"-1\",\n            \"last_purchase\": \"2023-10-25T19:30:00.000-03:00\",\n            \"phone\": {\n                \"area_code\": \"11\",\n                \"number\": \"987654321\"\n            },\n            \"address\": {\n                \"zip_code\": \"1406\",\n                \"street_name\": \"Av. 9 de Julio\",\n                \"street_number\": \"1150\"\n            },\n            \"registration_date\": \"2023-08-06T09:25:04.000-03:00\"\n        }\n        \n    }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": 71654379887,
    "date_created": "2024-02-05T16:10:43.534-04:00",
    "date_approved": "2024-02-05T16:10:44.029-04:00",
    "date_last_updated": "2024-02-05T16:10:44.029-04:00",
    "date_of_expiration": null,
    "money_release_date": "2024-02-23T16:10:44.029-04:00",
    "money_release_status": "pending",
    "operation_type": "recurring_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "approved",
    "status_detail": "accredited",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.36.3",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1670445614-6R4OLYVlnY2C00",
        "operator_id": null,
        "email": "test_payer_1234@testuser.com",
        "identification": {
            "type": null,
            "number": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD#1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 959.48,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [
        {
            "type": "mercadopago_fee",
            "amount": 41.02,
            "fee_payer": "collector"
        }
    ],
    "charges_details": [
        {
            "id": "71654379887-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-05T16:10:43.537-04:00",
            "last_updated": "2024-02-05T16:10:43.537-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": true,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": "9392738686",
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": null,
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-05T16:10:43.000-04:00",
        "date_last_updated": "2024-02-05T16:10:43.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "12123123",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "preapproval",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
Zero Dollar Auth
ZDA allows you to validate a credit or debit card withouth making effective charges to the client. This eliminates the the need to make a trial charge and refund, improving overall customer experience.

Make sure to read the documentation.

Available for Visa and Mastercard credit, debit and prepaid cards, only in Argentina, Brazil, Chile and Colombia.

#### 📤 POST Card Validation (with customer id)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Validate a card with a zero value transaction (for a previously saved customer)

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
```

{
    "token": "{{card_token_id}}",
    "payment_method_id": "master",
    "payer": {
        "id": {{customer_id}},
        "type" : "customer"
    },
    "description": "Validacion de tarjeta ZDA master",
    "transaction_amount": 0
}
#### POST Card validation (with email)

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Validate a card with a zero value transaction (with an email)

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
```json
{
    "token": "{{card_token_id}}",
    "payment_method_id": "master",
    "payer": {
        "email": "test_user_8787@testuser.com",
        "type" : "guest"
    },
    "description": "Validacion tarjeta zero dollar auth master",
    "transaction_amount": 0
}
### Refunds, Cancellations & Chargebacks

Manage your payments. Make a total or partial refund, cancel a pre authorized payment or manage a chargeback.

There may be restrictions to partial refunds depending on site of operation or payment method.

### Refunds and Cancellations

A refund can happen when a charge has been made to the customer, meaning there is an approved payment.

Cancellations happen when a purchase is made, but the payments has not yet been approved (payments status pendind or in_process)

#### 📤 POST Refund Payment (Total)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId/refunds`

Create Full Refund for a specific payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Example
Refund Payment (Total)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId/refunds", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 1627096680,
    "payment_id": 72048446488,
    "amount": 10,
    "metadata": {
        "status_detail": null
    },
    "source": {
        "name": "Test Test",
        "id": "1117105806",
        "type": "collector"
    },
    "date_created": "2024-02-08T16:04:03.000-04:00",
    "expiration_date": null,
    "unique_sequence_number": null,
    "refund_mode": "standard",
    "adjustment_amount": 0,
    "status": "approved",
    "reason": null,
    "labels": [],
    "amount_refunded_to_payer": 10,
    "additional_data": null,
    "e2e_id": null,
    "partition_details": []
}
#### POST Refund Payment (Partial)

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId/refunds`

Create partial refund for a specific payment.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```json
{
    "amount": {{amount}}
}
Example
Refund Payment (Partial)
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"amount\": 10\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId/refunds", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "id": 1627096680,
    "payment_id": 72048446488,
    "amount": 10,
    "metadata": {
        "status_detail": null
    },
    "source": {
        "id": "1117105806",
        "name": "Test Test",
        "type": "collector"
    },
    "date_created": "2024-02-08T16:04:03.438-04:00",
    "expiration_date": null,
    "unique_sequence_number": null,
    "refund_mode": "standard",
    "adjustment_amount": 0,
    "status": "approved",
    "reason": null,
    "labels": [],
    "amount_refunded_to_payer": 10,
    "additional_data": null,
    "e2e_id": null,
    "partition_details": []
}
#### PUT Cancel Payment

**Endpoint:** `https://api.mercadopago.com/v1/payments/:paymentId`

Cancel a payment. Works for pre-authorized and pending payments.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
paymentId
(Required) Id of the payment

Body
raw (json)
```json
{
    "status": "cancelled"
}
Example
Cancel Payment
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"status\": \"cancelled\"\n}";

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/payments/:paymentId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 72072190362,
    "date_created": "2024-02-08T16:16:26.000-04:00",
    "date_approved": null,
    "date_last_updated": "2024-02-08T16:16:37.466-04:00",
    "date_of_expiration": null,
    "money_release_date": null,
    "money_release_status": "pending",
    "operation_type": "regular_payment",
    "issuer_id": "3",
    "payment_method_id": "master",
    "payment_type_id": "credit_card",
    "payment_method": {
        "id": "master",
        "type": "credit_card",
        "issuer_id": "3",
        "data": {
            "routing_data": {
                "merchant_account_id": "5924780738444"
            }
        }
    },
    "status": "cancelled",
    "status_detail": "by_collector",
    "currency_id": "ARS",
    "description": "Compra en Test Store",
    "live_mode": true,
    "sponsor_id": null,
    "authorization_code": "301299",
    "money_release_schema": null,
    "taxes_amount": 0,
    "counter_currency": null,
    "brand_id": null,
    "shipping_amount": 0,
    "build_version": "3.37.0",
    "pos_id": null,
    "store_id": null,
    "integrator_id": null,
    "platform_id": null,
    "corporation_id": null,
    "payer": {
        "type": null,
        "id": "1640286694",
        "operator_id": null,
        "email": null,
        "identification": {
            "number": null,
            "type": null
        },
        "phone": {
            "number": null,
            "extension": null,
            "area_code": null
        },
        "first_name": null,
        "last_name": null,
        "entity_type": null
    },
    "collector_id": 1117105806,
    "marketplace_owner": null,
    "metadata": {
        "order_number": "order_PKJNWD1231"
    },
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": "1",
                "unit_price": "1000.5"
            }
        ],
        "payer": {
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "first_name": "Juan",
            "last_name": "Perez",
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        },
        "available_balance": null,
        "nsu_processadora": null,
        "authentication_code": null
    },
    "order": {},
    "external_reference": "PKJNWD1231",
    "transaction_amount": 1000.5,
    "transaction_amount_refunded": 0,
    "coupon_amount": 0,
    "differential_pricing_id": null,
    "financing_group": null,
    "deduction_schema": "PROACTIVE_6",
    "installments": 1,
    "transaction_details": {
        "payment_method_reference_id": null,
        "acquirer_reference": null,
        "net_received_amount": 0,
        "total_paid_amount": 1000.5,
        "overpaid_amount": 0,
        "external_resource_url": null,
        "installment_amount": 1000.5,
        "financial_institution": null,
        "payable_deferral_period": null
    },
    "fee_details": [],
    "charges_details": [
        {
            "id": "72072190362-001",
            "name": "mercadopago_fee",
            "type": "fee",
            "accounts": {
                "from": "collector",
                "to": "mp"
            },
            "client_id": 0,
            "date_created": "2024-02-08T16:16:26.000-04:00",
            "last_updated": "2024-02-08T16:16:26.000-04:00",
            "amounts": {
                "original": 41.02,
                "refunded": 0
            },
            "metadata": {},
            "reserve_id": null,
            "refund_charges": []
        }
    ],
    "captured": false,
    "binary_mode": false,
    "call_for_authorize_id": null,
    "statement_descriptor": "Mercadopago*fake",
    "card": {
        "id": null,
        "first_six_digits": "503175",
        "last_four_digits": "0604",
        "bin": "50317557",
        "expiration_month": 11,
        "expiration_year": 2025,
        "date_created": "2024-02-08T16:16:26.000-04:00",
        "date_last_updated": "2024-02-08T16:16:26.000-04:00",
        "cardholder": {
            "name": "APRO",
            "identification": {
                "number": "19119119100",
                "type": "DNI"
            }
        }
    },
    "notification_url": "https://www.yoursite.com/webhooks",
    "refunds": [],
    "processing_mode": "aggregator",
    "merchant_account_id": null,
    "merchant_number": null,
    "acquirer_reconciliation": [],
    "point_of_interaction": {
        "type": "UNSPECIFIED",
        "business_info": {
            "unit": "online_payments",
            "sub_unit": "default",
            "branch": null
        },
        "transaction_data": {}
    },
    "accounts_info": null,
    "tags": null
}
Chargebacks
How to manage chargebacks. You will know the chargeback id from a server-to-server notification about the chargeback, or via the payment (from a change of status).

#### GET Get Chargeback

**Endpoint:** `https://api.mercadopago.com/v1/chargebacks/:chargebackId`

Check all the information related to a chargeback for your product or service with the ID of the chargeback.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
chargebackId
{{chargeback_id}}
(Required) Id of the chargeback

#### POST Chargeback - Upload documentation

**Endpoint:** `https://api.mercadopago.com/v1/chargebacks/:chargebackId/documentation`

Submit documentation for a chargeback dispute.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
chargebackId
{{chargeback_id}}
(Required) Id of the chargeback

Body
form-data
files[]
@/path/to/file/file1.png
files[]
@/path/to/file/file2.pdf
Marketplace model
The Split payments solution is designed to provide Payment Service Provider (PSP) services to sellers in marketplace models. Marketplaces are e-commerce platforms that connect sellers and buyers, offering a unified environment for online sales, expanding reach, and conversion.

The API call is made with an access token obtained through the Oauth process. The variable seller_access_token represents this particular access token. For more information refer to the Split Payments documentation﻿

Requires the implementation of Oauth

#### POST Create Payment (card) - Marketplace Fee

**Endpoint:** `https://api.mercadopago.com/v1/payments`

Create a payment using maketplace model, allowing a marketplace fee (application fee) in the transaction

---

Authorization
Bearer Token
Token
{{seller_access_token}}
Body
raw (json)
View More
```json
{
    "transaction_amount": 1000.50, // Chile and Colombia does not support decimals
    "application_fee": 150,
    "installments": 1,
    "capture": true,
    "binary_mode": false,
    "payment_method_id": "visa",
    "issuer_id": "130",
    "token": "{{card_token_id}}",
    "external_reference": "PKJNWD#1231",
    "notification_url": "https://www.yoursite.com/webhooks",
    "metadata": {
        "order_number": "order_PKJNWD#1231"
    },
    "payer": {
        "first_name": "Juan",
        "last_name": "Perez",
        "email": "test_user_12345@testuser.com",
        "identification": {
            "type": "DNI",
            "number": "12123123"
        }
    },
    "statement_descriptor": "TestStore",
    "description": "Compra en Test Store",
    "additional_info": {
        "items": [
            {
                "id": "1941",
                "title": "Apple",
                "description": "Apple Airpods Pro",
                "picture_url": "https://www.yoursite.com/pictures/apple/airpods_pro",
                "category_id": "electronics",
                "quantity": 1,
                "unit_price": 1000.50
            }
        ],
        "payer": {
            "first_name": "Juan",
            "last_name": "Perez",
            "is_prime_user": "-1",
            "is_first_purchase_online": "-1",
            "last_purchase": "2023-10-25T19:30:00.000-03:00",
            "phone": {
                "area_code": "11",
                "number": "987654321"
            },
            "address": {
                "zip_code": "1406",
                "street_name": "Av. 9 de Julio",
                "street_number": "1150"
            },
            "registration_date": "2023-08-06T09:25:04.000-03:00"
        }

    }
}
## 📱 QR Code

API calls to implement QR Code payments for Mercado Pago's instore solution

Make sure to:

Read the testing documentation﻿
Create an account and get the testing credentials﻿
Select the Environment "Integration"
Set the "public_key" and "access_token" variables with the test credentials
To use this collection:

Fork the "Integration" environment.
Find your account's credentials / API Key (Access Token) and set the current value of access_token variable with the corresponding key.
Find you account's user id on the developer panel set the value for "user_id" on the Integration environment. If using Oauth, you will obtain the user id of the account when generating access token on /oauth/token API.
Create a Store and POS with the APIs on this collection. Make sure to set the "fixed_amount" field on POS creation to "true" and set an "external_pos_id" to identify your POS.
Create an Order using the Orders API
Scan the QR code and complete the transaction.
This collection sets variables automatically, but you may need to set variables manually depending on the flows you are trying to complete.

Store & POS Management
Manage (create, update, delete) your Stores and Point of sale (POS) to integrate in-person payments.

Stores
Physical store where your customers can acquire products and services. You can have multiple stores in the same account.

#### 📤 POST Create Store

**Endpoint:** `https://api.mercadopago.com/users/:userId/stores`

Generates a physical store where customers can purchase products or services. You can create more than one store per account.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
userId
{{user_id}}
(Required) ID of the Mercado Pago collector account

Body
raw (json)
View More
```

{
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "external_id": "SUC002",
  "location": {
    "street_number": "0123",
    "street_name": "Example Street Name",
    "city_name": "City name",
    "state_name": "State name",
    "latitude": 27.175193925922862,
    "longitude": 78.04213533235064,
    "reference": "Local"
  },
  "name": "Sucursal Instore"
}
Example
Create Store
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "external_id": "SUC002",
  "location": {
    "street_number": "0123",
    "street_name": "Example Street Name",
    "city_name": "City name",
    "state_name": "State name",
    "latitude": 27.175193925922862,
    "longitude": 78.04213533235064,
    "reference": "Local"
  },
  "name": "Sucursal Instore"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/users/{{user_id}}/stores", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": "60030440",
    "name": "Sucursal Instore",
    "date_creation": "2024-02-09T16:34:06.654Z",
    "business_hours": {
        "monday": [
            {
                "open": "08:00",
                "close": "12:00"
            }
        ],
        "tuesday": [
            {
                "open": "09:00",
                "close": "18:00"
            }
        ]
    },
    "location": {
        "address_line": "Example Street Name 0123, City Name, State Name, Country",
        "reference": "Local",
        "latitude": 27.175193925922862,
        "longitude": 78.04213533235064,
        "id": "AR",
        "type": "country",
        "city": "City Name"
    },
    "external_id": "SUC002"
}
#### 📥 GET GET Store by ID

**Endpoint:** `https://api.mercadopago.com/stores/:storeId`

Check all the information of a physical store with the ID of the store you want.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
storeId
(Required) ID of the store

Example
GET Store by ID
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/stores/:storeId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": "60030440",
    "name": "Sucursal Instore",
    "date_creation": "2024-02-09T16:34:06.654Z",
    "business_hours": {
        "monday": [
            {
                "open": "08:00",
                "close": "12:00"
            }
        ],
        "tuesday": [
            {
                "open": "09:00",
                "close": "18:00"
            }
        ]
    },
    "location": {
        "address_line": "Example Street Name 0123, City Name, State Name, Country",
        "reference": "Local",
        "latitude": 27.175193925922862,
        "longitude": 78.04213533235064,
        "id": "AR",
        "type": "country",
        "city": "City Name"
    },
    "external_id": "SUC002"
}
#### GET Search Store by External_ID

**Endpoint:** `https://api.mercadopago.com/users/:userId/stores/search?external_id=`

Find all the information of the stores generated through the specific external id sent when creating the store.

---

Authorization
Bearer Token
Token
{{access_token}}
Query Params
external_id
(Required) External ID of the store

Path Variables
userId
{{user_id}}
(Required) ID of the Mercado Pago collector account

Example
Search Store by External_ID
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/users/{{user_id}}/stores/search?external_id=", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "paging": {
        "total": 1,
        "offset": 0,
        "limit": 0
    },
    "results": [
        {
            "id": "60030440",
            "name": "Sucursal Instore",
            "date_creation": "2024-02-09T16:34:06.654Z",
            "business_hours": {
                "monday": [
                    {
                        "open": "08:00",
                        "close": "12:00"
                    }
                ],
                "tuesday": [
                    {
                        "open": "09:00",
                        "close": "18:00"
                    }
                ]
            },
            "location": {
                "address_line": "Example Street Name 0123, City Name, State Name, Country",
                "reference": "Local",
                "latitude": 27.175193925922862,
                "longitude": 78.04213533235064,
                "id": "AR",
                "type": "country",
                "city": "City Name"
            },
            "external_id": "SUC002"
        }
    ]
}
#### ✏️ PUT Update Store

**Endpoint:** `https://api.mercadopago.com/users/:userId/stores/:storeId`

Renew the data of a physical shop. Indicate the ID of the collector account and the store and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
userId
{{user_id}}
(Required) ID of the Mercado Pago collector account

storeId
(Required) ID of the store

Body
raw (json)
View More
```

{
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "external_id": "SUC002",
    "location": {
        "address_line": "Example Street Name 0123, City Name, State Name, Country",
        "reference": "Local",
        "latitude": 27.175193925922862,
        "longitude": 78.04213533235064,
        "id": "AR",
        "type": "country",
        "city": "City Name"
    },
  "name": "Sucursal Instore 2"
}
Example
Update Store
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "location": {
    "street_number": "0123",
    "street_name": "Example Street Name",
    "city_name": "City name",
    "state_name": "State name",
    "latitude": 27.175193925922862,
    "longitude": 78.04213533235064,
    "reference": "Local"
  },
  "name": "Sucursal Instore"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/users/{{user_id}}/stores/:storeId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": "60030440",
    "name": "Sucursal Instore",
    "date_creation": "2024-02-09T16:34:06.654Z",
    "business_hours": {
        "monday": [
            {
                "open": "08:00",
                "close": "12:00"
            }
        ],
        "tuesday": [
            {
                "open": "09:00",
                "close": "18:00"
            }
        ]
    },
    "location": {
        "address_line": "Example Street Name 0123, City Name, State Name, Country",
        "reference": "Local",
        "latitude": 27.175193925922862,
        "longitude": 78.04213533235064,
        "id": "AR",
        "type": "country",
        "city": "City Name"
    },
    "external_id": "SUC002"
}
#### 🗑️ DELETE Delete Store

**Endpoint:** `https://api.mercadopago.com/users/:userId/stores/:storeId`

Delete a physical shop whenever you need it with the ID of the store.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
userId
{{user_id}}
(Required) ID of the Mercado Pago collector account

storeId
(Required) ID of the store

Example
Delete Store
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/users/:userId/stores/:storeId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
```

{
    "store": 60030440,
    "user": 123456789
}
POS
A point of sale that exists in a branch or physical store. Each Store can have more than one POS.

#### POST Create POS

**Endpoint:** `https://api.mercadopago.com/pos`

Generate a Point of Sale in a store. Each POS will have a unique QR Code linked to it.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
```json
{
  "category": 621102,
  "external_id": "your_external_pos_id",
  "external_store_id": "",
  "fixed_amount": true, //send as true to use QR on integrated mode
  "name": "First POS1",
  "store_id": 
}
Example
Create POS
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "category": 621102,
  "external_id": "SUC002POS001",
  "external_store_id": "SUC002",
  "fixed_amount": true,
  "name": "First POS",
  "store_id": 60030440
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/pos", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "id": 96444399,
    "qr": {
        "image": {{png}},
        "template_document": {{pdf}},
        "template_image": {{image}}
    },
    "status": "active",
    "date_created": "2024-02-09T12:47:05.000-04:00",
    "date_last_updated": "2024-02-09T12:47:05.000-04:00",
    "uuid": {{uuid}},
    "user_id": 123456789,
    "name": "First POS",
    "fixed_amount": true,
    "category": 621102,
    "store_id": "60030440",
    "external_store_id": "SUC002",
    "external_id": "SUC002POS001",
    "site": "MLA",
    "qr_code": {{qr}}
}
#### GET GET POS by ID

**Endpoint:** `https://api.mercadopago.com/pos/:posId`

Check all the information of a Point of Sale with the ID of the POS you want.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
posId
(Required) Id of the POS

Example
GET POS by ID
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/pos/:posId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": 96444399,
    "qr": {
        "image": {{png}},
        "template_document": {{pdf}},
        "template_image": {{image}}
    },
    "status": "active",
    "date_created": "2024-02-09T12:47:05.000-04:00",
    "date_last_updated": "2024-02-09T12:47:05.000-04:00",
    "uuid": {{uuid}},
    "user_id": 123456789,
    "name": "First POS",
    "fixed_amount": true,
    "category": 621102,
    "store_id": "60030440",
    "external_store_id": "SUC002",
    "external_id": "SUC002POS001",
    "site": "MLA",
    "qr_code": {{qr}}
}
#### 📥 GET Search POS by External POS ID

**Endpoint:** `https://api.mercadopago.com/pos?external_id=your_external_pos_id`

Get the information about a specific store though the external POS id

---

Authorization
Bearer Token
Token
{{access_token}}
Query Params
external_id
your_external_pos_id
(Optional) External ID of the POS

external_store_id
(Optional) External ID of the Store

store_id
(Optional) Store ID

Example
Search POS by External POS ID
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/pos?external_id=your_external_pos_id", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "paging": {
        "total": 1,
        "offset": 0,
        "limit": 30
    },
    "results": [
        {
            "user_id": 123456789,
            "name": "First POS",
            "fixed_amount": true,
            "category": 621102,
            "store_id": "60030440",
            "external_id": "SUC002POS001",
            "id": 96444399,
            "qr": {
                 "image": {{png}},
                 "template_document": {{pdf}},
                "template_image": {{image}}
            },
            "date_created": "2024-02-09T12:47:05.000-04:00",
            "date_last_updated": "2024-02-09T12:47:05.000-04:00",
            "external_store_id": "SUC002",
            "qr_code": {{qr}}
        }
    ]
}
#### PUT Update POS

**Endpoint:** `https://api.mercadopago.com/pos/:posId`

Renew the data of a Point of Sale. Indicate the ID of the POS and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
posId
(Required) Id of the POS

Body
raw (json)
```json
{
  "name": "Second POS"
}
Example
Update POS
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "name": "Second POS"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/pos/:posId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": 96444399,
    "qr": {
       "image": {{png}},
        "template_document": {{pdf}},
        "template_image": {{image}}
    },
    "status": "active",
    "date_created": "2024-02-09T12:47:05.000-04:00",
    "date_last_updated": "2024-02-09T12:51:07.000-04:00",
    "uuid": {{uuid}},
    "user_id": 123456789,
    "name": "Second POS",
    "fixed_amount": true,
    "category": 621102,
    "store_id": "60030440",
    "external_id": "SUC002POS001",
    "site": "MLA",
    "qr_code": {{qr}}
}
#### DELETE Delete POS

**Endpoint:** `https://api.mercadopago.com/pos/:posId`

Delete a Point of Sale whenever you need it with the ID of the POS.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
posId
(Required) ID of the POS

Example
DELETE POS
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/pos/:posId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
204 No Content
Response
Body
Headers (0)
No response body
This request doesn't return any response body.
### Orders QR

APIs for transaction flow. Allows you to create, get, cancel or refund an order for QR Codes.

This API allows you to create QR codes con static, dynamic and hybrid modes.

#### POST Create Order QR

**Endpoint:** `https://api.mercadopago.com/v1/orders`

This endpoint allows to create an order for QR Code for payment transactions.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```json
{
  "type": "qr",
  "total_amount": "50.00",
  "description": "Smartphone",
  "external_reference": "your_external_reference",
  "expiration_time": "PT16M",
  "integration_data": {
    "platform_id": "dev_1234567890",
    "integrator_id": "dev_1234" // For certified developers
  },
  "config": {
    "qr": {
      "external_pos_id": "your_external_pos_id",
      "mode": "static" //static - dynamic - hybrid
    }
  },
  "transactions": {
    "payments": [
      {
        "amount": "50.00"
      }
    ]
  },
  "items": [
    {
      "title": "Smartphone",
      "unit_price": "50.00",
      "quantity": 1,
      "unit_measure": "kg",
      "external_code": "777489134"
    }
  ],
  "discounts": {
    "payment_methods": [
      {
        "new_total_amount": "47.28",
        "type": "account_money"
      }
    ]
  },
  "taxes": [ //Field specific for Chile.
    {
      "payer_condition": "payment_taxable_iva"
    }
  ]
}
Example
201 - Create Order QR Static
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n  \"type\": \"qr\",\n  \"total_amount\": \"50.00\",\n  \"description\": \"Smartphone\",\n  \"external_reference\": \"your_external_reference\",\n  \"expiration_time\": \"PT16M\",\n  \"integration_data\": {\n    \"platform_id\": \"dev_1234567890\",\n    \"integrator_id\": \"dev_1234\"\n  },\n  \"config\": {\n    \"qr\": {\n      \"external_pos_id\": \"your_external_pos_id\",\n      \"mode\": \"static\"\n    }\n  },\n  \"transactions\": {\n    \"payments\": [\n      {\n        \"amount\": \"50.00\"\n      }\n    ]\n  },\n  \"items\": [\n    {\n      \"title\": \"Smartphone\",\n      \"unit_price\": \"50.00\",\n      \"quantity\": 1,\n      \"unit_measure\": \"kg\",\n      \"external_code\": \"777489134\"\n    }\n  ],\n  \"discounts\": {\n    \"payment_methods\": [\n      {\n        \"new_total_amount\": \"47.28\",\n        \"type\": \"account_money\"\n      }\n    ]\n  }\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/orders", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (0)
View More
```

{
    "id": "ORDTST01K0EPV4K8S54GADYVVA8WBV8B",
    "type": "qr",
    "processing_mode": "automatic",
    "external_reference": "ext_ref_create_ou_6ubmxrjbqs25",
    "description": "Smartphone",
    "total_amount": "50.00",
    "expiration_time": "PT16M",
    "country_code": "ARG",
    "user_id": "123456789",
    "status": "created",
    "status_detail": "created",
    "currency": "ARS",
    "created_date": "2025-07-18T12:06:17.66Z",
    "last_updated_date": "2025-07-18T12:06:17.66Z",
    "integration_data": {
        "application_id": "12345678912345",
        "integrator_id": "dev_1234",
        "platform_id": "dev_1234567890"
    },
    "transactions": {
        "payments": [
            {
                "id": "PAY01K0EPV4K8S54GADYVVDJ377NH",
                "amount": "50.00",
                "status": "created",
                "status_detail": "ready_to_process"
            }
        ]
    },
    "config": {
        "qr": {
            "external_pos_id": "SUC003POS001",
            "mode": "static"
        }
    },
    "items": [
        {
            "title": "Smartphone",
            "unit_price": "50.00",
            "unit_measure": "kg",
            "external_code": "777489134",
            "quantity": 1
        }
    ],
    "discounts": {
        "payment_methods": [
            {
                "type": "account_money",
                "new_total_amount": "47.28"
            }
        ]
    }
}
#### GET Get Order

**Endpoint:** `https://api.mercadopago.com/v1/orders/:orderId`

Consult all QR Code order information using the ID obtained in the response to its creation

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
orderId
(Required) ID of the order

Example
200 - Get Order - Created
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/orders/:orderId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": "ORDTST01K0EPV4K8S54GADYVVA8WBV8B",
    "type": "qr",
    "processing_mode": "automatic",
    "external_reference": "ext_ref_create_ou_6ubmxrjbqs25",
    "description": "Smartphone",
    "total_amount": "50.00",
    "expiration_time": "PT16M",
    "country_code": "ARG",
    "user_id": "123456789",
    "status": "created",
    "status_detail": "created",
    "currency": "ARS",
    "created_date": "2025-07-18T12:06:17.66Z",
    "last_updated_date": "2025-07-18T12:06:17.66Z",
    "integration_data": {
        "application_id": "12345678912345",
        "integrator_id": "dev_1234",
        "platform_id": "dev_1234567890"
    },
    "transactions": {
        "payments": [
            {
                "id": "PAY01K0EPV4K8S54GADYVVDJ377NH",
                "amount": "50.00",
                "status": "created",
                "status_detail": "ready_to_process"
            }
        ]
    },
    "config": {
        "qr": {
            "external_pos_id": "SUC003POS001",
            "mode": "static"
        }
    },
    "items": [
        {
            "title": "Smartphone",
            "unit_price": "50.00",
            "unit_measure": "kg",
            "external_code": "777489134",
            "quantity": 1
        }
    ],
    "discounts": {
        "payment_methods": [
            {
                "type": "account_money",
                "new_total_amount": "47.28"
            }
        ]
    }
}
#### 📤 POST Cancel Order

**Endpoint:** `https://api.mercadopago.com/v1/orders/:orderId/cancel`

Cancel an order created for Mercado Pago QR Code and all its transactions using the reference ID obtained in the response to its creation.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
orderId
(Required) Order ID to cancel

Example
200 - Cancel Order
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/orders/:orderId/cancel", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": "ORDTST01K0EQRSA7TGGD4D9VM8T0RK2K",
    "type": "qr",
    "processing_mode": "automatic",
    "external_reference": "ext_ref_create_ou_04jh4gcrtskw",
    "description": "Smartphone",
    "total_amount": "50.00",
    "expiration_time": "PT16M",
    "country_code": "ARG",
    "user_id": "123456789",
    "status": "canceled",
    "status_detail": "canceled",
    "currency": "ARS",
    "created_date": "2025-07-18T12:22:28.979Z",
    "last_updated_date": "2025-07-18T12:27:04.102Z",
    "integration_data": {
        "application_id": "12345678912345",
        "integrator_id": "dev_1234",
        "platform_id": "dev_1234567890"
    },
    "transactions": {
        "payments": [
            {
                "id": "PAY01K0EQRSA7TGGD4D9VMC0N450X",
                "amount": "50.00",
                "status": "canceled",
                "status_detail": "canceled_by_api"
            }
        ]
    },
    "config": {
        "qr": {
            "external_pos_id": "SUC003POS001",
            "mode": "dynamic"
        }
    },
    "items": [
        {
            "title": "Smartphone",
            "unit_price": "50.00",
            "unit_measure": "kg",
            "external_code": "777489134",
            "quantity": 1
        }
    ],
    "discounts": {
        "payment_methods": [
            {
                "type": "account_money",
                "new_total_amount": "47.28"
            }
        ]
    },
    "type_response": {
        "qr_data": "{{qr_data}}"
    }
}
#### POST Refund Order

**Endpoint:** `https://api.mercadopago.com/v1/orders/:orderId/refund`

This endpoint allows to create a refund for all the transactions associated with an order for Mercado Pago QR Code. That is, the refund will be issued on the order, so all transactions will be returned. Additionally, only orders with "status=processed" can be refunded. For more information about refunds refer to API Reference.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
orderId
(Required) ID of the order to refund

Example
201 - Refund Order
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/orders/:orderId/refund", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": "ORDTST01K0EQJVZ06T3N2J35JTPQT7XF",
    "status": "processed",
    "status_detail": "accredited",
    "transactions": {
        "refunds": [
            {
                "id": "REF01K0ER96KG4HVXYEMVKHY466K0",
                "transaction_id": "PAY01K0EQJVZ06T3N2J35JWVYN0MD",
                "reference_id": "119030375738",
                "amount": "47.28",
                "status": "processing"
            }
        ]
    }
}
## 💳 Point

Find in this section the required endpoints to integrate Mercado Pago's Point / POS machines with Unified Order APIs.

For more information, refer to the Mercado Pago documentation.

Note____: If you are a platform integrating for multiple merchants, the use of Oauth authentication is required.

To use this collection:

Fork the "Integration" environment.
Find your account's credentials / API Key (Access Token) and set the current value of access_token variable with the corresponding key.
Find you account's user id on the developer panel set the value for "user_id" on the Integration environment. If using Oauth, you will obtain the user id of the account when generating access token on /oauth/token API.
Create a Store and POS with the APIs on this collection.
Turn on your POS machine and vinculate it to the Store and POS previously created. For this step, you will need to login to Mercado Pago's mobile application (Android or iOS) with your account's credentials (or colaborator account) and scan the QR code on the POS machine and follow along the steps indicated on the Mercado Pago's application.
Use the List Terminals API on this collection to get the terminal's ID and set it to the "terminal_id" collection variable.
Use Change operating mode request on this collection to set the machine to PDV mode (integrated).
Restart the terminal
Your machine is ready to test Order flow.

Store & POS Management
Manage (create, update, delete) your Stores and Point of sale (POS) to integrate in-person payments.

Stores
Physical store where your customers can acquire products and services. You can have multiple stores in the same account.

#### 📤 POST Create Store

**Endpoint:** `https://api.mercadopago.com/users/:userId/stores`

Generates a physical store where customers can purchase products or services. You can create more than one store per account.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
userId
{{user_id}}
(Required) ID of the Mercado Pago collector account

Body
raw (json)
View More
```

{
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "external_id": "SUC002",
  "location": {
    "street_number": "0123",
    "street_name": "Example Street Name",
    "city_name": "City name",
    "state_name": "State name",
    "latitude": 27.175193925922862,
    "longitude": 78.04213533235064,
    "reference": "Local"
  },
  "name": "Sucursal Instore"
}
Example
Create Store
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "external_id": "SUC002",
  "location": {
    "street_number": "0123",
    "street_name": "Example Street Name",
    "city_name": "City name",
    "state_name": "State name",
    "latitude": 27.175193925922862,
    "longitude": 78.04213533235064,
    "reference": "Local"
  },
  "name": "Sucursal Instore"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/users/{{user_id}}/stores", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": "60030440",
    "name": "Sucursal Instore",
    "date_creation": "2024-02-09T16:34:06.654Z",
    "business_hours": {
        "monday": [
            {
                "open": "08:00",
                "close": "12:00"
            }
        ],
        "tuesday": [
            {
                "open": "09:00",
                "close": "18:00"
            }
        ]
    },
    "location": {
        "address_line": "Example Street Name 0123, City Name, State Name, Country",
        "reference": "Local",
        "latitude": 27.175193925922862,
        "longitude": 78.04213533235064,
        "id": "AR",
        "type": "country",
        "city": "City Name"
    },
    "external_id": "SUC002"
}
#### 📥 GET GET Store by ID

**Endpoint:** `https://api.mercadopago.com/stores/:storeId`

Check all the information of a physical store with the ID of the store you want.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
storeId
(Required) ID of the store

Example
GET Store by ID
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/stores/:storeId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": "60030440",
    "name": "Sucursal Instore",
    "date_creation": "2024-02-09T16:34:06.654Z",
    "business_hours": {
        "monday": [
            {
                "open": "08:00",
                "close": "12:00"
            }
        ],
        "tuesday": [
            {
                "open": "09:00",
                "close": "18:00"
            }
        ]
    },
    "location": {
        "address_line": "Example Street Name 0123, City Name, State Name, Country",
        "reference": "Local",
        "latitude": 27.175193925922862,
        "longitude": 78.04213533235064,
        "id": "AR",
        "type": "country",
        "city": "City Name"
    },
    "external_id": "SUC002"
}
#### GET Search Store by External_ID

**Endpoint:** `https://api.mercadopago.com/users/:userId/stores/search?external_id=`

Find all the information of the stores generated through the specific external id sent when creating the store.

---

Authorization
Bearer Token
Token
{{access_token}}
Query Params
external_id
(Required) External ID of the store

Path Variables
userId
{{user_id}}
(Required) ID of the Mercado Pago collector account

Example
Search Store by External_ID
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/users/{{user_id}}/stores/search?external_id=", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "paging": {
        "total": 1,
        "offset": 0,
        "limit": 0
    },
    "results": [
        {
            "id": "60030440",
            "name": "Sucursal Instore",
            "date_creation": "2024-02-09T16:34:06.654Z",
            "business_hours": {
                "monday": [
                    {
                        "open": "08:00",
                        "close": "12:00"
                    }
                ],
                "tuesday": [
                    {
                        "open": "09:00",
                        "close": "18:00"
                    }
                ]
            },
            "location": {
                "address_line": "Example Street Name 0123, City Name, State Name, Country",
                "reference": "Local",
                "latitude": 27.175193925922862,
                "longitude": 78.04213533235064,
                "id": "AR",
                "type": "country",
                "city": "City Name"
            },
            "external_id": "SUC002"
        }
    ]
}
#### ✏️ PUT Update Store

**Endpoint:** `https://api.mercadopago.com/users/:userId/stores/:storeId`

Renew the data of a physical shop. Indicate the ID of the collector account and the store and send the parameters with the information you want to update.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
userId
{{user_id}}
(Required) ID of the Mercado Pago collector account

storeId
(Required) ID of the store

Body
raw (json)
View More
```

{
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "external_id": "SUC002",
    "location": {
        "address_line": "Example Street Name 0123, City Name, State Name, Country",
        "reference": "Local",
        "latitude": 27.175193925922862,
        "longitude": 78.04213533235064,
        "id": "AR",
        "type": "country",
        "city": "City Name"
    },
  "name": "Sucursal Instore 2"
}
Example
Update Store
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "business_hours": {
    "monday": [
      {
        "open": "08:00",
        "close": "12:00"
      }
    ],
    "tuesday": [
      {
        "open": "09:00",
        "close": "18:00"
      }
    ]
  },
  "location": {
    "street_number": "0123",
    "street_name": "Example Street Name",
    "city_name": "City name",
    "state_name": "State name",
    "latitude": 27.175193925922862,
    "longitude": 78.04213533235064,
    "reference": "Local"
  },
  "name": "Sucursal Instore"
});

const requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/users/{{user_id}}/stores/:storeId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": "60030440",
    "name": "Sucursal Instore",
    "date_creation": "2024-02-09T16:34:06.654Z",
    "business_hours": {
        "monday": [
            {
                "open": "08:00",
                "close": "12:00"
            }
        ],
        "tuesday": [
            {
                "open": "09:00",
                "close": "18:00"
            }
        ]
    },
    "location": {
        "address_line": "Example Street Name 0123, City Name, State Name, Country",
        "reference": "Local",
        "latitude": 27.175193925922862,
        "longitude": 78.04213533235064,
        "id": "AR",
        "type": "country",
        "city": "City Name"
    },
    "external_id": "SUC002"
}
#### 🗑️ DELETE Delete Store

**Endpoint:** `https://api.mercadopago.com/users/:userId/stores/:storeId`

Delete a physical shop whenever you need it with the ID of the store.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
userId
{{user_id}}
(Required) ID of the Mercado Pago collector account

storeId
(Required) ID of the store

Example
Delete Store
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/users/{{user_id}}/stores/:storeId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
```

{
    "store": 60030440,
    "user": 123456789
}
POS
A point of sale that exists in a branch or physical store. Each Store can have more than one POS.

#### POST Create POS

**Endpoint:** `https://api.mercadopago.com/pos`

Generate a Point of Sale in a store. Each POS will have a unique QR Code linked to it.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
```json
{
  "category": 621102,
  "external_id": "your_external_pos_id",
  "external_store_id": "",
  "fixed_amount": true,
  "name": "First POS1",
  "store_id": 
}
Example
Create POS
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "category": 621102,
  "external_id": "SUC002POS001",
  "external_store_id": "SUC002",
  "fixed_amount": true,
  "name": "First POS",
  "store_id": 60030440
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/pos", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```

{
    "id": 96444399,
    "qr": {
        "image": {{png}},
        "template_document": {{pdf}},
        "template_image": {{image}}
    },
    "status": "active",
    "date_created": "2024-02-09T12:47:05.000-04:00",
    "date_last_updated": "2024-02-09T12:47:05.000-04:00",
    "uuid": {{uuid}},
    "user_id": 123456789,
    "name": "First POS",
    "fixed_amount": true,
    "category": 621102,
    "store_id": "60030440",
    "external_store_id": "SUC002",
    "external_id": "SUC002POS001",
    "site": "MLA",
    "qr_code": {{qr}}
}
#### GET GET POS by ID

**Endpoint:** `https://api.mercadopago.com/pos/:posId`

Check all the information of a Point of Sale with the ID of the POS you want.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
posId
(Required) Id of the POS

Example
GET POS by ID
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/pos/:posId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "id": 96444399,
    "qr": {
        "image": {{png}},
        "template_document": {{pdf}},
        "template_image": {{image}}
    },
    "status": "active",
    "date_created": "2024-02-09T12:47:05.000-04:00",
    "date_last_updated": "2024-02-09T12:47:05.000-04:00",
    "uuid": {{uuid}},
    "user_id": 123456789,
    "name": "First POS",
    "fixed_amount": true,
    "category": 621102,
    "store_id": "60030440",
    "external_store_id": "SUC002",
    "external_id": "SUC002POS001",
    "site": "MLA",
    "qr_code": {{qr}}
}
#### 📥 GET Search POS by External POS ID

**Endpoint:** `https://api.mercadopago.com/pos?external_id=your_external_pos_id`

Get the information about a specific store though the external POS id

---

Authorization
Bearer Token
Token
{{access_token}}
Query Params
external_id
your_external_pos_id
(Optional) External ID of the POS

external_store_id
(Optional) External ID of the Store

store_id
(Optional) Store ID

Example
Search POS by External POS ID
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/pos?external_id=your_external_pos_id", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "paging": {
        "total": 1,
        "offset": 0,
        "limit": 30
    },
    "results": [
        {
            "user_id": 123456789,
            "name": "First POS",
            "fixed_amount": true,
            "category": 621102,
            "store_id": "60030440",
            "external_id": "SUC002POS001",
            "id": 96444399,
            "qr": {
                 "image": {{png}},
                 "template_document": {{pdf}},
                "template_image": {{image}}
            },
            "date_created": "2024-02-09T12:47:05.000-04:00",
            "date_last_updated": "2024-02-09T12:47:05.000-04:00",
            "external_store_id": "SUC002",
            "qr_code": {{qr}}
        }
    ]
}
Terminals
Interact with your account's terminals. List the terminals vinculated to your account, filter by pos or store id and get the Terminal ID to start the order flow. Change operation mode.

#### GET List of terminals

**Endpoint:** `https://api.mercadopago.com/terminals/v1/list`

This endpoint allows you to obtain a list of the Point terminals associated with your account, with the information corresponding to their respective point of sale, store, and operating mode.

---

In case of success, the request will return a response with status 200.

Authorization
Bearer Token
Token
{{access_token}}
Query Params
pos_id
(Optional) It's the device POS identifier, that you should send only if you want to filter the available devices by POS.

store_id
(Optional) It's the store identifier, that you should send only if you want to filter the available devices by store.

limit
(Optional) Pagination limit. This parameter specifies the maximum number of records you want to get in the response. It must be a numeric value, greater than or equal to 1 and less than or equal to 50. The default value is 50.

offset
(Optional) Pagination offset. This parameter determines the starting point from which the records should be obtained. It must be a numerical value greater than or equal to zero (0). Its default value is zero (0).

Example
List Terminals
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/terminals/v1/list", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```json
{
    "data": {
        "terminals": [
            {
                "id": "PAX_A910__SMARTPOS1234345545",
                "pos_id": 110326956,
                "store_id": "67895816",
                "external_pos_id": "",
                "operating_mode": "STANDALONE"
            }
        ]
    },
    "paging": {
        "total": 1,
        "limit": 50,
        "offset": 0
    }
}
#### 📝 PATCH Change operating mode

**Endpoint:** `https://api.mercadopago.com/terminals/v1/setup`

This endpoint allows you to change the terminal operating mode.

---

The avaibale operating modes are:

PDV: Point of Sale (POS) operating mode. It's when the terminal is integrated with the API.

STANDALONE: Default terminal configuration. It's when the terminal is not integrated with the API.

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
```

{
    "terminals": [
        {
            "id": "PAX_A910__SMARTPOS1234345545",
            "operating_mode": "PDV"
        }
    ]
}
Example
Change operating mode - 201
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "terminals": [
    {
      "id": "PAX_A910__SMARTPOS1234345545",
      "operating_mode": "PDV"
    }
  ]
});

const requestOptions = {
  method: "PATCH",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/terminals/v1/setup", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
```json
{
    "terminals": [
        {
            "id": "PAX_A910__SMARTPOS1234345545",
            "operating_mode": "PDV"
        }
    ]
}
### Orders

APIs for transaction flow. Allows you to create, get, cancel or refund an order.

#### 📤 POST Create Order

**Endpoint:** `https://api.mercadopago.com/v1/orders`

This endpoint allows to create an order for Mercado Pago Point for payment transactions.

---

Authorization
Bearer Token
Token
{{access_token}}
Body
raw (json)
View More
```

{
    "type": "point",
    "external_reference": "your_external_reference",
    "expiration_time": "PT2M",
    "transactions": {
        "payments": [
            {
                "amount": "130.00" //Chile does not support decimals. All other sites, two decimals are required
            }
        ]
    },
    "config": {
        "point": {
            "terminal_id": "PAX_A910__SMARTPOS1234345545",
            "print_on_terminal": "seller_ticket"
        },
        "payment_method": {
            "default_type": "credit_card"
        }
    },
    "description": "Point OU description pago your_external_reference",
    "integration_data": {
        "platform_id": "1234567890", 
        "integrator_id": "dev_1234567890" //For Certified Developers
    },
    "taxes": [ // Field exclusive for Chile, contains information about VAT.
        {
            "payer_condition": "payment_taxable_iva"
        }
    ]
}
Example
Create Order
Request
View More
JavaScript - Fetch
const myHeaders = new Headers();
myHeaders.append("X-Idempotency-Key", "Idempotency_Value");

const raw = "{\n    \"type\": \"point\",\n    \"external_reference\": \"ext_ref_create_ou_sm0d44zq6h6k\",\n    \"expiration_time\": \"PT2M\",\n    \"transactions\": {\n        \"payments\": [\n            {\n                \"amount\": \"130.00\" //Chile does not support decimals. All other sites, two decimals are required\n            }\n        ]\n    },\n    \"config\": {\n        \"point\": {\n            \"terminal_id\": \"NEWLAND_N950__N950NCB123\",\n            \"print_on_terminal\": \"seller_ticket\"\n        },\n        \"payment_method\": {\n            \"default_type\": \"credit_card\"\n        }\n    },\n    \"description\": \"Point OU description pago ext_ref_create_ou_sm0d44zq6h6k\",\n    \"integration_data\": {\n        \"platform_id\": \"1234567890\", \n        \"integrator_id\": \"dev_1234567890\" //For Certified Developers\n    },\n    \"taxes\": [ // Field exclusive for Chile, contains information about VAT.\n        {\n            \"payer_condition\": \"payment_taxable_iva\"\n        }\n    ]\n}";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/orders", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
201 Created
Response
Body
Headers (1)
View More
```json
{
    "id": "ORDTST01KC4DA9CEY9H33G3ENMJ2PSYR",
    "type": "point",
    "processing_mode": "automatic",
    "external_reference": "ext_ref_create_ou_sm0d44zq6h6k",
    "description": "Point OU description pago ext_ref_create_ou_sm0d44zq6h6k",
    "expiration_time": "PT2M",
    "country_code": "ARG",
    "user_id": "123456789",
    "status": "created",
    "status_detail": "created",
    "currency": "ARS",
    "created_date": "2025-12-10T15:15:45.393Z",
    "last_updated_date": "2025-12-10T15:15:45.393Z",
    "integration_data": {
        "application_id": "1234567890",
        "integrator_id": "dev_1234567890",
        "platform_id": "1234567890"
    },
    "config": {
        "point": {
            "terminal_id": "NEWLAND_N950__N950NCB123",
            "print_on_terminal": "seller_ticket"
        },
        "payment_method": {
            "default_type": "credit_card"
        }
    },
    "transactions": {
        "payments": [
            {
                "id": "PAY01KC4DA9CEY9H33G3ENPK0RVVB",
                "amount": "130.00",
                "status": "created"
            }
        ]
    }
}
#### 📥 GET Get Order

**Endpoint:** `https://api.mercadopago.com/v1/orders/:orderId`

Consult all order information using the ID obtained in the response to its creation.

---

Authorization
Bearer Token
Token
{{access_token}}
Path Variables
orderId
(Required) ID of the order

Example
Get Order
Request
JavaScript - Fetch
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://api.mercadopago.com/v1/orders/:orderId", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
200 OK
Response
Body
Headers (1)
View More
```

{
    "id": "ORD01JSYD7XEZ2371TTHHMT5BWWTG",
    "type": "point",
    "processing_mode": "automatic",
    "external_reference": "ext_ref_create_ou_bvw0xiy5fjcr",
    "description": "Point OU description pago ext_ref_create_ou_bvw0xiy5fjcr",
    "country_code": "ARG",
    "user_id": "1117105806",
    "status": "created",
    "status_detail": "created",
    "created_date": "2025-04-28T14:36:28.223Z",
    "last_updated_date": "2025-04-28T14:36:28.223Z",
    "integration_data": {
        "application_id": "3716133738897248",
        "integrator_id": "dev_1234567890",
        "platform_id": "1234567890"
    },
    "transactions": {
        "payments": [
            {
                "id": "PAY01JSYD7XEZ2371TTHHMVWYJYG6",
                "amount": "130.00",
                "status": "created"
            }
        ]
    },
    "config": {
        "point": {
            "terminal_id": "PAX_A910__SMARTPOS1234345545",
            "print_on_terminal": "seller_ticket"
        },
        "payment_method": {
            "default_type": "credit_card"
        }
    }
}
LINK
Connect URL
https://auth.mercadopago.com/authorization?client_id={{application_id}}&response_type=code&platform_id=mp&redirect_uri={{redirect_uri}}&state=
The URL you will need to redirect the client to in order to complete the authorization process.

Query Params
client_id
{{application_id}}
(Required) Id of the application to receive permits

response_type
code
(Required) Always "code"

platform_id
mp
(Required) Always "mp"

redirect_uri
{{redirect_uri}}
(Required) Redirect URL set in the application

state
(Optional) Code to identify connection trial

#### POST Generate Access Token

**Endpoint:** `https://api.mercadopago.com/oauth/token`

To create the necessary token to operate your application in the name of a seller.

---

Body
urlencoded
client_secret
{{client_secret}}
(Required) Client Secret of the Oauth recipient

grant_type
authorization_code
(Required) Always "authorization_code" when generating token

redirect_uri
{{redirect_uri}}
(Required) Redirect URL of the application

code
(Required) Temporal grant received in the redirect url in an Oauth process

client_id
{{application_id}}
(Required) Application ID of the Oauth recepient

test_token
true
(Optional) Send in case of testing

#### POST Refresh Access Token

**Endpoint:** `https://api.mercadopago.com/oauth/token`

To refresh the necessary token to operate your application in the name of a seller.

---

Body
urlencoded
client_secret
{{client_secret}}
(Required) Client Secret of Oauth recepient

refresh_token
{{seller_refresh_token}}
(Required) Refresh token associated with an Oauth vinculation

grant_type
refresh_token
(Required) Always "refresh_token" when refreshing credentials

