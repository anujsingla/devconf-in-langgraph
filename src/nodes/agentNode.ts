import { isAIMessage } from '@langchain/core/messages';
import { AppAgentState } from '../states/appState';

export const agentNode = async (state: AppAgentState) => {
    const { messages } = state;
    console.log('ACTION: agentNode');
    const lastMessage = messages[messages.length - 1];
    // console.log('agentNode lastMessage', lastMessage);
    if (
        isAIMessage(lastMessage) &&
        'tool_calls' in lastMessage &&
        Array.isArray(lastMessage.tool_calls) &&
        lastMessage.tool_calls?.length
    ) {
        return {
            action: 'toolsExecution',
        };
    }
    return {
        action: 'callModel',
    };
};

export const chooseAction = (state: AppAgentState) => {
    return state.action;
};
