# Visualizador 3D de Moléculas Químicas con Chat IA

## 🚀 Características

- **Visualización 3D interactiva** de moléculas químicas
- **Estructuras 2D mejoradas** con colores y formas definidas
- **Chat IA con Google Gemini** para consultas químicas
- **Interfaz moderna y responsiva** con diseño oscuro
- **Navegación intuitiva** entre moléculas
- **Información completa** sobre propiedades y usos

## 📁 Estructura del Proyecto

```
📁 LuxyAtom/
├── 📄 index.html                 # Página principal de presentación
├── 📄 server.js                  # Servidor HTTP (activo)
├── 📄 server.py                  # Servidor de respaldo
├── 📄 README.md                  # Este archivo
├── 📁 molecules/                 # Visualizadores 3D individuales
│   ├── 📄 ethanol.html          # Etanol (C₂H₆O)
│   ├── 📄 ammonia.html          # Amoníaco (NH₃)
│   ├── 📄 ethylene.html         # Etileno (C₂H₄)
│   ├── 📄 sulfuric-acid.html    # Ácido sulfúrico (H₂SO₄)
│   └── 📄 acetone.html          # Acetona (C₃H₆O)
└── 📁 src/                      # Proyecto React (existente)
```

## 🤖 Configuración del Chat IA con Google Gemini

### Paso 1: Obtener API Key de Google Gemini
1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una cuenta o inicia sesión
3. Genera una nueva API key
4. Copia la key generada

### Paso 2: Configurar la API Key
En cada archivo de molécula, busca esta línea:
```javascript
const GEMINI_API_KEY = 'AIzaSyAsOrx9g1AqYpdzgmkhhxUp5njo7EuWC-Q';
```

Y reemplázala con tu API key real:
```javascript
const GEMINI_API_KEY = 'AIzaSyD....'; // Tu API key aquí
```

### Paso 3: Probar el Chat
1. Inicia el servidor: `node server.js`
2. Abre: http://localhost:8000
3. Entra a cualquier molécula
4. Haz clic en el botón del robot 🤖
5. Pregunta sobre la molécula

## 🌐 URLs de Acceso

- **http://localhost:8000/** - Página principal
- **http://localhost:8000/molecules/ethanol.html** - Etanol 3D
- **http://localhost:8000/molecules/ammonia.html** - Amoníaco 3D
- **http://localhost:8000/molecules/ethylene.html** - Etileno 3D
- **http://localhost:8000/molecules/sulfuric-acid.html** - Ácido sulfúrico 3D
- **http://localhost:8000/molecules/acetone.html** - Acetona 3D

## 💬 Funcionalidades del Chat IA

Cada molécula tiene su propio chat especializado:

- **Etanol**: Especialista en alcohol etílico
- **Amoníaco**: Especialista en compuestos nitrogenados
- **Etileno**: Especialista en alquenos y plásticos
- **Ácido Sulfúrico**: Especialista en química industrial
- **Acetona**: Especialista en cetonas y disolventes

### Preguntas que puedes hacer:
- ¿Cuáles son las propiedades del etanol?
- ¿Para qué se usa el amoníaco?
- ¿Cómo se produce el etileno?
- ¿Por qué el ácido sulfúrico es corrosivo?
- ¿Qué precauciones debo tener con la acetona?

## 🎨 Características Visuales

- **Tema oscuro** con gradientes modernos
- **Estructuras 2D mejoradas** con colores atómicos
- **Iconos Font Awesome** para seguridad y navegación
- **Animaciones suaves** y efectos visuales
- **Diseño responsivo** para móviles y desktop

## 🔧 Tecnologías Utilizadas

- **Three.js** - Visualización 3D
- **Google Gemini AI** - Chat inteligente
- **HTML5/CSS3** - Interfaz moderna
- **Font Awesome** - Iconografía
- **Node.js** - Servidor HTTP

## 🚀 Inicio Rápido

1. **Inicia el servidor:**
   ```bash
   node server.js
   ```

2. **Abre en tu navegador:**
   ```
   http://localhost:8000
   ```

3. **Configura tu API key de Gemini** para activar el chat IA

4. **¡Explora las moléculas y haz preguntas al asistente IA!**

## 📚 Información Educativa

Cada molécula incluye:
- **Estructura 3D interactiva**
- **Fórmula química y propiedades**
- **Aplicaciones industriales**
- **Datos de seguridad y riesgos**
- **Estructura 2D mejorada**
- **Chat IA especializado**

---

**¡Disfruta explorando el fascinante mundo de la química con IA!** 🔬🤖