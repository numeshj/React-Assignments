import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    // Broadcast to all clients except sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        try {
          client.send(message.toString());
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

wss.on('error', (error) => {
  console.error('Server error:', error);
});

console.log('WebSocket server running on ws://localhost:3080');

console.log('WebSocket server running on ws://localhost:3080');
