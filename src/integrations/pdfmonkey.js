export default {
    "name": "PDFMonkey",
    "slug": "pdfmonkey",
    "version": "0.1.24",
    "shortDescription": "Access PDFMonkey API solutions",
    "description": "PDFMonkey integration for WeWeb that provides comprehensive access to the PDFMonkey platform including document generation, template management, and PDF engine configuration.",
    "secrets": [
        {
            "name": "PDFMONKEY_API_KEY",
            "description": "Your PDFMonkey API Key"
        }
    ],
    "methods": {
        "list_documents": {
            "name": "List Documents",
            "description": "List all documents with optional filtering and pagination.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number for pagination."
                },
                {
                    "name": "documentTemplateId",
                    "type": "string",
                    "required": false,
                    "description": "Filter documents by template ID."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": false,
                    "description": "Filter documents by status (success, failure, draft)."
                },
                {
                    "name": "workspaceId",
                    "type": "string",
                    "required": false,
                    "description": "Filter documents by workspace ID."
                },
                {
                    "name": "updatedSince",
                    "type": "string",
                    "required": false,
                    "description": "Filter documents updated since the specified date (ISO 8601 format)."
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of document objects.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the document."
                        },
                        {
                            "name": "status",
                            "type": "string",
                            "required": true,
                            "description": "Status of the document (success, failure, draft)."
                        },
                        {
                            "name": "download_url",
                            "type": "string",
                            "required": false,
                            "description": "URL to download the generated PDF."
                        },
                        {
                            "name": "created_at",
                            "type": "string",
                            "required": true,
                            "description": "Timestamp when the document was created."
                        },
                        {
                            "name": "updated_at",
                            "type": "string",
                            "required": true,
                            "description": "Timestamp when the document was last updated."
                        }
                    ]
                }
            ]
        },
        "get_document": {
            "name": "Get Document",
            "description": "Get a specific document by ID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the document to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "document",
                    "type": "object",
                    "required": true,
                    "description": "The document object.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the document."
                        },
                        {
                            "name": "status",
                            "type": "string",
                            "required": true,
                            "description": "Status of the document."
                        },
                        {
                            "name": "download_url",
                            "type": "string",
                            "required": false,
                            "description": "URL to download the generated PDF."
                        },
                        {
                            "name": "payload",
                            "type": "object",
                            "required": false,
                            "description": "Data used to generate the document."
                        },
                        {
                            "name": "meta",
                            "type": "object",
                            "required": false,
                            "description": "Metadata associated with the document."
                        }
                    ]
                }
            ]
        },
        "get_document_card": {
            "name": "Get Document Card",
            "description": "Get a document card by ID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the document card to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "document_card",
                    "type": "object",
                    "required": true,
                    "description": "The document card object.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the document card."
                        },
                        {
                            "name": "status",
                            "type": "string",
                            "required": true,
                            "description": "Status of the document."
                        },
                        {
                            "name": "preview_url",
                            "type": "string",
                            "required": false,
                            "description": "URL to preview the document."
                        }
                    ]
                }
            ]
        },
        "create_document": {
            "name": "Create Document",
            "description": "Create a new document from a template.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "document_template_id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the template to use."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": false,
                    "description": "Initial status of the document (draft or pending)."
                },
                {
                    "name": "payload",
                    "type": "object",
                    "required": false,
                    "description": "Data to use when generating the document."
                },
                {
                    "name": "meta",
                    "type": "object",
                    "required": false,
                    "description": "Metadata to associate with the document."
                }
            ],
            "outputType": [
                {
                    "name": "document",
                    "type": "object",
                    "required": true,
                    "description": "The created document object.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the document."
                        },
                        {
                            "name": "status",
                            "type": "string",
                            "required": true,
                            "description": "Status of the document."
                        },
                        {
                            "name": "download_url",
                            "type": "string",
                            "required": false,
                            "description": "URL to download the generated PDF."
                        }
                    ]
                }
            ]
        },
        "update_document": {
            "name": "Update Document",
            "description": "Update an existing document.",
            "recommendedHttpMethod": "PUT",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the document to update."
                },
                {
                    "name": "document_template_id",
                    "type": "string",
                    "required": false,
                    "description": "New template ID to use."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": false,
                    "description": "New status for the document."
                },
                {
                    "name": "payload",
                    "type": "object",
                    "required": false,
                    "description": "New data for generating the document."
                },
                {
                    "name": "meta",
                    "type": "object",
                    "required": false,
                    "description": "New metadata for the document."
                }
            ],
            "outputType": [
                {
                    "name": "document",
                    "type": "object",
                    "required": true,
                    "description": "The updated document object.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the document."
                        },
                        {
                            "name": "status",
                            "type": "string",
                            "required": true,
                            "description": "Status of the document."
                        },
                        {
                            "name": "download_url",
                            "type": "string",
                            "required": false,
                            "description": "URL to download the generated PDF."
                        }
                    ]
                }
            ]
        },
        "delete_document": {
            "name": "Delete Document",
            "description": "Delete a document.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the document to delete."
                }
            ],
            "outputType": []
        },
        "list_templates": {
            "name": "List Templates",
            "description": "List all document templates with optional filtering and pagination.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number for pagination."
                },
                {
                    "name": "workspaceId",
                    "type": "string",
                    "required": false,
                    "description": "Filter templates by workspace ID."
                },
                {
                    "name": "folders",
                    "type": "string",
                    "required": false,
                    "description": "Filter templates by folder IDs (comma-separated)."
                },
                {
                    "name": "sort",
                    "type": "string",
                    "required": false,
                    "description": "Sort templates by field (identifier, created_at, updated_at)."
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of template objects.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the template."
                        },
                        {
                            "name": "identifier",
                            "type": "string",
                            "required": true,
                            "description": "Human-readable identifier for the template."
                        },
                        {
                            "name": "created_at",
                            "type": "string",
                            "required": true,
                            "description": "Timestamp when the template was created."
                        },
                        {
                            "name": "updated_at",
                            "type": "string",
                            "required": true,
                            "description": "Timestamp when the template was last updated."
                        }
                    ]
                }
            ]
        },
        "get_template": {
            "name": "Get Template",
            "description": "Get a specific template by ID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the template to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "template",
                    "type": "object",
                    "required": true,
                    "description": "The template object.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the template."
                        },
                        {
                            "name": "identifier",
                            "type": "string",
                            "required": true,
                            "description": "Human-readable identifier for the template."
                        },
                        {
                            "name": "body",
                            "type": "string",
                            "required": false,
                            "description": "HTML content of the template."
                        },
                        {
                            "name": "scss_style",
                            "type": "string",
                            "required": false,
                            "description": "SCSS styles for the template."
                        }
                    ]
                }
            ]
        },
        "create_template": {
            "name": "Create Template",
            "description": "Create a new document template.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "identifier",
                    "type": "string",
                    "required": true,
                    "description": "Human-readable identifier for the template."
                },
                {
                    "name": "edition_mode",
                    "type": "string",
                    "required": false,
                    "description": "Edition mode for the template (code or visual)."
                },
                {
                    "name": "body",
                    "type": "string",
                    "required": false,
                    "description": "HTML content of the template."
                },
                {
                    "name": "scss_style",
                    "type": "string",
                    "required": false,
                    "description": "SCSS styles for the template."
                },
                {
                    "name": "sample_data",
                    "type": "string",
                    "required": false,
                    "description": "Sample data for template testing."
                },
                {
                    "name": "settings",
                    "type": "object",
                    "required": false,
                    "description": "Template settings (orientation, paper format, margins)."
                },
                {
                    "name": "pdf_engine_id",
                    "type": "string",
                    "required": false,
                    "description": "ID of the PDF engine to use."
                },
                {
                    "name": "ttl",
                    "type": "number",
                    "required": false,
                    "description": "Time-to-live in seconds for generated documents."
                }
            ],
            "outputType": [
                {
                    "name": "template",
                    "type": "object",
                    "required": true,
                    "description": "The created template object.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the template."
                        },
                        {
                            "name": "identifier",
                            "type": "string",
                            "required": true,
                            "description": "Human-readable identifier for the template."
                        }
                    ]
                }
            ]
        },
        "update_template": {
            "name": "Update Template",
            "description": "Update an existing document template.",
            "recommendedHttpMethod": "PUT",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the template to update."
                },
                {
                    "name": "identifier",
                    "type": "string",
                    "required": false,
                    "description": "New human-readable identifier for the template."
                },
                {
                    "name": "edition_mode",
                    "type": "string",
                    "required": false,
                    "description": "New edition mode for the template."
                },
                {
                    "name": "body",
                    "type": "string",
                    "required": false,
                    "description": "New HTML content for the template."
                },
                {
                    "name": "scss_style",
                    "type": "string",
                    "required": false,
                    "description": "New SCSS styles for the template."
                },
                {
                    "name": "sample_data",
                    "type": "string",
                    "required": false,
                    "description": "New sample data for template testing."
                },
                {
                    "name": "settings",
                    "type": "object",
                    "required": false,
                    "description": "New template settings."
                },
                {
                    "name": "pdf_engine_id",
                    "type": "string",
                    "required": false,
                    "description": "New PDF engine ID."
                },
                {
                    "name": "ttl",
                    "type": "number",
                    "required": false,
                    "description": "New time-to-live value."
                }
            ],
            "outputType": [
                {
                    "name": "template",
                    "type": "object",
                    "required": true,
                    "description": "The updated template object.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the template."
                        },
                        {
                            "name": "identifier",
                            "type": "string",
                            "required": true,
                            "description": "Human-readable identifier for the template."
                        }
                    ]
                }
            ]
        },
        "delete_template": {
            "name": "Delete Template",
            "description": "Delete a document template.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "ID of the template to delete."
                }
            ],
            "outputType": []
        },
        "list_engines": {
            "name": "List Engines",
            "description": "List all available PDF engines.",
            "recommendedHttpMethod": "GET",
            "inputFields": [],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of PDF engine objects.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "Unique identifier for the engine."
                        },
                        {
                            "name": "name",
                            "type": "string",
                            "required": true,
                            "description": "Name of the PDF engine."
                        },
                        {
                            "name": "description",
                            "type": "string",
                            "required": true,
                            "description": "Description of the PDF engine."
                        }
                    ]
                }
            ]
        }
    }
}