export const RESOURCE_TYPES = ['gold', 'wood', 'stone'] as const;
export type ResourceType = typeof RESOURCE_TYPES[number];
export type ResourceInit = Partial<Record<ResourceType, number>>;

export const GOLD_RESOURCE = 'gold' satisfies ResourceType;
export const WOOD_RESOURCE = 'wood' satisfies ResourceType;
export const STONE_RESOURCE = 'stone' satisfies ResourceType;
