import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    console.log("result", result);

    if (
      !result.data ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      throw new Error("Unexpected API response format");
    }

    return result.data[0].embedding as number[];
  } catch (error) {
    console.log("Error calling OpenAI Embeddings API", error);
    throw error;
  }
}
