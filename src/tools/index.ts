import { getArxivTool } from "./arxivApi";
import { getGoogleSearchTool } from "./googleSearchTool";

export const tools = [
    getGoogleSearchTool,
    getArxivTool
];