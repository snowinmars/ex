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

// Add these to your existing types
export interface Buff {
  id: string;
  name: string;
  stacks: number;
  maxStacks: number;
  duration: number; // in ticks
  effects: BuffEffect[];
}

export interface BuffEffect {
  property: VelocityKey;
  value: number;
  operation: 'add' | 'multiply';
}

export interface CharacterDTO {
  id: string;
  name: string;
  properties: CharacterProperties;
  velocities: CharacterVelocities;
  buffs: Buff[]; // Add buffs array
}