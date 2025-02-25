import { BaseMessage } from '@langchain/core/messages';
import { Annotation, MessagesAnnotation } from '@langchain/langgraph';
import type { RunnableConfig } from '@langchain/core/runnables';

type Action = 'toolsExecution' | 'callModel';
export const AppAgentStateSchema = Annotation.Root({
    ...MessagesAnnotation.spec,
    action: Annotation<Action>,
});
export type AppAgentState = typeof AppAgentStateSchema.State;

export const AppConfigSchema = Annotation.Root({
    sessionId: Annotation<string>,
});

export type AppConfig = typeof AppConfigSchema.State;

export type AppRunnableConfig = RunnableConfig<AppConfig>;
