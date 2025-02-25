import { ConversationManager } from "./conversationManager";

interface SessionMetadata {
    conversation: ConversationManager;
    createdAt: Date;
    firstQuery: string;
}

class InMemoryCache {
    private cache: Map<string, SessionMetadata>;

    constructor() {
        this.cache = new Map<string, SessionMetadata>();
    }

    public getConversation(sessionId: string, queryString: string): ConversationManager {
        if (!this.cache.has(sessionId)) {
            this.cache.set(sessionId, {
                conversation: new ConversationManager(),
                createdAt: new Date(),
                firstQuery: queryString || '',
            });
        }
        return this.cache.get(sessionId)!.conversation;
    }

    public getConversationBySessionId(sessionId: string): ConversationManager {
        return this.cache.get(sessionId)?.conversation;
    }

    public setConversation(sessionId: string, conversation: ConversationManager, queryString: string) {
        if (this.cache.has(sessionId)) {
            const existingMetadata = this.cache.get(sessionId)!;
            this.cache.set(sessionId, {
                ...existingMetadata,
                conversation,
            });
        } else {
            this.cache.set(sessionId, {
                conversation,
                createdAt: new Date(),
                firstQuery: queryString || '',
            });
        }
    }

    public clearConversation(sessionId: string) {
        this.cache.delete(sessionId);
    }

    public getSessionMetadata(): { sessionId: string; createdAt: Date }[] {
        return Array.from(this.cache.entries()).map(([sessionId, metadata]) => ({
            sessionId,
            createdAt: metadata.createdAt,
            firstQuery: metadata.firstQuery,
        }));
    }
}

export const inMemoryCache = new InMemoryCache();
