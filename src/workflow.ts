import { END, START, StateGraph } from '@langchain/langgraph';
import { AppAgentStateSchema, AppConfigSchema } from './states/appState';
import { identifyToolsNode } from './nodes/identifyToolsNode';
import { llmModerationNode, verifyLLMModeration } from './nodes/llmModerationNode';
import { agentNode, chooseAction } from './nodes/agentNode';
import { callToolNode } from './nodes/callToolNode';
import { callModelNode } from './nodes/callModelNode';
// import { storePng } from './utils';

const workflow = new StateGraph(AppAgentStateSchema, AppConfigSchema)
    .addNode('llmModeration', llmModerationNode)
    .addNode('identifyTools', identifyToolsNode)
    .addNode('actionsPlanner', agentNode)
    .addNode('toolsExecution', callToolNode)
    .addNode('callModel', callModelNode)
    .addEdge(START, 'llmModeration')
    .addConditionalEdges('llmModeration', verifyLLMModeration, ['identifyTools', END])
    .addEdge('identifyTools', 'actionsPlanner')
    .addConditionalEdges('actionsPlanner', chooseAction, ['toolsExecution', 'callModel'])
    .addEdge('toolsExecution', 'callModel')
    .addEdge('callModel', END)

export const app = workflow.compile();

export default app;
