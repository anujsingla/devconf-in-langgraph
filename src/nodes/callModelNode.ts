import { isAIMessage, SystemMessage } from '@langchain/core/messages';
import { AppAgentState } from '../states/appState';
import { model } from '../models/models';
import { CALL_MODEL_NODE_PROMPT } from '../utils/appPrompts';

export const callModelNode = async (state: AppAgentState) => {
    const { messages } = state;
    console.log('----CALLMODEL----');
    // const messagesForModel = messages.filter(m => !m.name || (!m.name.startsWith("genie")));
    // console.log('ACTION: callModel sources', sources);
    // console.log('ACTION: callModel state', state);

    const systemMessage = new SystemMessage({
        content: CALL_MODEL_NODE_PROMPT,
    });
    const response = await model.invoke([systemMessage, ...messages]);
    if (isAIMessage(response)) {
        response.additional_kwargs = {
            ...response.additional_kwargs,
        };
    }
    return { messages: response };
};
