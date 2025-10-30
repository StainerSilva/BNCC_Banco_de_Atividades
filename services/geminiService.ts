
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API will not be available.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateActivitySuggestion = async (
  grade: string,
  subject: string,
  bncc: string,
  topic: string
): Promise<string> => {
   if (!process.env.API_KEY) {
    return Promise.resolve(
        `**Geração com IA desabilitada.**\n\n(Para habilitar, configure a variável de ambiente API_KEY).\n\n**Exemplo de conteúdo:**\n\n**Título:** Explorando ${topic}\n\n**Objetivo:** Introduzir o conceito de ${topic} para alunos do ${grade}.\n\n**Instruções:**\n1. Leia o texto a seguir sobre ${topic}.\n2. Responda às perguntas.\n3. Crie um desenho que represente o que você aprendeu.`
    );
  }
  
  const prompt = `
    Crie o conteúdo para uma atividade escolar para alunos do ${grade}.
    A matéria é ${subject}.
    O código da BNCC relacionado é ${bncc}.
    O tópico principal é: "${topic}".

    Formate a resposta de forma clara e estruturada, com:
    1. Um título criativo para a atividade.
    2. Um texto introdutório curto e de fácil compreensão para a idade dos alunos.
    3. Uma lista de 3 a 5 questões ou tarefas práticas sobre o tópico.
    
    A resposta deve ser apenas o conteúdo da atividade, sem introduções ou despedidas. Use markdown para formatação.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao gerar a sugestão. Por favor, tente novamente.";
  }
};
