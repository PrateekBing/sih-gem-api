const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());

// const key = process.env.GOOGLE_API_KEY || "AIzaSyBShrIVy_UqwUpWZeIiMirTY5sGSs9HbgI";

const gemini = new GoogleGenerativeAI("AIzaSyBShrIVy_UqwUpWZeIiMirTY5sGSs9HbgI");
const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });


app.post('/chat', async (req, res) => {
    const userInput = req.body.input;

    console.log("User Input: ", userInput);

    const prompt = `Reduce the following input from a user and force-fit it into one of the following categories: booking ticket, tour packages, ticket cost, ticket cancellation. Be conservative while categorizing, if the user input isn't somewhat relevant to any of the options mentioned, respond with "Sorry, I can't help with that request." Strictly respond with 1,2,3, or 4 respectively otherwise. You are not allowed to respond with anything else. The user's input is: ${userInput}`;

    try {
        const result = await model.generateContent(prompt);

        console.log("Response: ", result.response.text());
        const response = result.response.text();

        if (response.includes("1")) {
            res.send("booking ticket");
        } else if (response.includes("2")) {
            res.send("tour packages");
        } else if (response.includes("3")) {
            res.send("ticket cost");
        } else if (response.includes("4")) {
            res.send("ticket cancellation");
        } else {
            res.send(result.response.text());
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).send("Internal Server Error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
