export default {
    "name": "SendGrid",
    "slug": "sendgrid",
    "version": "0.1.29",
    "shortDescription": "Access SendGrid API solutions",
    "description": "SendGrid integration for WeWeb that provides a robust email sending service with features like transactional emails, HTML template support, attachments, tracking capabilities, and list management.",
    "svgLogo": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 256 256\"><!-- Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt --><path fill=\"#9DD6E3\" d=\"M256 0v170.667h-85.333v85.33H.002v-85.331H0V85.332h85.333V0z\"/><path fill=\"#3F72AB\" d=\"M.002 255.996h85.333v-85.333H.002z\"/><path fill=\"#00A9D1\" d=\"M170.667 170.667H256V85.331h-85.333zM85.333 85.333h85.334V0H85.333z\"/><path fill=\"#2191C4\" d=\"M85.333 170.665h85.334V85.331H85.333z\"/><path fill=\"#3F72AB\" d=\"M170.667 85.333H256V0h-85.333z\"/></svg>",
    "secrets": [
        {
            "name": "SENDGRID_API_KEY",
            "description": "Your SendGrid API Key"
        }
    ],
    "methods": {
        "send_email": {
            "name": "Send Email",
            "description": "Send an email through SendGrid API.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "from",
                    "type": "object",
                    "required": true,
                    "description": "The sender's information containing email and optional name."
                },
                {
                    "name": "to",
                    "type": "array",
                    "required": true,
                    "description": "Array of recipient objects, each containing email and optional name."
                },
                {
                    "name": "cc",
                    "type": "array",
                    "required": false,
                    "description": "Array of CC recipient objects, each containing email and optional name."
                },
                {
                    "name": "bcc",
                    "type": "array",
                    "required": false,
                    "description": "Array of BCC recipient objects, each containing email and optional name."
                },
                {
                    "name": "reply_to",
                    "type": "object",
                    "required": false,
                    "description": "Reply-to email address with optional name."
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
                    "description": "Array of attachments. Each attachment should have filename, content (base64 encoded), type, and disposition."
                },
                {
                    "name": "categories",
                    "type": "array",
                    "required": false,
                    "description": "Array of categories (strings) to tag the email with."
                },
                {
                    "name": "custom_args",
                    "type": "object",
                    "required": false,
                    "description": "Custom arguments to be carried through the mail send."
                },
                {
                    "name": "template_id",
                    "type": "string",
                    "required": false,
                    "description": "ID of a template that you would like to use."
                },
                {
                    "name": "dynamic_template_data",
                    "type": "object",
                    "required": false,
                    "description": "Dynamic data for template substitution."
                },
                {
                    "name": "send_at",
                    "type": "number",
                    "required": false,
                    "description": "Timestamp to schedule the email for. Must be at least 60 seconds in the future."
                },
                {
                    "name": "batch_id",
                    "type": "string",
                    "required": false,
                    "description": "Batch ID to group multiple sends together."
                },
                {
                    "name": "asm",
                    "type": "object",
                    "required": false,
                    "description": "Advanced Suppression Management options, including group_id and groups_to_display."
                },
                {
                    "name": "ip_pool_name",
                    "type": "string",
                    "required": false,
                    "description": "The IP Pool that you would like to send this email from."
                },
                {
                    "name": "mail_settings",
                    "type": "object",
                    "required": false,
                    "description": "Mail settings to determine how you would like this email to be handled."
                },
                {
                    "name": "tracking_settings",
                    "type": "object",
                    "required": false,
                    "description": "Settings to determine how you would like to track the metrics of the email."
                }
            ],
            "outputType": [
                {
                    "name": "statusCode",
                    "type": "number",
                    "required": true,
                    "description": "HTTP status code of the response."
                },
                {
                    "name": "body",
                    "type": "string",
                    "required": false,
                    "description": "Response body (usually empty for successful sends)."
                },
                {
                    "name": "headers",
                    "type": "object",
                    "required": false,
                    "description": "Response headers."
                }
            ]
        },
        "create_contact": {
            "name": "Create Contact",
            "description": "Add a new contact to a list.",
            "recommendedHttpMethod": "PUT",
            "inputFields": [
                {
                    "name": "list_ids",
                    "type": "array",
                    "required": true,
                    "description": "Array of list IDs to add the contact to."
                },
                {
                    "name": "contacts",
                    "type": "array",
                    "required": true,
                    "description": "Array of contact objects to add. Each should have an email and can have custom fields."
                }
            ],
            "outputType": [
                {
                    "name": "job_id",
                    "type": "string",
                    "required": true,
                    "description": "Job ID for the contact creation task."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the job."
                }
            ]
        },
        "delete_contact": {
            "name": "Delete Contact",
            "description": "Delete a contact by email address.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "ids",
                    "type": "array",
                    "required": false,
                    "description": "Array of contact IDs to delete."
                },
                {
                    "name": "emails",
                    "type": "array",
                    "required": false,
                    "description": "Array of email addresses to delete."
                }
            ],
            "outputType": [
                {
                    "name": "job_id",
                    "type": "string",
                    "required": true,
                    "description": "Job ID for the deletion task."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the job."
                }
            ]
        },
        "get_contact": {
            "name": "Get Contact",
            "description": "Get information about a contact by email address.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "email",
                    "type": "string",
                    "required": true,
                    "description": "Email address of the contact to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the contact."
                },
                {
                    "name": "email",
                    "type": "string",
                    "required": true,
                    "description": "Email address of the contact."
                },
                {
                    "name": "created_at",
                    "type": "string",
                    "required": true,
                    "description": "ISO8601 timestamp of when the contact was created."
                },
                {
                    "name": "updated_at",
                    "type": "string",
                    "required": true,
                    "description": "ISO8601 timestamp of when the contact was last updated."
                },
                {
                    "name": "list_ids",
                    "type": "array",
                    "required": false,
                    "description": "List IDs this contact belongs to."
                },
                {
                    "name": "custom_fields",
                    "type": "object",
                    "required": false,
                    "description": "Any custom fields associated with the contact."
                }
            ]
        },
        "search_contacts": {
            "name": "Search Contacts",
            "description": "Search for contacts using query conditions.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "query",
                    "type": "string",
                    "required": true,
                    "description": "Search query string (e.g., \"email LIKE '%@example.com'\")."
                }
            ],
            "outputType": [
                {
                    "name": "result",
                    "type": "array",
                    "required": true,
                    "description": "Array of matching contact objects."
                },
                {
                    "name": "_metadata",
                    "type": "object",
                    "required": true,
                    "description": "Metadata about the search results, including count."
                }
            ]
        },
        "create_list": {
            "name": "Create List",
            "description": "Create a new contact list.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "Name of the contact list."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the created list."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "Name of the list."
                },
                {
                    "name": "contact_count",
                    "type": "number",
                    "required": true,
                    "description": "Number of contacts in the list (initially 0)."
                }
            ]
        },
        "get_list": {
            "name": "Get List",
            "description": "Get information about a specific list.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the list to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the list."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "Name of the list."
                },
                {
                    "name": "contact_count",
                    "type": "number",
                    "required": true,
                    "description": "Number of contacts in the list."
                }
            ]
        },
        "get_lists": {
            "name": "Get Lists",
            "description": "Get all contact lists.",
            "recommendedHttpMethod": "GET",
            "inputFields": [],
            "outputType": [
                {
                    "name": "result",
                    "type": "array",
                    "required": true,
                    "description": "Array of list objects."
                },
                {
                    "name": "_metadata",
                    "type": "object",
                    "required": true,
                    "description": "Metadata about the lists, including count."
                }
            ]
        },
        "delete_list": {
            "name": "Delete List",
            "description": "Delete a contact list.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the list to delete."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the deleted list."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "Status of the deletion."
                }
            ]
        },
        "get_template": {
            "name": "Get Template",
            "description": "Get information about an email template.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the template to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the template."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "Name of the template."
                },
                {
                    "name": "generation",
                    "type": "string",
                    "required": true,
                    "description": "Generation of the template (legacy or dynamic)."
                },
                {
                    "name": "updated_at",
                    "type": "string",
                    "required": true,
                    "description": "ISO8601 timestamp of when the template was last updated."
                },
                {
                    "name": "versions",
                    "type": "array",
                    "required": true,
                    "description": "Array of template versions."
                }
            ]
        },
        "get_templates": {
            "name": "Get Templates",
            "description": "Get all email templates.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "generations",
                    "type": "string",
                    "required": false,
                    "description": "Filter by template generation (legacy, dynamic, or both)."
                }
            ],
            "outputType": [
                {
                    "name": "templates",
                    "type": "array",
                    "required": true,
                    "description": "Array of template objects."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": true,
                    "description": "Metadata about the templates, including count."
                }
            ]
        }
    }
}