export const RESOURCE_TYPES = ['gold', 'wood', 'stone', 'diamond', 'iron', 'randomonium', 'artifact', 'ash', 'magma', 'heckstone', 'magic'] as const;
export type ResourceType = typeof RESOURCE_TYPES[number];
export type ResourceInit = Partial<Record<ResourceType, number>>;

export function defaultStartingResources(): Record<ResourceType, number> {
    const data = {} as Record<ResourceType, number>;
    for (const t of RESOURCE_TYPES) {
        data[t] = t === 'gold' ? 50 : 0;
    }
    return data;
}

export const GOLD_RESOURCE = 'gold' satisfies ResourceType;
export const WOOD_RESOURCE = 'wood' satisfies ResourceType;
export const STONE_RESOURCE = 'stone' satisfies ResourceType;
export const DIAMOND_RESOURCE = 'diamond' satisfies ResourceType;
export const IRON_RESOURCE = "iron" satisfies ResourceType;
export const RANDOMONIUM_RESROUCE = "randomonium" satisfies ResourceType;
export const ARTIFACT_RESOURCE = "artifact" satisfies ResourceType;
export const ASH_RESOURCE = "ash" satisfies ResourceType;
export const MAGMA_RESOURCE = "magma" satisfies ResourceType;
export const HECKSTONE_RESOURCE = "heckstone" satisfies ResourceType;
export const MAGIC_RESOURCE = "magic" satisfies ResourceType;
