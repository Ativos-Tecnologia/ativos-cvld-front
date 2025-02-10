export interface IClaudeMessage {
    role: string;
    content: Array<{
        type: string;
        text?: string;
        source?: {
            type: string;
            media_type: string;
            data: string;
        };
    }>;
}
