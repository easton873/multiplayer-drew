import { ResourceType } from "../shared/resource_types";

// Record (not Partial) so adding a resource to RESOURCE_TYPES fails to compile until it has an emoji.
export const RESOURCE_EMOJI: Record<ResourceType, string> = {
  gold: "\u{1F4B0}",
  wood: "\u{1FAB5}",
  stone: "\u{1FAA8}",
};

export function resourceLabel(type: ResourceType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
