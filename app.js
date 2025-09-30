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

        // Crear prompt mejorado para respuestas expertas y educativas
        const enhancedPrompt = prompt + '\n\nINSTRUCCIÓN ESPECIALIZADA:\n' +
            '- Eres un experto químico especializado en educación científica\n' +
            '- Proporciona información precisa, actualizada y bien fundamentada\n' +
            '- Explica conceptos complejos de manera clara y accesible\n' +
            '- Incluye ejemplos prácticos cuando sea relevante\n' +
            '- Menciona aplicaciones industriales o importancia biológica cuando corresponda\n' +
            '- Sé breve pero completo: máximo 4-5 oraciones útiles\n' +
            '- Usa lenguaje técnico apropiado pero evita jerga innecesaria\n' +
            '- Si no sabes algo con certeza, dilo honestamente';

        const response = await question(enhancedPrompt);

        // No limitar la respuesta, dejar que la IA controle la longitud
        let formattedResponse = response;

        console.log('✅ Respuesta generada:', formattedResponse.substring(0, 100) + '...');

        res.json({ response: formattedResponse });

    } catch (error) {
        console.error('Error en /api/question:', error);

        // Respuestas de fallback según el tipo de error
        let fallbackResponse = '';
        let statusCode = 500;

        if (error.message.includes('API_KEY') || error.message.includes('403')) {
            fallbackResponse = 'Lo siento, tengo problemas de conexión con el servicio de IA. Por favor, verifica que mi API key esté configurada correctamente o intenta de nuevo en unos momentos.';
            statusCode = 503;
        } else if (error.message.includes('429')) {
            fallbackResponse = 'He excedido mi límite de consultas por el momento. Por favor, espera unos minutos antes de hacer otra pregunta.';
            statusCode = 429;
        } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
            fallbackResponse = 'Tengo problemas de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.';
            statusCode = 502;
        } else {
            fallbackResponse = 'Disculpa, ocurrió un error inesperado. Como experto químico, puedo ayudarte con información general sobre química mientras se resuelve el problema técnico.';
            statusCode = 500;
        }

        res.status(statusCode).json({
            error: 'Error en el servicio',
            fallback: fallbackResponse,
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

// Base de datos de referencias químicas confiables
const chemicalReferences = {
    etanol: [
        "PubChem CID: 702",
        "IUPAC: Etanol",
        "Fuente: NIST Chemistry WebBook",
        "Referencia: CRC Handbook of Chemistry and Physics"
    ],
    amoniaco: [
        "PubChem CID: 222",
        "IUPAC: Azano",
        "Fuente: NIST Chemistry WebBook",
        "Referencia: Merck Index"
    ],
    etileno: [
        "PubChem CID: 6325",
        "IUPAC: Eteno",
        "Fuente: NIST Chemistry WebBook",
        "Referencia: CRC Handbook of Chemistry and Physics"
    ],
    'acido_sulfurico': [
        "PubChem CID: 1118",
        "IUPAC: Ácido sulfúrico",
        "Fuente: NIST Chemistry WebBook",
        "Referencia: Merck Index, CRC Handbook"
    ],
    acetona: [
        "PubChem CID: 180",
        "IUPAC: Propanona",
        "Fuente: NIST Chemistry WebBook",
        "Referencia: CRC Handbook of Chemistry and Physics"
    ],
    glucosa: [
        "PubChem CID: 5793",
        "IUPAC: (2R,3S,4R,5R)-2,3,4,5,6-Pentahidroxiexanal",
        "Fuente: PubChem, KEGG",
        "Referencia: Merck Index, Biochemical Pathways"
    ],
    agua: [
        "PubChem CID: 962",
        "IUPAC: Óxido de hidrógeno",
        "Fuente: NIST Chemistry WebBook",
        "Referencia: CRC Handbook, Lange's Handbook"
    ],
    metano: [
        "PubChem CID: 297",
        "IUPAC: Metano",
        "Fuente: NIST Chemistry WebBook",
        "Referencia: CRC Handbook of Chemistry and Physics"
    ],
    'hidroxido_sodio': [
        "PubChem CID: 14798",
        "IUPAC: Hidróxido de sodio",
        "Fuente: PubChem, NIST",
        "Referencia: Merck Index, CRC Handbook"
    ]
};

// API endpoint para referencias químicas
app.get('/api/chemistry/references/:molecule', (req, res) => {
    try {
        const molecule = req.params.molecule.toLowerCase();
        const references = chemicalReferences[molecule];

        if (references) {
            res.json({
                molecule,
                references,
                disclaimer: "Estas referencias provienen de fuentes científicas confiables como PubChem, NIST y manuales químicos estándar."
            });
        } else {
            res.status(404).json({
                error: 'Molécula no encontrada',
                available: Object.keys(chemicalReferences)
            });
        }
    } catch (error) {
        console.error('Error en referencias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
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

// API endpoint para búsqueda de moléculas
app.get('/api/molecules/search', (req, res) => {
    try {
        const query = req.query.q?.toLowerCase() || '';

        // Base de datos simple de moléculas disponibles
        const molecules = [
            {
                name: 'Etanol',
                formula: 'C₂H₆O',
                category: 'Alcohol',
                description: 'Alcohol etílico usado en bebidas y como solvente',
                url: 'molecules/ethanol.html'
            },
            {
                name: 'Amoníaco',
                formula: 'NH₃',
                category: 'Gas Industrial',
                description: 'Gas incoloro con olor penetrante, usado en fertilizantes',
                url: 'molecules/ammonia.html'
            },
            {
                name: 'Etileno',
                formula: 'C₂H₄',
                category: 'Alqueno',
                description: 'Hidrocarburo insaturado, materia prima para plásticos',
                url: 'molecules/ethylene.html'
            },
            {
                name: 'Ácido Sulfúrico',
                formula: 'H₂SO₄',
                category: 'Ácido Fuerte',
                description: 'Ácido corrosivo usado en múltiples industrias',
                url: 'molecules/sulfuric-acid.html'
            },
            {
                name: 'Acetona',
                formula: 'C₃H₆O',
                category: 'Cetona',
                description: 'Importante solvente industrial y removedor de esmalte',
                url: 'molecules/acetone.html'
            },
            {
                name: 'Glucosa',
                formula: 'C₆H₁₂O₆',
                category: 'Azúcar',
                description: 'Azúcar más importante biológicamente, fuente principal de energía',
                url: 'molecules/glucose.html'
            },
            {
                name: 'Agua',
                formula: 'H₂O',
                category: 'Óxido',
                description: 'Solvente universal y molécula esencial para la vida',
                url: 'molecules/water.html'
            },
            {
                name: 'Metano',
                formula: 'CH₄',
                category: 'Alcano',
                description: 'Gas natural, hidrocarburo más simple y potente gas de efecto invernadero',
                url: 'molecules/methane.html'
            },
            {
                name: 'Hidróxido de Sodio',
                formula: 'NaOH',
                category: 'Base Fuerte',
                description: 'Base muy utilizada en industria química y sosa cáustica',
                url: 'molecules/sodium-hydroxide.html'
            }
        ];

        // Filtrar moléculas según la búsqueda
        const results = molecules.filter(mol =>
            mol.name.toLowerCase().includes(query) ||
            mol.formula.toLowerCase().includes(query) ||
            mol.category.toLowerCase().includes(query)
        );

        res.json({ results });
    } catch (error) {
        console.error('Error en búsqueda:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API endpoint para cálculos químicos básicos
app.post('/api/chemistry/calculate', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (!type || !data) {
            return res.status(400).json({
                error: 'Tipo de cálculo y datos son requeridos'
            });
        }

        let result;
        switch (type) {
            case 'molar_mass':
                result = await calculateMolarMass(data.formula);
                break;
            case 'concentration':
                result = calculateConcentration(data);
                break;
            case 'dilution':
                result = calculateDilution(data);
                break;
            default:
                return res.status(400).json({ error: 'Tipo de cálculo no reconocido' });
        }

        res.json({ result });
    } catch (error) {
        console.error('Error en cálculo químico:', error);
        res.status(500).json({ error: 'Error en el cálculo' });
    }
});

// Función auxiliar para calcular masa molar (simplificada)
async function calculateMolarMass(formula) {
    // Esta es una implementación muy básica - en producción usarías una librería química
    const atomicMasses = {
        'H': 1.008, 'C': 12.011, 'N': 14.007, 'O': 15.999,
        'S': 32.06, 'P': 30.974, 'Cl': 35.45, 'Na': 22.99
    };

    let mass = 0;
    let currentElement = '';
    let currentNumber = '';

    for (let i = 0; i < formula.length; i++) {
        const char = formula[i];

        if (char >= 'A' && char <= 'Z') {
            if (currentElement) {
                const num = currentNumber ? parseInt(currentNumber) : 1;
                mass += atomicMasses[currentElement] * num;
            }
            currentElement = char;
            currentNumber = '';
        } else if (char >= 'a' && char <= 'z') {
            currentElement += char;
        } else if (char >= '0' && char <= '9') {
            currentNumber += char;
        }
    }

    if (currentElement) {
        const num = currentNumber ? parseInt(currentNumber) : 1;
        mass += atomicMasses[currentElement] * num;
    }

    return {
        formula,
        molar_mass: mass.toFixed(2),
        units: 'g/mol'
    };
}

// Función para calcular concentración
function calculateConcentration(data) {
    const { solute_mass, solution_volume, solute_molar_mass } = data;

    if (!solute_mass || !solution_volume || !solute_molar_mass) {
        throw new Error('Datos incompletos para calcular concentración');
    }

    const moles = solute_mass / solute_molar_mass;
    const concentration = moles / (solution_volume / 1000); // Convertir mL a L

    return {
        concentration: concentration.toFixed(3),
        units: 'mol/L',
        calculation: `${solute_mass}g / ${solute_molar_mass} g/mol / ${solution_volume/1000}L = ${concentration.toFixed(3)} mol/L`
    };
}

// Función para calcular dilución
function calculateDilution(data) {
    const { initial_concentration, initial_volume, final_concentration } = data;

    if (!initial_concentration || !initial_volume || !final_concentration) {
        throw new Error('Datos incompletos para calcular dilución');
    }

    const final_volume = (initial_concentration * initial_volume) / final_concentration;

    return {
        final_volume: final_volume.toFixed(1),
        units: 'mL',
        calculation: `V₂ = (${initial_concentration} × ${initial_volume}) / ${final_concentration} = ${final_volume.toFixed(1)} mL`
    };
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