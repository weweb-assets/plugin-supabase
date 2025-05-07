export default {
    "name": "Resend",
    "slug": "resend",
    "version": "0.1.29",
    "shortDescription": "Access Resend API solutions",
    "description": "Resend integration for WeWeb that provides a robust email sending service with features like transactional emails, HTML template support, attachments, and tracking capabilities.",
    "svgLogo": "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"186 154 244 293.47\"> <path d=\"M186 447.471V154H318.062C336.788 154 353.697 158.053 368.79 166.158C384.163 174.263 396.181 185.443 404.845 199.698C413.51 213.672 417.842 229.604 417.842 247.491C417.842 265.938 413.51 282.568 404.845 297.381C396.181 311.915 384.302 323.375 369.209 331.759C354.117 340.144 337.067 344.337 318.062 344.337H253.917V447.471H186ZM348.667 447.471L274.041 314.99L346.99 304.509L430 447.471H348.667ZM253.917 289.835H311.773C319.04 289.835 325.329 288.298 330.639 285.223C336.229 281.869 340.421 277.258 343.216 271.388C346.291 265.519 347.828 258.811 347.828 251.265C347.828 243.718 346.151 237.15 342.797 231.56C339.443 225.691 334.552 221.219 328.124 218.144C321.975 215.07 314.428 213.533 305.484 213.533H253.917V289.835Z\" fill=\"black\"></path> <script xmlns=\"\"></script></svg>",
    "secrets": [
        {
            "name": "RESEND_API_KEY",
            "description": "Your Resend API Key"
        }
    ],
    "methods": {
        "send_email": {
            "name": "Send Email",
            "description": "Send an email through Resend API.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "from",
                    "type": "string",
                    "required": true,
                    "description": "The sender's email address. Must be a domain you've verified with Resend."
                },
                {
                    "name": "to",
                    "type": [
                        "string",
                        "array"
                    ],
                    "required": true,
                    "description": "The recipient's email address or array of addresses."
                },
                {
                    "name": "cc",
                    "type": [
                        "string",
                        "array"
                    ],
                    "required": false,
                    "description": "The carbon copy email address or array of addresses."
                },
                {
                    "name": "bcc",
                    "type": [
                        "string",
                        "array"
                    ],
                    "required": false,
                    "description": "The blind carbon copy email address or array of addresses."
                },
                {
                    "name": "reply_to",
                    "type": "string",
                    "required": false,
                    "description": "The email address for recipients to reply to."
                },
                {
                    "name": "subject",
                    "type": "string",
                    "required": true,
                    "description": "The subject of the email."
                },
                {
                    "name": "text",
                    "type": "string",
                    "required": false,
                    "description": "The plain text content of the email. Required if html is not provided."
                },
                {
                    "name": "html",
                    "type": "string",
                    "required": false,
                    "description": "The HTML content of the email. Required if text is not provided."
                },
                {
                    "name": "attachments",
                    "type": "array",
                    "required": false,
                    "description": "Array of attachments to include in the email. Each attachment should have filename, content (base64 encoded) and contentType."
                },
                {
                    "name": "tags",
                    "type": "array",
                    "required": false,
                    "description": "Array of tags to categorize the email. Each tag should have name and value properties."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the sent email."
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": false,
                    "description": "The sender's email address."
                },
                {
                    "name": "to",
                    "type": "string",
                    "required": false,
                    "description": "The recipient's email address."
                }
            ]
        },
        "get_email": {
            "name": "Get Email",
            "description": "Get information about a sent email.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the email to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type ('email')."
                },
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the email."
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": true,
                    "description": "The sender's email address."
                },
                {
                    "name": "to",
                    "type": [
                        "string",
                        "array"
                    ],
                    "required": true,
                    "description": "The recipient's email address or addresses."
                },
                {
                    "name": "created_at",
                    "type": "string",
                    "required": true,
                    "description": "The ISO-8601 timestamp when the email was created."
                },
                {
                    "name": "subject",
                    "type": "string",
                    "required": true,
                    "description": "The subject of the email."
                },
                {
                    "name": "html",
                    "type": "string",
                    "required": false,
                    "description": "The HTML content of the email (if sent)."
                },
                {
                    "name": "text",
                    "type": "string",
                    "required": false,
                    "description": "The plain text content of the email (if sent)."
                },
                {
                    "name": "bcc",
                    "type": [
                        "string",
                        "array"
                    ],
                    "required": false,
                    "description": "The BCC recipients of the email."
                },
                {
                    "name": "cc",
                    "type": [
                        "string",
                        "array"
                    ],
                    "required": false,
                    "description": "The CC recipients of the email."
                },
                {
                    "name": "reply_to",
                    "type": "string",
                    "required": false,
                    "description": "The reply-to address for the email."
                },
                {
                    "name": "last_event",
                    "type": "string",
                    "required": false,
                    "description": "The last event status of the email."
                }
            ]
        },
        "create_domain": {
            "name": "Create Domain",
            "description": "Add a new domain to your Resend account for sending emails.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "The domain name to add (e.g. example.com)."
                },
                {
                    "name": "region",
                    "type": "string",
                    "required": false,
                    "description": "The region for the domain (e.g. us-east-1, eu-west-1)."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the created domain."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "The domain name that was added."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The verification status of the domain."
                },
                {
                    "name": "created_at",
                    "type": "string",
                    "required": true,
                    "description": "The ISO-8601 timestamp when the domain was created."
                },
                {
                    "name": "region",
                    "type": "string",
                    "required": true,
                    "description": "The region of the domain."
                },
                {
                    "name": "records",
                    "type": "array",
                    "required": true,
                    "description": "The DNS records to verify the domain."
                }
            ]
        },
        "get_domain": {
            "name": "Get Domain",
            "description": "Get information about a specific domain in your Resend account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the domain to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the domain."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "The domain name."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The verification status of the domain."
                },
                {
                    "name": "created_at",
                    "type": "string",
                    "required": true,
                    "description": "The ISO-8601 timestamp when the domain was created."
                },
                {
                    "name": "region",
                    "type": "string",
                    "required": true,
                    "description": "The region of the domain."
                },
                {
                    "name": "records",
                    "type": "array",
                    "required": true,
                    "description": "The DNS records to verify the domain."
                }
            ]
        },
        "list_domains": {
            "name": "List Domains",
            "description": "List all domains in your Resend account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "Array of domain objects."
                }
            ]
        },
        "delete_domain": {
            "name": "Delete Domain",
            "description": "Remove a domain from your Resend account.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the domain to delete."
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the domain was successfully deleted."
                }
            ]
        },
        "verify_domain": {
            "name": "Verify Domain",
            "description": "Verify a domain's DNS records in your Resend account.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the domain to verify."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the domain."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "The domain name."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The verification status of the domain."
                },
                {
                    "name": "records",
                    "type": "array",
                    "required": true,
                    "description": "The DNS records with their verification status."
                }
            ]
        },
        "create_api_key": {
            "name": "Create API Key",
            "description": "Create a new API key for your Resend account.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "A name to identify the API key."
                },
                {
                    "name": "permission",
                    "type": "string",
                    "required": false,
                    "description": "The permission level for the API key (full_access or sending_access)."
                },
                {
                    "name": "domain_id",
                    "type": "string",
                    "required": false,
                    "description": "Restrict the API key to a specific domain (for sending_access permission)."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the API key."
                },
                {
                    "name": "token",
                    "type": "string",
                    "required": true,
                    "description": "The API key token (only shown once)."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "The name of the API key."
                },
                {
                    "name": "created_at",
                    "type": "string",
                    "required": true,
                    "description": "The ISO-8601 timestamp when the API key was created."
                }
            ]
        },
        "list_api_keys": {
            "name": "List API Keys",
            "description": "List all API keys in your Resend account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "Array of API key objects."
                }
            ]
        },
        "delete_api_key": {
            "name": "Delete API Key",
            "description": "Delete an API key from your Resend account.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the API key to delete."
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the API key was successfully deleted."
                }
            ]
        },
        "create_audience": {
            "name": "Create Audience",
            "description": "Create a new audience for email campaigns.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "The name of the audience."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the created audience."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "The name of the audience."
                },
                {
                    "name": "created_at",
                    "type": "string",
                    "required": true,
                    "description": "The ISO-8601 timestamp when the audience was created."
                }
            ]
        },
        "get_audience": {
            "name": "Get Audience",
            "description": "Get information about an audience.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the audience to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the audience."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "The name of the audience."
                },
                {
                    "name": "created_at",
                    "type": "string",
                    "required": true,
                    "description": "The ISO-8601 timestamp when the audience was created."
                }
            ]
        },
        "list_audiences": {
            "name": "List Audiences",
            "description": "List all audiences in your Resend account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "Array of audience objects."
                }
            ]
        },
        "delete_audience": {
            "name": "Delete Audience",
            "description": "Remove an audience from your Resend account.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the audience to delete."
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the audience was successfully deleted."
                }
            ]
        },
        "add_contacts": {
            "name": "Add Contacts",
            "description": "Add contacts to an audience.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "audience_id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the audience to add contacts to."
                },
                {
                    "name": "contacts",
                    "type": "array",
                    "required": true,
                    "description": "Array of contact objects. Each contact must have an email and can have optional fields."
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type ('batch')."
                },
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the batch operation."
                }
            ]
        },
        "get_contact": {
            "name": "Get Contact",
            "description": "Get information about a contact.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "audience_id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the audience."
                },
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the contact to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the contact."
                },
                {
                    "name": "email",
                    "type": "string",
                    "required": true,
                    "description": "The email address of the contact."
                },
                {
                    "name": "first_name",
                    "type": "string",
                    "required": false,
                    "description": "The first name of the contact."
                },
                {
                    "name": "last_name",
                    "type": "string",
                    "required": false,
                    "description": "The last name of the contact."
                },
                {
                    "name": "created_at",
                    "type": "string",
                    "required": true,
                    "description": "The ISO-8601 timestamp when the contact was created."
                },
                {
                    "name": "unsubscribed",
                    "type": "boolean",
                    "required": false,
                    "description": "Whether the contact has unsubscribed."
                }
            ]
        },
        "list_contacts": {
            "name": "List Contacts",
            "description": "List all contacts in an audience.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "audience_id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the audience."
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "Array of contact objects."
                }
            ]
        },
        "delete_contact": {
            "name": "Delete Contact",
            "description": "Remove a contact from an audience.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "audience_id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the audience."
                },
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The unique identifier of the contact to delete."
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the contact was successfully deleted."
                }
            ]
        }
    }
}