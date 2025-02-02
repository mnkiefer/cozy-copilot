import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
    {
        ignores: [
            '**/dist/*',
            '**/docs/*',
            '**/tests/*',
            'tsconfig.json',
        ]
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.mocha,
                ...globals.node
            },
        }
    },
    {
        files: ["eslint.config.mjs"],
        rules: {
            "@typescript-eslint/no-var-requires": "off"
        }
    },
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json"
            }
        },
        plugins: {
            "@typescript-eslint": ts
        },
        rules: {
            // ✅ Recommended TypeScript rules
            ...ts.configs.recommended.rules,
            ...ts.configs["recommended-requiring-type-checking"].rules,

            // ✅ Style & Best Practices
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-function-return-type": "off", // Can be enforced if needed
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "@typescript-eslint/prefer-optional-chain": "warn",

            // ✅ Strict TypeScript Checks
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",

            // ✅ Disable ESLint's default rules in favor of TypeScript versions
            "no-unused-vars": "off",
            "no-shadow": "off",
            "no-undef": "off",
        },
        settings: {
            "import/resolver": {
                typescript: {}
            }
        }
    }
];
