# Docker Commands Documentation - Helper

This document contains **all Docker fundamentals** plus a **generic production workflow**.

---

# 🐳 1. Containers — Essential Commands

### **List all containers (running + stopped)**

```bash
docker ps -a
```

### **List only running containers**

```bash
docker ps
```

### **Restart a container**

```bash
docker restart <container_id_or_name>
```

### **Enter a container (interactive shell)**

```bash
docker exec -it <container_id_or_name> /bin/bash
```

If the shell is `sh`:

```bash
docker exec -it <container_id_or_name> sh
```

### **View logs**

```bash
docker logs <container_id_or_name>
```

Follow:

```bash
docker logs -f <container_id_or_name>
```

### **Stop a container**

```bash
docker stop <container_id_or_name>
```

### **Start a container**

```bash
docker start <container_id_or_name>
```

### **Remove a container**

```bash
docker rm <container_id_or_name>
```

Force:

```bash
docker rm -f <container_id_or_name>
```

### **Create and run a new container**

```bash
docker run -d --name <container_name> <image>
```

Interactive:

```bash
docker run -it --name <container_name> <image> /bin/bash
```

---

# 🗂️ 2. Volumes — Essential Commands

### **List volumes**

```bash
docker volume ls
```

### **Create a volume**

```bash
docker volume create <volume_name>
```

### **Inspect volume**

```bash
docker volume inspect <volume_name>
```

### **Remove volume**

```bash
docker volume rm <volume_name>
```

Force:

```bash
docker volume rm -f <volume_name>
```

### **Cleanup unused volumes**

```bash
docker volume prune
```

---

# 🏞️ 3. Images — Essential Commands

### **List images**

```bash
docker images
```

### **Pull an image**

```bash
docker pull <image>
```

### **Remove an image**

```bash
docker rmi <image>
```

Force:

```bash
docker rmi -f <image>
```

### **Build image from Dockerfile**

```bash
docker build -t <image_name> .
```

### **Inspect image**

```bash
docker inspect <image>
```

### **Cleanup unused images**

```bash
docker image prune
```

Full cleanup:

It removes all unused images, containers, networks, and optionally, volumes.

```bash
docker system prune -a
```

---

# 🏗️ 4. Example — Building & Running a Generic Web App Image

### **Build image**

```bash
docker build -t app-webserver .
```

### **Run container (initial version)**

```bash
docker run -d \
  --name app \
  -p 8080:80 \
  -v /data/app:/data/app \
  app-webserver
```

---

# 🔥 5. FULL DOCKER RESET — Stop, Remove, Clean EVERYTHING

### ✅ 1 — List containers

Running:

```bash
docker ps
```

All:

```bash
docker ps -a
```

### ✅ 2 — Stop ALL containers

```bash
docker stop $(docker ps -aq)
```

### ✅ 3 — Remove ALL containers

```bash
docker rm $(docker ps -aq)
```

### ✅ 4 — Remove ALL images

```bash
docker rmi $(docker images -q)
```

Force:

```bash
docker rmi -f $(docker images -q)
```

### ✅ 5 — Remove ALL volumes (optional)

```bash
docker volume rm $(docker volume ls -q)
```

### Result:

Your Docker environment is **completely reset**.

Full wipe:

```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker rmi -f $(docker images -q)
docker volume rm $(docker volume ls -q)
```

---

# 📁 6. Correct Way to Run the App Container with Absolute Paths

If the app uses absolute paths like:

```
/data/app/files
/data/app/runtime
/data/app/logs
```

Mount the parent directory:

```bash
-v /data:/data
```

Now inside the container:

```
/data/app == /data/app (host)
```

---

# 🧱 7. Final Recommended Run Command

```bash
docker run -d \
  --name app \
  -p 8080:80 \
  -v /data:/data \
  app-webserver
```

---

# 📝 8. Example Dockerfile (Generic)

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

# 🧪 9. Testing & Debugging

### Access the app

```
http://IP:8080
```

### View logs

```bash
docker logs app -f
```

### Enter container

```bash
docker exec -it app bash
```

---

# 🔄 10. Important: Auto-Restart Containers After Reboot

## Enable auto-restart for containers

To ensure containers come back automatically when Docker or the server restarts, run them with:

```bash
--restart=always
```

Example:

```bash
docker run -d \
  --name app \
  --restart=always \
  -p 8080:80 \
  -v /data:/data \
  app-webserver
```

## Apply restart policy to an existing container

Docker does **not** allow modifying restart policy in-place. You must recreate the container:

```bash
docker stop app
docker rm app
```

Then recreate:

```bash
docker run -d --name app --restart=always app-webserver
```

---

# 🖥️ 11. Ensure Docker Starts Automatically on System Boot

Check if Docker is enabled:

```bash
systemctl is-enabled docker
```

Enable Docker startup on boot:

```bash
systemctl enable docker
```

Start Docker service manually if necessary:

```bash
systemctl start docker
```
