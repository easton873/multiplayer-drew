import { ResourceType } from "../shared/resource_types";

// Record (not Partial) so adding a resource to RESOURCE_TYPES fails to compile until it has an emoji.
export const RESOURCE_EMOJI: Record<ResourceType, string> = {
  gold: "\u{1F4B0}",
  wood: "\u{1FAB5}",
  stone: "\u{1FAA8}",
  diamond: "\u{1F48E}",
  iron: "\u{1F529}",
  randomonium: "\u{1F3B2}",
  artifact: "\u{1F3FA}",
  ash: "\u{1F4A8}",
  magma: "\u{1F30B}",
  heckstone: "\u{1F525}",
  magic: "✨",
};

export function resourceLabel(type: ResourceType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
