// shared/world-manager.ts
import { CharacterDTO, PropertyKey, VelocityKey } from '@app/shared/types';
import { ICharacterManager, CharacterManager } from '@app/character-manager';

export interface IWorldManager {
  addCharacter(character: CharacterDTO): void;
  removeCharacter(character: CharacterDTO): void;
  start(): void;
  stop(): void;
  tick(): void;
  getCharacterManager(): ICharacterManager;
  setCharacterManager(manager: ICharacterManager): void;
}

export class WorldManager implements IWorldManager {
  private characters: CharacterDTO[] = [];
  private characterManager: ICharacterManager;
  private tickInterval: NodeJS.Timeout | null = null;
  private tickRate: number = 1 * 1000; // 1 sec

  constructor(characterManager?: ICharacterManager) {
    this.characterManager = characterManager || new CharacterManager();
  }

  addCharacter(character: CharacterDTO): void {
    this.characters.push(character);
  }

  removeCharacter(character: CharacterDTO): void {
    const index = this.characters.indexOf(character);
    if (index > -1) {
      this.characters.splice(index, 1);
    }
  }

  getCharacters(): CharacterDTO[] {
    return this.characters;
  }

  start(): void {
    if (this.tickInterval) {
      this.stop();
    }

    this.tickInterval = setInterval(() => {
      this.tick();
    }, this.tickRate);
  }

  stop(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  logCharacter = (character: CharacterDTO) => {
    console.log(`Id: ${character.id}`);
    console.log(`Name: ${character.name}`);
    console.log();
    console.log(`  sleepiness: ${character.properties.sleepiness}   +${character.velocities.sleepiness}`);
    console.log(`  hunger:     ${character.properties.hunger}   +${character.velocities.hunger}`);
    console.log(`  thirst:     ${character.properties.thirst}   +${character.velocities.thirst}`);
    console.log(`  toilet:     ${character.properties.toilet}   +${character.velocities.toilet}`);
    console.log(`  dirtiness:  ${character.properties.dirtiness}   +${character.velocities.dirtiness}`);
    console.log(`  pain:       ${character.properties.pain}   +${character.velocities.pain}`);
    console.log(`  discomfort: ${character.properties.discomfort}   +${character.velocities.discomfort}`);
    console.log();
    for(const buff of character.buffs) {
      console.log(`  ${buff.id} ${buff.name} ${buff.stacks} ${buff.duration}`);
    }
  }

  tick(): void {
    this.characters.forEach(character => {
      this.logCharacter(character);
      this.characterManager.processBuffs(character);
      this.characterManager.updateVelocities(character);
      this.applyVelocities(character);
      this.clampProperties(character);
    });
  }

  private applyVelocities(character: CharacterDTO): void {
    const propertyKeys = Object.keys(character.properties) as PropertyKey[];

    propertyKeys.forEach(key => {
      character.properties[key] += character.velocities[key];
    });
  }

  private clampProperties(character: CharacterDTO): void {
    const propertyKeys = Object.keys(character.properties) as PropertyKey[];
    const minPropertyValue = 0;
    const maxPropertyValue = 10;

    propertyKeys.forEach(key => {
      character.properties[key] = Math.max(minPropertyValue, Math.min(maxPropertyValue, character.properties[key]));
    });
  }

  setTickRate(rate: number): void {
    this.tickRate = rate;
    if (this.tickInterval) {
      this.stop();
      this.start();
    }
  }

  getCharacterManager(): ICharacterManager {
    return this.characterManager;
  }

  setCharacterManager(manager: ICharacterManager): void {
    this.characterManager = manager;
  }
}