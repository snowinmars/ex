import React from 'react';
import { CharacterProperties, NaturalEffect, NaturalEffectEntry } from '../../shared/types';

import './NaturalEffectsPanel.css';

interface NaturalEffectsPanelProps {
  effects: NaturalEffect[];
  characterProperties: CharacterProperties;
}

export const NaturalEffectsPanel: React.FC<NaturalEffectsPanelProps> = ({ effects, characterProperties }) => {
  const evaluateCondition = (condition: string): boolean => {
    try {
      // Use the characterProperties directly since it's now CharacterProperties type
      const context = { ...characterProperties };

      // Replace property access with context variables
      const evalCondition = condition.replace(/properties\.(\w+)/g, 'context.$1');

      // Use Function constructor for safe evaluation
      return new Function('context', `return ${evalCondition}`)(context);
    } catch (error) {
      console.error('Error evaluating condition:', condition, error);
      return false;
    }
  };

  const formatEffectValue = (effect: NaturalEffectEntry): string => {
    const value = effect.source
      ? effect.value * characterProperties[effect.source]
      : effect.value;

    const percentage = (value * 100).toFixed(1);
    return effect.operation === 'add'
      ? `${value > 0 ? '+' : ''}${percentage}%`
      : `×${value.toFixed(2)}`;
  };

  return (
    <div className="natural-effects-panel">
      <h3>Natural Effects</h3>
      <div className="effects-list">
        {effects.map(effect => {
          const isActive = evaluateCondition(effect.condition);

          return (
            <div
              key={effect.id}
              className={`effect-item ${isActive ? 'active' : 'inactive'}`}
              title={effect.description}
            >
              <div className="effect-status">
                <div className={`status-indicator ${isActive ? 'active' : 'inactive'}`} />
              </div>
              <div className="effect-info">
                <div className="effect-description">{effect.description}</div>
                {isActive && (
                  <div className="effect-details">
                    {effect.effects.map((entry, index) => (
                      <span key={index} className="effect-entry">
                        {entry.target}: {formatEffectValue(entry)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};