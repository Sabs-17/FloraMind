# 🌿 FloraMind

<div align="center">

![Node](https://img.shields.io/badge/node-v18%2B-green)
![React](https://img.shields.io/badge/React-18%2B-blue)

Um chatbot inteligente e interativo focado em botânica e cuidados com plantas, desenvolvido com tecnologias modernas de IA e web.


</div>

---

## 📋 Sobre o Projeto

**FloraMind** é um assistente de IA especializado em botânica, desenvolvido como projeto para a disciplina de **IA Aplicada ao Desenvolvimento**. O chatbot oferece uma experiência interativa onde usuários podem fazer perguntas sobre plantas, receber recomendações personalizadas e aprender sobre cuidados e cultivo de plantas.

### ✨ Principais Características

- 🤖 **Chatbot Inteligente** - Powered by  Groq API
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
- **Chave da API Groq** - [Obtenha aqui](https://console.groq.com/)
- 
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

# Edite .env e adicione sua chave da API Groq
# GROQ_KEY=sua_chave_aqui

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
2. Faça login 
3. Comece a conversar sobre plantas!

### Exemplos de Perguntas

- "Como cuidar de uma planta suculenta?"
- "Qual planta é melhor para interiores com pouca luz?"
- "Minha planta está com folhas amarelas, o que faço?"
- "Compartilhe imagem de uma planta para identificar"

</div>
