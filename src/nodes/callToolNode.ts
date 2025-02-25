import {
    AIMessage,
    isAIMessage,
    isBaseMessage,
    isHumanMessage,
    isSystemMessage,
    ToolMessage,
} from '@langchain/core/messages';
import { AppAgentState, AppConfig, } from '../states/appState';
import { tools } from '../tools';
import { createError } from '../utils/utils';
import { isString } from 'lodash';

export const callToolNode = async (state: AppAgentState, config: AppConfig) => {
    const { messages } = state;
    const message = messages[messages.length - 1];
    // console.log("ACTION: callTool. messages:", message);

    if (isHumanMessage(message) || isSystemMessage(message)) {
        return state;
    }

    if (!isAIMessage(message)) {
        throw new Error('ToolNode only accepts AIMessages as input.');
    }
    const outputs = await Promise.all(
        (message as AIMessage).tool_calls?.map(async (call) => {
            const tool = tools?.find((tool) => {
                if (isString(call?.name)) {
                    return tool.name === call?.name;
                }
                return false;
            });
            // console.log('tool', tool);
            try {
                if (tool === undefined) {
                    throw new Error(`Tool "${call.name}" not found.`);
                }
                // adding state to gather feedback or whatever needed.
                const customConfig: any = {
                    ...config,
                };
                const output = await tool.invoke({ ...call, type: 'tool_call' }, customConfig);
                if (isBaseMessage(output) && output._getType() === 'tool') {
                    return output;
                } else {
                    return new ToolMessage({
                        name: tool.name,
                        content: typeof output === 'string' ? output : JSON.stringify(output),
                        tool_call_id: call.id,
                    });
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e) {
                // TOOD: Better Error Handling
                return new ToolMessage({
                    name: tool?.name || '',
                    content: JSON.stringify(createError(e.message), null, ''),
                    tool_call_id: call.id,
                    status: 'error',
                });
            }
        }) ?? [],
    );

    return {
        messages: outputs,
        human_feedback: {}, // removing humanFeedback (as consumed by tool)
    } as any;
};
