import { getArxivTool } from "./arxivApi";
import { getGoogleSearchTool } from "./googleSearchToot";

export const tools = [
    getGoogleSearchTool,
    getArxivTool
];