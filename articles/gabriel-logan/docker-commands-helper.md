# Docker Commands Documentation - Helper

This document is a practical Docker quick reference focused on commands you actually use in day-to-day work: containers, images, volumes, networks, logs, cleanup, restart policies, and Docker Compose.

---

# 1. Containers — Essential Commands

### List only running containers

```bash
docker ps
```

### List all containers (running + stopped)

```bash
docker ps -a
```

### Create and run a new container

```bash
docker run -d --name <container_name> <image>
```

Useful common options:

- `-d` -> detached mode
- `--name` -> friendly container name
- `-p HOST:CONTAINER` -> publish ports
- `-v HOST:CONTAINER` -> mount volume/bind path
- `-e KEY=value` -> environment variable
- `--restart unless-stopped` -> auto restart policy

Example:

```bash
docker run -d \
  --name app \
  --restart unless-stopped \
  -p 8080:80 \
  -e APP_ENV=production \
  -v /data:/data \
  app-webserver
```

### Interactive shell inside container

```bash
docker exec -it <container_id_or_name> /bin/bash
```

If `bash` does not exist:

```bash
docker exec -it <container_id_or_name> sh
```

### View logs

```bash
docker logs <container_id_or_name>
```

Follow logs live:

```bash
docker logs -f <container_id_or_name>
```

Show last lines only:

```bash
docker logs --tail 100 <container_id_or_name>
```

### Inspect container details

```bash
docker inspect <container_id_or_name>
```

Useful when you need:

- mounted volumes
- networks
- restart policy
- IP address
- environment variables

### See running processes inside the container

```bash
docker top <container_id_or_name>
```

### Watch CPU / memory usage

```bash
docker stats
```

Single container:

```bash
docker stats <container_id_or_name>
```

### Stop a container

```bash
docker stop <container_id_or_name>
```

### Start a stopped container

```bash
docker start <container_id_or_name>
```

### Restart a container

```bash
docker restart <container_id_or_name>
```

### Remove a container

```bash
docker rm <container_id_or_name>
```

Force remove:

```bash
docker rm -f <container_id_or_name>
```

### Copy files between host and container

From host to container:

```bash
docker cp ./local-file.txt <container_name>:/tmp/local-file.txt
```

From container to host:

```bash
docker cp <container_name>:/var/log/app.log ./app.log
```

---

# 2. Images — Essential Commands

### List images

```bash
docker images
```

### Pull an image

```bash
docker pull <image>
```

Example with tag:

```bash
docker pull nginx:latest
```

### Build image from Dockerfile

```bash
docker build -t <image_name> .
```

Example:

```bash
docker build -t app-webserver:latest .
```

### Build without cache

```bash
docker build --no-cache -t <image_name> .
```

### Inspect image

```bash
docker image inspect <image>
```

### Remove an image

```bash
docker rmi <image>
```

Force:

```bash
docker rmi -f <image>
```

---

# 3. Volumes — Essential Commands

### List volumes

```bash
docker volume ls
```

### Create a volume

```bash
docker volume create <volume_name>
```

### Inspect a volume

```bash
docker volume inspect <volume_name>
```

### Remove a volume

```bash
docker volume rm <volume_name>
```

### Remove unused volumes

```bash
docker volume prune
```

Important:

- Named volumes are managed by Docker
- Bind mounts use host paths like `/data:/data`
- Prefer named volumes for simpler portability
- Prefer bind mounts when you explicitly need host files/directories

---

# 4. Networks — Essentials That Are Commonly Missing

### List networks

```bash
docker network ls
```

### Inspect a network

```bash
docker network inspect <network_name>
```

### Create a custom network

```bash
docker network create <network_name>
```

### Run a container attached to a network

```bash
docker run -d --name app --network <network_name> <image>
```

Why this matters:

- containers on the same custom network can talk to each other by name
- it is cleaner than exposing every internal service port to the host

---

# 5. Cleanup Commands

Use these carefully.

### Remove stopped containers

```bash
docker container prune
```

### Remove dangling/unused images

```bash
docker image prune
```

### Remove unused volumes

```bash
docker volume prune
```

### Remove unused networks

```bash
docker network prune
```

### Clean build cache

```bash
docker builder prune
```

More aggressive:

```bash
docker builder prune --all
```

### Full Docker cleanup

```bash
docker system prune
```

Aggressive cleanup:

```bash
docker system prune -a
```

Aggressive cleanup including volumes:

```bash
docker system prune -a --volumes
```

Important:

- `docker system prune -a` removes unused images, stopped containers, unused networks, and build cache
- adding `--volumes` may remove data you still care about

---

# 6. Full Reset Commands

These are destructive. Use them only if you truly want to wipe your local Docker state.

### Stop all containers

```bash
docker stop $(docker ps -aq)
```

### Remove all containers

```bash
docker rm $(docker ps -aq)
```

### Remove all images

```bash
docker rmi -f $(docker images -q)
```

### Remove all volumes

```bash
docker volume rm $(docker volume ls -q)
```

If you prefer one simpler command, this is usually safer and clearer:

```bash
docker system prune -a --volumes
```

---

# 7. Common `docker run` Options You End Up Needing

### Publish ports

```bash
-p 8080:80
```

Meaning:

- host port `8080`
- container port `80`

### Mount host path

```bash
-v /data:/data
```

Meaning:

- host `/data`
- container `/data`

### Pass environment variables

```bash
-e APP_ENV=production
```

### Set container name

```bash
--name app
```

### Auto-remove short-lived containers

```bash
docker run --rm <image>
```

Useful for quick scripts/tests.

### Set working directory

```bash
docker run -w /app <image>
```

### Open an interactive terminal

```bash
docker run -it --rm ubuntu bash
```

---

# 8. Correct Way to Mount Absolute Paths

If the application expects paths like:

```text
/data/app/files
/data/app/runtime
/data/app/logs
```

Mount the parent path:

```bash
-v /data:/data
```

That way:

```text
/data/app inside container == /data/app on host
```

This is cleaner than trying to mount each subdirectory separately unless you specifically want that.

---

# 9. Restart Policies

This is essential for production-like usage.

### Use restart policy when creating the container

```bash
docker run -d \
  --name app \
  --restart unless-stopped \
  -p 8080:80 \
  -v /data:/data \
  app-webserver
```

Common policies:

- `no` -> do not restart automatically
- `on-failure[:max-retries]` -> restart only on failure
- `always` -> always restart
- `unless-stopped` -> restart automatically unless you explicitly stopped it

For most servers, `unless-stopped` is usually the most practical default.

### Update restart policy of an existing container

```bash
docker update --restart unless-stopped <container_name>
```

This is important because you do not need to recreate the container just to change the restart policy.

### Check restart configuration

```bash
docker inspect -f "{{ .HostConfig.RestartPolicy.Name }}" <container_name>
```

---

# 10. Docker Service on Boot

On Linux systems using `systemd`:

### Check if Docker starts automatically on boot

```bash
systemctl is-enabled docker
```

### Enable Docker on boot

```bash
systemctl enable docker
```

### Start Docker now

```bash
systemctl start docker
```

### Check Docker status

```bash
systemctl status docker
```

---

# 11. Docker Compose — Essential Commands

For multi-container applications, these commands are too important to leave out.

### Start services

```bash
docker compose up -d
```

### Build and start

```bash
docker compose up -d --build
```

### Stop and remove services

```bash
docker compose down
```

### Stop and remove services, networks, and volumes

```bash
docker compose down -v
```

### View services

```bash
docker compose ps
```

### View logs

```bash
docker compose logs
```

Follow logs:

```bash
docker compose logs -f
```

### Restart a service

```bash
docker compose restart <service_name>
```

### Open a shell inside a service container

```bash
docker compose exec <service_name> sh
```

### Rebuild a specific service

```bash
docker compose build <service_name>
```

---

# 12. Example — Generic Web App Container

### Build image

```bash
docker build -t app-webserver .
```

### Run container

```bash
docker run -d \
  --name app \
  --restart unless-stopped \
  -p 8080:80 \
  -v /data:/data \
  app-webserver
```

### Test and debug

Access:

```text
http://IP:8080
```

Logs:

```bash
docker logs -f app
```

Shell:

```bash
docker exec -it app bash
```

Inspect:

```bash
docker inspect app
```

---

# 13. Example Dockerfile (Generic)

```dockerfile
FROM httpd:2.4

RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf
COPY vhosts.conf /usr/local/apache2/conf/extra/vhosts.conf
RUN echo "Include conf/extra/vhosts.conf" >> /usr/local/apache2/conf/httpd.conf
```

### Generic `vhosts.conf`

```apache
DocumentRoot /data/app
ScriptAlias /cgi-bin/ "/data/app/cgi-bin/"
CustomLog /data/app/logs/access_log combined
AuthUserFile /data/app/runtime/.authfile
```

---

# 14. High-Value Troubleshooting Checklist

When a container "doesn't work", check these first:

1. Is it running?

```bash
docker ps -a
```

2. What do the logs say?

```bash
docker logs <container_name>
```

3. Is the port published correctly?

```bash
docker inspect <container_name>
```

4. Is the mount path correct?

```bash
docker inspect <container_name>
```

5. Is the process inside the container alive?

```bash
docker top <container_name>
```

6. Is it consuming too much memory/CPU?

```bash
docker stats <container_name>
```

---

# 15. Official Docs

- Docker CLI reference: `https://docs.docker.com/reference/`
- `docker run`: `https://docs.docker.com/reference/cli/docker/container/run/`
- Restart policies: `https://docs.docker.com/engine/containers/start-containers-automatically/`
- Docker Compose reference: `https://docs.docker.com/reference/cli/docker/compose/`
