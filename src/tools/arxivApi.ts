import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import axios from 'axios';
import { parseStringPromise } from "xml2js";
import { stringify } from '../utils/utils';


export const getArxivTool = tool(
    async (input: any) => {
        console.log('ACTION: getArxivTool. user query: ' + input.query);
        const arxivSearch = await searchArxiv(input.query);
        console.log('getArxivTool response', arxivSearch)
        return arxivSearch;
    },
    {
        name: 'get_arxiv_search',
        description:
            "Use this tool to perform a arXiv is a free distribution service and an open-access archive for nearly 2.4 million scholarly articles in the fields of physics, mathematics, computer science, quantitative biology, quantitative finance, statistics, electrical engineering and systems science, and economics.",
        schema: z.object({
            query: z.string().describe('user query.'),
        }),
    },
);

const ARXIV_API_URL = "http://export.arxiv.org/api/query";

export async function searchArxiv(query: string): Promise<string> {
  try {
    const response = await axios.get(ARXIV_API_URL, {
      params: {
        search_query: `all:${query}`,
        start: 0,
        max_results: 5,
        sortBy: "submittedDate",
        sortOrder: "descending",
      },
    });

    const parsedData = await parseStringPromise(response.data);
    const entries = parsedData.feed?.entry ?? [];

    const responseExtract = entries.slice(0, 5).map((entry: any) => ({
      title: entry.title?.[0] || "No Title",
      summary: entry.summary?.[0] || "No Summary",
    }));
    console.log('responseExtract', responseExtract)

    return stringify(responseExtract);
  } catch (error) {
    console.error("Error fetching data from arXiv:", error);
    return JSON.stringify({ error: "Failed to fetch data" });
  }
}

