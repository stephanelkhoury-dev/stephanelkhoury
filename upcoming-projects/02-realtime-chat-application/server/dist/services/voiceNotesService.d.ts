import { Server } from 'socket.io';
interface VoiceNoteData {
    chatId: string;
    duration: number;
    waveform?: number[];
    audioBlob: Buffer;
    format: 'webm' | 'mp3' | 'wav' | 'ogg';
}
interface VoiceNoteMetadata {
    id: string;
    duration: number;
    format: string;
    size: number;
    waveform?: number[];
    url: string;
}
declare class VoiceNotesService {
    private io;
    private uploadDir;
    private maxDuration;
    private maxFileSize;
    constructor(io: Server);
    private ensureUploadDirectory;
    saveVoiceNote(senderId: string, data: VoiceNoteData): Promise<VoiceNoteMetadata | null>;
    createVoiceMessage(senderId: string, chatId: string, voiceMetadata: VoiceNoteMetadata, replyTo?: string): Promise<any>;
    handleVoiceNoteUpload(socket: any, userId: string, data: {
        chatId: string;
        audioData: string;
        duration: number;
        format: 'webm' | 'mp3' | 'wav' | 'ogg';
        waveform?: number[];
        replyTo?: string;
    }): Promise<void>;
    generateWaveform(audioBuffer: Buffer, samples?: number): Promise<number[]>;
    startRecording(socket: any, userId: string, chatId: string): void;
    cancelRecording(socket: any, userId: string, chatId: string): void;
    getVoiceNoteFile(filename: string): Promise<Buffer | null>;
    deleteVoiceNote(filename: string): Promise<boolean>;
    handleVoiceNoteStart(socket: any, chatId: string, userId: string): void;
    handleVoiceNoteStop(socket: any, chatId: string, userId: string): void;
    private formatDuration;
    private getMimeType;
    cleanupOldVoiceNotes(daysOld?: number): Promise<void>;
}
export default VoiceNotesService;
//# sourceMappingURL=voiceNotesService.d.ts.map