export const ADULT_SIZES = {
  S: { id: "S", label: "S", chest: '38"', description: "Slim fit" },
  M: { id: "M", label: "M", chest: '40"', description: "Regular fit" },
  L: { id: "L", label: "L", chest: '42"', description: "Comfortable fit" },
  XL: { id: "XL", label: "XL", chest: '44"', description: "Relaxed fit" },
  XXL: { id: "XXL", label: "XXL", chest: '46"', description: "Generous fit" },
} as const;

export const KIDS_SIZES = {
  KIDS_S: { id: "KIDS_S", label: "Kids S", chest: '24"', description: "Ages 4-6" },
  KIDS_M: { id: "KIDS_M", label: "Kids M", chest: '28"', description: "Ages 6-8" },
  KIDS_L: { id: "KIDS_L", label: "Kids L", chest: '32"', description: "Ages 8-10" },
} as const;

export const ALL_SIZES = {
  ...ADULT_SIZES,
  ...KIDS_SIZES,
} as const;

export type SizeId = keyof typeof ALL_SIZES;

export const ADULT_SIZE_LIST = Object.values(ADULT_SIZES);
export const KIDS_SIZE_LIST = Object.values(KIDS_SIZES);
export const ALL_SIZE_LIST = Object.values(ALL_SIZES);
