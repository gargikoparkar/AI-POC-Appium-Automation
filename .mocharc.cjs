module.exports = {
    // Load TypeScript on the fly
    'node-option': ['import=tsx'],
    // Starts Appium + the session once, tears it down at the end
    require: ['./src/hooks/rootHooks.ts'],
    extension: ['ts'],
    // Native app tests can take a while
    timeout: 3 * 60 * 1000,
    reporter: 'spec',
    // One device = one session, so never run in parallel
    parallel: false,
};
