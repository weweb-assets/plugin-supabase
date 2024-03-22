export function convertCondition({ field, operator, value, isEmptyIgnored }) {
    if (isEmptyIgnored && !value) return [];
    switch (operator) {
        case '$eq':
            return [field, 'eq', typeof value === 'string' ? `"${escape(value)}"` : value];
        case '$ne':
            return [field, 'neq', typeof value === 'string' ? `"${escape(value)}"` : value];
        case '$lt':
            return [field, 'lt', value];
        case '$gt':
            return [field, 'gt', value];
        case '$lte':
            return [field, 'lte', value];
        case '$gte':
            return [field, 'gte', value];
        case '$iLike:contains': // not possible on array
            return [field, 'ilike', `"%${escape(value)}%"`];
        case '$notILike:contains': // not possible on array
            return [field, 'not.ilike', `"%${escape(value)}%"`];
        case '$iLike:startsWith':
            return [field, 'ilike', `"${escape(value)}%"`];
        case '$iLike:endsWith':
            return [field, 'ilike', `"%${escape(value)}"`];
        case '$eq:null':
            return [field, 'is', 'null'];
        case '$ne:null':
            return [field, 'not.is', 'null'];
        case '$in':
            return [field, 'in', `(${value})`];
        case '$notIn':
            return [field, 'not.in', `(${value})`];
        case '$overlap':
            return [field, 'ov', `{${value}}`];
        case '$notOverlap':
            return [field, 'not.ov', `{${value}}`];
        case '$contains':
            return [field, 'cs', `{${value}}`];
        default:
            break;
    }
}

export function generateFilter(config) {
    if (!config) return '';
    if (!config.link || !config.conditions || config.if === false) return '';
    const conditions = config.conditions
        .map(condition => {
            return condition.link ? generateFilter(condition) : convertCondition(condition).join('.');
        })
        .filter(condition => condition);

    if (!conditions.length) return '';

    const filter = `${config.link.slice(1)}(${conditions.join()})`;

    return filter;
}

function escape(value) {
    // weird but it's how back slash match
    return value.replaceAll('\\', '\\\\\\\\').replaceAll('"', '\\"');
}
