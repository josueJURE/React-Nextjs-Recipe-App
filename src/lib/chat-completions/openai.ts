import OpenAI from "openai";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";








    const openaiObject = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  
 export async function chatCompletion(country: string, vegan: boolean, additionalNote: string) {
  const veganNote = vegan
    ? ", taking into account that the user is vegan"
    : "";
  const additionalNoteText = additionalNote && additionalNote.trim() ? `. ${additionalNote}` : "";

  const stream = await openaiObject.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `make me a dish from ${country}${veganNote}${additionalNoteText}`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 2000,
    stream: true,
  });

  return stream

  // const stream = await streamText({
  //   model: openai("gpt-3.5-turbo"),
  //   messages: [
  //     {
  //       role: "user",
  //       content: `make me a dish from ${country}${veganNote}${additionalNoteText}`,
  //     },
  //   ],
  //   // max_tokens: 1000,
  // });



}






// const response = await streamText({
//   model: openai("gpt-3.5-turbo"),
//   messages: [
//     {
//       role: "user",
//       content: prompt,
//     },
//   ],
//   maxTokens: 1000,
// });


export default chatCompletion
// export default stream