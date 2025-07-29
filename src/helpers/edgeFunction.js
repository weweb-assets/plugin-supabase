import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from '@supabase/supabase-js';

/**
 * Builds a query string from an array or object of queries.
 * @param {Array|Object} queries - Input queries.
 * @returns {string} - Formatted query string (e.g., "?key=value") or empty string.
 */
export function buildQueryString(queries = []) {
    const queryArray = Array.isArray(queries)
        ? queries
        : typeof queries === 'object' && queries !== null
        ? Object.entries(queries).map(([key, value]) => ({ key, value }))
        : [];

    if (!queryArray.length) return '';

    const params = new URLSearchParams();
    for (const item of queryArray) {
        if (item && typeof item.key === 'string') {
            // Ensure key is a string
            params.append(item.key, item.value ?? '');
        }
    }
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Builds a headers object from an array or object of headers.
 * @param {Array|Object} headers - Input headers.
 * @returns {Object<string, string>} - Headers object.
 */
export function buildHeaders(headers = []) {
    const headerObject = {};
    const headersArray = Array.isArray(headers)
        ? headers
        : typeof headers === 'object' && headers !== null
        ? Object.entries(headers).map(([key, value]) => ({ key, value }))
        : [];

    for (const item of headersArray) {
        if (item && typeof item.key === 'string') {
            // Ensure key is a string
            // Ensure value is a string or provide default for header values
            headerObject[item.key] = typeof item.value === 'string' ? item.value : String(item.value ?? '');
        }
    }
    return headerObject;
}

/**
 * Parses a line from an SSE stream.
 * Handles 'data: ' prefix and '[DONE]' signal.
 * Attempts JSON parsing. Returns null for signals, empty lines, or non-JSON data.
 * @param {string} line - The raw line content.
 * @param {object} [logger=console] - Optional logger (like wwUtils or wwLib.wwLog).
 * @returns {object|null} - Parsed JSON data, or null if line should be skipped.
 */
export function parseSseLine(line, logger = console) {
    line = line?.trim();
    if (!line) return null;

    if (line.startsWith('data:')) {
        line = line.substring(5).trim();
    }

    if (line === '[DONE]') {
        logger?.debug?.('[Supabase Stream] Received [DONE] signal.');
        return null;
    }

    if (!line) return null;

    try {
        return JSON.parse(line);
    } catch (parseError) {
        logger?.warn?.(`[Supabase Stream] Skipping non-JSON data line: "${line}"`, { parseError });
        return null;
    }
}

/**
 * Parses the successful response body of a non-streaming function.
 * @param {*} data - The raw response data.
 * @returns {*} - Parsed data (object, string, or original type).
 */
export function parseFunctionResponse(data) {
    try {
        if (typeof data === 'object' && data !== null) return data;
        if (typeof data === 'string') return JSON.parse(data);
        return data;
    } catch (e) {
        if (typeof data === 'string') {
            console.warn('[Supabase] Non-JSON string response received:', data);
            return data;
        }
        throw new Error(`Failed to parse non-streaming function response of type ${typeof data}`, { cause: e });
    }
}

/**
 * Standardizes errors thrown by Supabase function invocation.
 * @param {Error} error - The original error from Supabase invoke.
 * @returns {Promise<Error>} - A new Error object with structured cause.
 */
export async function handleSupabaseInvokeError(error) {
    const status = error?.context?.status;
    let causeData = null;
    let errorType = 'Unknown function invocation error';

    try {
        causeData = error?.context ? await error.context.text?.() : null;
        if (causeData && typeof causeData === 'string') {
            try {
                const jsonData = JSON.parse(causeData);
                causeData = jsonData;
            } catch (jsonErr) {
                // Keep raw text if not JSON
            }
        }
    } catch (e) {
        console.error('Failed to get Supabase error context text', e);
    }

    const cause = {
        name: error?.name,
        message: error?.message,
        status,
        responseBody: causeData,
        originalError: error,
    };

    if (error instanceof FunctionsHttpError) {
        errorType = `Function returned an error status: ${status || 'unknown'}`;
    } else if (error instanceof FunctionsRelayError) {
        errorType = `Function relay error: ${error.message}`;
    } else if (error instanceof FunctionsFetchError) {
        errorType = `Function fetch error: ${error.message}`;
    } else if (error?.message) {
        errorType = error.message;
    }

    const standardizedError = new Error(errorType);
    standardizedError.cause = cause;
    return standardizedError;
}

/**
 * Executes a regular (non-streaming) edge function invocation.
 * @param {Object} params - Function parameters
 * @param {Object} params.instance - Supabase client instance
 * @param {string} params.functionName - Name of the edge function to invoke
 * @param {string} params.queryString - Query string for the request
 * @param {string} params.method - HTTP method (GET, POST, etc.)
 * @param {any} params.body - Request body
 * @param {Object} params.headerObject - Request headers
 * @param {Object} [wwUtils] - Optional logging utility
 * @returns {Promise<any>} - Function response
 */
export async function executeRegularInvocation(
    { instance, functionName, queryString, method, body, headerObject },
    wwUtils
) {
    try {
        const { data, error } = await instance.functions.invoke(functionName + queryString, {
            method,
            body,
            headers: headerObject,
        });

        if (error) throw error;

        const parsedData = parseFunctionResponse(data);
        wwUtils?.log('info', `[Supabase] Edge function executed successfully - ${functionName}`, {
            type: 'response',
            preview: parsedData,
        });

        return parsedData;
    } catch (error) {
        const standardizedError = await handleSupabaseInvokeError(error);
        wwUtils?.log('error', `[Supabase] Edge function error - ${functionName}`, {
            type: 'error',
            preview: standardizedError,
        });
        throw standardizedError;
    }
}

/**
 * Executes a streaming edge function invocation.
 * @param {Object} params - Function parameters
 * @param {Object} params.instance - Supabase client instance
 * @param {string} params.functionName - Name of the edge function to invoke
 * @param {string} params.queryString - Query string for the request
 * @param {string} params.method - HTTP method (GET, POST, etc.)
 * @param {any} params.body - Request body
 * @param {Object} params.headerObject - Request headers
 * @param {string} params.streamVariableId - ID of the variable to update with stream data
 * @param {Object} params.wwLib - Window & Widgets library for variable updates
 * @param {Object} [wwUtils] - Optional logging utility
 * @returns {Promise<any>} - Final accumulated stream data
 */
export async function executeStreamingInvocation(
    { instance, functionName, queryString, method, body, headerObject, streamVariableId, wwLib },
    wwUtils
) {
    try {
        wwLib.wwVariable.updateValue(streamVariableId, []);

        const invokeOptions = {
            method,
            body: method === 'GET' ? undefined : body,
            headers: {
                ...headerObject,
                Accept: 'text/event-stream',
            },
            responseType: 'stream',
        };

        const { data: responseData, error: invokeError } = await instance.functions.invoke(
            functionName + queryString,
            invokeOptions
        );

        if (invokeError) throw invokeError;

        if (!responseData || !responseData.body || typeof responseData.body.getReader !== 'function') {
            console.error('[Supabase Stream Debug] Failed response data object:', responseData);
            throw new Error('Response data does not contain a readable stream.');
        }

        const reader = responseData.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        let streamActive = true;
        while (streamActive) {
            const { done, value } = await reader.read();

            if (done) {
                streamActive = false;
                break;
            }

            const textChunk = decoder.decode(value, { stream: true });
            buffer += textChunk;

            let newlineIndex;
            while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
                let line = buffer.slice(0, newlineIndex).trim();
                buffer = buffer.slice(newlineIndex + 1);

                if (!line) continue; // Skip empty lines

                if (line.startsWith('data:')) {
                    const dataContent = line.substring(5).trim();
                    if (dataContent === '[DONE]') {
                        streamActive = false;
                        wwUtils?.log('info', '[Supabase Stream] Received [DONE] in data: line.');
                        break;
                    }
                    if (dataContent) {
                        try {
                            const parsedData = JSON.parse(dataContent);
                            const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                            wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                        } catch (parseError) {
                            wwUtils?.log('warn', `[Supabase Stream] Non-JSON data in data: line: ${dataContent}`, {
                                parseError,
                            });
                            // Keep non-JSON data as raw string (like REST API implementation)
                            const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                            wwLib.wwVariable.updateValue(streamVariableId, [...currentData, dataContent]);
                        }
                    }
                } else if (line === '[DONE]') {
                    streamActive = false;
                    wwUtils?.log('info', '[Supabase Stream] Received [DONE] on its own line.');
                    break;
                } else if (
                    line.startsWith('id:') ||
                    line.startsWith('event:') ||
                    line.startsWith('retry:') ||
                    line.startsWith(':')
                ) {
                    // SSE metadata line (but not 'data:'). Ignore it.
                    wwUtils?.log('debug', `[Supabase Stream] Ignoring SSE metadata line: ${line}`);
                } else {
                    // Not 'data:', not '[DONE]', and not other known SSE metadata.
                    // Treat the whole line as a potential payload (e.g., newline-delimited JSON/text).
                    try {
                        const parsedData = JSON.parse(line);
                        const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                        wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                    } catch (parseError) {
                        wwUtils?.log('debug', `[Supabase Stream] Adding raw line as non-JSON: ${line}`, {
                            parseError,
                        });
                        // Keep non-JSON data as raw string (like REST API implementation)
                        const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                        wwLib.wwVariable.updateValue(streamVariableId, [...currentData, line]);
                    }
                }
                if (!streamActive) break; // Exit outer while loop if [DONE] was encountered
            }
            if (!streamActive) break; // Exit outer while loop if [DONE] was encountered
        }

        // Process any remaining content in the buffer
        const finalBufferTrimmed = buffer.trim();
        if (finalBufferTrimmed) {
            if (finalBufferTrimmed.startsWith('data:')) {
                const dataContent = finalBufferTrimmed.substring(5).trim();
                if (dataContent && dataContent !== '[DONE]') {
                    try {
                        const parsedData = JSON.parse(dataContent);
                        const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                        wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                    } catch (e) {
                        wwUtils?.log(
                            'warn',
                            `[Supabase Stream] Failed to parse JSON from final buffer data: line: ${dataContent}`,
                            { e }
                        );
                        const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                        wwLib.wwVariable.updateValue(streamVariableId, [...currentData, dataContent]);
                    }
                } else if (dataContent === '[DONE]') {
                    wwUtils?.log('info', '[Supabase Stream] Received [DONE] in final buffer data: line.');
                }
            } else if (finalBufferTrimmed === '[DONE]') {
                wwUtils?.log('info', '[Supabase Stream] Received [DONE] as final buffer content.');
            } else if (
                finalBufferTrimmed.startsWith('id:') ||
                finalBufferTrimmed.startsWith('event:') ||
                finalBufferTrimmed.startsWith('retry:') ||
                finalBufferTrimmed.startsWith(':')
            ) {
                wwUtils?.log('debug', `[Supabase Stream] Ignoring SSE metadata in final buffer: ${finalBufferTrimmed}`);
            } else {
                // Treat the whole final buffer content as a potential payload.
                try {
                    const parsedData = JSON.parse(finalBufferTrimmed);
                    const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                    wwLib.wwVariable.updateValue(streamVariableId, [...currentData, parsedData]);
                } catch (e) {
                    wwUtils?.log(
                        'debug',
                        `[Supabase Stream] Adding raw final buffer as non-JSON: ${finalBufferTrimmed}`,
                        { e }
                    );
                    const currentData = wwLib.wwVariable.getValue(streamVariableId) || [];
                    wwLib.wwVariable.updateValue(streamVariableId, [...currentData, finalBufferTrimmed]);
                }
            }
        }

        wwUtils?.log('info', `[Supabase] Streaming completed for Edge function - ${functionName}`, {
            type: 'response',
        });

        return wwLib.wwVariable.getValue(streamVariableId);
    } catch (error) {
        const standardizedError = await handleSupabaseInvokeError(error);
        wwUtils?.log('error', `[Supabase] Streaming error for Edge function - ${functionName}`, {
            type: 'error',
            preview: standardizedError,
        });
        throw standardizedError;
    }
}
