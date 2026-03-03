# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# AngoStart

Plataforma inteligente de validação, crescimento e estruturação de negócios em Angola.

A AngoStart ajuda empreendedores a validar ideias de negócio com base na sua localização, mercado e legislação angolana, utilizando análise de IA, mapas, questionários dinâmicos e dados estratégicos.

---

## 🎯 Objetivo Principal

Permitir que empreendedores:

- Cadastrem suas ideias de negócio
- Descubram se são viáveis na sua localização
- Recebam análise estratégica automatizada por IA
- Tenham acompanhamento contínuo
- Estruturem suas empresas legalmente em Angola
- Conectem-se com mentores e investidores
- Vendam ou publiquem ideias no marketplace
- Tenham acesso a planos pagos via assinatura

---

## 🏗 Arquitetura

### Backend
- API REST
- MySQL
- JWT Authentication
- Stripe (Assinaturas)
- Resend (E-mails)
- Alibaba Cloud ID Verification (KYC)
- Documentero (Geração de documentos)
- WebSockets

### Frontend
- React + Vite
- Chart.js
- Socket.IO
- Google Maps API

---

## 👥 Perfis

- Administrador
- Empreendedor
- Mentor
- Investidor

---

## 🚀 Funcionalidades

### 💡 Validação de Ideias com IA
- Empreendedor informa:
  - Localização atual
  - Local onde deseja empreender
- Integração com Google Maps
- Questionário dinâmico gerado por IA
- Análise automática:
  - Viável ou inviável
  - Pontos fortes
  - Pontos fracos
  - Ajustes necessários
  - Sugestões estratégicas

### 📊 Acompanhamento do Negócio
- Atualização periódica do status do negócio
- Checklist automático de crescimento
- Recomendações estratégicas
- Alertas de riscos

### 🛡 Proteção da Ideia
- Orientação para:
  - Proteção de propriedade intelectual
  - Registro de marca
  - Estruturação legal
- Geração automática de contratos

### 🏛 Legalização em Angola
- Passo a passo de:
  - Constituição de empresa
  - Estrutura societária
  - Registros necessários
  - Procedimentos junto à AGT

### 💳 Assinaturas & Carteira Digital
- Plano gratuito
- Planos premium
- Integração Stripe
- Controle de acesso por plano

### 💬 Comunicação
- Chat em tempo real
- Chamadas de voz
- Videochamadas

### 📈 Gráficos
- Crescimento
- Receita
- Métricas de desempenho

---

## 🔐 Segurança

- JWT
- Controle por roles
- Proteção contra SQL Injection
- Validação de dados

---

## 🧠 Módulo 4 - Questionário Dinâmico (IA)

Endpoints disponíveis:

- `POST /api/v1/questionnaire/generate`
  - Gera sessão e perguntas dinâmicas com base no contexto da ideia.
- `POST /api/v1/questionnaire/:sessionId/answers`
  - Salva respostas do questionário.
- `GET /api/v1/questionnaire/:sessionId`
  - Retorna sessão, perguntas e respostas já salvas.
