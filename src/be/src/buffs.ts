import { Buff } from './shared/types';

export const BUFF_DEFINITIONS: Record<string, Omit<Buff, 'id' | 'stacks'>> = {
  // Permanent buffs
  'alive': {
    name: 'Alive',
    maxStacks: 1,
    duration: Infinity,
    effects: [
      { property: 'sleepiness', value: 0.08, operation: 'add' },
      { property: 'hunger', value: 0.08, operation: 'add' },
      { property: 'thirst', value: 0.08, operation: 'add' },
      { property: 'toilet', value: 0.08, operation: 'add' },
      { property: 'dirtiness', value: 0.08, operation: 'add' }
    ]
  },

  // Action buffs (stronger to counter natural growth)
  'sleep': {
    name: 'Sleeping',
    maxStacks: 3,
    duration: 4,
    effects: [
      { property: 'sleepiness', value: -0.35, operation: 'add' },
      { property: 'pain', value: -0.10, operation: 'add' }
    ]
  },

  'eat': {
    name: 'Eating',
    maxStacks: 3,
    duration: 3,
    effects: [
      { property: 'hunger', value: -0.45, operation: 'add' },
      { property: 'toilet', value: 0.15, operation: 'add' }
    ]
  },

  'drink': {
    name: 'Drinking',
    maxStacks: 3,
    duration: 3,
    effects: [
      { property: 'thirst', value: -0.50, operation: 'add' },
      { property: 'toilet', value: 0.20, operation: 'add' }
    ]
  },

  'clean': {
    name: 'Cleaning',
    maxStacks: 3,
    duration: 3,
    effects: [
      { property: 'dirtiness', value: -0.70, operation: 'add' },
      { property: 'discomfort', value: -0.15, operation: 'add' }
    ]
  },

  'heal': {
    name: 'Healing',
    maxStacks: 3,
    duration: 3,
    effects: [
      { property: 'pain', value: -0.50, operation: 'add' },
      { property: 'discomfort', value: -0.10, operation: 'add' }
    ]
  },

  'rest': {
    name: 'Resting',
    maxStacks: 3,
    duration: 2,
    effects: [
      { property: 'discomfort', value: -0.25, operation: 'add' }
    ]
  },

  'toilet': {
    name: 'Toilet',
    maxStacks: 3,
    duration: 4,
    effects: [
      { property: 'toilet', value: -0.60, operation: 'add' },
      { property: 'discomfort', value: -0.20, operation: 'add' }
    ]
  }
};