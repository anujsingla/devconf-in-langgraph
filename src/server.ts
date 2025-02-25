import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { HumanMessage } from '@langchain/core/messages';
import appWorkflow from './workflow';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { config } from 'dotenv';
import { isEmpty } from 'lodash';
import { inMemoryCache } from './services/cache';
import { storePng } from './utils/utils';
config();

const server = express();
const PORT = process.env.PORT || 5000;

server.use(cors());
server.use(bodyParser.json());

server.get('/health', (req: Request, res: Response): void => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

server.get('/sessions', (req: Request, res: Response) => {
    const sessions = inMemoryCache.getSessionMetadata();
    res.json({
        sessionCount: sessions.length,
        sessions,
    });
});

server.get('/sessionById/:sessionId', (req: Request, res: Response) => {
    const { sessionId } = req.params;
    if (!sessionId) {
        res.status(400).json({ error: 'Session ID is required' });
        return;
    }
    const conversation = inMemoryCache.getConversationBySessionId(sessionId);
    if (!conversation) {
        res.status(404).json({ error: 'Session not found' });
        return;
    }
    res.json({ sessionId, conversation: conversation });
});

server.post('/chat', async (req: Request, res: Response): Promise<void> => {
    let { sessionId, message } = req.body;
    // just to create image of the graph
    const drawableGraph = await appWorkflow.getGraphAsync();
    const image = await drawableGraph.drawMermaidPng();
    storePng(image, 'workflow.png');

    // console.log('product version', product, version);

    if (!message) {
        res.status(400).json({ error: 'Message is required.' });
        return;
    }
    if (isEmpty(sessionId)) {
        sessionId = uuidv4();
    }

    try {
        console.log('start of ai process _----------------------', message, sessionId);
        const conversation = inMemoryCache.getConversation(sessionId, message);

        const humanMessage = new HumanMessage(message);
        conversation.addMessages([humanMessage]);
        const finalMessage = conversation.getMessages();
        // console.log('conversation.getMessages()', finalMessage);

        const config = {
            configurable: {
                thread_id: sessionId,
                sessionId: sessionId,
            },
        };
        const finalState = await appWorkflow.invoke(
            {
                messages: finalMessage,
            },
            config,
        );

        const { messages: newMessages } = finalState;
        const aiResponse = newMessages[newMessages.length - 1];
        // handle moderation error;
        if (!isEmpty(aiResponse?.additional_kwargs?.moderationError)) {
            res.json({ sessionId, content: (aiResponse.additional_kwargs?.moderationError as any)?.message });
            return;
        }
        conversation.addMessages([aiResponse]);

        inMemoryCache.setConversation(sessionId, conversation, message);

        console.log('end of ai response message _----------------------');
        res.json({
            sessionId,
            content: aiResponse?.content,
        });
    } catch (error: any) {
        res.status(500).json({
            error: 'Internal server error.',
            content: 'There is some issue to fetch the data from the backend',
            sessionId,
        });
    }
});

server.post('/reset', (req: Request, res: Response): void => {
    const { sessionId } = req.body;

    if (!sessionId) {
        res.status(400).json({ error: 'sessionId is required.' });
        return;
    }

    inMemoryCache.clearConversation(sessionId);
    res.json({ content: 'Conversation reset successfully.' });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
