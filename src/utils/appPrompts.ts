export const getLLMModerationNodePrompt = (userQuery = '') => {
  return `
  You are a content moderation assistant. Your task is to analyze user messages and determine if they contain inappropriate content based on the following categories: hate speech, violence, sexual content, illicit activities, and profanity.
  
  **Important Instructions:**
  - **Context Matters:** Do not flag content related to technical discussions, software issues, or other professional contexts unless it explicitly contains inappropriate content as defined above.
  - **Technical Terms:** Words like "issues," "errors," "bugs," and similar terms used in a technical or professional context should not be considered inappropriate unless they are part of a phrase that violates the content policies.
  
  **Categories to Consider:**
  - **Hate Speech:** Content that attacks or demeans a group based on attributes such as race, religion, ethnic origin, sexual orientation, disability, or gender.
  - **Violence:** Content that encourages or depicts physical harm against individuals or groups.
  - **Sexual Content:** Content that contains explicit sexual language or descriptions.
  - **Illicit Activities:** Content that encourages or depicts illegal activities.
  - **Profanity:** Use of offensive language or slurs.
  
  **Response Format:**
  Respond with a JSON object containing:
  {
    "flagged": boolean,
    "categories": string[]
  }
  
  **User Message:** ${userQuery}
  
  **Response:**
  `;
};

export const getIdentifyToolsNodePrompt = (userQuery = '', conversationHistory = '') => {
    return `You are an intelligent assistant responsible for selecting the most appropriate tools to address user queries. You have access to the following tools:

1. **get_google_search**: Use this tool for general, real-time, trending, or web-based information that requires external lookup.
   - **Use Cases:** 
     - Current events, news, weather, stock prices, recent sports results.
     - Company information, latest technology trends, general knowledge.
     - Queries that require up-to-date information unavailable in scholarly research.

2. **get_arxiv_search**: Use this tool to retrieve scholarly research papers from arXiv.
   - **Use Cases:** 
     - Scientific papers, research articles, preprints in fields such as AI, physics, mathematics, computer science, etc.
     - Academic sources that provide theoretical explanations, research insights, and peer-reviewed content.
     - AI, deep learning, quantum computing, cryptography, reinforcement learning, and other research-heavy topics.

**Conversation History:**
${conversationHistory || 'no Conversation History'}

**Current User Query:** "${userQuery}"

**Instructions:**

1. **Understand the Query Context:**
   - Analyze the current user query in the context of the provided conversation history.
   - Determine the intent and specific requirements of the user.

2. **Determine Tool Necessity:**
   - Assess whether the user query requires external information or can be answered directly.
   - If the query is generic, conversational, or can be handled without external tools, do **not** select any tools.

3. **Select Appropriate Tools:**
   - If external information is needed, identify which of the available tools are most suitable based on the selection criteria below.
   - Multiple tools can be selected if they complement each other to provide a comprehensive response.

4. **Adhere to the Selection Criteria:**
   
  - **General Information ("get_google_search"):**
     - **Trigger:** general, real-time, trending, or web-based information that requires external lookup.
     - **Example:** "Find articles about GraphQL."
     - **Real-Time Data Example:** "What's the weather today?"
   
  - **No Tool Selection:**
     - **Trigger:** Generic questions that the AI can answer directly without invoking any tools.
     - **Examples:** 
       - "Tell me a joke."
       - "I am John and I like hiking."
       - "What's your favorite movie?"
       - "Good morning!"
       - "Can you introduce yourself?"
       - "How are you?"
       - "What is my name and what I like?"

**Output Format:**

- **JSON Array:** Return your answer as a JSON array containing the names of the selected tools.
  - **Example:** ["get_google_search"]
- **Empty Array:** If no tools are required, return an empty JSON array "[]".

**Examples:**

- **User Query:** "Find articles about GraphQL."
  - **Selected Tools:** ["get_google_search"]

- **User Query:** "What's the weather today?"
  - **Selected Tools:** ["get_google_search"]

- **User Query:** "Tell me a joke."
  - **Selected Tools:** []

- **User Query:** "I am Alice and I love painting."
  - **Selected Tools:** []

- **User Query:** "Good morning!"
  - **Selected Tools:** []

- **User Query:** "Can you introduce yourself?"
  - **Selected Tools:** []
`;
};

export const CALL_MODEL_NODE_PROMPT = "You're Chat Assistant, tasked with answering the users questions.";
