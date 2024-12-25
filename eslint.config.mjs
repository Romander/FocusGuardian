import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from "eslint-config-prettier";
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    ignores: [
        "vite.config.ts",
        "vitest.config.ts",
        "tailwind.config.js",
        "postcss.config.js",
        "eslint.config.mjs",
        ".prettierrc.js",
        "node_modules/*",
        "dist/*",
    ],
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
  },
  eslint.configs.recommended,
 {
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  }, 
  {
    ...importPlugin.flatConfigs.recommended,
    settings: {
        "import/resolver": {
            node: {
                paths: ["src"],
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
    },
  },
  jsxA11y.flatConfigs.recommended,
 tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }, 
    eslintConfigPrettier,
    {
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "no-console": "error",
        },
    }
);