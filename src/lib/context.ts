import { Pinecone } from "@pinecone-database/pinecone";
import { getPineconeClient } from "./pinecone";
import { getEmbeddings } from "./embeddings";

type Metadata = {
  text: string;
  pageNumber: number;
};

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);

  return docs.join("\n").substring(0, 3000);
}

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const index = await client.index("talk-to-your-pdf");
    const query = await index.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    return query.matches || [];
  } catch (error) {
    console.log("Error with querying embeddings.", error);
    throw error;
  }
}
