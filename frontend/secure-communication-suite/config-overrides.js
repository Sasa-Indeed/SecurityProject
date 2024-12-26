const webpack = require('webpack');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config) {
    // Remove ModuleScopePlugin
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));

    // Add polyfill fallbacks
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser.js'),
        util: require.resolve('util/'),
        zlib: require.resolve('browserify-zlib'),
        path: require.resolve('path-browserify'),
        "fs": false,
        "tls": false,
        "net": false,
        "dns": false,
        "child_process": false,
    });

    config.resolve.fallback = fallback;

    // Add buffer plugin
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser.js'
        }),
    ];

    // Add resolve extensions
    config.resolve.extensions = [...config.resolve.extensions, '.ts', '.js'];

    // Add module rules
    config.module.rules.push({
        test: /\.m?js/,
        resolve: {
            fullySpecified: false
        }
    });

    // Critical: Add these aliases
    config.resolve.alias = {
        ...config.resolve.alias,
        'process/browser': require.resolve('process/browser.js'),
        process: 'process/browser.js',
        util: require.resolve('util/'),
        'util/util': require.resolve('util/util'),
        stream: 'stream-browserify',
        zlib: 'browserify-zlib',
        buffer: 'buffer'
    };

    return config;
}