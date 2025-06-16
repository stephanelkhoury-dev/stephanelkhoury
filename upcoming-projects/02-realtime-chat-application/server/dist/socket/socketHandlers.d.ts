import { Socket, Server } from 'socket.io';
import { IUser } from '../models/User';
interface AuthenticatedSocket extends Socket {
    data: {
        user: IUser;
        userId: string;
    };
}
export declare const handleSocketConnection: (socket: AuthenticatedSocket, io: Server) => void;
export {};
//# sourceMappingURL=socketHandlers.d.ts.map