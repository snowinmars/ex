import React from 'react';
import { CharacterDTO, VelocityKey } from '@app/shared/types';

import './ActionButtons.css';

interface ActionButtonsProps {
  character: CharacterDTO;
  onAction: (characterId: string, property: VelocityKey, value: number) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ character, onAction }) => {
  const actions = [
    { label: 'Sleep', property: 'sleep' as VelocityKey, value: -0.3 },
    { label: 'Eat', property: 'eat' as VelocityKey, value: -0.4 },
    { label: 'Drink', property: 'drink' as VelocityKey, value: -0.5 },
    { label: 'Clean', property: 'clean' as VelocityKey, value: -0.6 },
    { label: 'Heal', property: 'heal' as VelocityKey, value: -0.4 },
    { label: 'Rest', property: 'rest' as VelocityKey, value: -0.2 },
    { label: 'Toilet', property: 'toilet' as VelocityKey, value: -0.5 },
  ];

  return (
    <div className="action-buttons">
      <h3>Actions</h3>
      <div className="buttons-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-button"
            onClick={() => onAction(character.id, action.property, action.value)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};