require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const ChatAIHandler = async (question) => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
        max_tokens: 1000
    });
    return response.data.choices[0].text;
};

exports.ChatAIHandler = ChatAIHandler;