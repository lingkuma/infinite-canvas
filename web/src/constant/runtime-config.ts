// Runtime configuration access layer.
// Priority: window.__RUNTIME_CONFIG__ (injected by the container entrypoint) > build-time VITE_ variables > defaults.
// This supports both configuring the same image with docker run -e and injecting values during custom builds.
//
// Each analytics provider has its own variable; configured providers are enabled independently and all are disabled by default.
// Only GA4 and Baidu are supported. Both accept IDs only, and script URLs are assembled in code without arbitrary scripts or inline JavaScript.

type RuntimeConfig = {
    DEFAULT_API_BASE_URL?: string;
    DEFAULT_API_KEY?: string;
    DEFAULT_IMAGE_MODEL?: string;
    GROK_IMAGE2_API_KEY?: string;
    GROK_IMAGE2_MODEL?: string;
    NANO_BANANA_API_KEY?: string;
    NANO_BANANA_MODEL?: string;
    SZBENMA_API_BASE_URL?: string;
    SZBENMA_API_KEY?: string;
    SZBENMA_MODEL?: string;
    DEFAULT_PROXY_ENABLED?: string;
    DEFAULT_PROXY_URL?: string;
    ANALYTICS_GA4_ID?: string; // GA4 measurement ID (G-XXXX)
    ANALYTICS_BAIDU_ID?: string; // Baidu Analytics site ID
};

declare global {
    interface Window {
        __RUNTIME_CONFIG__?: RuntimeConfig;
    }
}

const runtime: RuntimeConfig = (typeof window !== "undefined" && window.__RUNTIME_CONFIG__) || {};

function read(key: keyof RuntimeConfig, buildTime: string | undefined, fallback = ""): string {
    const value = runtime[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof buildTime === "string" && buildTime.trim()) return buildTime.trim();
    return fallback;
}

export const ANALYTICS_GA4_ID = read("ANALYTICS_GA4_ID", import.meta.env.VITE_ANALYTICS_GA4_ID);
export const ANALYTICS_BAIDU_ID = read("ANALYTICS_BAIDU_ID", import.meta.env.VITE_ANALYTICS_BAIDU_ID);
export const DEFAULT_API_BASE_URL = read("DEFAULT_API_BASE_URL", import.meta.env.VITE_DEFAULT_API_BASE_URL);
export const DEFAULT_API_KEY = read("DEFAULT_API_KEY", import.meta.env.VITE_DEFAULT_API_KEY);
export const DEFAULT_IMAGE_MODEL = read("DEFAULT_IMAGE_MODEL", import.meta.env.VITE_DEFAULT_IMAGE_MODEL, "gpt-image-2.5");
export const GROK_IMAGE2_API_KEY = read("GROK_IMAGE2_API_KEY", import.meta.env.VITE_GROK_IMAGE2_API_KEY);
export const GROK_IMAGE2_MODEL = read("GROK_IMAGE2_MODEL", import.meta.env.VITE_GROK_IMAGE2_MODEL, "grok-imagine-image-2.0");
export const NANO_BANANA_API_KEY = read("NANO_BANANA_API_KEY", import.meta.env.VITE_NANO_BANANA_API_KEY);
export const NANO_BANANA_MODEL = read("NANO_BANANA_MODEL", import.meta.env.VITE_NANO_BANANA_MODEL, "gemini-nano-banana-2.1");
export const SZBENMA_API_BASE_URL = read("SZBENMA_API_BASE_URL", import.meta.env.VITE_SZBENMA_API_BASE_URL, "https://api.szbenma.cn");
export const SZBENMA_API_KEY = read("SZBENMA_API_KEY", import.meta.env.VITE_SZBENMA_API_KEY);
export const SZBENMA_MODEL = read("SZBENMA_MODEL", import.meta.env.VITE_SZBENMA_MODEL, "gemini-4-argon");
export const DEFAULT_PROXY_ENABLED = read("DEFAULT_PROXY_ENABLED", import.meta.env.VITE_DEFAULT_PROXY_ENABLED, "false") === "true";
export const DEFAULT_PROXY_URL = read("DEFAULT_PROXY_URL", import.meta.env.VITE_DEFAULT_PROXY_URL);
