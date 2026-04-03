import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // JSX 안에서 ", ', >, } 등의 문자를 &quot; 같은 HTML 엔티티로 이스케이프하지 않아도 되게 허용
    // 약관, 개인정보처리방침 등 텍스트가 많은 페이지에서 불필요한 변환 작업을 없애기 위해 비활성화
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
]);

export default eslintConfig;
