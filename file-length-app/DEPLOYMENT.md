# Docker Deployment Guide

This guide explains how to deploy the File Length Checker application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (optional, but recommended)

## Deployment Options

### Option 1: Using Docker Compose (Recommended)

1. Navigate to the application directory:
   ```bash
   cd file-length-app
   ```

2. Build and start the container:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Open your browser and go to: `http://localhost:8080`

4. Stop the container:
   ```bash
   docker-compose down
   ```

### Option 2: Using Docker Commands

1. Navigate to the application directory:
   ```bash
   cd file-length-app
   ```

2. Build the Docker image:
   ```bash
   docker build -t file-length-checker .
   ```

3. Run the container:
   ```bash
   docker run -d -p 8080:80 --name file-length-checker file-length-checker
   ```

4. Access the application:
   - Open your browser and go to: `http://localhost:8080`

5. Stop and remove the container:
   ```bash
   docker stop file-length-checker
   docker rm file-length-checker
   ```

## Docker Configuration

### Dockerfile
- Based on `nginx:alpine` (lightweight Nginx image)
- Copies application files to Nginx's web root
- Includes custom Nginx configuration for optimization
- Exposes port 80

### docker-compose.yml
- Defines the service configuration
- Maps port 8080 (host) to port 80 (container)
- Includes restart policy
- Sets up a bridge network

### nginx.conf
- Custom Nginx configuration
- Enables gzip compression
- Configures caching for static assets
- Adds security headers

## Useful Commands

### View running containers:
```bash
docker ps
```

### View container logs:
```bash
docker logs file-length-checker
```

### View logs in real-time:
```bash
docker logs -f file-length-checker
```

### Rebuild and restart (after code changes):
```bash
docker-compose up -d --build
```

### Remove all stopped containers and images:
```bash
docker system prune -a
```

## Customization

### Change Port
To use a different port, modify the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # Change 3000 to your desired port
```

### Production Deployment
For production deployment, consider:
- Using a reverse proxy (like Traefik or Nginx Proxy Manager)
- Adding SSL/TLS certificates
- Implementing proper logging and monitoring
- Setting resource limits in docker-compose.yml

## Troubleshooting

### Port already in use
If port 8080 is already in use, change it in `docker-compose.yml` to another port (e.g., 8081, 3000, etc.)

### Container won't start
Check the logs:
```bash
docker logs file-length-checker
```

### Application not accessible
Ensure the container is running:
```bash
docker ps
```

If not listed, check stopped containers:
```bash
docker ps -a
```
