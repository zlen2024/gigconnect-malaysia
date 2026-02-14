#!/bin/sh

# Recreate the config file
rm -rf /usr/share/nginx/html/env-config.js
touch /usr/share/nginx/html/env-config.js

# Add assignment
echo "window.env = {" >> /usr/share/nginx/html/env-config.js

# Get values with fallback
# If VITE_SUPABASE_URL is set, use it. Otherwise try SUPABASE_URL.
URL="${VITE_SUPABASE_URL:-$SUPABASE_URL}"
KEY="${VITE_SUPABASE_PUBLISHABLE_KEY:-$SUPABASE_PUBLISHABLE_KEY}"
PROJECT_ID="${VITE_SUPABASE_PROJECT_ID:-$SUPABASE_PROJECT_ID}"

echo "  VITE_SUPABASE_URL: \"$URL\"," >> /usr/share/nginx/html/env-config.js
echo "  VITE_SUPABASE_PUBLISHABLE_KEY: \"$KEY\"," >> /usr/share/nginx/html/env-config.js
echo "  VITE_SUPABASE_PROJECT_ID: \"$PROJECT_ID\"" >> /usr/share/nginx/html/env-config.js

echo "};" >> /usr/share/nginx/html/env-config.js

# Execute the CMD passed to the container
exec "$@"
