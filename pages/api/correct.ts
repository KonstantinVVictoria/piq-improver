import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Data = {
  data: string | null;
  error: {
    status: boolean;
    message: string | null;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { writing } = req.body;

  const corrected_writing: string = await SpellGrammarCheck(writing);

  let response: Data = {
    data: null,
    error: {
      status: true,
      message: "Could not complete request.",
    },
  };

  if (corrected_writing !== "")
    response = {
      data: corrected_writing,
      error: {
        status: false,
        message: null,
      },
    };

  res.status(200).json(response);
}

async function SpellGrammarCheck(writing: string) {
  return (
    (
      await openai.createCompletion({
        model: "text-curie-001",
        prompt: `Rewrite the passage with better prose and correct grammar.\n\nPassage:\n${writing}\n\nRewrite The Passage:`,
        temperature: 0.6,
        max_tokens: 1000,
      })
    ).data.choices[0].text || ""
  );
}
