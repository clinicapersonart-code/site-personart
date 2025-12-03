import { GoogleGenAI } from "@google/genai";
import { ProjectFile } from '../types';

const SYSTEM_INSTRUCTION = `
Você é um desenvolvedor web full-stack especialista e designer de UI/UX.
Seu objetivo é ajudar os usuários a editar seus arquivos HTML, CSS e JavaScript com base em solicitações em linguagem natural.

Quando um usuário pedir uma alteração:
1. Analise o conteúdo do arquivo fornecido.
2. Implemente a alteração solicitada usando as melhores práticas, garantindo responsividade e acessibilidade.
3. Use Tailwind CSS para estilização se o usuário pedir mudanças de estilo e o projeto parecer suportá-lo, caso contrário, use CSS padrão.
4. RETORNE APENAS O CÓDIGO ATUALIZADO COMPLETO para o arquivo específico que está sendo editado. Não retorne blocos de código markdown (crases), apenas a string de código bruta. Não inclua explicações, a menos que especificamente solicitado nos comentários dentro do código.
5. Se precisar explicar algo fora do código, responda sempre em Português do Brasil.
`;

export const editCodeWithGemini = async (
  currentFile: ProjectFile,
  allFiles: ProjectFile[],
  userPrompt: string
): Promise<string> => {
  try {
    // Initialize inside the function to avoid top-level crashes
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Contextualize with other files if necessary (e.g., seeing CSS while editing HTML)
    const contextFiles = allFiles
      .filter(f => f.name !== currentFile.name)
      .map(f => `Nome do Arquivo: ${f.name}\nPreview do Conteúdo: ${f.content.substring(0, 500)}...`)
      .join('\n\n');

    const prompt = `
      Nome do Arquivo Atual: ${currentFile.name}
      Conteúdo Atual do Arquivo:
      ${currentFile.content}

      Contexto de outros arquivos no projeto:
      ${contextFiles}

      Solicitação do Usuário: ${userPrompt}

      Saída: O conteúdo COMPLETO atualizado para ${currentFile.name}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for code precision
      },
    });

    let code = response.text || '';
    
    // Clean up markdown code blocks if the model accidentally includes them
    if (code.startsWith('```')) {
      const lines = code.split('\n');
      // Remove first line (```html or similar)
      lines.shift();
      // Remove last line if it is ```
      if (lines[lines.length - 1].trim() === '```') {
        lines.pop();
      }
      code = lines.join('\n');
    }

    return code.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao atualizar o código com IA.");
  }
};

export const suggestDomainNames = async (projectName: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Gere 5 nomes de domínio criativos e com sonoridade de disponíveis para um projeto chamado "${projectName}". Retorne-os como um array JSON de strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    // Fallback if API fails or key is invalid
    return [`${projectName.toLowerCase()}.com.br`, `get${projectName.toLowerCase()}.io`, `${projectName.toLowerCase().replace(/\s/g, '')}.net`];
  }
};