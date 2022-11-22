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
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `Rewrite the following passage given the feedback\n\nFeedback:\n${req.body.feedback}\n\n${req.body.writing}\n\nRevision:`,
    temperature: 0.6,
    max_tokens: 1000,
  });
  res.status(200).json({ data: completion.data.choices[0].text });
}
