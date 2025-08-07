/**
 * Detects the type of Supabase API key
 * @param {string} key - The API key to check
 * @returns {string|null} - 'publishable', 'secret', 'jwt', or null
 */
export function detectKeyType(key) {
    if (!key) return null;
    if (key.startsWith('sb_publishable_')) return 'publishable';
    if (key.startsWith('sb_secret_')) return 'secret';
    if (key.startsWith('ey')) return 'jwt'; // Legacy JWT format
    return 'unknown';
}

/**
 * Gets the role associated with a key type
 * @param {string} key - The API key
 * @returns {string} - 'anon' or 'service_role'
 */
export function getKeyRole(key) {
    const type = detectKeyType(key);
    return ['publishable', 'jwt'].includes(type) ? 'anon' : 'service_role';
}

/**
 * Validates if a key can be used in a specific context
 * @param {string} key - The API key
 * @param {string} context - 'browser' or 'server'
 * @returns {boolean} - true if valid, throws error if not
 */
export function validateKeyUsage(key, context) {
    const type = detectKeyType(key);
    
    // Prevent secret keys in browser context
    if (type === 'secret' && context === 'browser') {
        throw new Error('Secret keys cannot be used in browser context');
    }
    
    return true;
}

/**
 * Gets a user-friendly label for the key type
 * @param {string} key - The API key
 * @returns {string} - Human readable label
 */
export function getKeyTypeLabel(key) {
    const type = detectKeyType(key);
    switch(type) {
        case 'publishable': return 'New Publishable Key';
        case 'secret': return 'New Secret Key';
        case 'jwt': return 'Legacy JWT Key';
        default: return 'Unknown Key Type';
    }
}

/**
 * Checks if a key is using the legacy JWT format
 * @param {string} key - The API key
 * @returns {boolean}
 */
export function isLegacyKey(key) {
    return detectKeyType(key) === 'jwt';
}

/**
 * Gets the appropriate CSS class for key type indicators
 * @param {string} key - The API key
 * @returns {string} - CSS classes for styling
 */
export function getKeyTypeClass(key) {
    const type = detectKeyType(key);
    switch(type) {
        case 'publishable':
        case 'secret': 
            return 'bg-green-100 text-green-800';
        case 'jwt': 
            return 'bg-yellow-100 text-yellow-800';
        default: 
            return 'bg-gray-100 text-gray-800';
    }
}