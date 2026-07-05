import { Server as HttpServer } from 'http';
import { Server as SocketIoServer } from 'socket.io';

let io: SocketIoServer | null = null;

export const initSocketIo = (server: HttpServer): SocketIoServer => {
  io = new SocketIoServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Join room for specific pickup updates
    socket.on('join_pickup', (pickupId: string) => {
      socket.join(`pickup_${pickupId}`);
      console.log(`Socket ${socket.id} joined room: pickup_${pickupId}`);
    });

    // Leave room
    socket.on('leave_pickup', (pickupId: string) => {
      socket.leave(`pickup_${pickupId}`);
      console.log(`Socket ${socket.id} left room: pickup_${pickupId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getSocketIo = (): SocketIoServer | null => {
  return io;
};
