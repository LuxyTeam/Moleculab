#!/usr/bin/env node
/**
 * Servidor HTTP simple para servir el visualizador 3D de moléculas
 * Ejecutar: node server.js
 * Acceder desde: http://[IP_LOCAL]:8000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8000;

// Obtener todas las interfaces de red
function getNetworkInterfaces() {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    Object.keys(interfaces).forEach((interfaceName) => {
        interfaces[interfaceName].forEach((iface) => {
            // Solo IPv4 y no localhost
            if (iface.family === 'IPv4' && !iface.internal && iface.address !== '127.0.0.1') {
                addresses.push(iface.address);
            }
        });
    });

    return addresses;
}

// Headers CORS para evitar problemas con recursos externos
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;

    // Si es la raíz, servir index.html
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // Agregar CORS headers
    Object.keys(corsHeaders).forEach(header => {
        res.setHeader(header, corsHeaders[header]);
    });

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('Archivo no encontrado', 'utf-8');
            } else {
                res.writeHead(500);
                res.end(`Error del servidor: ${error.code}`, 'utf-8');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Configurar el servidor para escuchar en todas las interfaces
server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Servidor iniciado exitosamente!');
    console.log('📱 Accede desde tu red local:');

    // Obtener IP local
    const interfaces = getNetworkInterfaces();
    const localIP = interfaces.length > 0 ? interfaces[0] : 'localhost';

    console.log(`   http://${localIP}:${PORT}`);
    console.log('💻 Desde esta máquina:');
    console.log(`   http://localhost:${PORT}`);
    console.log(`   http://127.0.0.1:${PORT}`);

    if (interfaces.length > 1) {
        console.log('📋 URLs alternativas:');
        interfaces.forEach((ip, index) => {
            if (index > 0) {
                console.log(`   http://${ip}:${PORT}`);
            }
        });
    }

    console.log('\n🔥 El visualizador 3D de moléculas está listo!');
    console.log('📖 Presiona Ctrl+C para detener el servidor');
    console.log('\n🌐 Abriendo navegador...');

    // Abrir navegador
    const { exec } = require('child_process');
    exec(`start http://${localIP}:${PORT}`);
});

// Manejar la interrupción (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n\n👋 Servidor detenido por el usuario');
    server.close();
    process.exit(0);
});