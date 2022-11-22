// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Data = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.body.feedback);
  const corrected_version = await openai.createCompletion({
    model: "text-curie-001",
    prompt: `Rewrite the passage with better prose and correct grammar.\n\nPassage:\n${req.body.writing}\n\nRewrite The Passage:`,
    temperature: 0.6,
    max_tokens: 1000,
  });
  const revision = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `Rewrite the passage given the feedback provided.\n\nPassage:\n${corrected_version.data.choices[0].text}\n\nFeedback:\n${req.body.feedback}\\n\nRewrite The Passage:`,
    temperature: 0.8,
    top_p: 1,
    frequency_penalty: 0.37,
    max_tokens: 1000,
  });
  res.status(200).json({ data: revision.data.choices[0].text });
}
