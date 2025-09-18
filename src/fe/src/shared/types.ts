// shared/types.ts
export interface CharacterProperties {
  sleepiness: number;
  hunger: number;
  thirst: number;
  toilet: number;
  dirtiness: number;
  pain: number;
  discomfort: number;
}

export interface CharacterVelocities {
  sleepiness: number;
  hunger: number;
  thirst: number;
  toilet: number;
  dirtiness: number;
  pain: number;
  discomfort: number;
}

export interface CharacterDTO {
  id: string;
  name: string;
  properties: CharacterProperties;
  velocities: CharacterVelocities;
}

export type PropertyKey = keyof CharacterProperties;
export type VelocityKey = keyof CharacterVelocities;

// WebSocket message types
export interface WSMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

export interface ActionMessage extends WSMessage {
  type: 'ACTION';
  characterId: string;
  property: VelocityKey;
  value: number;
}

export interface StateUpdateMessage extends WSMessage {
  type: 'STATE_UPDATE';
  data: CharacterDTO[];
}

export interface Buff {
  id: string;
  name: string;
  stacks: number;
  maxStacks: number;
  duration: number;
}

export interface CharacterDTO {
  id: string;
  name: string;
  properties: CharacterProperties;
  velocities: CharacterVelocities;
  buffs: Buff[]; // Add buffs to character
}

// Add to existing types
export interface NaturalEffect {
  id: string;
  description: string;
  condition: string;
  effects: NaturalEffectEntry[];
}

export interface NaturalEffectEntry {
  target: VelocityKey;
  value: number;
  operation: 'add' | 'multiply';
  source?: PropertyKey;
}