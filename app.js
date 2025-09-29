import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { question, fileAI, analyzeImage } from './ai.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta raíz - servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rutas para moléculas
app.get('/molecules/:molecule', (req, res) => {
    const molecule = req.params.molecule;
    const moleculePath = path.join(__dirname, 'molecules', `${molecule}.html`);

    // Verificar si el archivo existe
    res.sendFile(moleculePath, (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'index.html'));
        }
    });
});

// Ruta para cualquier página de molécula sin extensión
app.get('/mol/:molecule', (req, res) => {
    const molecule = req.params.molecule;
    const moleculePath = path.join(__dirname, 'molecules', `${molecule}.html`);

    res.sendFile(moleculePath, (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'index.html'));
        }
    });
});

// API endpoint para preguntas de IA
app.post('/api/question', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                error: 'Prompt es requerido'
            });
        }

        console.log('📝 Prompt recibido:', prompt.substring(0, 100) + '...');

        // Detección SIMPLE de saludos
        const userMessageMatch = prompt.match(/El usuario pregunta:\s*(.+)$/i);
        const userMessage = userMessageMatch ? userMessageMatch[1].trim().toLowerCase() : prompt.toLowerCase();

        const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hello', 'hi', 'hey'];
        const isGreeting = greetings.some(greeting => userMessage.includes(greeting));

        let enhancedPrompt;
        if (isGreeting) {
            // Para saludos, ser ABSOLUTAMENTE MÍNIMO
            enhancedPrompt = `El usuario dice: "${userMessage}". INSTRUCCIÓN: Responde SOLO con "¡Hola!" o "¡Hola! ¿En qué puedo ayudarte?". NADA MÁS. SIN información química.`;
        } else {
            enhancedPrompt = prompt + '\n\nINSTRUCCIÓN CRÍTICA: Responde ULTRA BREVE. Máximo 2 oraciones. Máximo 80 palabras. CORTA toda información innecesaria.';
        }

        const response = await question(enhancedPrompt);

        // Asegurar que la respuesta no sea demasiado larga
        let formattedResponse = response;
        if (isGreeting && response.length > 20) {
            // Para saludos, ser ABSOLUTAMENTE ESTRICTO
            formattedResponse = response.split('.')[0].split('!')[0].split('?')[0].trim();
            if (formattedResponse.length > 20) {
                formattedResponse = '¡Hola!';
            }
        } else if (!isGreeting && response.length > 200) {
            formattedResponse = response.substring(0, 200) + '...';
        }

        console.log('✅ Respuesta generada:', formattedResponse.substring(0, 100) + '...');

        res.json({ response: formattedResponse });

    } catch (error) {
        console.error('Error en /api/question:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// API endpoint para análisis de archivos
app.post('/api/file-analysis', async (req, res) => {
    try {
        const { fileBuffer, mimeType, prompt } = req.body;

        if (!fileBuffer || !mimeType || !prompt) {
            return res.status(400).json({
                error: 'fileBuffer, mimeType y prompt son requeridos'
            });
        }

        // Convertir base64 a buffer
        const buffer = Buffer.from(fileBuffer, 'base64');
        const response = await fileAI(buffer, mimeType, prompt);

        res.json({ response });

    } catch (error) {
        console.error('Error en /api/file-analysis:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// API endpoint para análisis de imágenes
app.post('/api/analyze-image', async (req, res) => {
    try {
        const { imageBuffer, prompt } = req.body;

        if (!imageBuffer || !prompt) {
            return res.status(400).json({
                error: 'imageBuffer y prompt son requeridos'
            });
        }

        // Convertir base64 a buffer
        const buffer = Buffer.from(imageBuffer, 'base64');

        // Para esta función necesitamos ajustar ya que usa console.log
        // Vamos a crear una versión que retorne el resultado
        const type = await import('file-type').then(m => m.fileTypeFromBuffer(buffer));

        if (!type) {
            return res.status(400).json({ error: 'No se pudo determinar el tipo de archivo' });
        }

        const response = await analyzeImageWithReturn(buffer, prompt);
        res.json({ response });

    } catch (error) {
        console.error('Error en /api/analyze-image:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            details: error.message
        });
    }
});

// Función auxiliar para analyzeImage que retorna el resultado
async function analyzeImageWithReturn(fileBuffer, prompt) {
    try {
        const { fileTypeFromBuffer } = await import('file-type');
        const { GoogleGenerativeAI } = await import('@google/generative-ai');

        const API_KEY = "AIzaSyAsOrx9g1AqYpdzgmkhhxUp5njo7EuWC-Q";
        const ai = new GoogleGenerativeAI(API_KEY);
        const GEMINI_MODEL = "gemini-2.5-flash-lite";

        const type = await fileTypeFromBuffer(fileBuffer);

        const inlineData = {
            data: fileBuffer.toString("base64"),
            mimeType: type.mime,
        };

        const model = ai.getGenerativeModel({ model: GEMINI_MODEL });

        const contents = [
            { role: "user", parts: [{ inlineData }] },
            {
                role: "user",
                parts: [{ text: prompt + "\n\nResponde solo en español." }],
            },
        ];

        const result = await model.generateContent({ contents });
        const response = await result.response;

        if (response && response.text()) {
            return response.text();
        } else {
            throw new Error("La respuesta de la API no tiene el formato esperado.");
        }
    } catch (error) {
        throw error;
    }
}

// Ruta catch-all - servir index.html para SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Servidor Express iniciado exitosamente!');
    console.log('📱 URLs de acceso:');
    console.log(`   Local: http://localhost:${PORT}`);
    console.log(`   Network: http://0.0.0.0:${PORT}`);
    console.log('\n🔥 El visualizador 3D de moléculas con IA está listo!');
    console.log('📖 Presiona Ctrl+C para detener el servidor');
});

// Manejar la interrupción (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n\n👋 Servidor detenido por el usuario');
    process.exit(0);
});