# 📘 **Goroutines, Threads, Scheduling, and Failure Behavior in Go**

_A Complete Technical Overview_

---

## 1. Introduction

Go provides concurrency through **goroutines**, extremely lightweight units of execution managed by the Go runtime. Although goroutines behave _conceptually_ like threads, they are **not** operating-system (OS) threads. Understanding how goroutines map to threads, how the Go scheduler works, and how failures propagate is essential for writing reliable concurrent code.

---

## 2. What Is a Goroutine?

A **goroutine** is an independently executing function managed by the Go runtime scheduler. It is much cheaper than an OS thread:

| Feature            | Goroutine             | OS Thread     |
| ------------------ | --------------------- | ------------- |
| Stack size (start) | 2 KB                  | ~1–2 MB       |
| Creation cost      | Very low              | High          |
| Count              | Can create millions   | Limited by OS |
| Scheduling         | Managed by Go runtime | Managed by OS |

Goroutines are multiplexed over fewer OS threads to achieve concurrency with minimal overhead.

---

## 3. The M:N Scheduler — How Goroutines Run

Go uses an **M:N scheduler**, meaning:

- **M** goroutines run on
- **N** OS threads, coordinated by
- **P** logical processors (`GOMAXPROCS`)

Formally known as the **G-M-P model**:

### **G**: Goroutine

Represents a lightweight execution context.

### **M**: Machine (OS Thread)

Represents an actual OS thread used to run goroutines.

### **P**: Processor

Represents the Go runtime’s ability to execute goroutines in parallel.

`P` determines **how many goroutines can run simultaneously**.
By default:

```
GOMAXPROCS = number of logical CPU cores
```

Example:
On an 8-core machine → `GOMAXPROCS=8`.

---

## 4. Does Each Goroutine Create a Thread?

**No.**
A goroutine does **not** correspond to a dedicated OS thread.

A single thread may execute **hundreds or thousands** of goroutines over time. The runtime schedules goroutines across available threads as needed.

---

## 5. What Happens When You Run Goroutines?

### ### Case 1 — You Have 8 Threads (`GOMAXPROCS=8`) and Run **1 goroutine**

- One goroutine is created.
- The scheduler chooses _one_ of the available threads to run it.
- The other threads remain idle.

➡️ Only **one** thread is used.

---

### Case 2 — You Have 8 Threads and Run **16 goroutines**

- Sixteen goroutines are created.
- The scheduler distributes these goroutines over at most **8 threads**.
- Up to **8 goroutines can run in parallel**.
- The remaining goroutines will wait until a thread becomes available.

➡️ **16 goroutines → multiplexed over 8 threads → max parallelism = 8**.

---

## 6. Does the Main Goroutine Consume One Thread Permanently?

No.

When the program starts:

1. A goroutine named **`main`** is created.
2. The runtime assigns it to one OS thread.
3. After running, this same thread can run **other goroutines**.

The `main` goroutine **does not “reserve” or remove one thread** from the pool.
It is simply another goroutine being scheduled.

---

## 7. What Happens If a Goroutine Panics?

By default:

### ➤ **If any goroutine panics (without recovery), the entire program crashes.**

This applies to:

- the `main` goroutine
- any child goroutine created with `go func() { }`

Example:

```go
go func() {
    panic("failed!")
}()
```

Result → program terminates with a panic.

---

## 8. How to Prevent a Panic in One Goroutine From Crashing the Program

Use `recover()`:

```go
go func() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered inside goroutine:", r)
        }
    }()
    panic("failure inside goroutine")
}()
```

This isolates the crash to that goroutine only.

---

## 9. How to Crash the Program When _Any_ Goroutine Fails

### Option 1 — Default Behavior

Simply do **not** use `recover()`.

### Option 2 — Explicit “fail-fast” behavior using channels

```go
errChan := make(chan error)

for i := 0; i < 10; i++ {
    go func(id int) {
        errChan <- fmt.Errorf("goroutine %d failed", id)
    }(i)
}

err := <-errChan
panic(err)
```

---

## 10. How to Cancel All Goroutines if One Fails (Supervisor Pattern)

Using `context`:

```go
ctx, cancel := context.WithCancel(context.Background())
errChan := make(chan error, 1)

for i := 0; i < 10; i++ {
    go func(id int) {
        select {
        case <-ctx.Done():
            return
        default:
            // do work...
            errChan <- fmt.Errorf("goroutine %d failed", id)
        }
    }(i)
}

err := <-errChan
cancel() // stops all other goroutines
panic(err)
```

---

## 11. Summary

### ✔ Goroutines do **not** create threads

### ✔ Up to `GOMAXPROCS` goroutines can run **in parallel**

### ✔ The main goroutine uses a thread but does not reserve it

### ✔ Any panic (without recovery) crashes the entire program

### ✔ Recovery isolates failures

### ✔ You can implement fail-fast or supervisor-like behavior
