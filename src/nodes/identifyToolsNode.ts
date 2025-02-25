import { isHumanMessage, SystemMessage } from '@langchain/core/messages';
import filter from 'lodash/filter';
import takeRight from 'lodash/takeRight';
import map from 'lodash/map';
import join from 'lodash/join';
import findLast from 'lodash/findLast';
import initial from 'lodash/initial';
import { modelWithTools } from '../models/models';
import { AppAgentState } from '../states/appState';
import { getIdentifyToolsNodePrompt } from '../utils/appPrompts';

export const identifyToolsNode = async (state: AppAgentState) => {
    console.log('---IDENTIFY TOOLS---');

    const { messages } = state;

    const recentHumanMessages = join(map(initial(takeRight(filter(messages, isHumanMessage), 6)), 'content'), '\n');

    console.log('recentHumanMessages', recentHumanMessages);

    const humanMessage = findLast(messages, (m) => isHumanMessage(m));
    // console.log('identifyTools humanMessage', humanMessage);

    // const humanMessage = messages[0];
    // console.log('ACTION: identifyTools. humanMessage:', humanMessage);
    const systemMessage = new SystemMessage({
        content: getIdentifyToolsNodePrompt(humanMessage?.content as string, recentHumanMessages),
    });

    const response = await modelWithTools.invoke([systemMessage, ...[humanMessage]]);
    console.log('---IDENTIFY TOOLS QUERY---', response.content);
    console.log('---IDENTIFY TOOLS LIST---', response?.tool_calls.map((t) => t.name).join(','));
    return { messages: response };
};
