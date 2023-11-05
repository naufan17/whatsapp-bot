require('dotenv').config()

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const ChatAIHandler = async (question) => {
    // const response = await openai.createCompletion({
    //     model: "text-davinci-003",
    //     prompt: question,
    //     max_tokens: 1000
    // });
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-3.5-turbo",
    });

    // return response.data.choices[0].text;
    return completion.choices[0];
};

exports.ChatAIHandler = ChatAIHandler;