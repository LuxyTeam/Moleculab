// Plantilla de chat para moléculas
const chatTemplate = {
    css: `
        #chat-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100;
            background-color: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-secondary);
            font-size: 1.2rem;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        #chat-toggle:hover {
            background-color: #34d399;
            color: white;
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(52, 211, 153, 0.3);
        }

        #chat-container {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 15px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            z-index: 200;
            overflow: hidden;
        }

        #chat-container.show {
            display: flex;
        }

        #chat-header {
            background: linear-gradient(135deg, #34d399, #10b981);
            color: white;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #chat-header h3 {
            margin: 0;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        #chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background-color 0.3s ease;
        }

        #chat-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        #chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        #chat-messages::-webkit-scrollbar {
            width: 4px;
        }

        #chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        #chat-messages::-webkit-scrollbar-thumb {
            background: #34d399;
            border-radius: 2px;
        }

        .message {
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 80%;
            font-size: 0.9rem;
            line-height: 1.4;
        }

        .message.user {
            background: var(--accent-color);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }

        .message.ai {
            background: rgba(52, 211, 153, 0.1);
            color: var(--text-primary);
            border: 1px solid rgba(52, 211, 153, 0.3);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }

        .message.ai-header {
            background: rgba(52, 211, 153, 0.2);
            color: #34d399;
            font-size: 0.8rem;
            font-weight: 600;
            padding: 8px 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            text-align: center;
        }

        .message.ai p {
            margin: 0 0 8px 0;
            line-height: 1.4;
        }

        .message.ai p:last-child {
            margin-bottom: 0;
        }

        .message.ai ul {
            margin: 8px 0;
            padding-left: 20px;
        }

        .message.ai li {
            margin: 4px 0;
            line-height: 1.3;
        }

        .message.ai strong {
            font-weight: 600;
            color: #34d399;
        }

        .message.ai em {
            font-style: italic;
            color: #10b981;
        }

        .message.ai table.ai-table {
            width: 100%;
            max-width: 280px;
            border-collapse: collapse;
            margin: 8px 0;
            font-size: 0.75rem;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(52, 211, 153, 0.1);
        }

        .message.ai table.ai-table th,
        .message.ai table.ai-table td {
            border: 1px solid rgba(52, 211, 153, 0.4);
            padding: 6px 8px;
            text-align: left;
            word-wrap: break-word;
        }

        .message.ai table.ai-table th {
            background: linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.1));
            font-weight: 600;
            color: #34d399;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .message.ai table.ai-table td {
            color: var(--text-primary);
            background: rgba(52, 211, 153, 0.02);
        }

        .message.ai table.ai-table tr:nth-child(even) td {
            background: rgba(52, 211, 153, 0.05);
        }

        .message.ai table.ai-table tr:hover td {
            background: rgba(52, 211, 153, 0.08);
        }

        .message.typing {
            background: rgba(52, 211, 153, 0.1);
            color: var(--text-secondary);
            border: 1px solid rgba(52, 211, 153, 0.3);
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
        }

        .typing-dots {
            display: flex;
            gap: 3px;
        }

        .typing-dots span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #34d399;
            animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
        .typing-dots span:nth-child(3) { animation-delay: 0s; }

        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        #chat-input-area {
            padding: 20px;
            border-top: 1px solid var(--border-color);
            display: flex;
            gap: 10px;
            align-items: center;
        }

        #chat-input {
            flex: 1;
            padding: 10px 15px;
            border: 1px solid var(--border-color);
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            font-size: 0.9rem;
            outline: none;
        }

        #chat-input:focus {
            border-color: #34d399;
            box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
        }

        #chat-input::placeholder {
            color: var(--text-secondary);
        }

        #chat-send {
            background: #34d399;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        #chat-send:hover {
            background: #10b981;
            transform: scale(1.05);
        }

        #chat-send:disabled {
            background: var(--text-secondary);
            cursor: not-allowed;
            transform: none;
        }

        @media (max-width: 768px) {
            #chat-container {
                width: calc(100vw - 40px);
                height: 400px;
                top: 80px;
                right: 20px;
                left: 20px;
            }
        }
    `,

    html: (moleculeName, placeholder) => `
        <button id="chat-toggle" title="Chat con IA">
            <i class="fa-solid fa-robot"></i>
        </button>

        <div id="chat-container">
            <div id="chat-header">
                <h3><i class="fa-solid fa-robot"></i> Asistente Químico</h3>
                <button id="chat-close"><i class="fa-solid fa-times"></i></button>
            </div>
            <div id="chat-messages"></div>
            <div id="chat-input-area">
                <input type="text" id="chat-input" placeholder="${placeholder}">
                <button id="chat-send">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `,

    javascript: (moleculeName, welcomeMessage) => `
        // Funcionalidad del chat con Gemini AI
        const chatToggle = document.getElementById('chat-toggle');
        const chatContainer = document.getElementById('chat-container');
        const chatClose = document.getElementById('chat-close');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        // Configuración de Gemini AI - REEMPLAZA CON TU API KEY REAL
        const GEMINI_API_KEY = 'AIzaSyAsOrx9g1AqYpdzgmkhhxUp5njo7EuWC-Q'; // API key de prueba (con límites)
        const GEMINI_MODEL = 'gemini-2.5-flash-lite';

        // 💡 INSTRUCCIONES PARA TU API KEY:
        // 1. Ve a https://aistudio.google.com/app/apikey
        // 2. Crea o copia tu API key
        // 3. Reemplaza la línea 237 con: const GEMINI_API_KEY = 'TU_API_KEY_AQUI';

        console.log('🤖 Inicializando Asistente IA con modelo:', GEMINI_MODEL);
        console.log('🔧 Para usar tu propia API key, edita la línea 237 en chat-template.js');

        // Mostrar/ocultar chat
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.add('show');
            chatInput.focus();
        });

        chatClose.addEventListener('click', () => {
            chatContainer.classList.remove('show');
        });

        // Enviar mensaje
        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message || chatSend.disabled) return;

            // Agregar mensaje del usuario
            addMessage(message, 'user');
            chatInput.value = '';
            chatSend.disabled = true;

            // Mostrar indicador de carga
            showTypingIndicator();

            try {
                // Llamar a Gemini AI
                const response = await callGeminiAI(message);
                // Remover indicador de carga
                removeTypingIndicator();
                // Formatear y agregar respuesta
                addFormattedMessage(response, 'ai');
            } catch (error) {
                // Remover indicador de carga
                removeTypingIndicator();
                console.error('Error con Gemini AI:', error);

                if (GEMINI_API_KEY.includes('AIzaSyAsOrx9g1AqYpdzgmkhhxUp5njo7EuWC-Q')) {
                    addMessage('⚠️ Usando API key de prueba (con límites). Para uso ilimitado, reemplaza la API key en chat-template.js con la tuya propia.', 'ai');
                } else if (error.message.includes('403') || error.message.includes('API_KEY')) {
                    addMessage('❌ Error: API key no válida o expirada. Verifica tu clave en Google AI Studio.', 'ai');
                } else if (error.message.includes('404')) {
                    addMessage('❌ Error: Modelo no encontrado. El modelo gemini-2.5-flash-lite debería estar disponible.', 'ai');
                } else if (error.message.includes('429')) {
                    addMessage('❌ Límite de rate excedido. Espera un momento antes de intentar nuevamente.', 'ai');
                } else if (error.message.includes('500')) {
                    addMessage('❌ Error del servidor de Google AI. Intenta de nuevo en unos momentos.', 'ai');
                } else {
                    addMessage('❌ Error de conexión. Verifica tu internet y que Google AI Studio esté disponible.', 'ai');
                }
            }

            chatSend.disabled = false;
        }

        // Mostrar indicador de carga
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message typing';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div><span>IA está pensando...</span>';
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Remover indicador de carga
        function removeTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        // Formatear mensaje como markdown
        function formatMarkdown(text) {
            // Limitar ULTRA estrictamente la longitud
            if (text.length > 200) {
                text = text.substring(0, 200) + '...';
            }

            // Procesar tablas markdown de manera más robusta
            const lines = text.split('\n');
            const processedLines = [];
            let inTable = false;
            let tableContent = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                // Detectar inicio de tabla (línea con pipes)
                if (line.includes('|') && line.split('|').length > 2) {
                    if (!inTable) {
                        // Inicio de tabla
                        inTable = true;
                        tableContent = ['<table class="ai-table">'];
                    }

                    // Verificar si es fila de encabezado (contiene guiones)
                    if (line.includes('-|') || line.includes('|-') || line.includes('--')) {
                        // Es fila de encabezado, convertir a <th>
                        const headers = line.split('|').map(cell => cell.trim().replace(/[-:]+/g, '').trim());
                        tableContent.push('<tr><th>' + headers.join('</th><th>') + '</th></tr>');
                    } else {
                        // Es fila de datos, convertir a <td>
                        const cells = line.split('|').map(cell => cell.trim());
                        tableContent.push('<tr><td>' + cells.join('</td><td>') + '</td></tr>');
                    }
                } else {
                    // Si estábamos en una tabla, cerrarla
                    if (inTable) {
                        tableContent.push('</table>');
                        processedLines.push(tableContent.join(''));
                        tableContent = [];
                        inTable = false;
                    }

                    // Agregar línea normal si no está vacía
                    if (line) {
                        processedLines.push(line);
                    }
                }
            }

            // Si terminamos con una tabla abierta, cerrarla
            if (inTable) {
                tableContent.push('</table>');
                processedLines.push(tableContent.join(''));
            }

            text = processedLines.join('\n');

            // Convertir negritas **texto** a <strong>texto</strong>
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // Convertir cursivas *texto* a <em>texto</em> (solo si no está entre **)
            text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

            // Convertir listas - elemento a <li>elemento</li>
            text = text.replace(/^- (.*$)/gm, '<li>$1</li>');
            text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

            // Convertir saltos de línea dobles a párrafos
            text = text.replace(/\n\n/g, '</p><p>');
            text = text.replace(/^/, '<p>').replace(/$/, '</p>');
            text = text.replace(/<p><\/p>/g, ''); // Remover párrafos vacíos
            text = text.replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1'); // Remover párrafos alrededor de listas

            // Convertir saltos de línea simples a <br> (dentro de párrafos)
            text = text.replace(/\n/g, '<br>');

            return text;
        }

        // Agregar mensaje formateado al chat
        function addFormattedMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + sender;

            if (sender === 'ai' && chatMessages.children.length === 0) {
                const headerDiv = document.createElement('div');
                headerDiv.className = 'message ai-header';
                headerDiv.textContent = '🤖 Asistente IA de Química';
                chatMessages.appendChild(headerDiv);
            }

            // Formatear como markdown si es respuesta de IA
            if (sender === 'ai') {
                messageDiv.innerHTML = formatMarkdown(text);
            } else {
                messageDiv.textContent = text;
            }

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Agregar mensaje al chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + sender;

            if (sender === 'ai' && chatMessages.children.length === 0) {
                const headerDiv = document.createElement('div');
                headerDiv.className = 'message ai-header';
                headerDiv.textContent = '🤖 Asistente IA de Química';
                chatMessages.appendChild(headerDiv);
            }

            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Llamar a Gemini AI usando el endpoint local
        async function callGeminiAI(message) {
            // Detectar si es un saludo simple
            const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hello', 'hi', 'hey'];
            const isGreeting = greetings.some(greeting =>
                message.toLowerCase().includes(greeting) && message.length < 20
            );

            let context;
            if (isGreeting) {
                // Para saludos simples, NO mencionar la molécula específica
                context = \`El usuario dice: "\${message}". Responde ÚNICAMENTE con un saludo breve y amigable. NO menciones ninguna molécula. Sé extremadamente conciso - máximo 2 palabras.\`;
            } else {
                // Para preguntas específicas, incluir contexto de la molécula
                context = \`Eres un experto en química explicando sobre ${moleculeName}. El usuario pregunta: "\${message}". IMPORTANTE: Responde de manera MUY CONCISA. Limita tu respuesta a 1-2 oraciones cortas. NO des más información de la necesaria.\`;
            }

            try {
                const response = await fetch('/api/question', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: context
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(\`Error HTTP: \${response.status} - \${errorData.error || 'Error desconocido'}\`);
                }

                const data = await response.json();

                if (data.response) {
                    return data.response;
                } else {
                    throw new Error('Respuesta inesperada de la API');
                }
            } catch (error) {
                throw new Error(\`Error al llamar Gemini AI: \${error.message}\`);
            }
        }

        // Event listeners para el chat
        chatSend.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Mensaje de bienvenida
        setTimeout(() => {
            addMessage('${welcomeMessage}', 'ai');
        }, 1000);
    `
};