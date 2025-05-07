export default {
    "name": "Twilio",
    "slug": "twilio",
    "version": "0.1.27",
    "shortDescription": "Access Twilio API solutions",
    "description": "Twilio integration for WeWeb that provides comprehensive access to Twilio's communication services including SMS, voice calls, conference calls, and phone number management.",
    "svgLogo": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 256 256\"><!-- Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt --><path fill=\"#F12E45\" d=\"M128 0c70.656 0 128 57.344 128 128s-57.344 128-128 128S0 198.656 0 128S57.344 0 128 0m0 33.792c-52.224 0-94.208 41.984-94.208 94.208S75.776 222.208 128 222.208s94.208-41.984 94.208-94.208S180.224 33.792 128 33.792m31.744 99.328c14.704 0 26.624 11.92 26.624 26.624s-11.92 26.624-26.624 26.624s-26.624-11.92-26.624-26.624s11.92-26.624 26.624-26.624m-63.488 0c14.704 0 26.624 11.92 26.624 26.624s-11.92 26.624-26.624 26.624s-26.624-11.92-26.624-26.624s11.92-26.624 26.624-26.624m63.488-63.488c14.704 0 26.624 11.92 26.624 26.624s-11.92 26.624-26.624 26.624s-26.624-11.92-26.624-26.624s11.92-26.624 26.624-26.624m-63.488 0c14.704 0 26.624 11.92 26.624 26.624s-11.92 26.624-26.624 26.624s-26.624-11.92-26.624-26.624s11.92-26.624 26.624-26.624\"/></svg>",
    "secrets": [
        {
            "name": "TWILIO_ACCOUNT_SID",
            "description": "Your Twilio Account SID"
        },
        {
            "name": "TWILIO_AUTH_TOKEN",
            "description": "Your Twilio Auth Token"
        }
    ],
    "methods": {
        "send_sms": {
            "name": "Send SMS",
            "description": "Send an SMS message to a phone number.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "to",
                    "type": "string",
                    "required": true,
                    "description": "The recipient's phone number"
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": true,
                    "description": "The sender's phone number"
                },
                {
                    "name": "body",
                    "type": "string",
                    "required": true,
                    "description": "The message content"
                },
                {
                    "name": "mediaUrl",
                    "type": "array",
                    "required": false,
                    "description": "URLs of media files to send with the message"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the message"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the message"
                },
                {
                    "name": "to",
                    "type": "string",
                    "required": true,
                    "description": "The recipient's phone number"
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": true,
                    "description": "The sender's phone number"
                },
                {
                    "name": "body",
                    "type": "string",
                    "required": true,
                    "description": "The message content"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the message was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the message was last updated"
                },
                {
                    "name": "dateSent",
                    "type": "string",
                    "required": false,
                    "description": "The date the message was sent"
                }
            ]
        },
        "make_call": {
            "name": "Make Call",
            "description": "Make a voice call to a phone number.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "to",
                    "type": "string",
                    "required": true,
                    "description": "The recipient's phone number"
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": true,
                    "description": "The sender's phone number"
                },
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "The URL that returns TwiML instructions for the call"
                },
                {
                    "name": "statusCallback",
                    "type": "string",
                    "required": false,
                    "description": "The URL to send status updates to"
                },
                {
                    "name": "statusCallbackEvent",
                    "type": "array",
                    "required": false,
                    "description": "The events to send status updates for"
                },
                {
                    "name": "statusCallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use for status callbacks"
                },
                {
                    "name": "twiml",
                    "type": "string",
                    "required": false,
                    "description": "TwiML instructions for the call"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the call"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the call"
                },
                {
                    "name": "to",
                    "type": "string",
                    "required": true,
                    "description": "The recipient's phone number"
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": true,
                    "description": "The sender's phone number"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the call was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the call was last updated"
                },
                {
                    "name": "startTime",
                    "type": "string",
                    "required": false,
                    "description": "The date the call started"
                },
                {
                    "name": "endTime",
                    "type": "string",
                    "required": false,
                    "description": "The date the call ended"
                },
                {
                    "name": "duration",
                    "type": "string",
                    "required": false,
                    "description": "The length of the call in seconds"
                }
            ]
        },
        "get_account": {
            "name": "Get Account",
            "description": "Get account information.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": false,
                    "description": "The unique string that identifies the account"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the account"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the account"
                },
                {
                    "name": "type",
                    "type": "string",
                    "required": true,
                    "description": "The type of the account"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the account was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the account was last updated"
                }
            ]
        },
        "list_phone_numbers": {
            "name": "List Phone Numbers",
            "description": "List phone numbers in your account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                },
                {
                    "name": "areaCode",
                    "type": "string",
                    "required": false,
                    "description": "Filter by area code"
                },
                {
                    "name": "contains",
                    "type": "string",
                    "required": false,
                    "description": "Filter by phone number containing this string"
                },
                {
                    "name": "smsEnabled",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by SMS capability"
                },
                {
                    "name": "mmsEnabled",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by MMS capability"
                },
                {
                    "name": "voiceEnabled",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by voice capability"
                },
                {
                    "name": "excludeAllAddressRequired",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by address requirement"
                },
                {
                    "name": "excludeLocalAddressRequired",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by local address requirement"
                },
                {
                    "name": "excludeForeignAddressRequired",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by foreign address requirement"
                },
                {
                    "name": "inRegion",
                    "type": "string",
                    "required": false,
                    "description": "Filter by region"
                },
                {
                    "name": "inLata",
                    "type": "string",
                    "required": false,
                    "description": "Filter by LATA"
                }
            ],
            "outputType": [
                {
                    "name": "phoneNumbers",
                    "type": "array",
                    "required": true,
                    "description": "List of phone numbers"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more phone numbers available"
                }
            ]
        },
        "get_phone_number": {
            "name": "Get Phone Number",
            "description": "Get a phone number by its SID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the phone number"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the phone number"
                },
                {
                    "name": "phoneNumber",
                    "type": "string",
                    "required": true,
                    "description": "The phone number"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the phone number"
                },
                {
                    "name": "smsEnabled",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the phone number can receive SMS messages"
                },
                {
                    "name": "mmsEnabled",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the phone number can receive MMS messages"
                },
                {
                    "name": "voiceEnabled",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the phone number can receive calls"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the phone number was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the phone number was last updated"
                }
            ]
        },
        "update_phone_number": {
            "name": "Update Phone Number",
            "description": "Update a phone number's settings.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the phone number"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": false,
                    "description": "A human-readable description of the phone number"
                },
                {
                    "name": "smsUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the phone number receives an SMS message"
                },
                {
                    "name": "smsMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the SMS URL"
                },
                {
                    "name": "smsFallbackUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when an error occurs while retrieving the SMS TwiML"
                },
                {
                    "name": "smsFallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the SMS fallback URL"
                },
                {
                    "name": "voiceUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the phone number receives a call"
                },
                {
                    "name": "voiceMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the voice URL"
                },
                {
                    "name": "voiceFallbackUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when an error occurs while retrieving the voice TwiML"
                },
                {
                    "name": "voiceFallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the voice fallback URL"
                },
                {
                    "name": "statusCallback",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the call status changes"
                },
                {
                    "name": "statusCallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the status callback URL"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the phone number"
                },
                {
                    "name": "phoneNumber",
                    "type": "string",
                    "required": true,
                    "description": "The phone number"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the phone number"
                },
                {
                    "name": "smsEnabled",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the phone number can receive SMS messages"
                },
                {
                    "name": "mmsEnabled",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the phone number can receive MMS messages"
                },
                {
                    "name": "voiceEnabled",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the phone number can receive calls"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the phone number was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the phone number was last updated"
                }
            ]
        },
        "release_phone_number": {
            "name": "Release Phone Number",
            "description": "Release a phone number from your account.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the phone number"
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the phone number was successfully released"
                }
            ]
        },
        "search_available_phone_numbers": {
            "name": "Search Available Phone Numbers",
            "description": "Search for available phone numbers to purchase.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "country",
                    "type": "string",
                    "required": true,
                    "description": "The country code to search in"
                },
                {
                    "name": "areaCode",
                    "type": "string",
                    "required": false,
                    "description": "Filter by area code"
                },
                {
                    "name": "contains",
                    "type": "string",
                    "required": false,
                    "description": "Filter by phone number containing this string"
                },
                {
                    "name": "smsEnabled",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by SMS capability"
                },
                {
                    "name": "mmsEnabled",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by MMS capability"
                },
                {
                    "name": "voiceEnabled",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by voice capability"
                },
                {
                    "name": "excludeAllAddressRequired",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by address requirement"
                },
                {
                    "name": "excludeLocalAddressRequired",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by local address requirement"
                },
                {
                    "name": "excludeForeignAddressRequired",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by foreign address requirement"
                },
                {
                    "name": "inRegion",
                    "type": "string",
                    "required": false,
                    "description": "Filter by region"
                },
                {
                    "name": "inLata",
                    "type": "string",
                    "required": false,
                    "description": "Filter by LATA"
                }
            ],
            "outputType": [
                {
                    "name": "availablePhoneNumbers",
                    "type": "array",
                    "required": true,
                    "description": "List of available phone numbers"
                }
            ]
        },
        "create_application": {
            "name": "Create Application",
            "description": "Create a TwiML application.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the application"
                },
                {
                    "name": "voiceUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when a call is received"
                },
                {
                    "name": "voiceMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the voice URL"
                },
                {
                    "name": "voiceFallbackUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when an error occurs while retrieving the voice TwiML"
                },
                {
                    "name": "voiceFallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the voice fallback URL"
                },
                {
                    "name": "statusCallback",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the call status changes"
                },
                {
                    "name": "statusCallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the status callback URL"
                },
                {
                    "name": "smsUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when an SMS message is received"
                },
                {
                    "name": "smsMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the SMS URL"
                },
                {
                    "name": "smsFallbackUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when an error occurs while retrieving the SMS TwiML"
                },
                {
                    "name": "smsFallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the SMS fallback URL"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the application"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the application"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the application was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the application was last updated"
                }
            ]
        },
        "list_applications": {
            "name": "List Applications",
            "description": "List TwiML applications in your account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": false,
                    "description": "Filter by friendly name"
                }
            ],
            "outputType": [
                {
                    "name": "applications",
                    "type": "array",
                    "required": true,
                    "description": "List of applications"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more applications available"
                }
            ]
        },
        "get_application": {
            "name": "Get Application",
            "description": "Get a TwiML application by its SID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the application"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the application"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the application"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the application was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the application was last updated"
                }
            ]
        },
        "update_application": {
            "name": "Update Application",
            "description": "Update a TwiML application.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the application"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": false,
                    "description": "A human-readable description of the application"
                },
                {
                    "name": "voiceUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when a call is received"
                },
                {
                    "name": "voiceMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the voice URL"
                },
                {
                    "name": "voiceFallbackUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when an error occurs while retrieving the voice TwiML"
                },
                {
                    "name": "voiceFallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the voice fallback URL"
                },
                {
                    "name": "statusCallback",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the call status changes"
                },
                {
                    "name": "statusCallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the status callback URL"
                },
                {
                    "name": "smsUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when an SMS message is received"
                },
                {
                    "name": "smsMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the SMS URL"
                },
                {
                    "name": "smsFallbackUrl",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when an error occurs while retrieving the SMS TwiML"
                },
                {
                    "name": "smsFallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use when calling the SMS fallback URL"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the application"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the application"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the application was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the application was last updated"
                }
            ]
        },
        "delete_application": {
            "name": "Delete Application",
            "description": "Delete a TwiML application.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the application"
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the application was successfully deleted"
                }
            ]
        },
        "list_recordings": {
            "name": "List Recordings",
            "description": "List call recordings in your account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                },
                {
                    "name": "callSid",
                    "type": "string",
                    "required": false,
                    "description": "Filter by call SID"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date created"
                },
                {
                    "name": "dateCreatedBefore",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date created before"
                },
                {
                    "name": "dateCreatedAfter",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date created after"
                }
            ],
            "outputType": [
                {
                    "name": "recordings",
                    "type": "array",
                    "required": true,
                    "description": "List of recordings"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more recordings available"
                }
            ]
        },
        "get_recording": {
            "name": "Get Recording",
            "description": "Get a call recording by its SID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the recording"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the recording"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "callSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the call"
                },
                {
                    "name": "duration",
                    "type": "string",
                    "required": true,
                    "description": "The length of the recording in seconds"
                },
                {
                    "name": "channels",
                    "type": "number",
                    "required": true,
                    "description": "The number of channels in the recording"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the recording"
                },
                {
                    "name": "source",
                    "type": "string",
                    "required": true,
                    "description": "The source of the recording"
                },
                {
                    "name": "errorCode",
                    "type": "string",
                    "required": false,
                    "description": "The error code if the recording failed"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the recording was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the recording was last updated"
                },
                {
                    "name": "uri",
                    "type": "string",
                    "required": true,
                    "description": "The URI of the recording"
                }
            ]
        },
        "delete_recording": {
            "name": "Delete Recording",
            "description": "Delete a call recording.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the recording"
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the recording was successfully deleted"
                }
            ]
        },
        "list_messages": {
            "name": "List Messages",
            "description": "List SMS messages in your account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                },
                {
                    "name": "to",
                    "type": "string",
                    "required": false,
                    "description": "Filter by recipient phone number"
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": false,
                    "description": "Filter by sender phone number"
                },
                {
                    "name": "dateSent",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date sent"
                },
                {
                    "name": "dateSentBefore",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date sent before"
                },
                {
                    "name": "dateSentAfter",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date sent after"
                }
            ],
            "outputType": [
                {
                    "name": "messages",
                    "type": "array",
                    "required": true,
                    "description": "List of messages"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more messages available"
                }
            ]
        },
        "get_message": {
            "name": "Get Message",
            "description": "Get an SMS message by its SID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the message"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the message"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "to",
                    "type": "string",
                    "required": true,
                    "description": "The recipient's phone number"
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": true,
                    "description": "The sender's phone number"
                },
                {
                    "name": "body",
                    "type": "string",
                    "required": true,
                    "description": "The message content"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the message"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the message was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the message was last updated"
                },
                {
                    "name": "dateSent",
                    "type": "string",
                    "required": false,
                    "description": "The date the message was sent"
                }
            ]
        },
        "list_calls": {
            "name": "List Calls",
            "description": "List voice calls in your account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                },
                {
                    "name": "to",
                    "type": "string",
                    "required": false,
                    "description": "Filter by recipient phone number"
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": false,
                    "description": "Filter by sender phone number"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": false,
                    "description": "Filter by call status"
                },
                {
                    "name": "startTime",
                    "type": "string",
                    "required": false,
                    "description": "Filter by start time"
                },
                {
                    "name": "startTimeBefore",
                    "type": "string",
                    "required": false,
                    "description": "Filter by start time before"
                },
                {
                    "name": "startTimeAfter",
                    "type": "string",
                    "required": false,
                    "description": "Filter by start time after"
                }
            ],
            "outputType": [
                {
                    "name": "calls",
                    "type": "array",
                    "required": true,
                    "description": "List of calls"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more calls available"
                }
            ]
        },
        "get_call": {
            "name": "Get Call",
            "description": "Get a voice call by its SID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the call"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the call"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "to",
                    "type": "string",
                    "required": true,
                    "description": "The recipient's phone number"
                },
                {
                    "name": "from",
                    "type": "string",
                    "required": true,
                    "description": "The sender's phone number"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the call"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the call was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the call was last updated"
                },
                {
                    "name": "startTime",
                    "type": "string",
                    "required": false,
                    "description": "The date the call started"
                },
                {
                    "name": "endTime",
                    "type": "string",
                    "required": false,
                    "description": "The date the call ended"
                },
                {
                    "name": "duration",
                    "type": "string",
                    "required": false,
                    "description": "The length of the call in seconds"
                }
            ]
        },
        "create_twiml": {
            "name": "Create TwiML",
            "description": "Create TwiML instructions for voice or messaging.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "type",
                    "type": "string",
                    "required": true,
                    "description": "The type of TwiML to create (voice or messaging)"
                },
                {
                    "name": "content",
                    "type": "object",
                    "required": true,
                    "description": "The content of the TwiML"
                }
            ],
            "outputType": [
                {
                    "name": "twiml",
                    "type": "string",
                    "required": true,
                    "description": "The generated TwiML"
                }
            ]
        },
        "create_conference": {
            "name": "Create Conference",
            "description": "Create a conference call.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the conference"
                },
                {
                    "name": "statusCallback",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the conference status changes"
                },
                {
                    "name": "statusCallbackEvent",
                    "type": "array",
                    "required": false,
                    "description": "The events to send status updates for"
                },
                {
                    "name": "statusCallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use for status callbacks"
                },
                {
                    "name": "participantLabel",
                    "type": "string",
                    "required": false,
                    "description": "A label for the participant"
                },
                {
                    "name": "participants",
                    "type": "array",
                    "required": false,
                    "description": "List of phone numbers to add as participants"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the conference"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the conference"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the conference"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the conference was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the conference was last updated"
                }
            ]
        },
        "list_conferences": {
            "name": "List Conferences",
            "description": "List conference calls in your account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": false,
                    "description": "Filter by conference status"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": false,
                    "description": "Filter by friendly name"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date created"
                },
                {
                    "name": "dateCreatedBefore",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date created before"
                },
                {
                    "name": "dateCreatedAfter",
                    "type": "string",
                    "required": false,
                    "description": "Filter by date created after"
                }
            ],
            "outputType": [
                {
                    "name": "conferences",
                    "type": "array",
                    "required": true,
                    "description": "List of conferences"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more conferences available"
                }
            ]
        },
        "get_conference": {
            "name": "Get Conference",
            "description": "Get a conference call by its SID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the conference"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the conference"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the conference"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the conference"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the conference was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the conference was last updated"
                }
            ]
        },
        "list_conference_participants": {
            "name": "List Conference Participants",
            "description": "List participants in a conference call.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "conferenceSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the conference"
                },
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                },
                {
                    "name": "muted",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by muted status"
                },
                {
                    "name": "hold",
                    "type": "boolean",
                    "required": false,
                    "description": "Filter by hold status"
                }
            ],
            "outputType": [
                {
                    "name": "participants",
                    "type": "array",
                    "required": true,
                    "description": "List of participants"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more participants available"
                }
            ]
        },
        "mute_conference_participant": {
            "name": "Mute Conference Participant",
            "description": "Mute a participant in a conference call.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "conferenceSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the conference"
                },
                {
                    "name": "participantSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the participant"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the participant"
                },
                {
                    "name": "conferenceSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the conference"
                },
                {
                    "name": "muted",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the participant is muted"
                }
            ]
        },
        "unmute_conference_participant": {
            "name": "Unmute Conference Participant",
            "description": "Unmute a participant in a conference call.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "conferenceSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the conference"
                },
                {
                    "name": "participantSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the participant"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the participant"
                },
                {
                    "name": "conferenceSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the conference"
                },
                {
                    "name": "muted",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the participant is muted"
                }
            ]
        },
        "list_message_media": {
            "name": "List Message Media",
            "description": "List media associated with a message.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "messageSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the message"
                },
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                }
            ],
            "outputType": [
                {
                    "name": "media",
                    "type": "array",
                    "required": true,
                    "description": "List of media"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more media available"
                }
            ]
        },
        "get_message_media": {
            "name": "Get Message Media",
            "description": "Get media associated with a message.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "messageSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the message"
                },
                {
                    "name": "mediaSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the media"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the media"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "parentAccountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the parent account"
                },
                {
                    "name": "messageSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the message"
                },
                {
                    "name": "uri",
                    "type": "string",
                    "required": true,
                    "description": "The URI of the media"
                },
                {
                    "name": "contentType",
                    "type": "string",
                    "required": true,
                    "description": "The content type of the media"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the media was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the media was last updated"
                }
            ]
        },
        "delete_message_media": {
            "name": "Delete Message Media",
            "description": "Delete media associated with a message.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "messageSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the message"
                },
                {
                    "name": "mediaSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the media"
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the media was successfully deleted"
                }
            ]
        },
        "create_webhook": {
            "name": "Create Webhook",
            "description": "Create a webhook endpoint.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "The URL to call when the webhook is triggered"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": false,
                    "description": "A human-readable description of the webhook"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": false,
                    "description": "The status of the webhook"
                },
                {
                    "name": "statusCallback",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the webhook status changes"
                },
                {
                    "name": "statusCallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use for status callbacks"
                },
                {
                    "name": "filters",
                    "type": "array",
                    "required": false,
                    "description": "List of filters to apply to the webhook"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the webhook"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the webhook"
                },
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "The URL to call when the webhook is triggered"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the webhook"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the webhook was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the webhook was last updated"
                }
            ]
        },
        "list_webhooks": {
            "name": "List Webhooks",
            "description": "List webhook endpoints in your account.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of records to return"
                },
                {
                    "name": "pageSize",
                    "type": "number",
                    "required": false,
                    "description": "Number of records per page"
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number"
                },
                {
                    "name": "pageToken",
                    "type": "string",
                    "required": false,
                    "description": "Token for the next page of results"
                }
            ],
            "outputType": [
                {
                    "name": "webhooks",
                    "type": "array",
                    "required": true,
                    "description": "List of webhooks"
                },
                {
                    "name": "hasMore",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more webhooks available"
                }
            ]
        },
        "get_webhook": {
            "name": "Get Webhook",
            "description": "Get a webhook endpoint by its SID.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the webhook"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the webhook"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the webhook"
                },
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "The URL to call when the webhook is triggered"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the webhook"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the webhook was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the webhook was last updated"
                }
            ]
        },
        "update_webhook": {
            "name": "Update Webhook",
            "description": "Update a webhook endpoint.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the webhook"
                },
                {
                    "name": "url",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the webhook is triggered"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": false,
                    "description": "A human-readable description of the webhook"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": false,
                    "description": "The status of the webhook"
                },
                {
                    "name": "statusCallback",
                    "type": "string",
                    "required": false,
                    "description": "The URL to call when the webhook status changes"
                },
                {
                    "name": "statusCallbackMethod",
                    "type": "string",
                    "required": false,
                    "description": "The HTTP method to use for status callbacks"
                },
                {
                    "name": "filters",
                    "type": "array",
                    "required": false,
                    "description": "List of filters to apply to the webhook"
                }
            ],
            "outputType": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the webhook"
                },
                {
                    "name": "accountSid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the account"
                },
                {
                    "name": "friendlyName",
                    "type": "string",
                    "required": true,
                    "description": "A human-readable description of the webhook"
                },
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "The URL to call when the webhook is triggered"
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the webhook"
                },
                {
                    "name": "dateCreated",
                    "type": "string",
                    "required": true,
                    "description": "The date the webhook was created"
                },
                {
                    "name": "dateUpdated",
                    "type": "string",
                    "required": true,
                    "description": "The date the webhook was last updated"
                }
            ]
        },
        "delete_webhook": {
            "name": "Delete Webhook",
            "description": "Delete a webhook endpoint.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "sid",
                    "type": "string",
                    "required": true,
                    "description": "The unique string that identifies the webhook"
                }
            ],
            "outputType": [
                {
                    "name": "success",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the webhook was successfully deleted"
                }
            ]
        },
        "validate_webhook_signature": {
            "name": "Validate Webhook Signature",
            "description": "Validate the signature of a webhook request.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "url",
                    "type": "string",
                    "required": true,
                    "description": "The URL that was called"
                },
                {
                    "name": "params",
                    "type": "object",
                    "required": true,
                    "description": "The parameters that were sent with the request"
                },
                {
                    "name": "signature",
                    "type": "string",
                    "required": true,
                    "description": "The signature to validate"
                },
                {
                    "name": "authToken",
                    "type": "string",
                    "required": false,
                    "description": "The auth token to use for validation"
                }
            ],
            "outputType": [
                {
                    "name": "valid",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the signature is valid"
                },
                {
                    "name": "expectedSignature",
                    "type": "string",
                    "required": true,
                    "description": "The expected signature"
                },
                {
                    "name": "providedSignature",
                    "type": "string",
                    "required": true,
                    "description": "The provided signature"
                }
            ]
        }
    }
}