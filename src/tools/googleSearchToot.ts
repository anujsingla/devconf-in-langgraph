import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { tavily } from '@tavily/core';

export const getGoogleSearchTool = tool(
    async (input: any) => {
        console.log('ACTION: getGooleSearchTool. user query: ' + input.query);
        const googleSearch = await getTavilyGoogleSearch(input.query);
        console.log('getGoogleSearchTool response', googleSearch)
        return googleSearch;
    },
    {
        name: 'get_google_search',
        description:
            "Use this tool to perform a Google search for general inquiries or when other specialized APIs do not provide the necessary information. It is ideal for fetching up-to-date information, broad topics, or when the user's question is outside the scope of existing tools.",
        schema: z.object({
            query: z.string().describe('user query.'),
        }),
    },
);

const getTavilyGoogleSearch = async (query: string): Promise<string> => {
    const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

    try {
        const response = await tvly.searchContext(query, {
            searchDepth: 'advanced',
            maxResults: 5,
        });
        // console.log('getTavilyGoogleSearch responseContext', response);
        return response;
    } catch (error) {
        console.log('error in fetching getTavilyGoogleSearch', error);
        return '';
    }
};
