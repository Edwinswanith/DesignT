export const PROMPT_SUGGESTIONS = [
  {
    id: "birthday",
    label: "Birthday Celebration",
    prompt: "A festive birthday celebration design with balloons and confetti",
  },
  {
    id: "wedding",
    label: "Wedding / Anniversary",
    prompt: "An elegant wedding or anniversary celebration design with floral elements",
  },
  {
    id: "family",
    label: "Family Portrait Style",
    prompt: "A warm family gathering illustration in a cozy setting",
  },
  {
    id: "tamil",
    label: "Tamil Culture",
    prompt: "A beautiful design celebrating Tamil culture and heritage",
  },
  {
    id: "baby",
    label: "Baby / Kids Theme",
    prompt: "A cute and playful design perfect for children",
  },
  {
    id: "sports",
    label: "Sports / Team",
    prompt: "A dynamic sports-themed design showing team spirit",
  },
] as const;

export const ASPECT_RATIOS = [
  {
    id: "1:1",
    label: "Square",
    description: "Centered chest print",
    width: 1,
    height: 1,
  },
  {
    id: "16:9",
    label: "Wide",
    description: "Banner style design",
    width: 16,
    height: 9,
  },
  {
    id: "9:16",
    label: "Tall",
    description: "Full front print",
    width: 9,
    height: 16,
  },
] as const;

export type AspectRatioId = (typeof ASPECT_RATIOS)[number]["id"];
