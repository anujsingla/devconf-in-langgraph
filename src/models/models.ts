import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { tools } from '../tools';

export const baseModelConfig = {
    model: process.env.MODEL_NAME || 'llama3.2',
    baseUrl: process.env.MODEL_URL || 'http://localhost:11434',
};

// Create the model without tools
export const model = new ChatOllama(baseModelConfig);

// export const mistralModel = new ChatOllama({
//     model: 'mistral:7b-instruct',
//     baseUrl: process.env.MODEL_URL || 'http://localhost:11434',
//     temperature: 0,
// });

export const modelWithTools = new ChatOllama(baseModelConfig).bindTools(tools);

// export const embeddings = new OllamaEmbeddings({
//     model: process.env.MODEL_NAME || 'mxbai-embed-large',
//     baseUrl: process.env.MODEL_URL || 'http://localhost:11434',
// });

// export const jsonModeLlm = new ChatOllama({
//     model: process.env.MODEL_NAME || 'llama3.2',
//     baseUrl: process.env.MODEL_URL || 'http://localhost:11434',
//     format: 'json',
//     temperature: 0,
// });
