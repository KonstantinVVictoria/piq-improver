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
  const { writing, feedback } = req.body;

  const revision: string = await Revise(writing, feedback);

  let response: Data = {
    data: null,
    error: {
      status: true,
      message: "Could not complete request.",
    },
  };

  if (revision !== "")
    response = {
      data: revision,
      error: {
        status: false,
        message: null,
      },
    };

  res.status(200).json(response);
}

async function Revise(corrected_writing: string, feedback: string) {
  return (
    (
      await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Rewrite the passage given the feedback provided.\n\nPassage:\n${corrected_writing}\n\nFeedback:\n${feedback}\\n\nRewrite The Passage:`,
        temperature: 0.8,
        top_p: 1,
        frequency_penalty: 0.37,
        max_tokens: 1000,
      })
    ).data.choices[0].text || ""
  );
}
