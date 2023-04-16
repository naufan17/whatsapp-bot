const { Configuration, OpenAIApi } = require("openai");
// const axios = require('axios');
require('dotenv').config()

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

// const ChatAIHandler = async (question) => {
//     await axios({
//         method: 'POST',
//         url: 'https://api.openai.com/v1/completions',
//         data: {
//             model: "text-davinci-003",
//             prompt: question,
//             max_tokens: 1000,
//             temperature: 0
//         },
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//         }
//     }).then((response) => {
//         return response.data.choices[0].text;
//     }).catch((error) => {
//         return error.message;
//     })
// }