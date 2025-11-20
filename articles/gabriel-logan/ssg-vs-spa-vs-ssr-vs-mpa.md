# Complete Documentation: SSG, SPA, SSR, MPA

This document provides a deeply detailed and comprehensive explanation of four major web application architectures: **SSG (Static Site Generation)**, **SPA (Single Page Application)**, **SSR (Server-Side Rendering)**, and **MPA (Multi-Page Application)**. Each section covers how they work, their strengths, weaknesses, ideal use cases, performance characteristics, and behavior regarding hydration, caching, SEO, and user experience.

At the end, a full comparative summary highlights their differences.

---

# 1. SPA — Single Page Application

A **Single Page Application** is a web application where the entire app is loaded once into the browser, and subsequent navigation happens entirely on the client side without page reloads.

## 1.1 How SPA Works

1. User visits the website.
2. The server sends a minimal HTML file.
3. The browser downloads the entire JavaScript bundle.
4. JavaScript builds the UI on the client, often using React, Vue, or similar.
5. Navigation between pages is simulated using the History API.
6. No full page reloads — only UI changes.

## 1.2 SPA Architecture Characteristics

- Single HTML entry point (`index.html`).
- All routing happens client-side.
- Components are rendered dynamically with JavaScript.
- Data fetching typically occurs via AJAX or GraphQL.

## 1.3 Advantages

- Extremely fast navigation (no full reloads).
- App-like experience.
- State persists across navigation (e.g., Zustand, Redux).
- Reduced load on server after initial load.

## 1.4 Disadvantages

- Slower **first load** due to heavy JS bundles.
- SEO challenges if not using pre-rendering.
- Requires JavaScript to function.

## 1.5 Ideal Use Cases

- Dashboards
- SaaS platforms
- PWAs
- Apps with heavy interactivity

---

# 2. SSG — Static Site Generation

**Static Site Generation** pre-builds HTML pages at build time. These pages are then served as plain static files (HTML + CSS + JS).

## 2.1 How SSG Works

1. During build, each page is generated into an `.html` file.
2. Pages are uploaded to CDN as static assets.
3. User requests a page.
4. CDN returns the pre-built HTML immediately.
5. JavaScript loads and **hydrates** the UI.
6. After hydration, the site behaves as a SPA.

## 2.2 Key Behaviors

- Fast first load because HTML already contains the content.
- Perfect for SEO because robots see the full HTML.
- After hydration, navigation becomes client-side (SPA behavior).

## 2.3 Advantages

- Best TTFB (served directly from CDN).
- Excellent SEO.
- Very scalable (no server).
- Very secure (no server code).

## 2.4 Disadvantages

- Rebuild needed when data changes.
- Not ideal for real-time or frequently changing data.
- Hydration cost on complex pages.

## 2.5 Ideal Use Cases

- Documentation
- Marketing sites
- Blogs
- Portfolios
- E-commerce with static products

---

# 3. SSR — Server-Side Rendering

**Server-Side Rendering** renders the UI on the server on every request, returning fully rendered HTML to the browser.

## 3.1 How SSR Works

1. User requests a page.
2. The server executes the application code.
3. React (or another framework) renders the page on the server.
4. The server sends HTML to the client.
5. JavaScript loads and **hydrates** the page.
6. Navigation becomes client-side (SPA behavior) unless a full reload occurs.

## 3.2 Advantages

- Excellent SEO.
- Faster perceived first load (content-visible).
- Can render dynamic data on request.

## 3.3 Disadvantages

- More expensive (server must execute JS on every request).
- Slower TTFB than SSG.
- Hydration cost on client remains.

## 3.4 Ideal Use Cases

- Apps requiring dynamic content on first load.
- Personalized dashboards.
- E-commerce with dynamic prices or user-specific data.

---

# 4. MPA — Multi-Page Application

A **Multi-Page Application** consists of multiple independent pages, each fully rendered by the server and loaded completely on navigation.

## 4.1 How MPA Works

1. User requests `pageA` → server returns HTML.
2. User clicks a link to `pageB` → server loads a brand new HTML document.
3. The entire browser state resets.

No hydration. No single runtime. No shared JavaScript state.

## 4.2 Characteristics

- True multi-page model.
- Each page load is a full network round-trip.
- State resets on every navigation.
- Very SEO-friendly.
- No need for a JavaScript framework.

## 4.3 Advantages

- Simple and predictable.
- No hydration cost.
- Great SEO.
- No JS required.

## 4.4 Disadvantages

- Slower navigation (full reloads).
- No shared client-side state.
- Heavy server load if pages are dynamic.

## 4.5 Ideal Use Cases

- News sites
- Blogs without JS
- Traditional websites
- Systems depending on classical server-rendered behavior

---

# 5. Extended Technical Comparison

This section dives deeper into how each architecture behaves beyond the basics.

## 5.1 Hydration

- **SPA:** Full hydration from empty HTML.
- **SSG:** Hydrates pre-rendered HTML.
- **SSR:** Hydrates server-rendered HTML.
- **MPA:** No hydration.

## 5.2 SEO

- **SPA:** Poor without pre-rendering.
- **SSG:** Excellent.
- **SSR:** Excellent.
- **MPA:** Excellent.

## 5.3 Navigation Speed

- **SPA:** Instant.
- **SSG:** Instant (after hydration).
- **SSR:** Instant (after hydration).
- **MPA:** Slow (full reloads).

## 5.4 Server Load

- **SPA:** Very low.
- **SSG:** Zero at runtime.
- **SSR:** High.
- **MPA:** Medium–high (depends on backend).

## 5.5 Client-Side State Behavior

- **SPA:** Shared, persistent across pages.
- **SSG:** Shared after hydration.
- **SSR:** Shared after hydration.
- **MPA:** No shared state.

---

# 6. Summary: Differences Between SSG, SPA, SSR, MPA

| Feature           | SPA      | SSG              | SSR                | MPA               |
| ----------------- | -------- | ---------------- | ------------------ | ----------------- |
| First Load        | JS-heavy | Pre-rendered     | Server-rendered    | Full reload       |
| Navigation        | Instant  | Instant (SPA)    | Instant (SPA)      | Slow              |
| SEO               | Weak     | Excellent        | Excellent          | Excellent         |
| Server Load       | Low      | None             | High               | Medium            |
| State Persistence | Yes      | Yes (client)     | Yes (client)       | No                |
| Needs JS          | Yes      | Yes (after load) | Yes (after load)   | No                |
| Hydration         | Yes      | Yes              | Yes                | No                |
| Ideal For         | Apps     | Content sites    | Dynamic-first-load | Traditional sites |

---

# 7. Global Summary

- **SPA**: A single-page runtime that handles everything via JavaScript. Great UX, weak SEO without pre-render.
- **SSG**: Pre-built static pages that hydrate into a SPA. Best SEO + best performance for static content.
- **SSR**: Server-generated HTML on each request, then becomes a SPA. Great for dynamic content with SEO.
- **MPA**: The classical web model — multiple server-rendered pages with no shared JS runtime.

Each architecture solves different problems. Choosing the right one depends on:

- SEO needs
- Data freshness
- Server cost
- Desired user experience
- Bundle size and performance goals
