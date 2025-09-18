// client/src/components/CharacterPanel.tsx
import React from 'react';
import { CharacterDTO } from '../../shared/types';
import './CharacterPanel.css';
import { getPercentageValue } from '../../shared/helpers';

interface CharacterPanelProps {
  character: CharacterDTO;
}

const propertyVelocityPairs = [
  { property: 'sleepiness', velocity: 'sleepiness', label: 'Sleepiness' },
  { property: 'hunger', velocity: 'hunger', label: 'Hunger' },
  { property: 'thirst', velocity: 'thirst', label: 'Thirst' },
  { property: 'toilet', velocity: 'toilet', label: 'Toilet' },
  { property: 'dirtiness', velocity: 'dirtiness', label: 'Dirtiness' },
  { property: 'pain', velocity: 'pain', label: 'Pain' },
  { property: 'discomfort', velocity: 'discomfort', label: 'Discomfort' }
] as const;

const formatValue = (value: number): string => {
  return getPercentageValue(value).toFixed(0) + '%';
};

const formatVelocity = (value: number): string => {
  return (value > 0 ? '+' : '') + (value * 100).toFixed(1) + '%/tick';
};

const getStatusClass = (value: number): string => {
  const percent = getPercentageValue(value);
  if (percent > 50 && percent < 85) return 'status-critical';
  if (percent >= 85) return 'status-warning';
  return 'status-normal';
};

const getVelocityClass = (value: number): string => {
  if (value > 0.05) return 'velocity-positive';
  if (value < -0.05) return 'velocity-negative';
  return 'velocity-neutral';
};

export const CharacterPanel: React.FC<CharacterPanelProps> = ({ character }) => {
  return (
    <div className="character-panel">
      <h3>Character State</h3>
      <div className="properties-grid">
        {propertyVelocityPairs.map(({ property, velocity, label }) => (
          <div key={property} className="property-row">
            <div className="property-header">
              <span className="property-name">{label}:</span>
              <span className="property-value-text">
                {formatValue(character.properties[property])}
              </span>
            </div>

            <div className="property-visualization">
              <div className="value-bar-container">
                <div className={`value-bar ${getStatusClass(character.properties[property])}`}>
                  <div
                    className="value-fill"
                    style={{ width: `${getPercentageValue(character.properties[property])}%` }}
                  ></div>
                </div>
                <div className="velocity-indicator">
                  <span className={`velocity-value ${getVelocityClass(character.velocities[velocity])}`}>
                    {formatVelocity(character.velocities[velocity])}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
