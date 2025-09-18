import { PropertyKey, VelocityKey } from './shared/types';

export interface NaturalEffect {
  id: string;
  description: string;
  condition: (properties: Record<PropertyKey, number>) => boolean;
  effects: NaturalEffectEntry[];
}

export interface NaturalEffectEntry {
  target: VelocityKey;
  value: number;
  operation: 'add' | 'multiply';
  source?: PropertyKey;
  condition?: (properties: Record<PropertyKey, number>) => boolean;
}

const minPropertyValue = 0;
const maxPropertyValue = 10;
const deltaPropertyValue = maxPropertyValue - minPropertyValue;

export const getPercentageValue = (value: number): number => {
  return value * 100 / deltaPropertyValue;
}

export const NATURAL_EFFECTS: NaturalEffect[] = [
  // Discomfort tiered effects
  {
    id: 'minor_discomfort',
    description: 'Very minor discomfort for 15%-50% filled needs',
    condition: (properties) =>
      getPercentageValue(properties.sleepiness) > 15 || getPercentageValue(properties.hunger) > 15 ||
      getPercentageValue(properties.thirst) > 15 || getPercentageValue(properties.toilet) > 15 ||
      getPercentageValue(properties.dirtiness) > 15 || getPercentageValue(properties.pain) > 15,
    effects: [
      {
        target: 'discomfort',
        value: 0.005,
        operation: 'add',
        source: 'sleepiness',
        condition: (p) => getPercentageValue(p.sleepiness) > 15 && getPercentageValue(p.sleepiness) <= 50
      },
      {
        target: 'discomfort',
        value: 0.005,
        operation: 'add',
        source: 'hunger',
        condition: (p) => getPercentageValue(p.hunger) > 15 && getPercentageValue(p.hunger) <= 50
      },
      {
        target: 'discomfort',
        value: 0.005,
        operation: 'add',
        source: 'thirst',
        condition: (p) => getPercentageValue(p.thirst) > 15 && getPercentageValue(p.thirst) <= 50
      },
      {
        target: 'discomfort',
        value: 0.005,
        operation: 'add',
        source: 'toilet',
        condition: (p) => getPercentageValue(p.toilet) > 15 && getPercentageValue(p.toilet) <= 50
      },
      {
        target: 'discomfort',
        value: 0.005,
        operation: 'add',
        source: 'dirtiness',
        condition: (p) => getPercentageValue(p.dirtiness) > 15 && getPercentageValue(p.dirtiness) <= 50
      },
      {
        target: 'discomfort',
        value: 0.008,
        operation: 'add',
        source: 'pain',
        condition: (p) => getPercentageValue(p.pain) > 15 && getPercentageValue(p.pain) <= 50
      }
    ]
  },
  {
    id: 'low_discomfort',
    description: 'Low discomfort for 50%-85% filled needs',
    condition: (properties) =>
      getPercentageValue(properties.sleepiness) > 50 || getPercentageValue(properties.hunger) > 50 ||
      getPercentageValue(properties.thirst) > 50 || getPercentageValue(properties.toilet) > 50 ||
      getPercentageValue(properties.dirtiness) > 50 || getPercentageValue(properties.pain) > 50,
    effects: [
      {
        target: 'discomfort',
        value: 0.02,
        operation: 'add',
        source: 'sleepiness',
        condition: (p) => getPercentageValue(p.sleepiness) > 50 && getPercentageValue(p.sleepiness) <= 85
      },
      {
        target: 'discomfort',
        value: 0.02,
        operation: 'add',
        source: 'hunger',
        condition: (p) => getPercentageValue(p.hunger) > 50 && getPercentageValue(p.hunger) <= 85
      },
      {
        target: 'discomfort',
        value: 0.02,
        operation: 'add',
        source: 'thirst',
        condition: (p) => getPercentageValue(p.thirst) > 50 && getPercentageValue(p.thirst) <= 85
      },
      {
        target: 'discomfort',
        value: 0.02,
        operation: 'add',
        source: 'toilet',
        condition: (p) => getPercentageValue(p.toilet) > 50 && getPercentageValue(p.toilet) <= 85
      },
      {
        target: 'discomfort',
        value: 0.02,
        operation: 'add',
        source: 'dirtiness',
        condition: (p) => getPercentageValue(p.dirtiness) > 50 && getPercentageValue(p.dirtiness) <= 85
      },
      {
        target: 'discomfort',
        value: 0.03,
        operation: 'add',
        source: 'pain',
        condition: (p) => getPercentageValue(p.pain) > 50 && getPercentageValue(p.pain) <= 85
      }
    ]
  },
  {
    id: 'high_discomfort',
    description: 'High discomfort for 85%-100% filled needs',
    condition: (properties) =>
      getPercentageValue(properties.sleepiness) > 85 || getPercentageValue(properties.hunger) > 85 ||
      getPercentageValue(properties.thirst) > 85 || getPercentageValue(properties.toilet) > 85 ||
      getPercentageValue(properties.dirtiness) > 85 || getPercentageValue(properties.pain) > 85,
    effects: [
      {
        target: 'discomfort',
        value: 0.25,
        operation: 'add',
        source: 'sleepiness',
        condition: (p) => getPercentageValue(p.sleepiness) > 85
      },
      {
        target: 'discomfort',
        value: 0.25,
        operation: 'add',
        source: 'hunger',
        condition: (p) => getPercentageValue(p.hunger) > 85
      },
      {
        target: 'discomfort',
        value: 0.25,
        operation: 'add',
        source: 'thirst',
        condition: (p) => getPercentageValue(p.thirst) > 85
      },
      {
        target: 'discomfort',
        value: 0.25,
        operation: 'add',
        source: 'toilet',
        condition: (p) => getPercentageValue(p.toilet) > 85
      },
      {
        target: 'discomfort',
        value: 0.25,
        operation: 'add',
        source: 'dirtiness',
        condition: (p) => getPercentageValue(p.dirtiness) > 85
      },
      {
        target: 'discomfort',
        value: 0.27,
        operation: 'add',
        source: 'pain',
        condition: (p) => getPercentageValue(p.pain) > 85
      }
    ]
  },

  // Secondary natural effects (unchanged from previous)
  {
    id: 'sleepiness_+_pain_-',
    description: 'High sleepiness decreases pain',
    condition: (properties) => getPercentageValue(properties.sleepiness) > 60,
    effects: [
      { target: 'pain', value: -0.03, operation: 'add', source: 'sleepiness' }
    ]
  },
  {
    id: 'hunger_+_sleepiness_-',
    description: 'High hunger decreases sleepiness',
    condition: (properties) => getPercentageValue(properties.hunger) > 70,
    effects: [
      { target: 'sleepiness', value: -0.02, operation: 'add', source: 'hunger' }
    ]
  },
  {
    id: 'thirst_+_dirtiness_+',
    description: 'High thirst increases dirtiness',
    condition: (properties) => getPercentageValue(properties.thirst) > 70,
    effects: [
      { target: 'dirtiness', value: 0.01, operation: 'add', source: 'thirst' }
    ]
  },
  {
    id: 'thirst_-_toilet_+',
    description: 'Low thirst increases toilet',
    condition: (properties) => getPercentageValue(properties.thirst) < 30,
    effects: [
      { target: 'toilet', value: 0.02, operation: 'add' }
    ]
  },
  {
    id: 'toilet_+_sleepiness_-',
    description: 'High toilet decreases sleepiness',
    condition: (properties) => getPercentageValue(properties.toilet) > 70,
    effects: [
      { target: 'sleepiness', value: -0.01, operation: 'add', source: 'toilet' }
    ]
  },
  {
    id: 'toilet_+_thirst_-',
    description: 'High toilet decreases thirst',
    condition: (properties) => getPercentageValue(properties.toilet) > 70,
    effects: [
      { target: 'thirst', value: -0.01, operation: 'add', source: 'toilet' }
    ]
  },
  {
    id: 'pain_+_thirst_+',
    description: 'High pain increases thirst',
    condition: (properties) => getPercentageValue(properties.pain) > 60,
    effects: [
      { target: 'thirst', value: 0.01, operation: 'add', source: 'pain' }
    ]
  },
  {
    id: 'pain_+_sleepiness_-',
    description: 'High pain decreases sleepiness',
    condition: (properties) => getPercentageValue(properties.pain) > 60,
    effects: [
      { target: 'sleepiness', value: -0.02, operation: 'add', source: 'pain' }
    ]
  }
];