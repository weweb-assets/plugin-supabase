export default {
    "name": "OpenAI",
    "slug": "openai",
    "version": "1.0.0",
    "shortDescription": "Access OpenAI API solutions",
    "description": "OpenAI integration for WeWeb that provides comprehensive access to the OpenAI platform including chat completions, embeddings, moderation, image generation, audio processing, assistants API, vision, fine-tuning, file management, and model information.",
    "svgLogo": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"31.51\" height=\"32\" viewBox=\"0 0 256 260\"><!-- Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt --><path d=\"M239.184 106.203a64.72 64.72 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.72 64.72 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.67 64.67 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.77 64.77 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483m-97.56 136.338a48.4 48.4 0 0 1-31.105-11.255l1.535-.87l51.67-29.825a8.6 8.6 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601M37.158 197.93a48.35 48.35 0 0 1-5.781-32.589l1.534.921l51.722 29.826a8.34 8.34 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803M23.549 85.38a48.5 48.5 0 0 1 25.58-21.333v61.39a8.29 8.29 0 0 0 4.195 7.316l62.874 36.272l-21.845 12.636a.82.82 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405zm179.466 41.695l-63.08-36.63L161.73 77.86a.82.82 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.54 8.54 0 0 0-4.4-7.213m21.742-32.69l-1.535-.922l-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.72.72 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391zM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87l-51.67 29.825a8.6 8.6 0 0 0-4.246 7.367zm11.868-25.58L128.067 97.3l28.188 16.218v32.434l-28.086 16.218l-28.188-16.218z\"/></svg>",
    "secrets": [
        {
            "name": "OPENAI_API_KEY",
            "description": "Your OpenAI API Key"
        },
        {
            "name": "OPENAI_ORGANIZATION_ID",
            "description": "Your OpenAI Organization ID (optional)"
        }
    ],
    "methods": {
        "create_chat_completion": {
            "name": "Chat Completion",
            "description": "Generate text responses from OpenAI's GPT models based on conversation history.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "messages",
                    "type": "array",
                    "required": true,
                    "description": "A list of messages comprising the conversation.",
                    "fields": [
                        {
                            "name": "role",
                            "type": "string",
                            "required": true,
                            "description": "The role of the message author (system, user, assistant, or tool)."
                        },
                        {
                            "name": "content",
                            "type": "string",
                            "required": true,
                            "description": "The content of the message."
                        },
                        {
                            "name": "name",
                            "type": "string",
                            "required": false,
                            "description": "The name of the author of this message."
                        },
                        {
                            "name": "tool_call_id",
                            "type": "string",
                            "required": false,
                            "description": "For tool messages, the ID of the tool call this message is responding to."
                        }
                    ]
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "ID of the model to use (e.g., gpt-4, gpt-3.5-turbo)."
                },
                {
                    "name": "temperature",
                    "type": "number",
                    "required": false,
                    "description": "Controls randomness in the output (0-2). Lower values make output more deterministic."
                },
                {
                    "name": "max_tokens",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of tokens to generate in the completion."
                },
                {
                    "name": "top_p",
                    "type": "number",
                    "required": false,
                    "description": "Alternative to temperature, nucleus sampling. Top-p = 0.1 means only tokens comprising the top 10% probability mass are considered."
                },
                {
                    "name": "frequency_penalty",
                    "type": "number",
                    "required": false,
                    "description": "Decreases likelihood of repeating the same tokens (-2.0 to 2.0)."
                },
                {
                    "name": "presence_penalty",
                    "type": "number",
                    "required": false,
                    "description": "Increases likelihood of new topics (-2.0 to 2.0)."
                },
                {
                    "name": "stream",
                    "type": "boolean",
                    "required": false,
                    "description": "Stream partial progress back rather than waiting for completion."
                },
                {
                    "name": "stop",
                    "type": "string|array",
                    "required": false,
                    "description": "One or more sequences where the API will stop generating further tokens."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the chat completion."
                },
                {
                    "name": "choices",
                    "type": "array",
                    "required": true,
                    "description": "The list of completion choices generated.",
                    "fields": [
                        {
                            "name": "message",
                            "type": "object",
                            "required": true,
                            "description": "The message output by the model.",
                            "fields": [
                                {
                                    "name": "role",
                                    "type": "string",
                                    "required": true,
                                    "description": "The role of the author of this message."
                                },
                                {
                                    "name": "content",
                                    "type": "string",
                                    "required": true,
                                    "description": "The content of the message."
                                },
                                {
                                    "name": "tool_calls",
                                    "type": "array",
                                    "required": false,
                                    "description": "Tool calls generated by the model.",
                                    "fields": [
                                        {
                                            "name": "id",
                                            "type": "string",
                                            "required": true,
                                            "description": "The ID of the tool call."
                                        },
                                        {
                                            "name": "type",
                                            "type": "string",
                                            "required": true,
                                            "description": "The type of the tool call."
                                        },
                                        {
                                            "name": "function",
                                            "type": "object",
                                            "required": true,
                                            "description": "Function call details."
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "finish_reason",
                            "type": "string",
                            "required": true,
                            "description": "The reason the model stopped generating (stop, length, content_filter, tool_calls, etc.)"
                        },
                        {
                            "name": "index",
                            "type": "number",
                            "required": true,
                            "description": "Index of this completion choice."
                        }
                    ]
                },
                {
                    "name": "created",
                    "type": "number",
                    "required": true,
                    "description": "UNIX timestamp of when the completion was created."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The model used for completion."
                },
                {
                    "name": "usage",
                    "type": "object",
                    "required": true,
                    "description": "Usage statistics for the completion request.",
                    "fields": [
                        {
                            "name": "prompt_tokens",
                            "type": "number",
                            "required": true,
                            "description": "Number of tokens in the prompt."
                        },
                        {
                            "name": "completion_tokens",
                            "type": "number",
                            "required": true,
                            "description": "Number of tokens in the completion."
                        },
                        {
                            "name": "total_tokens",
                            "type": "number",
                            "required": true,
                            "description": "Total number of tokens used (prompt + completion)."
                        }
                    ]
                }
            ]
        },
        "create_embeddings": {
            "name": "Text Embeddings",
            "description": "Convert text into vector embeddings for semantic search, clustering, and similarity analysis.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "input",
                    "type": "string|array",
                    "required": true,
                    "description": "Input text to embed, can be a string or array of strings."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "ID of the model to use (e.g., text-embedding-ada-002)."
                },
                {
                    "name": "encoding_format",
                    "type": "string",
                    "required": false,
                    "description": "The format to return the embeddings in (float or base64)."
                },
                {
                    "name": "dimensions",
                    "type": "number",
                    "required": false,
                    "description": "The number of dimensions the resulting output embeddings should have."
                }
            ],
            "outputType": [
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of embedding objects.",
                    "fields": [
                        {
                            "name": "embedding",
                            "type": "array",
                            "required": true,
                            "description": "The embedding vector, which is a list of floats."
                        },
                        {
                            "name": "index",
                            "type": "number",
                            "required": true,
                            "description": "The index of the embedding in the list."
                        },
                        {
                            "name": "object",
                            "type": "string",
                            "required": true,
                            "description": "The object type (always 'embedding')."
                        }
                    ]
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The model used for generating embeddings."
                },
                {
                    "name": "usage",
                    "type": "object",
                    "required": true,
                    "description": "Usage statistics for the request.",
                    "fields": [
                        {
                            "name": "prompt_tokens",
                            "type": "number",
                            "required": true,
                            "description": "Number of tokens in the prompt."
                        },
                        {
                            "name": "total_tokens",
                            "type": "number",
                            "required": true,
                            "description": "Total number of tokens used."
                        }
                    ]
                }
            ]
        },
        "generate_image": {
            "name": "Image Generation",
            "description": "Create images from textual descriptions using DALL-E models.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "prompt",
                    "type": "string",
                    "required": true,
                    "description": "Text description of the desired image."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": false,
                    "description": "The model to use for image generation (e.g., dall-e-3)."
                },
                {
                    "name": "n",
                    "type": "number",
                    "required": false,
                    "description": "Number of images to generate (default 1)."
                },
                {
                    "name": "size",
                    "type": "string",
                    "required": false,
                    "description": "Size of the generated images (e.g., 1024x1024, 1792x1024, 1024x1792)."
                },
                {
                    "name": "quality",
                    "type": "string",
                    "required": false,
                    "description": "Quality of the generated images (standard or hd)."
                },
                {
                    "name": "style",
                    "type": "string",
                    "required": false,
                    "description": "Style of the generated images (vivid or natural)."
                },
                {
                    "name": "response_format",
                    "type": "string",
                    "required": false,
                    "description": "Format in which to return the generated images (url or b64_json)."
                }
            ],
            "outputType": [
                {
                    "name": "created",
                    "type": "number",
                    "required": true,
                    "description": "UNIX timestamp of when the images were created."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of generated image objects.",
                    "fields": [
                        {
                            "name": "url",
                            "type": "string",
                            "required": false,
                            "description": "URL to the generated image (if response_format=url)."
                        },
                        {
                            "name": "b64_json",
                            "type": "string",
                            "required": false,
                            "description": "Base64-encoded JSON string of the generated image (if response_format=b64_json)."
                        },
                        {
                            "name": "revised_prompt",
                            "type": "string",
                            "required": false,
                            "description": "The prompt that was actually used to generate the image, after any revisions."
                        }
                    ]
                }
            ]
        },
        "create_vision_completion": {
            "name": "Vision Completion",
            "description": "Generate text responses from images using OpenAI's vision capabilities.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "ID of the model to use (must support vision, e.g., gpt-4-vision-preview)."
                },
                {
                    "name": "messages",
                    "type": "array",
                    "required": true,
                    "description": "A list of messages comprising the conversation, including image content.",
                    "fields": [
                        {
                            "name": "role",
                            "type": "string",
                            "required": true,
                            "description": "The role of the message author (system, user, assistant)."
                        },
                        {
                            "name": "content",
                            "type": "array|string",
                            "required": true,
                            "description": "The content of the message, either a string or an array of text and image URL objects."
                        }
                    ]
                },
                {
                    "name": "max_tokens",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of tokens to generate in the completion."
                },
                {
                    "name": "temperature",
                    "type": "number",
                    "required": false,
                    "description": "Controls randomness in the output (0-2)."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the chat completion."
                },
                {
                    "name": "choices",
                    "type": "array",
                    "required": true,
                    "description": "The list of completion choices generated."
                },
                {
                    "name": "created",
                    "type": "number",
                    "required": true,
                    "description": "UNIX timestamp of when the completion was created."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The model used for completion."
                },
                {
                    "name": "usage",
                    "type": "object",
                    "required": true,
                    "description": "Usage statistics for the completion request."
                }
            ]
        },
        "create_moderation": {
            "name": "Content Moderation",
            "description": "Check if content violates OpenAI's content policy by detecting harmful or unsafe text.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "input",
                    "type": "string|array",
                    "required": true,
                    "description": "The input text to classify, can be a string or array of strings."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": false,
                    "description": "The moderation model to use (text-moderation-latest or text-moderation-stable)."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "Unique identifier for the moderation request."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The moderation model used."
                },
                {
                    "name": "results",
                    "type": "array",
                    "required": true,
                    "description": "A list of moderation objects.",
                    "fields": [
                        {
                            "name": "categories",
                            "type": "object",
                            "required": true,
                            "description": "Categories of harmful content detected.",
                            "fields": [
                                {
                                    "name": "sexual",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Sexual content."
                                },
                                {
                                    "name": "hate",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Hateful content."
                                },
                                {
                                    "name": "harassment",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Harassment content."
                                },
                                {
                                    "name": "self-harm",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Self-harm content."
                                },
                                {
                                    "name": "sexual/minors",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Sexual content involving minors."
                                },
                                {
                                    "name": "hate/threatening",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Hateful/threatening content."
                                },
                                {
                                    "name": "violence/graphic",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Violent/graphic content."
                                },
                                {
                                    "name": "self-harm/intent",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Self-harm with intent."
                                },
                                {
                                    "name": "self-harm/instructions",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Self-harm instructions."
                                },
                                {
                                    "name": "harassment/threatening",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Harassment/threatening content."
                                },
                                {
                                    "name": "violence",
                                    "type": "boolean",
                                    "required": true,
                                    "description": "Violent content."
                                }
                            ]
                        },
                        {
                            "name": "category_scores",
                            "type": "object",
                            "required": true,
                            "description": "Score for each category.",
                            "fields": [
                                {
                                    "name": "sexual",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for sexual category."
                                },
                                {
                                    "name": "hate",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for hate category."
                                },
                                {
                                    "name": "harassment",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for harassment category."
                                },
                                {
                                    "name": "self-harm",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for self-harm category."
                                },
                                {
                                    "name": "sexual/minors",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for sexual/minors category."
                                },
                                {
                                    "name": "hate/threatening",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for hate/threatening category."
                                },
                                {
                                    "name": "violence/graphic",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for violence/graphic category."
                                },
                                {
                                    "name": "self-harm/intent",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for self-harm/intent category."
                                },
                                {
                                    "name": "self-harm/instructions",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for self-harm/instructions category."
                                },
                                {
                                    "name": "harassment/threatening",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for harassment/threatening category."
                                },
                                {
                                    "name": "violence",
                                    "type": "number",
                                    "required": true,
                                    "description": "Score for violence category."
                                }
                            ]
                        },
                        {
                            "name": "flagged",
                            "type": "boolean",
                            "required": true,
                            "description": "Whether the content was flagged as harmful."
                        }
                    ]
                }
            ]
        },
        "create_transcription": {
            "name": "Audio Transcription",
            "description": "Transcribe audio into text using OpenAI's speech-to-text models.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "file",
                    "type": "string",
                    "required": true,
                    "description": "Base64-encoded audio file to transcribe (MP3, MP4, MPEG, MPGA, M4A, WAV, or WEBM)."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "ID of the model to use (e.g., whisper-1)."
                },
                {
                    "name": "language",
                    "type": "string",
                    "required": false,
                    "description": "The language of the input audio (ISO-639-1 format)."
                },
                {
                    "name": "prompt",
                    "type": "string",
                    "required": false,
                    "description": "Optional text to guide the model's style or continue a previous audio segment."
                },
                {
                    "name": "response_format",
                    "type": "string",
                    "required": false,
                    "description": "Format of the transcript output (json, text, srt, verbose_json, or vtt)."
                },
                {
                    "name": "temperature",
                    "type": "number",
                    "required": false,
                    "description": "Sampling temperature between 0 and 1."
                }
            ],
            "outputType": [
                {
                    "name": "text",
                    "type": "string",
                    "required": true,
                    "description": "The transcribed text."
                }
            ]
        },
        "create_translation": {
            "name": "Audio Translation",
            "description": "Translate audio into English text using OpenAI's speech-to-text models.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "file",
                    "type": "string",
                    "required": true,
                    "description": "Base64-encoded audio file to translate (MP3, MP4, MPEG, MPGA, M4A, WAV, or WEBM)."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "ID of the model to use (e.g., whisper-1)."
                },
                {
                    "name": "prompt",
                    "type": "string",
                    "required": false,
                    "description": "Optional text to guide the model's style or continue a previous audio segment."
                },
                {
                    "name": "response_format",
                    "type": "string",
                    "required": false,
                    "description": "Format of the translation output (json, text, srt, verbose_json, or vtt)."
                },
                {
                    "name": "temperature",
                    "type": "number",
                    "required": false,
                    "description": "Sampling temperature between 0 and 1."
                }
            ],
            "outputType": [
                {
                    "name": "text",
                    "type": "string",
                    "required": true,
                    "description": "The translated text in English."
                }
            ]
        },
        "create_image_variation": {
            "name": "Create Image Variation",
            "description": "Create variations of an existing image.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "image",
                    "type": "string",
                    "required": true,
                    "description": "Base64-encoded image to use as the basis for variation creation."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": false,
                    "description": "The model to use for image variation generation."
                },
                {
                    "name": "n",
                    "type": "number",
                    "required": false,
                    "description": "Number of variations to generate (default 1)."
                },
                {
                    "name": "size",
                    "type": "string",
                    "required": false,
                    "description": "Size of the generated images (e.g., 1024x1024)."
                },
                {
                    "name": "response_format",
                    "type": "string",
                    "required": false,
                    "description": "Format in which to return the generated images (url or b64_json)."
                }
            ],
            "outputType": [
                {
                    "name": "created",
                    "type": "number",
                    "required": true,
                    "description": "UNIX timestamp of when the variations were created."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of generated image objects."
                }
            ]
        },
        "edit_image": {
            "name": "Edit Image",
            "description": "Edit an image by providing a prompt and mask.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "image",
                    "type": "string",
                    "required": true,
                    "description": "Base64-encoded image to edit."
                },
                {
                    "name": "mask",
                    "type": "string",
                    "required": false,
                    "description": "Base64-encoded mask image where transparent areas indicate where the image should be edited."
                },
                {
                    "name": "prompt",
                    "type": "string",
                    "required": true,
                    "description": "Text description of the desired edits."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": false,
                    "description": "The model to use for image editing."
                },
                {
                    "name": "n",
                    "type": "number",
                    "required": false,
                    "description": "Number of edited images to generate (default 1)."
                },
                {
                    "name": "size",
                    "type": "string",
                    "required": false,
                    "description": "Size of the generated images (e.g., 1024x1024)."
                },
                {
                    "name": "response_format",
                    "type": "string",
                    "required": false,
                    "description": "Format in which to return the generated images (url or b64_json)."
                }
            ],
            "outputType": [
                {
                    "name": "created",
                    "type": "number",
                    "required": true,
                    "description": "UNIX timestamp of when the edited images were created."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "List of generated image objects."
                }
            ]
        },
        "create_assistant": {
            "name": "Create Assistant",
            "description": "Create an AI assistant with specific capabilities and tools.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "ID of the model to use (e.g., gpt-4, gpt-3.5-turbo)."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "The name of the assistant."
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "The description of the assistant."
                },
                {
                    "name": "instructions",
                    "type": "string",
                    "required": false,
                    "description": "The system instructions that the assistant uses."
                },
                {
                    "name": "tools",
                    "type": "array",
                    "required": false,
                    "description": "A list of tools enabled on the assistant."
                },
                {
                    "name": "file_ids",
                    "type": "array",
                    "required": false,
                    "description": "A list of file IDs attached to this assistant."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the assistant."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the assistant."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'assistant')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the assistant was created."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "The name of the assistant."
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "The description of the assistant."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The model used by the assistant."
                },
                {
                    "name": "instructions",
                    "type": "string",
                    "required": false,
                    "description": "The system instructions that the assistant uses."
                },
                {
                    "name": "tools",
                    "type": "array",
                    "required": true,
                    "description": "A list of tools enabled on the assistant."
                },
                {
                    "name": "file_ids",
                    "type": "array",
                    "required": true,
                    "description": "A list of file IDs attached to this assistant."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the assistant."
                }
            ]
        },
        "list_assistants": {
            "name": "List Assistants",
            "description": "List all assistants belonging to the user's organization.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of assistants to return."
                },
                {
                    "name": "order",
                    "type": "string",
                    "required": false,
                    "description": "Sort order by the created_at timestamp (asc or desc)."
                },
                {
                    "name": "after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination for fetching the next page of assistants."
                },
                {
                    "name": "before",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination for fetching the previous page of assistants."
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'list')."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "A list of assistant objects."
                },
                {
                    "name": "first_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the first assistant in the list."
                },
                {
                    "name": "last_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the last assistant in the list."
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more assistants to fetch."
                }
            ]
        },
        "retrieve_assistant": {
            "name": "Retrieve Assistant",
            "description": "Get information about a specific assistant.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "assistantId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the assistant to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the assistant."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always \"assistant\")."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the assistant was created."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "The name of the assistant."
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "The description of the assistant."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The model used by the assistant."
                },
                {
                    "name": "instructions",
                    "type": "string",
                    "required": false,
                    "description": "The system instructions that the assistant uses."
                },
                {
                    "name": "tools",
                    "type": "array",
                    "required": true,
                    "description": "A list of tools enabled on the assistant."
                },
                {
                    "name": "file_ids",
                    "type": "array",
                    "required": true,
                    "description": "A list of file IDs attached to this assistant."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the assistant."
                }
            ]
        },
        "update_assistant": {
            "name": "Update Assistant",
            "description": "Modify an existing assistant.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "assistantId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the assistant to modify."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": false,
                    "description": "ID of the model to use (e.g., gpt-4, gpt-3.5-turbo)."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "The name of the assistant."
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "The description of the assistant."
                },
                {
                    "name": "instructions",
                    "type": "string",
                    "required": false,
                    "description": "The system instructions that the assistant uses."
                },
                {
                    "name": "tools",
                    "type": "array",
                    "required": false,
                    "description": "A list of tools enabled on the assistant."
                },
                {
                    "name": "file_ids",
                    "type": "array",
                    "required": false,
                    "description": "A list of file IDs attached to this assistant."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the assistant."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the assistant."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'assistant')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the assistant was created."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": false,
                    "description": "The name of the assistant."
                },
                {
                    "name": "description",
                    "type": "string",
                    "required": false,
                    "description": "The description of the assistant."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The model used by the assistant."
                },
                {
                    "name": "instructions",
                    "type": "string",
                    "required": false,
                    "description": "The system instructions that the assistant uses."
                },
                {
                    "name": "tools",
                    "type": "array",
                    "required": true,
                    "description": "A list of tools enabled on the assistant."
                },
                {
                    "name": "file_ids",
                    "type": "array",
                    "required": true,
                    "description": "A list of file IDs attached to this assistant."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the assistant."
                }
            ]
        },
        "delete_assistant": {
            "name": "Delete Assistant",
            "description": "Delete an assistant.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "assistantId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the assistant to delete."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the deleted assistant."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'assistant.deleted')."
                },
                {
                    "name": "deleted",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the assistant was successfully deleted."
                }
            ]
        },
        "create_thread": {
            "name": "Create Thread",
            "description": "Create a thread for conversation with an assistant.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "messages",
                    "type": "array",
                    "required": false,
                    "description": "A list of messages to start the thread with."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the thread."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the thread."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the thread was created."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the thread."
                }
            ]
        },
        "retrieve_thread": {
            "name": "Retrieve Thread",
            "description": "Get information about a specific thread.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the thread."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the thread was created."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the thread."
                }
            ]
        },
        "update_thread": {
            "name": "Update Thread",
            "description": "Modify a specific thread.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread to modify."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the thread."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the thread."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the thread was created."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the thread."
                }
            ]
        },
        "delete_thread": {
            "name": "Delete Thread",
            "description": "Delete a specific thread.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread to delete."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the deleted thread."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread.deleted')."
                },
                {
                    "name": "deleted",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the thread was successfully deleted."
                }
            ]
        },
        "create_thread_message": {
            "name": "Create Thread Message",
            "description": "Add a message to an existing thread.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread to add a message to."
                },
                {
                    "name": "message",
                    "type": "object",
                    "required": true,
                    "description": "The message to add to the thread.",
                    "fields": [
                        {
                            "name": "role",
                            "type": "string",
                            "required": true,
                            "description": "The role of the message author (user)."
                        },
                        {
                            "name": "content",
                            "type": "string",
                            "required": true,
                            "description": "The content of the message."
                        },
                        {
                            "name": "file_ids",
                            "type": "array",
                            "required": false,
                            "description": "A list of file IDs to attach to the message."
                        },
                        {
                            "name": "metadata",
                            "type": "object",
                            "required": false,
                            "description": "Set of key-value pairs for storing additional information about the message."
                        }
                    ]
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the message."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread.message')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the message was created."
                },
                {
                    "name": "thread_id",
                    "type": "string",
                    "required": true,
                    "description": "The thread ID that this message belongs to."
                },
                {
                    "name": "role",
                    "type": "string",
                    "required": true,
                    "description": "The role of the entity that created the message."
                },
                {
                    "name": "content",
                    "type": "array",
                    "required": true,
                    "description": "The content of the message."
                },
                {
                    "name": "file_ids",
                    "type": "array",
                    "required": true,
                    "description": "A list of file IDs that the message references."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the message."
                }
            ]
        },
        "list_thread_messages": {
            "name": "List Thread Messages",
            "description": "List all messages from a specific thread.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread to retrieve messages from."
                },
                {
                    "name": "options",
                    "type": "object",
                    "required": false,
                    "description": "Options for listing messages.",
                    "fields": [
                        {
                            "name": "limit",
                            "type": "number",
                            "required": false,
                            "description": "A limit on the number of messages to return."
                        },
                        {
                            "name": "order",
                            "type": "string",
                            "required": false,
                            "description": "Sort order by the created_at timestamp (asc or desc)."
                        },
                        {
                            "name": "after",
                            "type": "string",
                            "required": false,
                            "description": "A cursor for pagination for fetching the next page of messages."
                        },
                        {
                            "name": "before",
                            "type": "string",
                            "required": false,
                            "description": "A cursor for pagination for fetching the previous page of messages."
                        }
                    ]
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'list')."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "A list of message objects."
                },
                {
                    "name": "first_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the first message in the list."
                },
                {
                    "name": "last_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the last message in the list."
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more messages to fetch."
                }
            ]
        },
        "retrieve_thread_message": {
            "name": "Retrieve Thread Message",
            "description": "Get information about a specific message in a thread.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread the message belongs to."
                },
                {
                    "name": "messageId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the message to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the message."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread.message')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the message was created."
                },
                {
                    "name": "thread_id",
                    "type": "string",
                    "required": true,
                    "description": "The thread ID that this message belongs to."
                },
                {
                    "name": "role",
                    "type": "string",
                    "required": true,
                    "description": "The role of the entity that created the message."
                },
                {
                    "name": "content",
                    "type": "array",
                    "required": true,
                    "description": "The content of the message."
                },
                {
                    "name": "file_ids",
                    "type": "array",
                    "required": true,
                    "description": "A list of file IDs that the message references."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the message."
                }
            ]
        },
        "create_thread_run": {
            "name": "Run Assistant on Thread",
            "description": "Run an assistant on a thread to generate a response.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread to run the assistant on."
                },
                {
                    "name": "options",
                    "type": "object",
                    "required": true,
                    "description": "The run options.",
                    "fields": [
                        {
                            "name": "assistant_id",
                            "type": "string",
                            "required": true,
                            "description": "The ID of the assistant to use."
                        },
                        {
                            "name": "instructions",
                            "type": "string",
                            "required": false,
                            "description": "Override for the assistant's instructions."
                        },
                        {
                            "name": "tools",
                            "type": "array",
                            "required": false,
                            "description": "Override for the assistant's tools."
                        },
                        {
                            "name": "metadata",
                            "type": "object",
                            "required": false,
                            "description": "Set of key-value pairs for storing additional information about the run."
                        }
                    ]
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the run."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread.run')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the run was created."
                },
                {
                    "name": "thread_id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread associated with the run."
                },
                {
                    "name": "assistant_id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the assistant associated with the run."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the run (queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired)."
                },
                {
                    "name": "required_action",
                    "type": "object",
                    "required": false,
                    "description": "Details on the action required to continue the run."
                },
                {
                    "name": "last_error",
                    "type": "object",
                    "required": false,
                    "description": "The last error associated with this run."
                },
                {
                    "name": "started_at",
                    "type": "number",
                    "required": false,
                    "description": "The Unix timestamp (in seconds) for when the run was started."
                },
                {
                    "name": "completed_at",
                    "type": "number",
                    "required": false,
                    "description": "The Unix timestamp (in seconds) for when the run was completed."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the run."
                }
            ]
        },
        "retrieve_thread_run": {
            "name": "Retrieve Thread Run",
            "description": "Retrieve information about a specific run on a thread.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread the run belongs to."
                },
                {
                    "name": "runId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the run to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the run."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread.run')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the run was created."
                },
                {
                    "name": "thread_id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread associated with the run."
                },
                {
                    "name": "assistant_id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the assistant associated with the run."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the run (queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired)."
                },
                {
                    "name": "required_action",
                    "type": "object",
                    "required": false,
                    "description": "Details on the action required to continue the run."
                },
                {
                    "name": "last_error",
                    "type": "object",
                    "required": false,
                    "description": "The last error associated with this run."
                },
                {
                    "name": "started_at",
                    "type": "number",
                    "required": false,
                    "description": "The Unix timestamp (in seconds) for when the run was started."
                },
                {
                    "name": "completed_at",
                    "type": "number",
                    "required": false,
                    "description": "The Unix timestamp (in seconds) for when the run was completed."
                },
                {
                    "name": "metadata",
                    "type": "object",
                    "required": false,
                    "description": "Set of key-value pairs for storing additional information about the run."
                }
            ]
        },
        "list_thread_runs": {
            "name": "List Thread Runs",
            "description": "List all runs for a specific thread.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread to list runs for."
                },
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of runs to return."
                },
                {
                    "name": "order",
                    "type": "string",
                    "required": false,
                    "description": "Sort order by the created_at timestamp (asc or desc)."
                },
                {
                    "name": "after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination for fetching the next page of runs."
                },
                {
                    "name": "before",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination for fetching the previous page of runs."
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'list')."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "A list of run objects."
                },
                {
                    "name": "first_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the first run in the list."
                },
                {
                    "name": "last_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the last run in the list."
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more runs to fetch."
                }
            ]
        },
        "cancel_thread_run": {
            "name": "Cancel Thread Run",
            "description": "Cancel a run that is in progress.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread the run belongs to."
                },
                {
                    "name": "runId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the run to cancel."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the run."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread.run')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the run was created."
                },
                {
                    "name": "thread_id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread associated with the run."
                },
                {
                    "name": "assistant_id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the assistant associated with the run."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the run (should be 'cancelling' or 'cancelled')."
                }
            ]
        },
        "list_thread_run_steps": {
            "name": "List Thread Run Steps",
            "description": "List all steps for a specific run.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread the run belongs to."
                },
                {
                    "name": "runId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the run to list steps for."
                },
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "A limit on the number of steps to return."
                },
                {
                    "name": "order",
                    "type": "string",
                    "required": false,
                    "description": "Sort order by the created_at timestamp (asc or desc)."
                },
                {
                    "name": "after",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination for fetching the next page of steps."
                },
                {
                    "name": "before",
                    "type": "string",
                    "required": false,
                    "description": "A cursor for pagination for fetching the previous page of steps."
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'list')."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "A list of run step objects."
                },
                {
                    "name": "first_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the first step in the list."
                },
                {
                    "name": "last_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the last step in the list."
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more steps to fetch."
                }
            ]
        },
        "submit_tool_outputs_to_run": {
            "name": "Submit Tool Outputs To Run",
            "description": "Submit tool outputs for a run that requires action.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "threadId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread the run belongs to."
                },
                {
                    "name": "runId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the run to submit tool outputs for."
                },
                {
                    "name": "tool_outputs",
                    "type": "array",
                    "required": true,
                    "description": "A list of tool outputs to submit.",
                    "fields": [
                        {
                            "name": "tool_call_id",
                            "type": "string",
                            "required": true,
                            "description": "The ID of the tool call to associate with the output."
                        },
                        {
                            "name": "output",
                            "type": "string",
                            "required": true,
                            "description": "The output of the tool call."
                        }
                    ]
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The identifier for the run."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'thread.run')."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The Unix timestamp (in seconds) for when the run was created."
                },
                {
                    "name": "thread_id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the thread associated with the run."
                },
                {
                    "name": "assistant_id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the assistant associated with the run."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the run (should be 'in_progress')."
                }
            ]
        },
        "list_models": {
            "name": "List Models",
            "description": "List all models available to use with the OpenAI API.",
            "recommendedHttpMethod": "GET",
            "inputFields": [],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'list')."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "A list of model objects.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "The model identifier."
                        },
                        {
                            "name": "object",
                            "type": "string",
                            "required": true,
                            "description": "The object type (always 'model')."
                        },
                        {
                            "name": "created",
                            "type": "number",
                            "required": true,
                            "description": "The timestamp when the model was created."
                        },
                        {
                            "name": "owned_by",
                            "type": "string",
                            "required": true,
                            "description": "The organization that owns the model."
                        }
                    ]
                }
            ]
        },
        "retrieve_model": {
            "name": "Retrieve Model",
            "description": "Get information about a specific model.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "modelId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the model to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The model identifier."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'model')."
                },
                {
                    "name": "created",
                    "type": "number",
                    "required": true,
                    "description": "The timestamp when the model was created."
                },
                {
                    "name": "owned_by",
                    "type": "string",
                    "required": true,
                    "description": "The organization that owns the model."
                }
            ]
        },
        "create_fine_tuning_job": {
            "name": "Create Fine-Tuning Job",
            "description": "Create a job to fine-tune a model to your specific training data.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "training_file",
                    "type": "string",
                    "required": true,
                    "description": "The ID of an uploaded file that contains training data."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The name of the base model to fine-tune."
                },
                {
                    "name": "validation_file",
                    "type": "string",
                    "required": false,
                    "description": "The ID of an uploaded file that contains validation data."
                },
                {
                    "name": "hyperparameters",
                    "type": "object",
                    "required": false,
                    "description": "The hyperparameters used for the fine-tuning job."
                },
                {
                    "name": "suffix",
                    "type": "string",
                    "required": false,
                    "description": "A suffix for the fine-tuned model name."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the fine-tuning job."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'fine_tuning.job')."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The name of the base model."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The timestamp for when the fine-tuning job was created."
                },
                {
                    "name": "finished_at",
                    "type": "number",
                    "required": false,
                    "description": "The timestamp for when the fine-tuning job finished."
                },
                {
                    "name": "fine_tuned_model",
                    "type": "string",
                    "required": false,
                    "description": "The name of the fine-tuned model, if the job succeeded."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the fine-tuning job (e.g., pending, running, succeeded, failed)."
                }
            ]
        },
        "list_fine_tuning_jobs": {
            "name": "List Fine-Tuning Jobs",
            "description": "List your organization's fine-tuning jobs.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Number of fine-tuning jobs to retrieve."
                },
                {
                    "name": "after",
                    "type": "string",
                    "required": false,
                    "description": "Identifier for pagination."
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'list')."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "A list of fine-tuning jobs."
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more fine-tuning jobs to retrieve."
                }
            ]
        },
        "retrieve_fine_tuning_job": {
            "name": "Retrieve Fine-Tuning Job",
            "description": "Get information about a specific fine-tuning job.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "jobId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the fine-tuning job to retrieve."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the fine-tuning job."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'fine_tuning.job')."
                },
                {
                    "name": "model",
                    "type": "string",
                    "required": true,
                    "description": "The name of the base model."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The timestamp for when the fine-tuning job was created."
                },
                {
                    "name": "finished_at",
                    "type": "number",
                    "required": false,
                    "description": "The timestamp for when the fine-tuning job finished."
                },
                {
                    "name": "fine_tuned_model",
                    "type": "string",
                    "required": false,
                    "description": "The name of the fine-tuned model, if the job succeeded."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the fine-tuning job."
                }
            ]
        },
        "retrieve_fine_tuning_job_events": {
            "name": "Retrieve Fine-Tuning Job Events",
            "description": "Get status updates for a fine-tuning job.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "jobId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the fine-tuning job to get events for."
                },
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Number of events to retrieve."
                },
                {
                    "name": "after",
                    "type": "string",
                    "required": false,
                    "description": "Identifier for pagination."
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'list')."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "A list of fine-tuning event objects.",
                    "fields": [
                        {
                            "name": "object",
                            "type": "string",
                            "required": true,
                            "description": "The object type (always 'fine_tuning.job.event')."
                        },
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "The ID of the event."
                        },
                        {
                            "name": "created_at",
                            "type": "number",
                            "required": true,
                            "description": "The timestamp for when the event was created."
                        },
                        {
                            "name": "level",
                            "type": "string",
                            "required": true,
                            "description": "The log level of the event (info, warning, error)."
                        },
                        {
                            "name": "message",
                            "type": "string",
                            "required": true,
                            "description": "The event message."
                        }
                    ]
                },
                {
                    "name": "has_more",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether there are more events to retrieve."
                }
            ]
        },
        "cancel_fine_tuning_job": {
            "name": "Cancel Fine-Tuning Job",
            "description": "Cancel a fine-tuning job that is in progress.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "jobId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the fine-tuning job to cancel."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the fine-tuning job."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'fine_tuning.job')."
                },
                {
                    "name": "status",
                    "type": "string",
                    "required": true,
                    "description": "The status of the fine-tuning job (should be 'cancelled')."
                }
            ]
        },
        "upload_file": {
            "name": "Upload File",
            "description": "Upload a file for use with various OpenAI features.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "file",
                    "type": "string",
                    "required": true,
                    "description": "Base64-encoded file content to upload."
                },
                {
                    "name": "purpose",
                    "type": "string",
                    "required": true,
                    "description": "The intended purpose of the file (e.g., 'fine-tune', 'assistants')."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the uploaded file."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'file')."
                },
                {
                    "name": "bytes",
                    "type": "number",
                    "required": true,
                    "description": "The size of the file in bytes."
                },
                {
                    "name": "created_at",
                    "type": "number",
                    "required": true,
                    "description": "The timestamp for when the file was created."
                },
                {
                    "name": "filename",
                    "type": "string",
                    "required": true,
                    "description": "The name of the file."
                },
                {
                    "name": "purpose",
                    "type": "string",
                    "required": true,
                    "description": "The purpose of the file."
                }
            ]
        },
        "list_files": {
            "name": "List Files",
            "description": "List all files that have been uploaded.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "purpose",
                    "type": "string",
                    "required": false,
                    "description": "Filter files by purpose (e.g., 'fine-tune', 'assistants')."
                }
            ],
            "outputType": [
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'list')."
                },
                {
                    "name": "data",
                    "type": "array",
                    "required": true,
                    "description": "A list of file objects."
                }
            ]
        },
        "retrieve_file_content": {
            "name": "Retrieve File Content",
            "description": "Get the contents of a specific file.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "fileId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the file to retrieve content from."
                }
            ],
            "outputType": [
                {
                    "name": "content",
                    "type": "string",
                    "required": true,
                    "description": "The content of the file."
                }
            ]
        },
        "delete_file": {
            "name": "Delete File",
            "description": "Delete a specific file.",
            "recommendedHttpMethod": "DELETE",
            "inputFields": [
                {
                    "name": "fileId",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the file to delete."
                }
            ],
            "outputType": [
                {
                    "name": "id",
                    "type": "string",
                    "required": true,
                    "description": "The ID of the deleted file."
                },
                {
                    "name": "object",
                    "type": "string",
                    "required": true,
                    "description": "The object type (always 'file')."
                },
                {
                    "name": "deleted",
                    "type": "boolean",
                    "required": true,
                    "description": "Whether the file was successfully deleted."
                }
            ]
        }
    }
}