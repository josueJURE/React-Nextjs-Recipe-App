import OpenAI from "openai";

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  
 export async function chatCompletion(country: string, vegan: boolean, additionalNote: string) {
  const veganNote = vegan
    ? ", taking into account that the user is vegan"
    : "";
  const additionalNoteText = additionalNote && additionalNote.trim() ? `. ${additionalNote}` : "";

  const stream = await openai.chat.completions.create({
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

  return stream;

}


export default chatCompletion