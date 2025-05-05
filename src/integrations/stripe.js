export default {
    "name": "Stripe",
    "slug": "stripe",
    "version": "1.0.0",
    "shortDescription": "Access Stripe API solutions",
    "description": "Stripe integration for WeWeb that provides comprehensive access to the Stripe platform including payment processing, customer management, subscriptions, products, and pricing.",
    "svgLogo": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"76.57\" height=\"32\" viewBox=\"0 0 512 214\"><!-- Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt --><path fill=\"#635BFF\" d=\"M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774\"/></svg>",
    "secrets": [
        {
            "name": "STRIPE_SECRET_KEY",
            "description": "Your Stripe Secret Key"
        },
        {
            "name": "STRIPE_WEBHOOK_SECRET",
            "description": "Your Stripe Webhook Secret for verifying webhook signatures"
        }
    ],
    "methods": {
        "create_payment_intent": {
            "name": "Create Payment Intent",
            "description": "Creates a PaymentIntent for collecting payment from a customer.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount intended to be collected (in smallest currency unit)"
                },
                {
                    "name": "currency",
                    "type": "string",
                    "required": true,
                    "description": "Three-letter ISO currency code"
                },
                {
                    "name": "customer",
                    "type": "string",
                    "required": false,
                    "description": "ID of the customer this PaymentIntent belongs to"
                },
                {
                    "name": "payment_method_types",
                    "type": "array",
                    "required": false,
                    "description": "List of payment method types that this PaymentIntent is allowed to use"
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "Description of the payment intent"
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the PaymentIntent"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the PaymentIntent"
                },
                {
                    "name": "client_secret",
                    "type": "string",
                    "required": true,
                    "description": "Client secret used to initialize payment on the client"
                }
            ]
        },
        "get_payment_intent": {
            "name": "Get Payment Intent",
            "description": "Retrieves a PaymentIntent by its ID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the PaymentIntent to retrieve"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the PaymentIntent"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the PaymentIntent"
                },
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount intended to be collected"
                },
                {
                    "name": "currency",
                    "type": "string",
                    "required": true,
                    "description": "Three-letter ISO currency code"
                }
            ]
        },
        "create_customer": {
            "name": "Create Customer",
            "description": "Creates a new customer in Stripe.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "email",
                    "type": "string",
                    "required": false,
                    "description": "Customer's email address"
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "Customer's full name"
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "Description of the customer"
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the customer"
                },
                {
                    "name": "email",
                    "type": "string",
                    "required": false,
                    "description": "Customer's email address"
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "Customer's full name"
                }
            ]
        },
        "get_customer": {
            "name": "Get Customer",
            "description": "Retrieves a customer by their ID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the customer to retrieve"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the customer"
                },
                {
                    "name": "email",
                    "type": "string",
                    "required": false,
                    "description": "Customer's email address"
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "Customer's full name"
                }
            ]
        },
        "update_customer": {
            "name": "Update Customer",
            "description": "Updates a customer's information.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the customer to update"
                },
                {
                    "name": "email",
                    "type": "string",
                    "required": false,
                    "description": "Customer's email address"
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "Customer's full name"
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "Description of the customer"
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the customer"
                },
                {
                    "name": "email",
                    "type": "string",
                    "required": false,
                    "description": "Customer's email address"
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "Customer's full name"
                }
            ]
        },
        "create_subscription": {
            "name": "Create Subscription",
            "description": "Creates a new subscription for a customer.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "customer",
                    "type": "string",
                    "required": true,
                    "description": "ID of the customer to subscribe"
                },
                {
                    "name": "items",
                    "type": "array",
                    "required": true,
                    "description": "List of prices and quantities for the subscription"
                },
                {
                    "name": "trial_period_days",
                    "type": "number",
                    "required": false,
                    "description": "Number of trial period days"
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the subscription"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the subscription"
                },
                {
                    "name": "current_period_end",
                    "type": "number",
                    "required": true,
                    "description": "End of the current period (Unix timestamp)"
                }
            ]
        },
        "get_subscription": {
            "name": "Get Subscription",
            "description": "Retrieves a subscription by its ID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the subscription to retrieve"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the subscription"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the subscription"
                },
                {
                    "name": "current_period_end",
                    "type": "number",
                    "required": true,
                    "description": "End of the current period (Unix timestamp)"
                }
            ]
        },
        "update_subscription": {
            "name": "Update Subscription",
            "description": "Updates a subscription.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the subscription to update"
                },
                {
                    "name": "items",
                    "type": "array",
                    "required": false,
                    "description": "List of prices and quantities for the subscription"
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the subscription"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the subscription"
                },
                {
                    "name": "current_period_end",
                    "type": "number",
                    "required": true,
                    "description": "End of the current period (Unix timestamp)"
                }
            ]
        },
        "create_product": {
            "name": "Create Product",
            "description": "Creates a new product in Stripe.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "Product name"
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "Product description"
                },
                {
                    "name": "active",
                    "type": "boolean",
                    "required": false,
                    "description": "Whether the product is currently available for purchase"
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the product"
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "Product name"
                },
                {
                    "name": "active",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the product is currently available"
                }
            ]
        },
        "create_price": {
            "name": "Create Price",
            "description": "Creates a new price for a product.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "product",
                    "type": "string",
                    "required": true,
                    "description": "ID of the product this price belongs to"
                },
                {
                    "name": "unit_amount",
                    "type": "number",
                    "required": true,
                    "description": "The unit amount in cents to be charged"
                },
                {
                    "name": "currency",
                    "type": "string",
                    "required": true,
                    "description": "Three-letter ISO currency code"
                },
                {
                    "name": "recurring",
                    "type": "object",
                    "required": false,
                    "description": "The recurring components of a price"
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the price"
                },
                {
                    "name": "product",
                    "type": "string",
                    "required": true,
                    "description": "ID of the product this price belongs to"
                },
                {
                    "name": "active",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the price is currently available"
                }
            ]
        },
        "create_refund": {
            "name": "Create Refund",
            "description": "Creates a refund for a charge.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "charge",
                    "type": "string",
                    "required": true,
                    "description": "ID of the charge to refund"
                },
                {
                    "name": "amount",
                    "type": "number",
                    "required": false,
                    "description": "Amount to refund in cents"
                },
                {
                    "name": "reason",
                    "type": "string",
                    "required": false,
                    "description": "Reason for the refund"
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the refund"
                },
                {
                    "name": "charge",
                    "type": "string",
                    "required": true,
                    "description": "ID of the charge that was refunded"
                },
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount refunded in cents"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the refund"
                }
            ]
        },
        "list_customers": {
            "name": "List Customers",
            "description": "Returns a list of customers.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of customers",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the customer"
                        },
                        {
                            "name": "email",
                            "type": "string",
                            "required": false,
                            "description": "Customer's email address"
                        },
                        {
                            "name": "name",
                            "type": "string",
                            "required": false,
                            "description": "Customer's full name"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more customers available"
                }
            ]
        },
        "list_subscriptions": {
            "name": "List Subscriptions",
            "description": "Returns a list of subscriptions.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                },
                {
                    "name": "customer",
                    "type": "string",
                    "required": false,
                    "description": "Filter by customer ID"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of subscriptions",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the subscription"
                        },
                        {
                            "name": "status",
                            "type": "string",
                            "required": true,
                            "description": "Status of the subscription"
                        },
                        {
                            "name": "current_period_end",
                            "type": "number",
                            "required": true,
                            "description": "End of the current period (Unix timestamp)"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more subscriptions available"
                }
            ]
        },
        "list_products": {
            "name": "List Products",
            "description": "Returns a list of products.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                },
                {
                    "name": "active",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by active status"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of products",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the product"
                        },
                        {
                            "name": "name",
                            "type": "string",
                            "required": true,
                            "description": "Product name"
                        },
                        {
                            "name": "active",
                            "type": "boolean",
                            "required": true,
                            "description": "Whether the product is currently available"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more products available"
                }
            ]
        },
        "list_prices": {
            "name": "List Prices",
            "description": "Returns a list of prices.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                },
                {
                    "name": "active",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by active status"
                },
                {
                    "name": "product",
                    "type": "string",
                    "required": false,
                    "description": "Filter by product ID"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of prices",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the price"
                        },
                        {
                            "name": "product",
                            "type": "string",
                            "required": true,
                            "description": "ID of the product this price belongs to"
                        },
                        {
                            "name": "active",
                            "type": "boolean",
                            "required": true,
                            "description": "Whether the price is currently available"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more prices available"
                }
            ]
        },
        "create_payment_method": {
            "name": "Create Payment Method",
            "description": "Creates a new payment method that can be attached to a customer.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "type",
                    "type": "string",
                    "required": true,
                    "description": "The type of payment method (e.g., 'card', 'sepa_debit', etc.)"
                },
                {
                    "name": "card",
                    "type": "object",
                    "required": false,
                    "description": "Card details if type is 'card'"
                },
                {
                    "name": "billing_details",
                    "type": "object",
                    "required": false,
                    "description": "Billing details associated with the payment method"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the payment method"
                },
                {
                    "name": "type",
                    "type": "string",
                    "required": true,
                    "description": "The type of payment method"
                },
                {
                    "name": "customer",
                    "type": "string",
                    "required": false,
                    "description": "The customer this payment method is attached to"
                }
            ]
        },
        "attach_payment_method": {
            "name": "Attach Payment Method",
            "description": "Attaches a payment method to a customer.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "paymentMethodId",
                    "type": "string",
                    "required": true,
                    "description": "ID of the payment method to attach"
                },
                {
                    "name": "customerId",
                    "type": "string",
                    "required": true,
                    "description": "ID of the customer to attach the payment method to"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the payment method"
                },
                {
                    "name": "customer",
                    "type": "string",
                    "required": true,
                    "description": "The customer this payment method is now attached to"
                }
            ]
        },
        "list_payment_methods": {
            "name": "List Payment Methods",
            "description": "Lists payment methods for a customer.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "customerId",
                    "type": "string",
                    "required": true,
                    "description": "ID of the customer whose payment methods to list"
                },
                {
                    "name": "type",
                    "type": "string",
                    "required": false,
                    "description": "Filter payment methods by type"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of payment methods",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the payment method"
                        },
                        {
                            "name": "type",
                            "type": "string",
                            "required": true,
                            "description": "The type of payment method"
                        },
                        {
                            "name": "customer",
                            "type": "string",
                            "required": true,
                            "description": "The customer this payment method belongs to"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more payment methods available"
                }
            ]
        },
        "create_setup_intent": {
            "name": "Create Setup Intent",
            "description": "Creates a SetupIntent for saving payment methods.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "customer",
                    "type": "string",
                    "required": false,
                    "description": "ID of the customer this SetupIntent belongs to"
                },
                {
                    "name": "payment_method_types",
                    "type": "array",
                    "required": false,
                    "description": "List of payment method types that this SetupIntent is allowed to set up"
                },
                {
                    "name": "usage",
                    "type": "string",
                    "required": false,
                    "description": "The usage of the payment method being set up ('on_session' or 'off_session')"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the setup intent"
                },
                {
                    "name": "client_secret",
                    "type": "string",
                    "required": true,
                    "description": "Client secret used to complete the setup"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the setup intent"
                }
            ]
        },
        "create_charge": {
            "name": "Create Charge",
            "description": "Creates a new charge on a customer's card.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount to charge in smallest currency unit"
                },
                {
                    "name": "currency",
                    "type": "string",
                    "required": true,
                    "description": "Three-letter ISO currency code"
                },
                {
                    "name": "customer",
                    "type": "string",
                    "required": false,
                    "description": "ID of the customer to charge"
                },
                {
                    "name": "source",
                    "type": "string",
                    "required": false,
                    "description": "Source to use for this charge"
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "Description of the charge"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the charge"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the charge"
                },
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount charged in smallest currency unit"
                }
            ]
        },
        "get_charge": {
            "name": "Get Charge",
            "description": "Retrieves a charge by its ID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the charge to retrieve"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the charge"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the charge"
                },
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount charged in smallest currency unit"
                }
            ]
        },
        "list_charges": {
            "name": "List Charges",
            "description": "Returns a list of charges.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                },
                {
                    "name": "customer",
                    "type": "string",
                    "required": false,
                    "description": "Only return charges for a specific customer"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of charges",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the charge"
                        },
                        {
                            "name": "status",
                            "type": "string",
                            "required": true,
                            "description": "Status of the charge"
                        },
                        {
                            "name": "amount",
                            "type": "number",
                            "required": true,
                            "description": "Amount charged in smallest currency unit"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more charges available"
                }
            ]
        },
        "create_tax_rate": {
            "name": "Create Tax Rate",
            "description": "Creates a new tax rate.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "display_name",
                    "type": "string",
                    "required": true,
                    "description": "Display name of the tax rate"
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "Description of the tax rate"
                },
                {
                    "name": "percentage",
                    "type": "number",
                    "required": true,
                    "description": "Tax rate percentage"
                },
                {
                    "name": "inclusive",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the tax rate is inclusive or exclusive"
                },
                {
                    "name": "jurisdiction",
                    "type": "string",
                    "required": false,
                    "description": "Jurisdiction for the tax rate"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the tax rate"
                },
                {
                    "name": "display_name",
                    "type": "string",
                    "required": true,
                    "description": "Display name of the tax rate"
                },
                {
                    "name": "percentage",
                    "type": "number",
                    "required": true,
                    "description": "Tax rate percentage"
                }
            ]
        },
        "list_tax_rates": {
            "name": "List Tax Rates",
            "description": "Returns a list of tax rates.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                },
                {
                    "name": "active",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by active status"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of tax rates",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the tax rate"
                        },
                        {
                            "name": "display_name",
                            "type": "string",
                            "required": true,
                            "description": "Display name of the tax rate"
                        },
                        {
                            "name": "percentage",
                            "type": "number",
                            "required": true,
                            "description": "Tax rate percentage"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more tax rates available"
                }
            ]
        },
        "create_webhook_endpoint": {
            "name": "Create Webhook Endpoint",
            "description": "Creates a webhook endpoint for receiving events from Stripe.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "The URL of the webhook endpoint"
                },
                {
                    "name": "enabled_events",
                    "type": "array",
                    "required": true,
                    "description": "List of events to enable for this endpoint"
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "Description of the webhook endpoint"
                },
                {
                    "name": "connect",
                    "type": "boolean",
                    "required": false,
                    "description": "Whether this endpoint should receive events from connected accounts"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the webhook endpoint"
                },
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "The URL of the webhook endpoint"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the webhook endpoint"
                },
                {
                    "name": "secret",
                    "type": "string",
                    "required": true,
                    "description": "The endpoint's secret, used to verify received events"
                }
            ]
        },
        "list_webhook_endpoints": {
            "name": "List Webhook Endpoints",
            "description": "Returns a list of webhook endpoints.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of webhook endpoints",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the webhook endpoint"
                        },
                        {
                            "name": "url",
                            "type": "string",
                            "required": true,
                            "description": "The URL of the webhook endpoint"
                        },
                        {
                            "name": "status",
                            "type": "string",
                            "required": true,
                            "description": "Status of the webhook endpoint"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more webhook endpoints available"
                }
            ]
        },
        "delete_webhook_endpoint": {
            "name": "Delete Webhook Endpoint",
            "description": "Deletes a webhook endpoint.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the webhook endpoint to delete"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the deleted webhook endpoint"
                },
                {
                    "name": "deleted",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the webhook endpoint was successfully deleted"
                }
            ]
        },
        "get_balance_transaction": {
            "name": "Get Balance Transaction",
            "description": "Retrieves a balance transaction.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the balance transaction to retrieve"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the balance transaction"
                },
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "The amount of the transaction"
                },
                {
                    "name": "currency",
                    "type": "string",
                    "required": true,
                    "description": "Three-letter ISO currency code"
                },
                {
                    "name": "type",
                    "type": "string",
                    "required": true,
                    "description": "Type of the balance transaction"
                }
            ]
        },
        "list_balance_transactions": {
            "name": "List Balance Transactions",
            "description": "Returns a list of balance transactions.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                },
                {
                    "name": "type",
                    "type": "string",
                    "required": false,
                    "description": "Only return transactions of this type"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of balance transactions",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the balance transaction"
                        },
                        {
                            "name": "amount",
                            "type": "number",
                            "required": true,
                            "description": "The amount of the transaction"
                        },
                        {
                            "name": "currency",
                            "type": "string",
                            "required": true,
                            "description": "Three-letter ISO currency code"
                        },
                        {
                            "name": "type",
                            "type": "string",
                            "required": true,
                            "description": "Type of the balance transaction"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more balance transactions available"
                }
            ]
        },
        "create_transfer": {
            "name": "Create Transfer",
            "description": "Creates a new transfer to a connected account.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount to transfer in smallest currency unit"
                },
                {
                    "name": "currency",
                    "type": "string",
                    "required": true,
                    "description": "Three-letter ISO currency code"
                },
                {
                    "name": "destination",
                    "type": "string",
                    "required": true,
                    "description": "ID of the connected account to transfer to"
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "Description of the transfer"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the transfer"
                },
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount transferred in smallest currency unit"
                },
                {
                    "name": "currency",
                    "type": "string",
                    "required": true,
                    "description": "Three-letter ISO currency code"
                }
            ]
        },
        "get_transfer": {
            "name": "Get Transfer",
            "description": "Retrieves a transfer by its ID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the transfer to retrieve"
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the transfer"
                },
                {
                    "name": "amount",
                    "type": "number",
                    "required": true,
                    "description": "Amount transferred in smallest currency unit"
                },
                {
                    "name": "currency",
                    "type": "string",
                    "required": true,
                    "description": "Three-letter ISO currency code"
                }
            ]
        },
        "list_transfers": {
            "name": "List Transfers",
            "description": "Returns a list of transfers.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of objects to be returned"
                },
                {
                    "name": "starting_after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination"
                },
                {
                    "name": "destination",
                    "type": "string",
                    "required": false,
                    "description": "Only return transfers to this connected account"
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of transfers",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the transfer"
                        },
                        {
                            "name": "amount",
                            "type": "number",
                            "required": true,
                            "description": "Amount transferred in smallest currency unit"
                        },
                        {
                            "name": "currency",
                            "type": "string",
                            "required": true,
                            "description": "Three-letter ISO currency code"
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more transfers available"
                }
            ]
        }
    }
}