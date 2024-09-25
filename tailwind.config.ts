import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                muted: "var(--muted)",
                hover: "var(--hover)",
                active: "var(--active)",
            },
        },
    },
    plugins: [],
};
export default config;
