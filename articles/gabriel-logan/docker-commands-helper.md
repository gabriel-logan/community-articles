# Docker Commands Documentation - Helper

## 🐳 Containers

### **List all containers (running and stopped)**

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

If the image uses `sh`:

```bash
docker exec -it <container_id_or_name> sh
```

### **Remove a container**

```bash
docker rm <container_id_or_name>
```

Force removal:

```bash
docker rm -f <container_id_or_name>
```

### **Create and run a new container**

```bash
docker run -d --name <container_name> <image>
```

Run and open interactive terminal:

```bash
docker run -it --name <container_name> <image> /bin/bash
```

### **View container logs**

```bash
docker logs <container_id_or_name>
```

### **Stop a container**

```bash
docker stop <container_id_or_name>
```

### **Start a stopped container**

```bash
docker start <container_id_or_name>
```

---

## 🗂️ Volumes

### **List volumes**

```bash
docker volume ls
```

### **Create a volume**

```bash
docker volume create <volume_name>
```

### **Inspect a volume**

```bash
docker volume inspect <volume_name>
```

### **Remove a volume**

```bash
docker volume rm <volume_name>
```

Force removal:

```bash
docker volume rm -f <volume_name>
```

### **Clean unused volumes**

```bash
docker volume prune
```

---

## 🏞️ Images

### **List local images**

```bash
docker images
```

### **Download an image (pull)**

```bash
docker pull <image>
```

### **Remove an image**

```bash
docker rmi <image>
```

Force removal:

```bash
docker rmi -f <image>
```

### **Build an image from a Dockerfile**

```bash
docker build -t <image_name> .
```

### **Inspect an image**

```bash
docker inspect <image>
```

### **Clean unused images**

```bash
docker image prune
```

Clean everything not being used:

```bash
docker system prune -a
```
