const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const globals = require('globals');

const config = defineConfig([
    {
        files: ['**/*.js'],
        plugins: {
            js,
        },
        extends: ['js/recommended'],
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
]);

module.exports = config;
