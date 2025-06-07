declare class ChatServer {
    private app;
    private server;
    private io;
    private port;
    constructor();
    private initializeMiddleware;
    private initializeRoutes;
    private initializeSocket;
    private connectDatabase;
    start(): void;
}
export default ChatServer;
//# sourceMappingURL=server.d.ts.map