# Reservas LTR AI

Chatbot de IA inteligente para reservar traslados a Riviera Maya. Funciona con Claude API y Cloudflare.

## 📋 Requisitos

- Cuenta GitHub (`luxurytransfersriviera2025-del`)
- Cuenta Cloudflare (con tu dominio `luxurytransfersriviera.com.mx`)
- API key de Claude (ya tienes: `sk-ant-api03-...`)

## 🚀 Pasos para desplegar

### 1. Crear el repositorio en GitHub

1. Ve a https://github.com/new
2. **Repository name:** `reservas-LTR-ai`
3. Selecciona **Public**
4. Click en "Create repository"

### 2. Clonar y subir los archivos

```bash
# Clonar el repo (vacío)
git clone https://github.com/luxurytransfersriviera2025-del/reservas-LTR-ai.git
cd reservas-LTR-ai

# Copiar los archivos que creamos:
# - index.html
# - wrangler.toml
# - functions/chat.js
# - functions/reserva.js
# - .gitignore
```

Estructura final:
```
reservas-LTR-ai/
├── index.html
├── wrangler.toml
├── .gitignore
├── functions/
│   ├── chat.js
│   └── reserva.js
└── README.md
```

### 3. Subir a GitHub

```bash
git add .
git commit -m "Initial commit: Chatbot AI para traslados"
git push origin main
```

### 4. Conectar a Cloudflare Pages

1. Ve a tu dashboard de Cloudflare
2. **Pages** → **Create a project** → **Connect to Git**
3. Selecciona el repo `reservas-LTR-ai`
4. Build settings:
   - **Framework:** None
   - **Build command:** (dejar vacío)
   - **Build output directory:** (dejar vacío)
5. Click "Save and deploy"

### 5. Configurar variables de entorno

En Cloudflare Pages:
1. Settings → Environment variables
2. Agregar variable:
   - **Name:** `CLAUDE_API_KEY`
   - **Value:** `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`
   - **Environment:** Production

### 6. Conectar dominio

1. En Cloudflare Pages → Domain
2. Agregar tu dominio: `luxurytransfersriviera.com.mx`

## 💬 Cómo funciona

1. Usuario pregunta en el chat
2. La página llama a `/api/chat` (Cloudflare Worker)
3. El Worker llama a Claude API
4. Claude responde de forma inteligente
5. Cuando cliente quiere reservar, se capturan datos

## 💰 Costos

- **Claude API:** ~$0.0008 por conversación
- **Cloudflare:** Gratis (con límites)
- **Total:** Prácticamente gratis

## 🔧 Configuración adicional

### Crear KV Store (para guardar reservas)

1. Cloudflare → KV → Create namespace
2. Nombre: `reservas-ltr`
3. En `wrangler.toml`, actualizar:
```toml
[[env.production.kv_namespaces]]
binding = "KV"
id = "tu-kv-id"
```

## 📞 Soporte

¿Problemas? Revisa:
- Variables de entorno configuradas
- API key de Claude válida
- Dominio conectado a Cloudflare
- Función `/api/chat` activa

## 📝 Notas

- El chatbot está en español
- Reconoce 5 destinos principales
- Captura automáticamente reservas
- Compatible con WhatsApp (con Twilio - próximo paso)