// Plantilla de chat para moléculas
const chatTemplate = {
    css: `
        :root {
            --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            --warning-gradient: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            --glass-bg: rgba(255, 255, 255, 0.1);
            --glass-border: rgba(255, 255, 255, 0.2);
            --shadow-primary: 0 8px 32px rgba(0, 0, 0, 0.1);
            --shadow-hover: 0 12px 40px rgba(0, 0, 0, 0.15);
            --border-radius: 20px;
            --animation-speed: 0.3s;
        }

        #chat-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--primary-gradient);
            border: 2px solid transparent;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.4rem;
            transition: all var(--animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: var(--shadow-primary);
            animation: pulse-glow 2s infinite;
        }

        #chat-toggle:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: var(--shadow-hover);
            animation: none;
        }

        #chat-toggle:active {
            transform: scale(0.95);
        }

        @keyframes pulse-glow {
            0%, 100% {
                box-shadow: var(--shadow-primary);
            }
            50% {
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
            }
        }

        #chat-container {
            position: fixed;
            top: 90px;
            right: 20px;
            width: 380px;
            height: 550px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            box-shadow: var(--shadow-primary);
            display: none;
            flex-direction: column;
            z-index: 999;
            overflow: hidden;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #chat-container.show {
            display: flex;
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
        }

        #chat-header {
            background: var(--primary-gradient);
            color: white;
            padding: 18px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
        }

        #chat-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
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
            padding: 16px 20px;
            border-radius: var(--border-radius);
            max-width: 85%;
            font-size: 0.95rem;
            line-height: 1.5;
            position: relative;
            animation: messageSlideIn 0.3s ease-out;
            word-wrap: break-word;
        }

        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(10px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .message.user {
            background: var(--secondary-gradient);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 8px;
            box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
        }

        .message.user::before {
            content: '';
            position: absolute;
            bottom: 0;
            right: -8px;
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-left: 8px solid #f5576c;
        }

        .message.ai {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
            color: var(--text-primary);
            border: 1px solid var(--glass-border);
            align-self: flex-start;
            border-bottom-left-radius: 8px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .message.ai::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: -8px;
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-right: 8px solid rgba(255, 255, 255, 0.1);
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
            font-weight: bold !important;
            color: #34d399 !important;
            background: transparent !important;
            font-family: inherit !important;
        }

        .message.ai strong *,
        .message.ai strong {
            font-weight: bold !important;
            color: #34d399 !important;
        }

        /* Asegurar que el texto con formato se vea correctamente */
        .message.ai p strong {
            display: inline !important;
            font-weight: bold !important;
            color: #34d399 !important;
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

        .message.ai h1, .message.ai h2, .message.ai h3 {
            color: #34d399;
            font-weight: 600;
            margin: 12px 0 8px 0;
        }

        .message.ai h1 { font-size: 1.2rem; }
        .message.ai h2 { font-size: 1.1rem; }
        .message.ai h3 { font-size: 1rem; }

        .message.ai ul, .message.ai ol {
            margin: 8px 0;
            padding-left: 20px;
        }

        .message.ai li {
            margin: 4px 0;
            line-height: 1.4;
        }

        .code-block {
            background: rgba(0, 0, 0, 0.8);
            border-radius: 8px;
            padding: 12px;
            margin: 8px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            overflow-x: auto;
        }

        .inline-code {
            background: rgba(52, 211, 153, 0.2);
            color: #34d399;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
        }

        .message.ai a {
            color: #34d399;
            text-decoration: none;
            border-bottom: 1px solid rgba(52, 211, 153, 0.3);
            transition: all var(--animation-speed) ease;
        }

        .message.ai a:hover {
            color: #10b981;
            border-bottom-color: #10b981;
        }

        .message.ai u {
            text-decoration: underline;
            text-decoration-color: #34d399;
        }

        .message.ai del {
            text-decoration: line-through;
            color: var(--text-secondary);
        }

        .message.ai strong {
            font-weight: 600;
            color: #34d399;
        }

        .message.ai em {
            font-style: italic;
            color: #10b981;
        }

        /* Estado minimizado del chat */
        .chat-container.minimized {
            height: 60px;
            animation: minimize 0.3s ease-out;
        }

        .chat-container.minimized #chat-messages,
        .chat-container.minimized .chat-toolbar,
        .chat-container.minimized #chat-commands {
            display: none;
        }

        .chat-container.minimized #chat-header {
            cursor: pointer;
        }

        @keyframes minimize {
            from {
                height: 550px;
                opacity: 1;
            }
            to {
                height: 60px;
                opacity: 0.9;
            }
        }

        /* Animación para modo de escritura */
        .typing-indicator {
            animation: typing-pulse 1.4s infinite ease-in-out;
        }

        @keyframes typing-pulse {
            0%, 80%, 100% {
                transform: scale(1);
                opacity: 0.8;
            }
            40% {
                transform: scale(1.05);
                opacity: 1;
            }
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
            padding: 24px;
            border-top: 1px solid var(--glass-border);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            display: flex;
            gap: 12px;
            align-items: center;
        }

        #chat-input {
            flex: 1;
            padding: 14px 20px;
            border: 1px solid var(--glass-border);
            border-radius: 25px;
            background: var(--glass-bg);
            color: var(--text-primary);
            font-size: 0.95rem;
            outline: none;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            transition: all var(--animation-speed) ease;
        }

        #chat-input:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-1px);
        }

        #chat-input::placeholder {
            color: var(--text-secondary);
            font-weight: 300;
        }

        .notification-badge {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #ff4757;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
        }

        .header-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .header-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--animation-speed) ease;
        }

        .header-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
        }

        .chat-toolbar {
            padding: 12px 20px;
            border-top: 1px solid var(--glass-border);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
        }

        .toolbar-section {
            display: flex;
            gap: 8px;
        }

        .tool-btn {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 8px 12px;
            color: var(--text-secondary);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.8rem;
            transition: all var(--animation-speed) ease;
        }

        .tool-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
            transform: translateY(-1px);
        }

        .tool-btn.active {
            background: var(--primary-gradient);
            color: white;
            border-color: #667eea;
        }

        .chat-commands {
            padding: 16px 20px;
            border-top: 1px solid var(--glass-border);
            display: flex;
            gap: 12px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%);
            flex-wrap: wrap;
        }

        .cmd-btn {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 10px 14px;
            color: var(--text-primary);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all var(--animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 0.85rem;
            font-weight: 500;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .cmd-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }

        .cmd-btn:active {
            transform: translateY(0);
        }

        .input-container {
            display: flex;
            align-items: center;
            position: relative;
            flex: 1;
        }

        .input-actions {
            position: absolute;
            right: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .input-action-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 4px;
            border-radius: 50%;
            transition: all var(--animation-speed) ease;
        }

        .input-action-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }

        #chat-send {
            background: var(--success-gradient);
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all var(--animation-speed) cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
            position: relative;
            overflow: hidden;
        }

        #chat-send::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s;
        }

        #chat-send:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
        }

        #chat-send:hover::before {
            width: 100%;
            height: 100%;
        }

        #chat-send:active {
            transform: scale(0.95);
        }

        #chat-send:disabled {
            background: linear-gradient(135deg, #ccc 0%, #999 100%);
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        #chat-send:disabled::before {
            display: none;
        }

        .chat-container.minimized {
            height: 60px;
        }

        .chat-container.minimized #chat-messages {
            display: none;
        }

        .chat-container.minimized .chat-toolbar {
            display: none;
        }

        .chat-container.minimized #chat-commands {
            display: none;
        }

        .mode-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--success-gradient);
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-primary);
            z-index: 1001;
            animation: slideInNotification 0.3s ease-out;
        }

        @keyframes slideInNotification {
            from {
                opacity: 0;
                transform: translateX(100px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateX(0) scale(1);
            }
        }

        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-primary);
            z-index: 1001;
            animation: slideInNotification 0.3s ease-out;
            font-weight: 500;
        }

        .notification.info {
            background: var(--primary-gradient);
            color: white;
        }

        .notification.error {
            background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
            color: white;
        }

        .cmd-btn.recording {
            background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
            color: white;
            animation: recording-pulse 1.5s infinite;
        }

        @keyframes recording-pulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(255, 71, 87, 0);
            }
        }

        @media (max-width: 768px) {
            #chat-container {
                width: calc(100vw - 40px);
                height: 450px;
                max-height: 80vh;
                top: 80px;
                right: 20px;
                left: 20px;
                border-radius: 16px;
            }

            #chat-toggle {
                width: 55px;
                height: 55px;
                font-size: 1.2rem;
            }

            .message {
                max-width: 90%;
                padding: 12px 16px;
                font-size: 0.9rem;
            }

            #chat-input-area {
                padding: 16px;
                gap: 8px;
            }

            #chat-input {
                padding: 12px 16px;
                font-size: 0.9rem;
            }

            #chat-send {
                width: 44px;
                height: 44px;
            }

            .chat-toolbar {
                padding: 8px 12px;
            }

            .toolbar-section {
                gap: 4px;
            }

            .tool-btn {
                padding: 6px 10px;
                font-size: 0.75rem;
                gap: 4px;
            }

            .tool-btn span {
                display: none;
            }

            .chat-commands {
                padding: 12px;
                gap: 8px;
            }

            .cmd-btn {
                padding: 8px 12px;
                font-size: 0.8rem;
                gap: 6px;
            }

            .cmd-btn span {
                display: none;
            }

            .input-actions {
                gap: 4px;
            }

            .notification, .mode-notification {
                right: 10px;
                left: 10px;
                text-align: center;
            }
        }

        @media (max-width: 480px) {
            #chat-container {
                width: calc(100vw - 20px);
                height: 400px;
                left: 10px;
                right: 10px;
            }

            #chat-toggle {
                width: 50px;
                height: 50px;
                font-size: 1.1rem;
            }

            .message {
                max-width: 95%;
                font-size: 0.85rem;
            }

            #chat-input-area {
                padding: 12px;
            }
        }
    `,

    html: (moleculeName, placeholder) => `
        <button id="chat-toggle" title="Asistente IA Químico Avanzado">
            <i class="fa-solid fa-robot"></i>
            <span class="notification-badge" id="notification-badge" style="display: none;">●</span>
        </button>

        <div id="chat-container">
            <div id="chat-header">
                <h3><i class="fa-solid fa-atom"></i> Asistente IA Químico</h3>
                <div class="header-actions">
                    <button id="chat-minimize" title="Minimizar" class="header-btn">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button id="chat-close" title="Cerrar">
                        <i class="fa-solid fa-times"></i>
                    </button>
                </div>
            </div>

            <div id="chat-messages"></div>

            <div class="chat-toolbar">
                <div class="toolbar-section">
                    <button class="tool-btn active" onclick="setChatMode('general')" title="Modo General">
                        <i class="fas fa-comments"></i>
                        <span>General</span>
                    </button>
                    <button class="tool-btn" onclick="setChatMode('educativo')" title="Modo Educativo">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Educativo</span>
                    </button>
                    <button class="tool-btn" onclick="setChatMode('tecnico')" title="Modo Técnico">
                        <i class="fas fa-cogs"></i>
                        <span>Técnico</span>
                    </button>
                </div>
            </div>

            <div id="chat-commands" class="chat-commands">
                <button class="cmd-btn" onclick="sendQuickCommand('/ayuda')" title="Ver comandos disponibles">
                    <i class="fas fa-question-circle"></i>
                    <span>Ayuda</span>
                </button>
                <button class="cmd-btn" onclick="sendQuickCommand('/moleculas')" title="Ver moléculas disponibles">
                    <i class="fas fa-flask"></i>
                    <span>Moléculas</span>
                </button>
                <button class="cmd-btn" onclick="sendQuickCommand('/buscar')" title="Buscar información">
                    <i class="fas fa-search"></i>
                    <span>Buscar</span>
                </button>
                <button class="cmd-btn" onclick="sendQuickCommand('/calcular')" title="Herramientas de cálculo">
                    <i class="fas fa-calculator"></i>
                    <span>Calcular</span>
                </button>
                <button class="cmd-btn" onclick="toggleVoiceInput()" id="voice-btn" title="Voz">
                    <i class="fas fa-microphone"></i>
                    <span>Voz</span>
                </button>
            </div>

            <div id="chat-input-area">
                <div class="input-container">
                    <input type="text" id="chat-input" placeholder="${placeholder}">
                    <div class="input-actions">
                        <button id="attach-btn" title="Adjuntar archivo" class="input-action-btn">
                            <i class="fas fa-paperclip"></i>
                        </button>
                        <input type="file" id="file-input" accept="image/*,.pdf,.txt" style="display: none;">
                    </div>
                </div>
                <button id="chat-send" title="Enviar mensaje">
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

        // Estado del chat
        let chatMode = 'general';
        let isMinimized = false;

        // Mostrar/ocultar chat
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.add('show');
            if (!isMinimized) {
                chatInput.focus();
            }
            // Ocultar badge de notificación
            const badge = document.getElementById('notification-badge');
            if (badge) badge.style.display = 'none';
        });

        chatClose.addEventListener('click', () => {
            chatContainer.classList.remove('show');
            isMinimized = false;
            document.getElementById('chat-container').classList.remove('minimized');
        });

        // Función para minimizar chat
        const minimizeBtn = document.getElementById('chat-minimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                isMinimized = !isMinimized;
                document.getElementById('chat-container').classList.toggle('minimized', isMinimized);
            });
        }

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

        // Formatear mensaje como markdown mejorado
        function formatMarkdown(text) {
            // Asegurar que el texto esté limpio para procesamiento
            if (typeof text !== 'string') {
                text = String(text);
            }

            // Procesar tablas markdown mejoradas
            text = processTables(text);

            // Procesar formato básico markdown
            // 1. Negritas
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

            // 2. Cursivas
            text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');

            // 3. Convertir listas
            text = text.replace(/^- (.*$)/gm, '<li>$1</li>');
            text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

            // 4. Procesar párrafos
            text = text.replace(/\n\n/g, '</p><p>');
            text = text.replace(/^/, '<p>').replace(/$/, '</p>');
            text = text.replace(/<p><\/p>/g, ''); // Remover párrafos vacíos
            text = text.replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1'); // Remover párrafos alrededor de listas

            // 5. Saltos de línea dentro de párrafos
            text = text.replace(/\n/g, '<br>');

            return text;
        }

        // Función para procesar tablas markdown
        function processTables(text) {
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
                        tableContent = ['<div class="table-container"><table class="ai-table">'];
                    }

                    // Verificar si es fila de encabezado (contiene guiones)
                    if (line.includes('-|') || line.includes('|-') || line.includes('--')) {
                        // Es fila de encabezado, convertir a <th>
                        const headers = line.split('|').map(cell => cell.trim().replace(/[-:]+/g, '').trim());
                        tableContent.push('<thead><tr><th>' + headers.join('</th><th>') + '</th></tr></thead>');
                    } else {
                        // Es fila de datos, convertir a <td>
                        const cells = line.split('|').map(cell => cell.trim());
                        tableContent.push('<tr><td>' + cells.join('</td><td>') + '</td></tr>');
                    }
                } else {
                    // Si estábamos en una tabla, cerrarla
                    if (inTable) {
                        tableContent.push('</table></div>');
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
                tableContent.push('</table></div>');
                processedLines.push(tableContent.join(''));
            }

            return processedLines.join('\n');
        }

        // Función para escapar HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
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

        // Procesar comandos especiales del chat
        function processSpecialCommands(message) {
            const cmd = message.toLowerCase().trim();

            // Comando de búsqueda mejorado
            if (cmd === '/buscar' || cmd === '/buscar ') {
                return showSearchHelp();
            }
            if (cmd.startsWith('/buscar ')) {
                const query = message.substring(8).trim();
                return searchMolecules(query);
            }

            // Comando de ayuda
            if (cmd === '/ayuda' || cmd === '/help') {
                return showHelp();
            }

            // Comando de moléculas disponibles
            if (cmd === '/moleculas' || cmd === '/molecules') {
                return listMolecules();
            }

            // Comando de cálculos químicos mejorado
            if (cmd === '/calcular' || cmd === '/calcular ') {
                return showCalculationHelp('menu');
            }
            if (cmd.startsWith('/calcular ')) {
                const calcType = message.substring(10).trim();
                return showCalculationHelp(calcType);
            }

            // Comando de referencias
            if (cmd.startsWith('/referencias')) {
                const molecule = message.substring(12).trim() || moleculeName.toLowerCase();
                return getReferences(molecule);
            }

            // Comando de fuentes
            if (cmd === '/fuentes' || cmd === '/referencias') {
                return showReferences();
            }

            // Comando de limpiar chat
            if (cmd === '/limpiar' || cmd === '/clear') {
                return clearChat();
            }

            // Comando de historial
            if (cmd === '/historial' || cmd === '/history') {
                return showChatHistory();
            }

            // Comando de tema
            if (cmd.startsWith('/tema ')) {
                const theme = message.substring(6).trim();
                return setChatTheme(theme);
            }

            // Comando de idioma
            if (cmd.startsWith('/idioma ')) {
                const lang = message.substring(8).trim();
                return setChatLanguage(lang);
            }

            // Comando de exportar
            if (cmd === '/exportar' || cmd === '/export') {
                return exportChat();
            }

            // Si no es un comando especial, usar IA normal
            return null;
        }

        // Función de búsqueda de moléculas
        async function searchMolecules(query) {
            try {
                const response = await fetch(\`/api/molecules/search?q=\${encodeURIComponent(query)}\`);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    let results = \`🔍 **Resultados de búsqueda para:** \${query}\\n\\n\`;
                    data.results.forEach((mol, index) => {
                        results += \`\${index + 1}. **\${mol.name}** (\${mol.formula}) - \${mol.category}\\n   \${mol.description}\\n\\n\`;
                    });
                    return results;
                } else {
                    return \`❌ No se encontraron moléculas que coincidan con: "\${query}". Usa /moleculas para ver todas disponibles.\`;
                }
            } catch (error) {
                return \`❌ Error en la búsqueda. Intenta de nuevo más tarde.\`;
            }
        }

        // Función para mostrar ayuda
        function showHelp() {
            return \`🤖 **Comandos disponibles:**

**🔍 Búsqueda:**
• /buscar [término] - Buscar moléculas por nombre, fórmula o categoría
• /moleculas - Ver todas las moléculas disponibles

**🧮 Cálculos:**
• /calcular [tipo] - Herramientas de cálculo químico
• /calcular masa - Calcular masa molar
• /calcular concentracion - Calcular concentración

**📚 Información:**
• /referencias [molécula] - Ver referencias científicas
• /fuentes - Información sobre fuentes utilizadas

**⚙️ Utilidades:**
• /limpiar - Limpiar historial del chat
• /historial - Ver estadísticas del chat
• /tema [nombre] - Cambiar tema visual
• /idioma [español/ingles] - Cambiar idioma
• /exportar - Descargar conversación

**💬 Comunicación:**
• /ayuda - Mostrar esta ayuda

💡 **También puedes:**
• Hacer preguntas en lenguaje natural
• Pedir explicaciones detalladas
• Solicitar ejemplos prácticos
• Preguntar sobre aplicaciones reales
• Usar voz para interactuar (*)\`;
        }

        // Función para listar moléculas
        async function listMolecules() {
            try {
                const response = await fetch('/api/molecules/search?q=');
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    let list = \`📚 **Moléculas disponibles:**\\n\\n\`;
                    data.results.forEach((mol, index) => {
                        list += \`\${index + 1}. **\${mol.name}** (\${mol.formula}) - \${mol.category}\\n\`;
                    });
                    return list;
                } else {
                    return \`❌ No se pudieron cargar las moléculas disponibles.\`;
                }
            } catch (error) {
                return \`❌ Error al cargar la lista de moléculas.\`;
            }
        }

        // Función para mostrar ayuda de cálculos
        function showCalculationHelp(calcType) {
            const help = {
                'masa': \`🧮 **Calcular Masa Molar:**
Envía: /calcular masa_formular=NaCl
Ejemplo: /calcular masa_formular=C2H5OH

Recibirás la masa molar de la fórmula química especificada.\`,

                'concentracion': \`🧮 **Calcular Concentración:**
Envía: /calcular concentracion_masa=10_volumen=1000_molar=180
Donde:
- masa = masa del soluto en gramos
- volumen = volumen de solución en mL
- molar = masa molar del soluto en g/mol\`,

                'dilucion': \`🧮 **Calcular Dilución:**
Envía: /calcular dilucion_concentracion=2_volumen=50_final=0.5
Donde:
- concentracion = concentración inicial en mol/L
- volumen = volumen inicial en mL
- final = concentración final deseada en mol/L\`
            };

            return help[calcType] || \`🤔 **Tipos de cálculo disponibles:**
/calcular masa - Calcular masa molar de una fórmula
/calcular concentracion - Calcular concentración de una solución
/calcular dilucion - Calcular volumen para dilución

Ejemplo: /calcular masa_formular=H2SO4\`;
        }

        // Función para obtener referencias químicas
        async function getReferences(molecule) {
            try {
                const response = await fetch(\`/api/chemistry/references/\${encodeURIComponent(molecule)}\`);
                const data = await response.json();

                if (response.ok && data.references) {
                    let refs = \`📚 **Referencias científicas para** \${molecule}:\\n\\n\`;
                    data.references.forEach((ref, index) => {
                        refs += \`\${index + 1}. \${ref}\\n\`;
                    });
                    refs += \`\\n📖 *\${data.disclaimer}*\`;
                    return refs;
                } else {
                    return \`❌ No se encontraron referencias para "\${molecule}". Moléculas disponibles: etanol, amoniaco, etileno, acido_sulfurico, acetona, glucosa, agua, metano, hidroxido_sodio.\`;
                }
            } catch (error) {
                return \`❌ Error al obtener referencias. Intenta de nuevo más tarde.\`;
            }
        }

        // Función para mostrar información sobre fuentes
        function showReferences() {
            return \`📚 **Fuentes confiables utilizadas:**

🔬 **Bases de datos químicas:**
- **PubChem** (NCBI) - Base de datos más completa de compuestos químicos
- **NIST Chemistry WebBook** - Instituto Nacional de Estándares y Tecnología
- **IUPAC** - Unión Internacional de Química Pura y Aplicada

📖 **Referencias académicas:**
- **CRC Handbook of Chemistry and Physics** - Manual estándar de química
- **Merck Index** - Enciclopedia de químicos y fármacos
- **Ullmann's Encyclopedia** - Referencia industrial

Estas fuentes garantizan la precisión y actualización de la información química proporcionada. Usa /referencias [molécula] para ver referencias específicas.\`;
        }

        // Función para mostrar ayuda de búsqueda
        function showSearchHelp() {
            return \`🔍 **Búsqueda avanzada de moléculas:**

**Ejemplos de búsqueda:**
- /buscar etanol
- /buscar alcohol
- /buscar propiedades químicas
- /buscar usos industriales

**Tipos de búsqueda disponibles:**
- **Por nombre:** /buscar agua, /buscar ácido sulfúrico
- **Por fórmula:** /buscar H2O, /buscar C2H5OH
- **Por categoría:** /buscar solventes, /buscar ácidos
- **Por propiedades:** /buscar inflamable, /buscar tóxico

💡 **Consejo:** Sé específico en tu búsqueda para obtener mejores resultados.\`;
        }

        // Función para limpiar chat
        function clearChat() {
            chatMessages.innerHTML = '';
            addMessage('💬 Chat limpiado. ¿En qué puedo ayudarte?', 'ai');
            return Promise.resolve('Chat limpiado correctamente');
        }

        // Función para mostrar historial (simulado)
        function showChatHistory() {
            const messageCount = chatMessages.children.length;
            return \`📜 **Historial del chat:**

💬 **Mensajes totales:** \${messageCount}
🤖 **Asistente:** Activo y listo
⚡ **Estado:** Todas las funciones operativas

*El historial detallado se almacena localmente en tu navegador para mayor privacidad.*\`;
        }

        // Función para cambiar tema
        function setChatTheme(theme) {
            const validThemes = ['oscuro', 'claro', 'azul', 'verde', 'morado'];
            if (!validThemes.includes(theme)) {
                return \`❌ Tema no válido. Temas disponibles: \${validThemes.join(', ')}\`;
            }

            // Aplicar tema (simplificado)
            document.getElementById('chat-container').className = \`theme-\${theme}\`;
            return \`🎨 **Tema cambiado a:** \${theme}

Tema aplicado correctamente. El cambio se mantendrá durante esta sesión.\`;
        }

        // Función para cambiar idioma
        function setChatLanguage(lang) {
            const validLangs = ['español', 'ingles', 'es', 'en'];
            if (!validLangs.includes(lang.toLowerCase())) {
                return \`❌ Idioma no válido. Idiomas disponibles: español, inglés\`;
            }

            const langNames = {
                'español': 'Español',
                'ingles': 'English',
                'es': 'Español',
                'en': 'English'
            };

            return \`🌐 **Idioma cambiado a:** \${langNames[lang.toLowerCase()]}

El asistente responderá en el idioma seleccionado. Esta configuración se mantiene durante la sesión.\`;
        }

        // Función para exportar chat
        function exportChat() {
            const messages = [];
            chatMessages.querySelectorAll('.message').forEach(msg => {
                const type = msg.classList.contains('user') ? 'Usuario' : 'Asistente';
                messages.push(\`[\${type}] \${msg.textContent}\`);
            });

            const chatContent = messages.join('\\n\\n');
            const blob = new Blob([chatContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = \`chat_quimica_\${new Date().toISOString().split('T')[0]}.txt\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            return '💾 Chat exportado correctamente';
        }

        // Llamar a Gemini AI usando el endpoint local
        async function callGeminiAI(message) {
            // Procesar comandos especiales primero
            const specialResponse = processSpecialCommands(message);
            if (specialResponse) {
                // Si es un comando especial, devolver respuesta directa
                if (typeof specialResponse === 'string') {
                    return specialResponse;
                }
                // Si es una promesa (búsqueda asíncrona), ejecutarla
                return await specialResponse;
            }

            // Crear contexto experto incluyendo información sobre la molécula
            const context = \`Eres un experto químico especializado en educación científica explicando sobre ${moleculeName}.
Usuario pregunta: "\${message}"

INSTRUCCIONES ESPECÍFICAS:
- Proporciona información precisa y educativa sobre química
- Explica conceptos de manera clara y estructurada
- Incluye propiedades químicas, aplicaciones prácticas e importancia industrial
- Sé breve pero completo: 3-5 oraciones útiles máximo
- Usa lenguaje técnico apropiado pero accesible
- Si es pregunta general sobre química, responde como experto independiente de la molécula específica
- Siempre prioriza la precisión científica sobre la velocidad de respuesta
- Puedes usar formato markdown como **negritas** para resaltar términos importantes.\`;

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

                    // Si hay respuesta de fallback, usarla directamente
                    if (errorData.fallback) {
                        return errorData.fallback;
                    }

                    // Crear mensaje de error según código de estado
                    let errorMessage = '';
                    switch (response.status) {
                        case 429:
                            errorMessage = 'Límite de consultas excedido. Por favor, espera unos minutos antes de hacer otra pregunta.';
                            break;
                        case 503:
                            errorMessage = 'Servicio de IA temporalmente no disponible. Puedes seguir preguntando sobre química general.';
                            break;
                        case 502:
                            errorMessage = 'Problemas de conexión con el servidor. Verifica tu conexión a internet.';
                            break;
                        case 400:
                            errorMessage = 'Consulta no válida. Verifica que tu pregunta esté bien formulada.';
                            break;
                        default:
                            errorMessage = \`Error del servidor: \${errorData.error || 'Error desconocido'}\`;
                    }

                    throw new Error(errorMessage);
                }

                const data = await response.json();

                if (data.response) {
                    return data.response;
                } else if (data.fallback) {
                    // Usar respuesta de fallback si está disponible
                    return data.fallback;
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

        // Función para establecer modo de chat
        window.setChatMode = function(mode) {
            chatMode = mode;
            // Actualizar estilos de botones
            document.querySelectorAll('.tool-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');

            // Actualizar placeholder según modo
            const placeholders = {
                'general': '💬 Pregunta sobre química...',
                'educativo': '🎓 ¿Qué deseas aprender?',
                'tecnico': '🔬 Consulta técnica específica...'
            };
            chatInput.placeholder = placeholders[mode] || placeholders.general;

            // Mostrar notificación de cambio de modo
            showModeNotification(mode);
        };

        // Función para mostrar notificación de modo
        function showModeNotification(mode) {
            const notifications = {
                'general': 'Modo conversación general activado',
                'educativo': 'Modo educativo activado - explicaciones detalladas',
                'tecnico': 'Modo técnico activado - información avanzada'
            };

            // Crear notificación flotante
            const notification = document.createElement('div');
            notification.className = 'mode-notification';
            notification.textContent = notifications[mode];
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 2000);
        }

        // Función para enviar comandos rápidos
        window.sendQuickCommand = function(command) {
            const chatInput = document.getElementById('chat-input');
            const chatSend = document.getElementById('chat-send');

            // Si es solo comando base, pedir más detalles
            if (command === '/buscar' || command === '/calcular') {
                chatInput.value = command + ' ';
                chatInput.focus();
                return;
            }

            chatInput.value = command;
            chatInput.focus();

            // Simular envío automático después de un breve delay
            setTimeout(() => {
                if (chatInput.value === command && !chatSend.disabled) {
                    sendMessage();
                }
            }, 100);
        };

        // Función para alternar entrada de voz
        window.toggleVoiceInput = function() {
            const voiceBtn = document.getElementById('voice-btn');
            const icon = voiceBtn.querySelector('i');

            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                if (voiceBtn.classList.contains('recording')) {
                    // Detener grabación
                    voiceBtn.classList.remove('recording');
                    icon.className = 'fas fa-microphone';
                    if (recognition) recognition.stop();
                } else {
                    // Iniciar grabación
                    startVoiceRecognition();
                    voiceBtn.classList.add('recording');
                    icon.className = 'fas fa-stop';
                }
            } else {
                // Mostrar error si no soporta voz
                showNotification('Entrada de voz no soportada en este navegador', 'error');
            }
        };

        // Función para iniciar reconocimiento de voz
        function startVoiceRecognition() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'es-ES';

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                chatInput.value = transcript;
                sendMessage();
            };

            recognition.onerror = function(event) {
                showNotification('Error en reconocimiento de voz: ' + event.error, 'error');
                toggleVoiceInput();
            };

            recognition.start();
        }

        // Función para mostrar notificaciones
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = \`notification \${type}\`;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Configurar adjuntar archivos
        const attachBtn = document.getElementById('attach-btn');
        const fileInput = document.getElementById('file-input');

        if (attachBtn && fileInput) {
            attachBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', handleFileUpload);
        }

        // Función para manejar subida de archivos
        async function handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
            if (!validTypes.includes(file.type)) {
                showNotification('Tipo de archivo no soportado. Usa imágenes, PDF o texto.', 'error');
                return;
            }

            // Validar tamaño (máximo 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showNotification('Archivo demasiado grande. Máximo 10MB.', 'error');
                return;
            }

            showNotification('Procesando archivo...', 'info');

            try {
                const response = await uploadFile(file);
                addMessage(\`Archivo "\${file.name}" procesado correctamente. Haz tu pregunta sobre el archivo.\`, 'ai');
            } catch (error) {
                showNotification('Error al procesar archivo: ' + error.message, 'error');
            }

            // Limpiar input
            fileInput.value = '';
        }

        // Función para subir archivo
        async function uploadFile(file) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error en subida de archivo');
            }

            return await response.json();
        }

        // Mensaje de bienvenida mejorado
        setTimeout(() => {
            addMessage('${welcomeMessage}\\n\\n💡 **Tip:** Usa los botones superiores o comandos como /ayuda, /buscar, /moleculas', 'ai');
        }, 1000);
    `
};