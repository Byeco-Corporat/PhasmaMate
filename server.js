const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/run-python-script', (req, res) => {
    exec('python ./components/custom-presence.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).send('Error executing script');
        }
        if (stderr) {
            console.error(`Script error output: ${stderr}`);
            return res.status(500).send('Script error');
        }
        console.log(`Script output: ${stdout}`);
        res.send('Script executed successfully');
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));