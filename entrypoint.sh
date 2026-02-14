#!/bin/sh

# Recreate the config file
rm -rf /usr/share/nginx/html/env-config.js
touch /usr/share/nginx/html/env-config.js

# Add assignment
echo "window.env = {" >> /usr/share/nginx/html/env-config.js

# Read each line in .env file
# Each line represents key=value pairs
echo "  VITE_SUPABASE_URL: \"${VITE_SUPABASE_URL}\"," >> /usr/share/nginx/html/env-config.js
echo "  VITE_SUPABASE_PUBLISHABLE_KEY: \"${VITE_SUPABASE_PUBLISHABLE_KEY}\"," >> /usr/share/nginx/html/env-config.js
echo "  VITE_SUPABASE_PROJECT_ID: \"${VITE_SUPABASE_PROJECT_ID}\"" >> /usr/share/nginx/html/env-config.js

echo "};" >> /usr/share/nginx/html/env-config.js

# Execute the CMD passed to the container
exec "$@"
