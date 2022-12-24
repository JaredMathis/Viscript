export function compile(parsed) {
    assert(parsed.type === 'function');

    function assert(condition) {
        if (condition !== true) {
            throw new Error('Expecting true')
        }
    }
}

