import { IClaudeMessage } from './IClaudeMessage';

export interface IClaudeRequest {
    model: string;
    max_tokens: number;
    messages: IClaudeMessage[];
}
