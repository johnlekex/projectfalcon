# Use nginx as base image for serving static files
FROM nginx:alpine

# Copy website files to nginx html directory
COPY . /usr/share/nginx/html/

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Add labels for better organization
LABEL maintainer="jrqualitylimited@gmail.com"
LABEL description="Static Website with CI/CD Pipeline"
LABEL version="1.0"

# Create a simple health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Nginx runs in foreground by default in this image
CMD ["nginx", "-g", "daemon off;"]
