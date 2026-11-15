import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mind And Soul Klinic with Nidhi",
    short_name: "Mind And Soul Klinic",
    description:
      "A welcoming space for therapy, emotional wellbeing, and personal growth with Kiran Khullar.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f4",
    theme_color: "#003044",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
