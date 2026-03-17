let ioInstance;

export function initSocket(io) {
  ioInstance = io;
}

export function emitRouteUpdate(payload) {
  if (ioInstance) {
    ioInstance.emit('route-updated', payload);
  }
}
