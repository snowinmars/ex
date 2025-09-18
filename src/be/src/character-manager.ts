import { CharacterDTO, VelocityKey } from './shared/types';
import { BUFF_DEFINITIONS } from './buffs';
import { Buff } from './shared/types';
import { NATURAL_EFFECTS } from './natural-effects';

export interface ICharacterManager {
  updateVelocities(character: CharacterDTO): void;
  applyBuff(character: CharacterDTO, buffId: string, stacks?: number): void;
  removeBuff(character: CharacterDTO, buffId: string): void;
  getBuff(character: CharacterDTO, buffId: string): Buff | undefined;
  processBuffs(character: CharacterDTO): void;
}

export class CharacterManager implements ICharacterManager {
  updateVelocities = (character: CharacterDTO): void => {
    this.resetVelocities(character);
    this.applyBuffEffects(character);
    this.applyNaturalEffects(character);
    this.clampVelocities(character);
  }

  private applyNaturalEffects(character: CharacterDTO): void {
    const { properties, velocities } = character;

    NATURAL_EFFECTS.forEach(effect => {
      if (effect.condition(properties)) {
        effect.effects.forEach(effectEntry => {
          if (!effectEntry.condition || effectEntry.condition(properties)) {
            const baseValue = effectEntry.value;
            const scaledValue = effectEntry.source
              ? baseValue * properties[effectEntry.source]
              : baseValue;

            switch (effectEntry.operation) {
              case 'add':
                velocities[effectEntry.target] += scaledValue;
                break;
              case 'multiply':
                velocities[effectEntry.target] *= scaledValue;
                break;
            }
          }
        });
      }
    });
  }

  applyBuff = (character: CharacterDTO, buffId: string, stacks: number = 1): void => {
    const buffDefinition = BUFF_DEFINITIONS[buffId];
    if (!buffDefinition) return;

    const existingBuff = character.buffs.find(b => b.id === buffId);

    if (existingBuff) {
      // Add stacks to existing buff
      existingBuff.stacks = Math.min(existingBuff.stacks + stacks, buffDefinition.maxStacks);
      existingBuff.duration = buffDefinition.duration; // Refresh duration
    } else {
      // Create new buff
      character.buffs.push({
        id: buffId,
        name: buffDefinition.name,
        stacks: Math.min(stacks, buffDefinition.maxStacks),
        maxStacks: buffDefinition.maxStacks,
        duration: buffDefinition.duration,
        effects: [...buffDefinition.effects]
      });
    }
  }

  removeBuff = (character: CharacterDTO, buffId: string): void => {
    const index = character.buffs.findIndex(b => b.id === buffId);
    if (index > -1) {
      character.buffs.splice(index, 1);
    }
  }

  getBuff = (character: CharacterDTO, buffId: string): Buff | undefined => {
    return character.buffs.find(b => b.id === buffId);
  }

  private resetVelocities = (character: CharacterDTO): void => {
    const velocityKeys = Object.keys(character.velocities) as VelocityKey[];
    velocityKeys.forEach(key => {
      character.velocities[key] = 0;
    });
  }

  private applyBuffEffects = (character: CharacterDTO): void => {
    character.buffs.forEach(buff => {
      buff.effects.forEach(effect => {
        switch (effect.operation) {
          case 'add':
            character.velocities[effect.property] += effect.value * buff.stacks;
            break;
          case 'multiply':
            character.velocities[effect.property] *= effect.value * buff.stacks;
            break;
        }
      });
    });
  }

  private clampVelocities(character: CharacterDTO): void {
    const { velocities } = character;
    const velocityKeys = Object.keys(velocities) as VelocityKey[];
    const maxVelocityValue = 1;

    velocityKeys.forEach(key => {
      velocities[key] = Math.max(-maxVelocityValue, Math.min(maxVelocityValue, velocities[key]));
    });
  }

  processBuffs(character: CharacterDTO): void {
  for (let i = character.buffs.length - 1; i >= 0; i--) {
    const buff = character.buffs[i];

    if (buff.duration === Infinity) continue;

    buff.duration--;

    if (buff.duration <= -1) { // ensure last buff tick is applied
      buff.stacks--;

      if (buff.stacks <= 0) {
        character.buffs.splice(i, 1);
      } else {
        buff.duration = BUFF_DEFINITIONS[buff.id].duration;
      }
    }
  }
}
}