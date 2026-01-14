export const IMAGE_STYLES = [
  {
    id: "none",
    label: "No Preference",
    hint: "",
    icon: "sparkles",
  },
  {
    id: "realistic",
    label: "Realistic",
    hint: "photorealistic, high quality photography",
    icon: "camera",
  },
  {
    id: "animated",
    label: "Animated",
    hint: "3D cartoon animation style like Pixar or Disney",
    icon: "film",
  },
  {
    id: "anime",
    label: "Anime",
    hint: "Japanese anime style illustration",
    icon: "star",
  },
  {
    id: "artistic",
    label: "Artistic",
    hint: "watercolor painting, artistic illustration",
    icon: "palette",
  },
  {
    id: "vintage",
    label: "Vintage",
    hint: "retro vintage style, nostalgic aesthetic",
    icon: "clock",
  },
] as const;

export type ImageStyleId = (typeof IMAGE_STYLES)[number]["id"];
