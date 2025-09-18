// server/server.ts
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { CharacterDTO } from '@app/shared/types';
import { WorldManager } from '@app/world-manager';
import { NATURAL_EFFECTS } from './natural-effects';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create world manager
const worldManager = new WorldManager();

// Create some initial characters
const characters: CharacterDTO[] = [
  {
    id: 'character-1',
    name: 'Hero',
    properties: {
      sleepiness: 0.2,
      hunger: 0.3,
      thirst: 0.1,
      toilet: 0.4,
      dirtiness: 0.2,
      pain: 0.1,
      discomfort: 0.3
    },
    velocities: {
      sleepiness: 0,
      hunger: 0,
      thirst: 0,
      toilet: 0,
      dirtiness: 0,
      pain: 0,
      discomfort: 0
    },
    buffs: []
  }
];

characters.forEach(character => {
  worldManager.getCharacterManager().applyBuff(character, 'alive');
  worldManager.addCharacter(character);
});

app.get('/api/characters', (req, res) => {
  res.json(characters);
});

app.get('/api/natural-effects', (req, res) => {
  res.json(NATURAL_EFFECTS.map(effect => ({
    id: effect.id,
    description: effect.description,
    condition: effect.condition.toString(),
    effects: effect.effects
  })));
});

app.post('/api/characters/:id/action', (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const character = characters.find(c => c.id === id);
  if (!character) {
    return res.status(404).json({ error: 'Character not found' });
  }

  // Apply the action as a buff
  worldManager.getCharacterManager().applyBuff(character, action);

  res.json({ success: true, buff: action });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

interface Client extends WebSocket {
  id: string;
}

const clients = new Set<Client>();

wss.on('connection', (ws: Client) => {
  ws.id = Math.random().toString(36).substr(2, 9);
  clients.add(ws);
  console.log(`Client connected: ${ws.id}`);

  // Send initial state
  ws.send(JSON.stringify({
    type: 'INITIAL_STATE',
    data: characters
  }));

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'ACTION') {
        const character = characters.find(c => c.id === data.characterId);
        if (character) {
          console.log(`Appying ${data.action} to ${character.name}`);
          worldManager.getCharacterManager().applyBuff(character, data.action);
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client disconnected: ${ws.id}`);
  });
});

worldManager.start();

setInterval(() => {
  const state = characters.map(character => ({
    id: character.id,
    name: character.name,
    buffs:character.buffs,
    properties: character.properties ,
    velocities: character.velocities
  }));

  const message = JSON.stringify({
    type: 'STATE_UPDATE',
    data: state,
    timestamp: Date.now()
  });

  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 1000);

setInterval(() => {
  const state = characters.map(character => ({
    id: character.id,
    name: character.name,
    properties: { ...character.properties },
    velocities: { ...character.velocities },
    buffs: character.buffs.map(buff => ({ // Include buffs data
      id: buff.id,
      name: buff.name,
      stacks: buff.stacks,
      maxStacks: buff.maxStacks,
      duration: buff.duration
    }))
  }));

  const message = JSON.stringify({
    type: 'STATE_UPDATE',
    data: state,
    timestamp: Date.now()
  });

  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}, 1000);

console.log(`WebSocket server started on ws://localhost:${PORT}`);