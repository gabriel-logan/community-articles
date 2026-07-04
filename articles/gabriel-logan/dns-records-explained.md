# DNS Records Explained: A Complete Guide

## Introduction

The Domain Name System (DNS) is the Internet's directory service. Its purpose is to translate human-readable domain names into information that computers can use, such as IP addresses or service locations.

For example, when a user visits:

```
https://api.example.com
```

the browser first performs a DNS lookup to determine where that hostname is located before establishing a network connection.

---

# How DNS Resolution Works

A simplified request flow looks like this:

```
User
 │
 ▼
Browser
 │
 ▼
Recursive DNS Resolver
(Google DNS, Cloudflare DNS, ISP, etc.)
 │
 ▼
Root DNS Server
 │
 ▼
TLD DNS Server
(.com, .org, .br, etc.)
 │
 ▼
Authoritative DNS Server
(Cloudflare, Route53, DigitalOcean, etc.)
 │
 ▼
DNS Record Response
 │
 ▼
Browser connects to the destination server
```

DNS itself does **not** serve your website.

Its only responsibility is answering questions such as:

- What IP address belongs to this hostname?
- Does this hostname point to another hostname?
- Which mail server handles this domain?
- Which services are available?

---

# Domain Structure

Example:

```
api.blog.example.com
```

Breakdown:

```
com          → Top-Level Domain (TLD)

example      → Registered domain

blog         → Subdomain

api          → Subdomain
```

You can create as many subdomains as needed:

```
api.example.com

admin.example.com

cdn.example.com

mail.example.com

dev.api.example.com
```

---

# DNS Records

A DNS zone contains multiple records.

Example:

```
Type     Name     Value

A        @        34.120.15.20

AAAA     @        2606:4700:....

CNAME    www      app.example.net

MX       @        1 aspmx.l.google.com

TXT      @        google-site-verification=...

CAA      @        0 issue "letsencrypt.org"
```

Each record type serves a different purpose.

---

# A Record

Maps a hostname directly to an IPv4 address.

Example:

```
A

api.example.com

↓

34.120.15.20
```

When a client asks:

```
Where is api.example.com?
```

DNS replies:

```
34.120.15.20
```

The browser then connects directly to that IP.

Typical uses:

- VPS servers
- Dedicated servers
- Static public IPs
- Load balancers

---

# AAAA Record

Exactly like an A record, except it points to an IPv6 address.

Example:

```
AAAA

api.example.com

↓

2606:4700:3035::6815:1
```

Many services publish both A and AAAA records.

---

# CNAME Record

Canonical Name.

Unlike an A record, it **does not point to an IP address**.

Instead, it points to another hostname.

Example:

```
www.example.com

↓

app.up.railway.app
```

Resolution process:

```
www.example.com

↓

app.up.railway.app

↓

34.120.15.20
```

The resolver follows the CNAME chain until an A or AAAA record is found.

Common use cases:

- Railway
- Vercel
- Netlify
- GitHub Pages
- CloudFront
- Render

Advantages:

- Infrastructure providers can change IP addresses without requiring DNS changes.
- Easier maintenance.

---

# A vs CNAME

### A Record

```
api.example.com

↓

34.120.15.20
```

### CNAME

```
api.example.com

↓

api-production.up.railway.app

↓

34.120.15.20
```

Rule of thumb:

- Use **A** when you own the server's IP.
- Use **CNAME** for subdomains that point to a managed platform.
- Do not use **CNAME** at the zone apex unless your DNS provider offers CNAME flattening or a similar feature.

---

# MX Record

Mail Exchange record.

Specifies which mail servers receive email for a domain.

Example:

```
MX

example.com

↓

Priority: 1

Host: aspmx.l.google.com
```

When someone sends:

```
contact@example.com
```

the sending mail server asks:

```
Which server accepts email for example.com?
```

DNS responds with the configured MX records.

Common providers:

- Google Workspace
- Microsoft 365
- Proton Mail
- Zoho Mail

---

# TXT Record

Stores arbitrary text.

Most commonly used for verification and email security.

Examples:

```
google-site-verification=...
```

```
facebook-domain-verification=...
```

```
v=spf1 include:_spf.google.com ~all
```

TXT records are also used for:

- SPF
- DKIM
- DMARC
- Domain ownership verification
- Third-party integrations

---

# NS Record

Name Server record.

Defines which DNS provider is authoritative for a domain.

Example:

```
example.com

↓

ns1.cloudflare.com

ns2.cloudflare.com
```

This means Cloudflare is responsible for answering all DNS queries for the domain.

Changing the delegated nameservers at the registrar effectively moves DNS management to another provider.

NS records inside a zone can also delegate a subdomain, such as `dev.example.com`, to different authoritative nameservers.

---

# SOA Record

Start of Authority.

Contains metadata about the DNS zone.

Typical fields include:

- Primary nameserver
- Administrative contact
- Serial number
- Refresh interval
- Retry interval
- Expiration time
- Default TTL

These records are usually managed automatically.

---

# SRV Record

Service Locator record.

Unlike A or CNAME, it specifies:

- Service
- Protocol
- Host
- Port
- Priority
- Weight

Example:

```
_minecraft._tcp.example.com

↓

Host: server.example.com

Port: 25565
```

Common uses:

- Minecraft
- SIP
- LDAP
- XMPP
- Kerberos

---

# CAA Record

Certification Authority Authorization.

Controls which Certificate Authorities (CAs) are allowed to issue SSL/TLS certificates for the domain.

Example:

```
CAA

0 issue "letsencrypt.org"
```

Only Let's Encrypt may issue standard certificates for that hostname.

If a domain has no CAA records, public Certificate Authorities are not restricted by CAA for that domain.

Benefits:

- Improved security
- Prevents unauthorized certificate issuance

---

# PTR Record

Pointer record.

Used for reverse DNS.

Normal DNS:

```
Hostname

↓

IP Address
```

Reverse DNS:

```
IP Address

↓

Hostname
```

Frequently used for:

- Email servers
- Spam prevention
- Network diagnostics

PTR records are generally managed by the owner of the IP address rather than the domain owner.

---

# ALIAS / ANAME Records

Some DNS providers support proprietary record types that behave similarly to CNAME records but can be used at the root domain.

Example:

```
example.com

↓

app.vercel.app
```

This solves the limitation that a standard CNAME cannot be used at the zone apex because the apex must also contain records such as SOA and NS.

Support varies by provider.

Cloudflare implements a similar feature internally through **CNAME Flattening**.

---

# Wildcard Records

A wildcard matches any undefined subdomain.

Example:

```
*.example.com
```

Requests like:

```
test.example.com

abc.example.com

customer123.example.com
```

will all resolve to the same destination unless a more specific record exists.

Common use cases:

- SaaS platforms
- Multi-tenant applications
- Development environments

---

# TTL (Time To Live)

TTL specifies how long DNS responses may be cached.

Example:

```
TTL = 300
```

means DNS resolvers may cache the record for 300 seconds.

Typical values:

```
60

300

600

3600

86400
```

Lower TTL:

- Faster cache expiration after DNS changes
- More DNS queries

Higher TTL:

- Better caching
- Slower cache expiration after DNS changes

---

# Summary Table

| Record            | Purpose                                                            |
| ----------------- | ------------------------------------------------------------------ |
| **A**             | Maps a hostname to an IPv4 address                                 |
| **AAAA**          | Maps a hostname to an IPv6 address                                 |
| **CNAME**         | Maps a hostname to another hostname                                |
| **MX**            | Specifies mail servers for the domain                              |
| **TXT**           | Stores arbitrary text for verification and email policies          |
| **NS**            | Specifies the authoritative DNS servers                            |
| **SOA**           | Stores metadata about the DNS zone                                 |
| **SRV**           | Specifies the location of network services                         |
| **CAA**           | Restricts which Certificate Authorities may issue SSL certificates |
| **PTR**           | Reverse DNS mapping from IP address to hostname                    |
| **ALIAS / ANAME** | Provider-specific alternative to CNAME for root domains            |
| **Wildcard (\*)** | Matches any undefined subdomain                                    |
| **TTL**           | Defines how long DNS responses remain cached                       |

---

# Which Records Are Commonly Used?

For most modern web applications, you'll primarily work with:

- **A** — Point a domain directly to an IPv4 address.
- **AAAA** — Point a domain to an IPv6 address.
- **CNAME** — Point subdomains to managed hosting providers like Railway, Vercel, or Netlify.
- **TXT** — Verify domain ownership and configure email authentication (SPF, DKIM, DMARC).
- **MX** — Configure email delivery for your domain.

The remaining record types are generally used for specialized infrastructure, enterprise networking, or advanced DNS configurations.
