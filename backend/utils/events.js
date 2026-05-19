const clients = new Set();

export function openEventStream(req, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream'
  });

  const client = { res };
  clients.add(client);
  send(client, 'connected', { status: 'connected', timestamp: new Date().toISOString() });

  req.on('close', () => {
    clients.delete(client);
  });
}

export function emitRouteUpdate(payload) {
  for (const client of clients) {
    send(client, 'route-updated', payload);
  }
}

function send(client, eventName, payload) {
  client.res.write(`event: ${eventName}\n`);
  client.res.write(`data: ${JSON.stringify(payload)}\n\n`);
}
