import React from 'react';
import { CharacterDTO } from '../../shared/types';
import './BuffsPanel.css';

interface BuffsPanelProps {
  character: CharacterDTO;
}

const colorMap: Record<string, string> = {
  'alive': '#4caf50',
  'sleep': '#2196f3',
  'eat': '#ff9800',
  'drink': '#00bcd4',
  'clean': '#9c27b0',
  'heal': '#f44336',
  'rest': '#795548'
};

const iconMap: Record<string, string> = {
  'alive': '❤️',
  'sleep': '😴',
  'eat': '🍎',
  'drink': '💧',
  'clean': '✨',
  'heal': '💊',
  'rest': '🛋️'
};

const getBuffColor = (buffId: string): string => {
  return colorMap[buffId] || '#607d8b';
};

const getBuffIcon = (buffId: string): string => {
  return iconMap[buffId] || '⭐';
};

export const BuffsPanel: React.FC<BuffsPanelProps> = ({ character }) => {
  if (character.buffs.length === 0) {
    return (
      <div className="buffs-panel">
        <h3>Active Effects</h3>
        <div className="no-buffs">No active effects</div>
      </div>
    );
  }

  return (
    <div className="buffs-panel">
      <h3>Active Effects</h3>
      <div className="buffs-grid">
        {
          character.buffs.map(buff => (
            <div
              key={buff.id}
              className="buff-item"
              style={{ borderLeftColor: getBuffColor(buff.id) }}
              title={`${buff.name} (${buff.stacks}/${buff.maxStacks} stacks, ${buff.duration} ticks remaining)`}
            >
              <div className="buff-icon">{getBuffIcon(buff.id)}</div>
              <div className="buff-info">
                <div className="buff-name">{buff.name}</div>
                <div className="buff-stacks">
                  {buff.stacks > 1 && `×${buff.stacks}`}
                </div>
                <div className="buff-duration">
                  {buff.duration !== Infinity ? `${buff.duration}t` : '∞'}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};
