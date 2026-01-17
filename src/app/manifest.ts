import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Masbettet",
    short_name: "Masbettet",
    description: "A Progressive Web App for Masbettet",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/masbettet-logo.webp",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/masbettet-logo.webp",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}