export interface Articles {
  [key: string]: () => Promise<string>;
}

export const articleFiles = import.meta.glob<Articles>(
  "../../articles/*/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
);
