import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const messageStr = message.toString();
    console.log('Received:', messageStr);

    // Skip ping/pong messages
    if (messageStr.startsWith('{') && messageStr.includes('"type"')) {
      try {
        const parsed = JSON.parse(messageStr);
        if (parsed.type === 'ping' || parsed.type === 'pong') {
          // Respond to ping with pong
          if (parsed.type === 'ping') {
            ws.send(JSON.stringify({ type: 'pong' }));
          }
          return;
        }
      } catch (e) {
        // Not a JSON control message, continue processing
      }
    }

    // Broadcast actual chat messages to all clients except sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        try {
          client.send(messageStr);
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

console.log('WebSocket server running on ws://localhost:3000');
