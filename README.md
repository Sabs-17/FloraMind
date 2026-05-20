# 🌿 FloraMind

<div align="center">

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-v18%2B-green)
![React](https://img.shields.io/badge/React-18%2B-blue)

Um chatbot inteligente e interativo focado em botânica e cuidados com plantas, desenvolvido com tecnologias modernas de IA e web.

[Demonstração](#) • [Documentação](./DOCS.md) • [Contribuir](CONTRIBUTING.md) • [Issues](https://github.com/Sabs-17/FloraMind/issues)

</div>

---

## 📋 Sobre o Projeto

**FloraMind** é um assistente de IA especializado em botânica, desenvolvido como projeto para a disciplina de **IA Aplicada ao Desenvolvimento**. O chatbot oferece uma experiência interativa onde usuários podem fazer perguntas sobre plantas, receber recomendações personalizadas e aprender sobre cuidados e cultivo de plantas.

### ✨ Principais Características

- 🤖 **Chatbot Inteligente** - Powered by Google's Generative AI (Gemini)
- 🎨 **Interface Moderna** - Design responsivo e intuitivo com TailwindCSS
- 📱 **Multiplataforma** - Funciona em desktop e mobile
- 💬 **Sugestões Inteligentes** - Recomendações contextuais baseadas em conversas anteriores
- 🖼️ **Análise de Imagens** - Identifique plantas por foto
- 📜 **Histórico de Conversas** - Acesse conversas anteriores facilmente
- 🔐 **Autenticação** - Sistema de login seguro

---

## 🏗️ Arquitetura

```
FloraMind/
├── Backend (Node.js + Express)
│   ├── Controllers - Lógica de negócio
│   ├── Services - Gerenciamento de conversas
│   ├── Routes - Endpoints da API
│   └── Utils - Classificação de intent e sugestões
│
└── Frontend (React + Vite)
    ├── Components - Componentes reutilizáveis
    ├── Pages - Páginas principais (Chat, Login)
    ├── Hooks - Lógicas customizadas
    ├── Context - Estados globais (Auth, Theme)
    └── Services - Integração com API
```

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** v18 ou superior
- **npm** ou **yarn**
- **Chave da API Google Cloud** (Gemini API) - [Obtenha aqui](https://ai.google.dev/)

### Instalação Rápida

1. **Clone o repositório**

```bash
git clone https://github.com/Sabs-17/FloraMind.git
cd FloraMind
```

2. **Configure o Backend**

```bash
cd backend
npm install

# Copie o arquivo de exemplo e configure com sua chave
cp .env.example .env

# Edite .env e adicione sua chave da Google AI Studio
# GEMINI_KEY=sua_chave_aqui

npm run dev
```

O backend iniciará em `http://localhost:3000`

3. **Configure o Frontend**

```bash
cd ../frontend
npm install
npm run dev
```

O frontend iniciará em `http://localhost:5173`

---

## 📖 Uso

1. Abra `http://localhost:5173` no seu navegador
2. Faça login ou crie uma conta
3. Comece a conversar sobre plantas!

### Exemplos de Perguntas

- "Como cuidar de uma planta suculenta?"
- "Qual planta é melhor para interiores com pouca luz?"
- "Minha planta está com folhas amarelas, o que faço?"
- "Compartilhe imagem de uma planta para identificar"

---

## 🛠️ Variáveis de Ambiente

### Backend (.env)

```env
# Google Gemini API
GEMINI_KEY=sua_chave_api_aqui

# Servidor
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

---

## 📁 Estrutura de Pastas

```
backend/
├── src/
│   ├── controllers/
│   │   ├── chatController.js      # Lógica do chat
│   │   └── imageController.js     # Processamento de imagens
│   ├── routes/
│   │   ├── chat.js               # Rotas de chat
│   │   └── image.js              # Rotas de imagens
│   ├── services/
│   │   └── conversationManager.js # Gerenciamento de conversas
│   ├── utils/
│   │   ├── intentClassifier.js   # Classificação de intents
│   │   └── suggestionGenerator.js # Gerador de sugestões
│   └── prompts/
│       └── systemPrompt.js       # Prompt do sistema da IA
└── server.js                     # Servidor principal

frontend/
├── src/
│   ├── components/
│   │   ├── ChatWindow.jsx        # Janela de chat
│   │   ├── MessageBubble.jsx     # Bolhas de mensagem
│   │   ├── MessageInput.jsx      # Input de mensagens
│   │   ├── HistoryPanel.jsx      # Painel de histórico
│   │   ├── Header.jsx            # Cabeçalho
│   │   └── ErrorBoundary.jsx     # Tratamento de erros
│   ├── pages/
│   │   ├── ChatPage.jsx          # Página principal
│   │   └── LoginPage.jsx         # Página de login
│   ├── hooks/
│   │   ├── useChat.js            # Hook do chat
│   │   └── useHistory.js         # Hook do histórico
│   ├── context/
│   │   ├── AuthContext.jsx       # Contexto de autenticação
│   │   └── ThemeContext.jsx      # Contexto de tema
│   ├── services/
│   │   └── api.js                # Cliente HTTP
│   └── utils/
│       └── memoryManager.js      # Gerenciador de memória local
└── styles/
    └── index.css                 # Estilos globais
```

---

## 🔧 Scripts Disponíveis

### Backend

```bash
npm run dev      # Inicia em modo desenvolvimento
npm run build    # Build para produção
npm start        # Executa a build de produção
```

### Frontend

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build de produção
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Sabrina** - [@Sabs-17](https://github.com/Sabs-17)

---

## 📚 Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, Google Gemini API
- **Frontend**: React, Vite, TailwindCSS, Axios
- **Versionamento**: Git & GitHub

---

## 🙏 Agradecimentos

- Google AI Studio pela API Gemini
- Comunidade de código aberto

---

<div align="center">

Made with ❤️ by [Sabrina](https://github.com/Sabs-17)

</div>
