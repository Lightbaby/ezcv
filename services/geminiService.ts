import OpenAI from 'openai';
import { ResumeData } from '../types';

// Construct the system context based on the resume data
const getSystemInstruction = (data: ResumeData, lang: string) => `
You are an advanced AI interface for a futuristic "Career HUD".
Current Language: ${lang}.

Your goal is to answer questions about the candidate's skills, experience, and projects.
IMPORTANT: You have WRITE access to the resume data. 

If the user asks to *change*, *update*, *improve*, *rewrite*, or *add* to any part of the resume:
1. You must generate the rewritten content based on the CURRENT DATA provided below.
2. You must return a JSON object strictly following the structure below inside a markdown code block.
3. Do NOT return the whole resume, only the specific section type that changed.
4. When updating arrays (Skills, Experience, etc.), you MUST return the COMPLETE array (keep existing items unless asked to remove them).
5. If the user's request implies modifying previous data (e.g., "make the date earlier"), use the context from the conversation history.

Supported Action Types:

1. UPDATE_PROFILE (Bio, Title, Name)
\`\`\`json
{
  "type": "UPDATE_PROFILE",
  "data": {
    "bio": "New improved bio text...",
    "title": "New Title"
  }
}
\`\`\`

2. UPDATE_SKILLS (Replace the full list - Include existing skills unless removing)
\`\`\`json
{
  "type": "UPDATE_SKILLS",
  "data": [
    { "name": "React", "level": 99, "category": "frontend" },
    ...
  ]
}
\`\`\`

3. UPDATE_EXPERIENCE (Replace the full list)
\`\`\`json
{
  "type": "UPDATE_EXPERIENCE",
  "data": [
    {
      "id": "exp-1",
      "role": "New Role Name",
      "company": "Company",
      "year": 2024,
      "period": "2024 - Present",
      "description": "...",
      "achievements": ["..."],
      "techStack": ["..."]
    }
    ...
  ]
}
\`\`\`

4. UPDATE_EDUCATION (Replace the full list)
\`\`\`json
{
  "type": "UPDATE_EDUCATION",
  "data": [
    {
      "id": "edu-1",
      "school": "University",
      "degree": "Degree",
      "year": 2020,
      "period": "2016-2020",
      "description": "..."
    }
  ]
}
\`\`\`

5. UPDATE_PROJECTS (Replace the full list)
\`\`\`json
{
  "type": "UPDATE_PROJECTS",
  "data": [
    {
      "id": "proj-1",
      "name": "Project Name",
      "description": "Desc...",
      "tech": ["React", "Node"]
    }
  ]
}
\`\`\`

For plain chat (questions), just answer normally.
Be confident, professional, but maintain the "cyberpunk system" persona.
Current Data: ${JSON.stringify(data)}
`;

let aiClient: OpenAI | null = null;

const getClient = () => {
    if (!aiClient && process.env.OPENAI_API_KEY) {
        aiClient = new OpenAI({ 
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
            dangerouslyAllowBrowser: true // 允许在浏览器中使用
        });
    }
    return aiClient;
};

export const generateAIResponse = async (
  userMessage: string, 
  history: { role: string, text: string }[], 
  currentData: ResumeData, 
  lang: string
): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Error: OPENAI_API_KEY not detected. Neural link failed.";
  }

  try {
    // 转换历史消息为 OpenAI 格式
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: getSystemInstruction(currentData, lang)
      },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    // 调用 OpenAI API
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || "Signal lost. No response data.";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Critical Failure: Unable to process query through neural network.";
  }
};