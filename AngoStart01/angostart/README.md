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

---

## ⚖️ Módulo 6 - Orientação Legal Angola + AGT

Endpoints disponíveis:

- `GET /api/v1/legal/flow?track=empresa_angola|agt_regularizacao|propriedade_intelectual`
  - Retorna etapas legais por trilha.
- `GET /api/v1/legal/progress` (auth)
  - Retorna progresso do checklist legal do usuário.
- `POST /api/v1/legal/progress` (auth)
  - Atualiza etapa do checklist legal.

---

## ✅ Módulo 7 - Checklist Estratégico Automático

Endpoints disponíveis:

- `GET /api/v1/strategy/checklist?track=validacao|operacao|crescimento`
  - Gera checklist estratégico automático por trilha, com prioridade e justificativa.
- `GET /api/v1/strategy/progress` (auth)
  - Retorna progresso do checklist estratégico do usuário.
- `POST /api/v1/strategy/progress` (auth)
  - Atualiza etapa do checklist estratégico.

---

## 🏛 Módulo 8 - Orientação para Abertura de Empresa (Angola)

Endpoints disponíveis:

- `POST /api/v1/legal/company-guide` (auth)
  - Gera recomendação legal de tipo societário (ENI/LDA/SA), custo, prazo e documentação.
- `GET /api/v1/legal/company-guide/latest` (auth)
  - Retorna a última orientação legal gerada pelo usuário.

---

## 🛒 Módulo 11 - Marketplace de Ideias

Endpoints disponíveis:

- `GET /api/v1/ideas/marketplace`
  - Lista ideias publicadas/submetidas para vitrine do marketplace com score de viabilidade mais recente.
- `GET /api/v1/ideas/mine` (auth)
  - Lista ideias do empreendedor autenticado.
- `PATCH /api/v1/ideas/:id/status` (auth empreendedor/admin)
  - Publica/retira ideia do marketplace via status (`active`, `submitted`, `archived`).

---

## 💳 Módulo 12 - Assinaturas e Controle por Plano

Endpoints disponíveis:

- `GET /api/v1/subscription/plans`
  - Lista catálogo de planos (`free`, `pro`, `premium`) e recursos.
- `GET /api/v1/subscription/current` (auth)
  - Retorna assinatura/plano atual do usuário.
- `POST /api/v1/subscription/change` (auth)
  - Altera plano atual do usuário (simulação local, pronto para Stripe).

Controle por plano aplicado:

- `dynamic_questionnaire` (Pro+)
- `viability_analysis` (Pro+)
- `strategy_checklist` (Pro+)
- `legal_company_guide` (Premium)
