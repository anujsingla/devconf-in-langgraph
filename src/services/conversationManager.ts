import { BaseMessage } from '@langchain/core/messages';

export class ConversationManager {
    private conversationHistory: BaseMessage[] = [];

    constructor(initialMessages: BaseMessage[] = []) {
        this.conversationHistory = initialMessages;
    }

    public addMessages(newMessages: BaseMessage[]) {
        this.conversationHistory.push(...newMessages);
    }

    public getMessages(): BaseMessage[] {
        return this.conversationHistory;
    }

    public clear() {
        this.conversationHistory = [];
    }
}
