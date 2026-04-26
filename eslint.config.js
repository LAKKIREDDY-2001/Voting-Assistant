import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        navigator: "readonly",
        performance: "readonly",
        AbortController: "readonly",
        ResizeObserver: "readonly",
        IntersectionObserver: "readonly",
        MutationObserver: "readonly",
        HTMLElement: "readonly",
        HTMLButtonElement: "readonly",
        Element: "readonly",
        Node: "readonly",
        Event: "readonly",
        MessageChannel: "readonly",
        URL: "readonly",
        FormData: "readonly",
        TextDecoder: "readonly",
        self: "readonly",
        structuredClone: "readonly",
        requestAnimationFrame: "readonly",
        queueMicrotask: "readonly",
        matchMedia: "readonly",
        navigation: "readonly",
        PointerEvent: "readonly",
        EventTarget: "readonly",
        ShadowRoot: "readonly",
        CSS: "readonly",
        __dirname: "readonly",
        require: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-undef": "error",
      "react-refresh/only-export-components": "off",
    },
  },
];
