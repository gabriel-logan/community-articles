# Domain Names, DNS, Registries and Performance

## A Complete, End-to-End Technical Documentation

---

## 1. What You Actually Buy When You Buy a Domain

When you buy a domain such as `logan.com.br`, **you are not buying a server, a website, or physical storage**.

You are buying:

> **The exclusive right to use a specific name inside the global Domain Name System (DNS) for a limited period of time.**

This right is enforced by official registries and coordinated globally.

### Key Characteristics

- A domain is **not physical**
- A domain is **not a file**
- A domain is **not infrastructure**
- A domain is a **record in an authoritative naming system**

If you stop paying for it, the right expires and the name can be registered by someone else.

---

## 2. Domain ≠ Server ≠ Website

These concepts are often confused but are completely different layers.

| Component | What it is                          |
| --------- | ----------------------------------- |
| Domain    | A human-readable name               |
| DNS       | The resolution system               |
| Server    | A machine connected to the internet |
| Website   | Code + content running on a server  |

A domain **only points** to something. It does not host anything.

---

## 3. The Global DNS Architecture (How the Internet Knows Everything)

The internet uses a **hierarchical and distributed naming system**, not a single central database.

### 3.1 The DNS Root

At the top of the hierarchy is the **DNS Root**.

The root knows only this:

- Who manages `.com`
- Who manages `.br`
- Who manages `.org`
- Who manages every TLD

The root **does not know individual domains**.

---

## 4. Global Authority: ICANN and IANA

### ICANN

**ICANN (Internet Corporation for Assigned Names and Numbers)** coordinates the global DNS.

ICANN:

- Defines policies
- Delegates authority
- Accredits registries and registrars

### IANA

Operated by ICANN, **IANA manages the DNS root zone**.

---

## 5. Registries: The Real Owners of TLDs

A **registry** is the official authority for a Top-Level Domain (TLD).

Only the registry can:

- Create domains
- Delete domains
- Define authoritative name servers

### Examples by Country

#### Brazil (.br)

- Registry: **Registro.br** (NIC.br / CGI.br)
- Manages: `.br`, `.com.br`, `.gov.br`, `.edu.br`

#### United States

- `.com`, `.net`: **Verisign**
- `.org`: **Public Interest Registry (PIR)**
- `.us`: Registry Services LLC

#### Argentina (.ar)

- Registry: **NIC Argentina** (government-managed)

#### Germany (.de)

- Registry: **DENIC eG**

#### France (.fr)

- Registry: **AFNIC**

#### European Union (.eu)

- Registry: **EURid**

---

## 6. Registrars vs Registries (Critical Difference)

| Role            | Registry              | Registrar                      |
| --------------- | --------------------- | ------------------------------ |
| Authority       | Owns the TLD          | Resells domains                |
| Creates domains | Yes                   | No                             |
| Examples        | Registro.br, Verisign | Cloudflare, Hostinger, GoDaddy |

A registrar is **never the real owner of a domain namespace**.

---

## 7. Buying `.br` Domains: Direct vs Intermediaries

### 7.1 Buying Directly from Registro.br

Advantages:

- Direct authority
- No intermediaries
- Full DNS control
- Clear pricing
- Strong legal ownership

Disadvantages:

- Minimal UI
- No hosting bundles

### 7.2 Buying `.br` via Cloudflare / Hostinger

What actually happens:

- The domain is still registered at Registro.br
- The provider acts as a reseller
- You depend on the provider’s account

Risks:

- Transfer friction
- Limited DNS flexibility
- Account dependency

**Technically inferior for `.br` domains.**

---

## 8. International Domains (`.com`, `.net`, etc.)

There is **no way to buy these directly** from the registry.

You must use a registrar.

### Cloudflare as Registrar

Pros:

- At-cost pricing
- Extremely fast DNS
- Easy DNSSEC
- Global Anycast

Cons:

- Mandatory Cloudflare DNS
- Less infra independence

---

## 9. Where Domain Records Are Stored

Domains exist as:

- Entries in registry databases
- Replicated authoritative DNS zones
- Cached globally by resolvers

There is:

- ❌ No single database
- ❌ No physical file
- ❌ No single server

Everything is:

- Distributed
- Replicated
- Cached
- Cryptographically verifiable

---

## 10. DNS Resolution Flow (Step-by-Step)

When a user accesses `logan.com.br`:

1. Browser checks local cache
2. OS resolver is queried
3. Recursive resolver queries root
4. Root points to `.br`
5. `.br` points to authoritative servers
6. Authoritative DNS returns IP
7. Browser connects to server

---

## 11. DNS and Performance (Why "Fast DNS" Is Real)

### 11.1 What “Fast DNS” Means

Fast DNS = **low-latency name resolution**.

It affects **connection start time**, not bandwidth.

### 11.2 Latency Timeline

Typical first request:

- DNS lookup: 5–100 ms
- TCP handshake: 30–150 ms
- TLS handshake: 50–200 ms

DNS latency delays everything that follows.

---

## 12. Why Some DNS Providers Are Faster

### Anycast

- Same IP
- Multiple global locations
- User routed to nearest POP

### Dedicated Infrastructure

- Memory-based
- UDP-first
- No disk I/O

### Aggressive Caching

- Reduced hierarchy traversal
- Optimized TTLs

---

## 13. Resolver DNS vs Authoritative DNS

| Type          | Example             | Role                    |
| ------------- | ------------------- | ----------------------- |
| Resolver      | 1.1.1.1, 8.8.8.8    | Answers users           |
| Authoritative | Cloudflare, Route53 | Answers for your domain |

Both affect latency.

---

## 14. When DNS Latency Matters Most

- First visit
- Mobile networks
- Cold starts
- Microservices
- Multi-domain pages
- CDN-heavy sites

---

## 15. DNS and Modern Web Protocols

DNS speed affects:

- HTTP/2 connection reuse
- HTTP/3 (QUIC)
- 0-RTT TLS
- Preconnect & Prefetch

Slow DNS reduces the effectiveness of modern protocols.

---

## 16. Security and Integrity

DNS is protected by:

- Registry authentication
- Account controls
- Replication
- DNSSEC signatures

Deleting or hijacking a domain without authorization is extremely difficult.

---

## 17. Final Technical Truths

- Domains are **rights**, not assets
- DNS is **distributed, not centralized**
- Registries are **authoritative**
- Registrars are **intermediaries**
- DNS speed affects **startup latency**

---

## 18. Final Statement

> **A domain is not a place.
> It is a globally agreed-upon name inside a distributed system of trust.**
