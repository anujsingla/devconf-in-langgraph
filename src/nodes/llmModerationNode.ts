import { AIMessage, isAIMessage, isHumanMessage, SystemMessage } from '@langchain/core/messages';
import { findLast, isEmpty, replace, trim } from 'lodash';
import { AppAgentState } from '../states/appState';
import { parseJson, stringify } from '../utils/utils';
import { getLLMModerationNodePrompt } from '../utils/appPrompts';
import { model } from '../models/models';

export const llmModerationNode = async (state: AppAgentState) => {
    console.log('---LLM MODERATION---');
    const { messages } = state;
    // console.log('llModerationNode user query', messages);

    const humanMessage = findLast(messages, (m) => isHumanMessage(m));
    if (isEmpty(humanMessage)) {
        console.log('No human message found for moderation.');
        return { messages: [new AIMessage('')] };
    }
    // console.log('llmModerationNode humanMessage', humanMessage);

    const systemMessage = new SystemMessage({
        content: getLLMModerationNodePrompt(humanMessage?.content as string),
    });
    // console.log('systemMessage', JSON.stringify(systemMessage));
    const response = await model.invoke([systemMessage, ...[humanMessage]]);
    const content: any = parseJson(trim(replace(replace(response?.content as any, /```json/g, ''), /```/g, '')));
    // console.log('llModerationNode', content, isString(content), isObject(content), response);

    if (content?.flagged && !isEmpty(content?.categories)) {
        response.additional_kwargs = {
            moderationError: {
                message:
                    "I'm unable to participate in discussions that involve unethical or inappropriate questions. Is there another topic I can assist you with?",
                details: stringify({
                    flagged: content?.flagged,
                    categories: content?.categories,
                }),
            },
        };
        return { messages: response };
    }
    response.content = '';
    return { messages: response };
};

export const verifyLLMModeration = (state: AppAgentState) => {
    const { messages } = state;
    const message = messages[messages.length - 1];
    if (isAIMessage(message) && !isEmpty(message?.additional_kwargs?.moderationError)) {
        console.log('---DECISION: MODERATION FAIL---');
        console.log('message', message);
        return '__end__';
    }
    console.log('---DECISION: MODERATION PASS---');
    return 'identifyTools';
};
