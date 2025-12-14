# Linux Filesystem and Permissions – Detailed Guide

This document explains **every directory present at the Linux root (`/`)**, their purpose, behavior, permissions, and risks, followed by root-only rules, `/usr/local`, where to install custom software, and global shell configuration.

It follows the Filesystem Hierarchy Standard (FHS) and modern Linux behavior (usr-merge), as seen in Linux Mint and most modern distributions.

---

## 1. Complete Linux Root Directory Breakdown (Detailed)

Below is a **directory-by-directory explanation** of everything found directly under `/`. This section goes deeper than a simple definition and explains **what uses it, who writes to it, when it is accessed, and what can break if misused**.

---

### `/` – Root filesystem

The root of the entire filesystem hierarchy. All other directories branch from here. The root filesystem must be mounted first during boot, even before `/usr` in early boot stages.

Key points:

- Required for system startup
- Usually mounted read-only early, then remounted read-write
- If corrupted, the system will not boot

---

### `/bin`

Contains **essential user-space commands** required for system operation, rescue mode, and basic administration.

More details:

- Needed when `/usr` is not yet mounted
- Used by scripts during early boot
- Commands here must have **no external dependencies** beyond `/lib`

On modern systems, `/bin` is typically a symlink to `/usr/bin` due to usr-merge.

---

### `/bin.usr-is-merged`

A marker directory used internally to indicate that `/bin` has been merged into `/usr/bin`.

Details:

- Exists for backward compatibility
- Not part of the FHS for manual interaction
- Tools rely on its presence to detect merged layouts

---

### `/boot`

Stores static files required by the bootloader and kernel to start the system.

More details:

- Accessed before the root filesystem is fully mounted
- Often placed on a separate partition
- Changes usually require `update-grub` or equivalent

Contains:

- Kernel images
- Initramfs
- Bootloader configuration and modules

---

### `/cdrom`

Traditional mount point for optical media.

Details:

- Mostly obsolete
- Still referenced by some installers and scripts
- Kept for historical and compatibility reasons

---

### `/dev`

A **dynamic device namespace** exposing hardware and kernel interfaces as files.

More details:

- Populated by `udev`
- Devices appear and disappear dynamically
- Permissions control hardware access

Writing incorrect data to some devices can cause immediate hardware or data damage.

---

### `/etc`

Holds **system-wide configuration**, never binaries.

More details:

- Text-based by design
- Parsed at startup and service reloads
- Often backed up for disaster recovery

Misconfiguration here is the most common cause of system misbehavior.

---

### `/home`

Contains user home directories and personal data.

More details:

- User-level configuration overrides system defaults
- Can be mounted on a separate partition or network filesystem
- Safe for backups and user experimentation

---

### `/lib`, `/lib32`, `/lib64`

Core shared libraries and kernel modules.

More details:

- Required by binaries in `/bin` and `/sbin`
- Kernel modules loaded from here
- Architecture-specific separation

Almost always symlinked to `/usr/lib` in modern distributions.

---

### `/lib.usr-is-merged`

Internal directory related to usr-merge.

Details:

- Signals merged library paths
- Not intended for manual inspection or modification

---

### `/lost+found`

Filesystem-level recovery directory.

More details:

- Created automatically by `mkfs`
- Used by `fsck`
- Stores orphaned inodes after crashes

Files here usually have numeric names and require manual inspection.

---

### `/media`

Default mount location for removable media.

More details:

- Managed by desktop environments and udisks
- Automatically creates per-user mount points
- Permissions reflect logged-in user

---

### `/mnt`

Generic temporary mount point.

More details:

- Intended for short-term manual mounts
- Common in rescue environments
- Convention, not enforced by the kernel

---

### `/opt`

Location for **optional, add-on, or third-party software**.

More details:

- Keeps non-native software isolated
- Often contains complete application trees
- Rarely touched by the distro package manager

---

### `/package`

Distribution-specific directory.

More details:

- Not standardized by FHS
- May be used internally by snapshots or packaging tools
- Should not be relied upon for portable setups

---

### `/proc`

Kernel-provided virtual filesystem exposing process and system information.

More details:

- Exists only in memory
- Writing values here can alter kernel behavior
- Heavily used by monitoring tools

---

### `/root`

Home directory for the root user.

More details:

- Separate from `/home`
- Accessible even if `/home` is not mounted
- Used for maintenance and recovery tasks

---

### `/run`

Runtime data for the current boot session.

More details:

- Replaces older `/var/run`
- Stored in tmpfs (RAM)
- Critical for service coordination

---

### `/sbin`

System administration commands.

More details:

- Intended for root usage
- Needed for boot and repair
- Merged into `/usr/sbin` on modern systems

---

### `/sbin.usr-is-merged`

Compatibility directory for merged `/sbin` layouts.

---

### `/srv`

Persistent data served by services.

More details:

- Separates service data from binaries
- Useful for backups and migrations
- Common on servers

---

### `/sys`

Kernel sysfs interface.

More details:

- Reflects live kernel state
- Used to control devices and drivers
- Writing values has immediate effect

---

### `/timeshift`

Stores Timeshift system snapshots.

More details:

- Used for system rollback
- Can grow large
- Should not be modified manually

---

### `/tmp`

Temporary workspace for applications.

More details:

- World-writable with sticky bit
- Automatically cleaned
- Not safe for persistent data

---

### `/usr`

Primary user-space system hierarchy.

More details:

- Contains the majority of installed software
- Designed to be shareable and mostly read-only
- Central to modern Linux layouts

---

### `/var`

Variable and stateful data.

More details:

- Grows over time
- Essential for logging and debugging
- Often monitored for disk usage

---

## 2. Directories That Can Only Be Modified by **root**

These directories are **system-critical**. Creating, deleting, or modifying files inside them requires **root privileges** (`sudo`).

### Root-only (Do NOT modify as a normal user)

- `/bin` – Essential system commands
- `/sbin` – System administration binaries
- `/boot` – Kernel and bootloader files
- `/dev` – Device files (managed by the kernel/udev)
- `/etc` – System-wide configuration files
- `/lib`, `/lib32`, `/lib64` – Core system libraries
- `/proc` – Kernel information (virtual filesystem)
- `/sys` – Kernel and hardware interface (virtual filesystem)
- `/run` – Runtime system data
- `/root` – Home directory of root
- `/usr` – System binaries, libraries, shared resources
- `/var` – Logs, cache, spool files
- `/srv` – Data for services (web, ftp, etc.)
- `/opt` – Optional / third-party software
- `/lost+found` – Filesystem recovery data
- `*.usr-is-merged` – Internal compatibility directories

⚠️ Modifying these incorrectly can **break or prevent the system from booting**.

---

### Directories Users Can Safely Modify

- `/home/username` – User files and configs
- `/tmp` – Temporary files (cleared on reboot)
- `/media/username` – Auto-mounted removable devices
- `/mnt` – Temporary manual mounts (with permission)

---

## 3. What Is `/usr/local`

`/usr/local` is reserved for **software installed manually by the system administrator** and **not managed by the package manager**.

Typical structure:

- `/usr/local/bin` – Custom executables
- `/usr/local/lib` – Custom libraries
- `/usr/local/share` – Docs, icons, man pages
- `/usr/local/etc` – Configuration files

### Why `/usr/local` exists

- Prevents conflicts with system packages
- Survives system upgrades
- Clean separation between distro-managed and user-installed software

📌 This is the **recommended place** for manually compiled or custom-built programs.

---

## 4. Where Should I Put Programs I Created or Installed Manually?

### Best choices (recommended)

#### `/usr/local/bin`

- Programs you compile yourself
- Scripts used system-wide
- Tools not managed by `apt`, `dnf`, etc.

Example:

```bash
sudo cp mytool /usr/local/bin
```

#### `/opt`

- Large third-party or self-contained software
- Software with its own directory structure

Example:

```
/opt/myapp/
  ├── bin/
  ├── lib/
  └── config/
```

---

### Not recommended

- `/usr/bin` – Managed by the package manager
- `/bin` – Critical system commands

---

### Per-user programs (no root required)

- `~/bin` or `~/.local/bin`

These are ideal for personal scripts.

Ensure it's in PATH:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

---

## 5. `/opt` vs `/usr/local` (When to Use Each)

| Use case                         | `/usr/local` | `/opt` |
| -------------------------------- | ------------ | ------ |
| Compiled tools                   | ✅           | ❌     |
| CLI utilities                    | ✅           | ❌     |
| Large GUI apps                   | ❌           | ✅     |
| Third-party proprietary software | ❌           | ✅     |
| System-wide scripts              | ✅           | ❌     |

---

## 6. Is There a Global `bashrc` for All Users?

Yes.

### Global Bash Configuration Files

- `/etc/bash.bashrc` → Executed for **all interactive shells**
- `/etc/profile` → Executed at **login**
- `/etc/profile.d/*.sh` → Modular global configs

### User-specific Bash Files

- `~/.bashrc` → Interactive shells
- `~/.bash_profile` or `~/.profile` → Login shells

### Execution order (simplified)

1. `/etc/profile`
2. `/etc/profile.d/*.sh`
3. `~/.bash_profile` or `~/.profile`
4. `/etc/bash.bashrc`
5. `~/.bashrc`

📌 Global changes affect **all users** — be careful.

---

## 7. Summary – Best Practices

- Use `/usr/local/bin` for your own programs
- Use `/opt` for large, isolated applications
- Never manually edit `/usr/bin`, `/bin`, `/lib`
- Global shell behavior lives in `/etc`
- User customization belongs in `/home`

---

## 8. Quick Safety Rule

> If it requires `sudo`, assume it can break the system.
