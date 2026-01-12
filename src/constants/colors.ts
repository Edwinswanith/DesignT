export const TSHIRT_COLORS = {
  "midnight-black": {
    id: "midnight-black",
    name: "Midnight Black",
    hex: "#1a1a1a",
  },
  "pure-white": {
    id: "pure-white",
    name: "Pure White",
    hex: "#fafafa",
  },
  "silver-grey": {
    id: "silver-grey",
    name: "Silver Grey",
    hex: "#9ca3af",
  },
  "warm-beige": {
    id: "warm-beige",
    name: "Warm Beige",
    hex: "#d4c4a8",
  },
  cream: {
    id: "cream",
    name: "Cream",
    hex: "#f5f0e6",
  },
} as const;

export type TShirtColorId = keyof typeof TSHIRT_COLORS;

export const TSHIRT_COLOR_LIST = Object.values(TSHIRT_COLORS);
