#!/bin/sh
set -e

# Executed automatically by the official nginx image entrypoint through /docker-entrypoint.d/*.sh before nginx starts.
# Generate runtime config.js from environment variables. Each analytics provider has an independent variable;
# unset providers remain disabled, load no scripts, and send no external requests. Multiple providers may be enabled together.

# GA4 and Baidu IDs contain only letters, numbers, and hyphens. Remove other characters
# so quotes and similar values cannot break the JavaScript strings in config.js as a defense-in-depth measure.
sanitize_id() {
    printf '%s' "$1" | tr -cd 'A-Za-z0-9-'
}

GA4_ID=$(sanitize_id "${ANALYTICS_GA4_ID:-}")
BAIDU_ID=$(sanitize_id "${ANALYTICS_BAIDU_ID:-}")
DEFAULT_API_BASE_URL=$(printf '%s' "${DEFAULT_API_BASE_URL:-}" | tr -cd 'A-Za-z0-9:/?&=_#.-')
DEFAULT_API_KEY=$(printf '%s' "${DEFAULT_API_KEY:-}" | tr -cd 'A-Za-z0-9._~-')
DEFAULT_IMAGE_MODEL=$(printf '%s' "${DEFAULT_IMAGE_MODEL:-gpt-image-2.5}" | tr -cd 'A-Za-z0-9._:-')
GROK_IMAGE2_API_KEY=$(printf '%s' "${GROK_IMAGE2_API_KEY:-}" | tr -cd 'A-Za-z0-9._~-')
GROK_IMAGE2_MODEL=$(printf '%s' "${GROK_IMAGE2_MODEL:-grok-imagine-image-2.0}" | tr -cd 'A-Za-z0-9._:-')
DEFAULT_PROXY_ENABLED=$(printf '%s' "${DEFAULT_PROXY_ENABLED:-false}" | tr -cd 'A-Za-z0-9')
DEFAULT_PROXY_URL=$(printf '%s' "${DEFAULT_PROXY_URL:-}" | tr -cd 'A-Za-z0-9:/?&=_#.-')

cat > /usr/share/nginx/html/config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  DEFAULT_API_BASE_URL: "${DEFAULT_API_BASE_URL}",
  DEFAULT_API_KEY: "${DEFAULT_API_KEY}",
  DEFAULT_IMAGE_MODEL: "${DEFAULT_IMAGE_MODEL}",
  GROK_IMAGE2_API_KEY: "${GROK_IMAGE2_API_KEY}",
  GROK_IMAGE2_MODEL: "${GROK_IMAGE2_MODEL}",
  DEFAULT_PROXY_ENABLED: "${DEFAULT_PROXY_ENABLED}",
  DEFAULT_PROXY_URL: "${DEFAULT_PROXY_URL}",
  ANALYTICS_GA4_ID: "${GA4_ID}",
  ANALYTICS_BAIDU_ID: "${BAIDU_ID}"
};
EOF
