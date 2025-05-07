export default {
    "name": "Slack",
    "slug": "slack",
    "version": "0.1.34",
    "shortDescription": "Access Slack API solutions",
    "description": "Slack integration for WeWeb that provides comprehensive access to the Slack platform including sending messages, creating channels, managing users, handling files, and querying information about workspaces.",
    "svgLogo": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 256 256\"><!-- Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt --><path fill=\"#E01E5A\" d=\"M53.841 161.32c0 14.832-11.987 26.82-26.819 26.82S.203 176.152.203 161.32c0-14.831 11.987-26.818 26.82-26.818H53.84zm13.41 0c0-14.831 11.987-26.818 26.819-26.818s26.819 11.987 26.819 26.819v67.047c0 14.832-11.987 26.82-26.82 26.82c-14.83 0-26.818-11.988-26.818-26.82z\"/><path fill=\"#36C5F0\" d=\"M94.07 53.638c-14.832 0-26.82-11.987-26.82-26.819S79.239 0 94.07 0s26.819 11.987 26.819 26.819v26.82zm0 13.613c14.832 0 26.819 11.987 26.819 26.819s-11.987 26.819-26.82 26.819H26.82C11.987 120.889 0 108.902 0 94.069c0-14.83 11.987-26.818 26.819-26.818z\"/><path fill=\"#2EB67D\" d=\"M201.55 94.07c0-14.832 11.987-26.82 26.818-26.82s26.82 11.988 26.82 26.82s-11.988 26.819-26.82 26.819H201.55zm-13.41 0c0 14.832-11.988 26.819-26.82 26.819c-14.831 0-26.818-11.987-26.818-26.82V26.82C134.502 11.987 146.489 0 161.32 0s26.819 11.987 26.819 26.819z\"/><path fill=\"#ECB22E\" d=\"M161.32 201.55c14.832 0 26.82 11.987 26.82 26.818s-11.988 26.82-26.82 26.82c-14.831 0-26.818-11.988-26.818-26.82V201.55zm0-13.41c-14.831 0-26.818-11.988-26.818-26.82c0-14.831 11.987-26.818 26.819-26.818h67.25c14.832 0 26.82 11.987 26.82 26.819s-11.988 26.819-26.82 26.819z\"/></svg>",
    "secrets": [
        {
            "name": "SLACK_BOT_TOKEN",
            "description": "Your Slack Bot User OAuth Token"
        },
        {
            "name": "SLACK_SIGNING_SECRET",
            "description": "Your Slack Signing Secret for verifying webhook requests"
        }
    ],
    "methods": {
        "post_message": {
            "name": "Post Message",
            "description": "Send a message to a channel or user in Slack.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "channel",
                    "type": "string",
                    "required": true,
                    "description": "Channel, private group, or IM channel to send message to. Can be an encoded ID, or a name."
                },
                {
                    "name": "text",
                    "type": "string",
                    "required": false,
                    "description": "Text of the message to send. This field is usually required, unless you're providing only attachments or blocks."
                },
                {
                    "name": "as_user",
                    "type": "boolean",
                    "required": false,
                    "description": "Pass true to post the message as the authenticated user."
                },
                {
                    "name": "attachments",
                    "type": "array",
                    "required": false,
                    "description": "A JSON-based array of structured attachments."
                },
                {
                    "name": "blocks",
                    "type": "array",
                    "required": false,
                    "description": "A JSON-based array of structured blocks."
                },
                {
                    "name": "thread_ts",
                    "type": "string",
                    "required": false,
                    "description": "Timestamp of the parent message to reply in a thread."
                },
                {
                    "name": "mrkdwn",
                    "type": "boolean",
                    "required": false,
                    "description": "Determines whether text field is rendered according to mrkdwn formatting or as plain text."
                },
                {
                    "name": "parse",
                    "type": "string",
                    "required": false,
                    "description": "Change how messages are treated (none or full)."
                },
                {
                    "name": "link_names",
                    "type": "boolean",
                    "required": false,
                    "description": "Find and link channel names and usernames."
                },
                {
                    "name": "unfurl_links",
                    "type": "boolean",
                    "required": false,
                    "description": "Pass true to enable unfurling of primarily text-based content."
                },
                {
                    "name": "unfurl_media",
                    "type": "boolean",
                    "required": false,
                    "description": "Pass false to disable unfurling of media content."
                },
                {
                    "name": "username",
                    "type": "string",
                    "required": false,
                    "description": "Set your bot's user name. Must be used in conjunction with as_user set to false."
                },
                {
                    "name": "icon_emoji",
                    "type": "string",
                    "required": false,
                    "description": "Emoji to use as the icon for this message. Overrides icon_url."
                },
                {
                    "name": "icon_url",
                    "type": "string",
                    "required": false,
                    "description": "URL to an image to use as the icon for this message."
                },
                {
                    "name": "reply_broadcast",
                    "type": "boolean",
                    "required": false,
                    "description": "Used in conjunction with thread_ts and indicates whether reply should be made visible to everyone in the channel or conversation."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "channel",
                    "type": "string",
                    "required": true,
                    "description": "Channel where the message was posted."
                },
                {
                    "name": "ts",
                    "type": "string",
                    "required": true,
                    "description": "Timestamp of the message."
                },
                {
                    "name": "message",
                    "type": "object",
                    "required": true,
                    "description": "Message that was posted.",
                    "fields": [
                        {
                            "name": "text",
                            "type": "string",
                            "required": true,
                            "description": "Text content of the message."
                        },
                        {
                            "name": "username",
                            "type": "string",
                            "required": false,
                            "description": "Username displayed for the message."
                        },
                        {
                            "name": "bot_id",
                            "type": "string",
                            "required": false,
                            "description": "Bot ID if the message was posted by a bot."
                        },
                        {
                            "name": "attachments",
                            "type": "array",
                            "required": false,
                            "description": "Attachments added to the message."
                        },
                        {
                            "name": "blocks",
                            "type": "array",
                            "required": false,
                            "description": "Blocks included in the message."
                        },
                        {
                            "name": "type",
                            "type": "string",
                            "required": true,
                            "description": "Type of message (typically 'message')."
                        },
                        {
                            "name": "subtype",
                            "type": "string",
                            "required": false,
                            "description": "Subtype of message (e.g., 'bot_message')."
                        },
                        {
                            "name": "ts",
                            "type": "string",
                            "required": true,
                            "description": "Timestamp of the message."
                        }
                    ]
                }
            ]
        },
        "create_channel": {
            "name": "Create Channel",
            "description": "Creates a new channel in a workspace.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "Name of the channel to create. Must be lowercase, without spaces or periods, and cannot be longer than 80 characters."
                },
                {
                    "name": "is_private",
                    "type": "boolean",
                    "required": false,
                    "description": "Set to true to create a private channel instead of a public one."
                },
                {
                    "name": "validate",
                    "type": "boolean",
                    "required": false,
                    "description": "Whether to validate the channel name or not."
                },
                {
                    "name": "team_id",
                    "type": "string",
                    "required": false,
                    "description": "The ID of the workspace to create the channel in."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "channel",
                    "type": "object",
                    "required": true,
                    "description": "Information about the created channel.",
                    "fields": [
                        {
                            "name": "id",
                            "type": "string",
                            "required": true,
                            "description": "ID of the channel."
                        },
                        {
                            "name": "name",
                            "type": "string",
                            "required": true,
                            "description": "Name of the channel."
                        },
                        {
                            "name": "is_channel",
                            "type": "boolean",
                            "required": true,
                            "description": "Whether it's a standard channel."
                        },
                        {
                            "name": "is_private",
                            "type": "boolean",
                            "required": true,
                            "description": "Whether it's a private channel."
                        },
                        {
                            "name": "created",
                            "type": "number",
                            "required": true,
                            "description": "Timestamp when the channel was created."
                        },
                        {
                            "name": "creator",
                            "type": "string",
                            "required": true,
                            "description": "User ID of the creator."
                        },
                        {
                            "name": "is_member",
                            "type": "boolean",
                            "required": true,
                            "description": "Whether the authenticated user is a member."
                        }
                    ]
                }
            ]
        },
        "invite_to_channel": {
            "name": "Invite to Channel",
            "description": "Invites users to a channel.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "channel",
                    "type": "string",
                    "required": true,
                    "description": "Channel to invite users to (ID)."
                },
                {
                    "name": "users",
                    "type": "string",
                    "required": true,
                    "description": "Comma-separated list of user IDs to invite."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "channel",
                    "type": "object",
                    "required": true,
                    "description": "Information about the channel."
                }
            ]
        },
        "archive_channel": {
            "name": "Archive Channel",
            "description": "Archives a channel.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "channel",
                    "type": "string",
                    "required": true,
                    "description": "Channel to archive (ID)."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                }
            ]
        },
        "list_channels": {
            "name": "List Channels",
            "description": "Lists all channels in a workspace.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "exclude_archived",
                    "type": "boolean",
                    "required": false,
                    "description": "Don't return archived channels."
                },
                {
                    "name": "types",
                    "type": "string",
                    "required": false,
                    "description": "Types of conversations to include (default: public_channel)."
                },
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of channels to return."
                },
                {
                    "name": "cursor",
                    "type": "string",
                    "required": false,
                    "description": "Pagination cursor for next page."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "channels",
                    "type": "array",
                    "required": true,
                    "description": "List of channels."
                },
                {
                    "name": "response_metadata",
                    "type": "object",
                    "required": false,
                    "description": "Metadata about the response.",
                    "fields": [
                        {
                            "name": "next_cursor",
                            "type": "string",
                            "required": false,
                            "description": "Cursor for next page of results."
                        }
                    ]
                }
            ]
        },
        "get_channel_info": {
            "name": "Get Channel Info",
            "description": "Gets information about a channel.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "channel",
                    "type": "string",
                    "required": true,
                    "description": "Channel to get info on (ID)."
                },
                {
                    "name": "include_locale",
                    "type": "boolean",
                    "required": false,
                    "description": "Set to true to receive the locale for this channel."
                },
                {
                    "name": "include_num_members",
                    "type": "boolean",
                    "required": false,
                    "description": "Set to true to include the number of members in the channel."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "channel",
                    "type": "object",
                    "required": true,
                    "description": "Information about the channel."
                }
            ]
        },
        "list_users": {
            "name": "List Users",
            "description": "Lists all users in a workspace.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "limit",
                    "type": "number",
                    "required": false,
                    "description": "Maximum number of users to return."
                },
                {
                    "name": "cursor",
                    "type": "string",
                    "required": false,
                    "description": "Pagination cursor for next page."
                },
                {
                    "name": "include_locale",
                    "type": "boolean",
                    "required": false,
                    "description": "Set to true to receive the locale for users."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "members",
                    "type": "array",
                    "required": true,
                    "description": "List of users."
                },
                {
                    "name": "response_metadata",
                    "type": "object",
                    "required": false,
                    "description": "Metadata about the response.",
                    "fields": [
                        {
                            "name": "next_cursor",
                            "type": "string",
                            "required": false,
                            "description": "Cursor for next page of results."
                        }
                    ]
                }
            ]
        },
        "get_user_info": {
            "name": "Get User Info",
            "description": "Gets information about a user.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "user",
                    "type": "string",
                    "required": true,
                    "description": "User to get info on (ID)."
                },
                {
                    "name": "include_locale",
                    "type": "boolean",
                    "required": false,
                    "description": "Set to true to receive the locale for this user."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "user",
                    "type": "object",
                    "required": true,
                    "description": "Information about the user."
                }
            ]
        },
        "add_reaction": {
            "name": "Add Reaction",
            "description": "Adds a reaction to a message.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "channel",
                    "type": "string",
                    "required": true,
                    "description": "Channel containing the message (ID)."
                },
                {
                    "name": "timestamp",
                    "type": "string",
                    "required": true,
                    "description": "Timestamp of the message to add reaction to."
                },
                {
                    "name": "name",
                    "type": "string",
                    "required": true,
                    "description": "Reaction emoji name (without colons)."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                }
            ]
        },
        "upload_file": {
            "name": "Upload File",
            "description": "Uploads a file to Slack.",
            "recommendedHttpMethod": "POST",
            "inputFields": [
                {
                    "name": "file",
                    "type": "string",
                    "required": false,
                    "description": "Base64-encoded file content to upload."
                },
                {
                    "name": "content",
                    "type": "string",
                    "required": false,
                    "description": "File content as string (text files only)."
                },
                {
                    "name": "filename",
                    "type": "string",
                    "required": false,
                    "description": "Filename of the file."
                },
                {
                    "name": "filetype",
                    "type": "string",
                    "required": false,
                    "description": "File type identifier (e.g., 'png', 'txt')."
                },
                {
                    "name": "title",
                    "type": "string",
                    "required": false,
                    "description": "Title of the file."
                },
                {
                    "name": "initial_comment",
                    "type": "string",
                    "required": false,
                    "description": "Initial comment to add to the file."
                },
                {
                    "name": "channels",
                    "type": "string",
                    "required": false,
                    "description": "Comma-separated list of channel IDs or names to share the file with."
                },
                {
                    "name": "thread_ts",
                    "type": "string",
                    "required": false,
                    "description": "Timestamp of a thread to share the file in."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "file",
                    "type": "object",
                    "required": true,
                    "description": "Information about the uploaded file."
                }
            ]
        },
        "search_messages": {
            "name": "Search Messages",
            "description": "Searches for messages matching a query.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "query",
                    "type": "string",
                    "required": true,
                    "description": "Search query to find messages."
                },
                {
                    "name": "sort",
                    "type": "string",
                    "required": false,
                    "description": "Sort direction (asc or desc)."
                },
                {
                    "name": "sort_by",
                    "type": "string",
                    "required": false,
                    "description": "Field to sort by (timestamp, score, relevance)."
                },
                {
                    "name": "count",
                    "type": "number",
                    "required": false,
                    "description": "Number of results to return per page."
                },
                {
                    "name": "page",
                    "type": "number",
                    "required": false,
                    "description": "Page number of results to return."
                },
                {
                    "name": "highlight",
                    "type": "boolean",
                    "required": false,
                    "description": "Pass true to enable query term highlighting."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "messages",
                    "type": "object",
                    "required": true,
                    "description": "Search results for messages.",
                    "fields": [
                        {
                            "name": "matches",
                            "type": "array",
                            "required": true,
                            "description": "List of matching messages."
                        },
                        {
                            "name": "paging",
                            "type": "object",
                            "required": true,
                            "description": "Paging information."
                        }
                    ]
                }
            ]
        },
        "get_team_info": {
            "name": "Get Team Info",
            "description": "Gets information about a workspace.",
            "recommendedHttpMethod": "GET",
            "inputFields": [
                {
                    "name": "team",
                    "type": "string",
                    "required": false,
                    "description": "Team ID to get info on. If omitted, will return information about the current team."
                }
            ],
            "outputType": [
                {
                    "name": "ok",
                    "type": "boolean",
                    "required": true,
                    "description": "Indicates whether the API call was successful."
                },
                {
                    "name": "team",
                    "type": "object",
                    "required": true,
                    "description": "Information about the team/workspace."
                }
            ]
        }
    }
}