const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const {OpenAI} = require("openai");

const openai = new OpenAI({
    apiKey: "",
});

const app = express();
app.use(logger("dev"));
app.use(bodyParser.json()); 
app.use(bodyParser.text()); 
app.use(cors());


// Endpoint for requests to OpenAI
app.post("/askGPT", async function (req, res) { 
    const notes = req.body; 
    
    // Amend the received text with a prompt structure
    const prompt = `Organize the following unsorted notes into clearly defined 
    categories with bullet points for easy reading. 
    Categories might include To-Dos, Reminders, Login Information, Ideas, etc. 
    Use the following syntax to highlight categories: --To-Dos--
    Translate all notes into ${notes.resultLanguage}, ensuring the language is optimized for clarity and coherence. 
    The final output should only consist of these organized notes, without any additional comments or warnings.

    Unsorted notes:
    "${notes.notesString}"
    
    Instructions:
    1. Categorize and bullet-point the notes.
    2. Translate to ${notes.resultLanguage}.
    3. Optimize language for clarity.
    4. Provide a structured and visually clear output.
   
    Please start your response with the organized notes directly.
    `;
    
    try {
        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {role: "user", content: prompt}],
            model: "gpt-4",
            temperature: 0.7
          });

        notes.notesStringOrganized = response.choices[0].message.content;
        res.json(notes);
        
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send({ error: 'Error calling OpenAI API' });
    }
});

app.listen(8080, function () {
    console.log("Listening on 8080");
});
