import React, { useState, useEffect, useCallback } from 'react';
import { CharacterDTO, NaturalEffect  } from '../../shared/types';
import {CharacterPanel} from '../CharacterPanel/CharacterPanel';
import {ActionButtons} from '../ActionButtons/ActionButtons';
import {PropertyChart} from '../PropertyChart/PropertyChart';
import {BuffsPanel} from '../BuffsPanel/BuffsPanel';
import {NaturalEffectsPanel} from '../NaturalEffectsPanel/NaturalEffectsPanel';

import './App.css';

const WS_URL = 'ws://localhost:3001';

export const App: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterDTO[]>([]);
  const [naturalEffects, setNaturalEffects] = useState<NaturalEffect[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchNaturalEffects = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/natural-effects');
        if (response.ok) {
          const effects = await response.json();
          setNaturalEffects(effects);
        }
      } catch (error) {
        console.error('Failed to fetch natural effects:', error);
      }
    };

    fetchNaturalEffects();
  }, []);

  useEffect(() => {
    const websocket = new WebSocket(WS_URL);

    websocket.onopen = () => {
      console.log('Connected to server');
      setConnected(true);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'INITIAL_STATE':
            setCharacters(message.data);
            break;
          case 'STATE_UPDATE':
            setCharacters(message.data);
            break;
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('Disconnected from server');
      setConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const sendAction = useCallback((characterId: string, action: string) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'ACTION',
        characterId,
        action
      }));
    }
  }, [ws]);

  if (characters.length === 0) {
    return (
      <div className="app">
        <div className="connection-status">
          {connected ? 'Connected' : 'Connecting...'}
        </div>
        <div>Loading characters...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="connection-status">
        Status: {connected ? 'Connected' : 'Disconnected'}
      </div>

      <div className="dashboard">
        {characters.map(character => (
          <div key={character.id} className="character-section">
            <h2>{character.name}</h2>

            <div className="character-content">
              <div className="left-panel">
                <CharacterPanel character={character} />
                <ActionButtons
                  character={character}
                  onAction={sendAction}
                />
                <BuffsPanel character={character} /> {/* Add BuffsPanel */}
                <NaturalEffectsPanel
                  effects={naturalEffects}
                  characterProperties={character.properties}
                />
              </div>

              <div className="right-panel">
                <PropertyChart character={character} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
