# CAPA

**Instituição:** [Preencher com o nome da instituição]  
**Curso:** [Preencher com o nome do curso]  
**Título do projeto:** **AngoStart - Plataforma Inteligente de Validação e Desenvolvimento de Negócios em Angola**  
**Autor:** [Preencher com o nome do autor]  
**Orientador:** [Preencher com o nome do orientador]  
**Ano:** 2026

---

# RESUMO

O presente Trabalho de Fim de Curso apresenta o desenvolvimento da plataforma AngoStart, concebida para apoiar a validação, estruturação e crescimento de ideias de negócio no contexto angolano. O projeto foi implementado com arquitetura cliente-servidor, utilizando API REST no backend, interface web responsiva no frontend e base de dados relacional para persistência de dados críticos.

O objetivo principal consiste em disponibilizar uma solução digital que permita ao empreendedor registrar ideias, obter questionários dinâmicos, realizar análise de viabilidade assistida por inteligência artificial, acompanhar requisitos legais em Angola e interagir com funcionalidades de gestão por perfil (empreendedor, mentor, investidor e administrador).

Do ponto de vista tecnológico, o sistema utiliza React + Vite no frontend e Node.js + Express no backend, com MySQL como sistema de gestão de base de dados. A segurança baseia-se em autenticação JWT, controle de acesso por papéis (RBAC), validação de dados com Zod, e middleware de proteção por plano de assinatura. Também estão presentes integração de geolocalização (Google Maps por embed), módulo de relatórios e exportação PDF.

Os resultados esperados incluem: aumento da capacidade de validação de ideias em fases iniciais, melhoria da tomada de decisão para empreendedores angolanos, redução de erros de estruturação legal e fortalecimento do ecossistema nacional de inovação por meio de uma plataforma SaaS modular e escalável.

## PALAVRAS-CHAVE

Empreendedorismo digital; SaaS; API REST; Inteligência Artificial; Viabilidade de negócios; Angola; JWT; MySQL.

---

# ABSTRACT

This Final Course Project presents the development of AngoStart, a digital platform designed to support business idea validation, structuring, and growth in the Angolan context. The solution follows a client-server architecture, combining a REST API backend, a responsive web frontend, and a relational database for persistent data management.

The main objective is to provide a practical digital environment where entrepreneurs can register business ideas, generate dynamic questionnaires, obtain AI-assisted viability analysis, follow legal guidance for Angola, and use role-based features (entrepreneur, mentor, investor, and administrator).

From a technical perspective, the platform uses React + Vite on the frontend and Node.js + Express on the backend, with MySQL as the database management system. Security is enforced through JWT authentication, role-based access control (RBAC), Zod-based data validation, and subscription-based feature gating middleware. The project also includes geolocation support (Google Maps embed), reporting capabilities, and PDF export.

Expected outcomes include better early-stage business validation, improved decision-making for Angolan entrepreneurs, fewer legal structuring mistakes, and a stronger local innovation ecosystem supported by a modular and scalable SaaS platform.

---

# ÍNDICE

1. Capítulo 1 - Introdução  
2. Capítulo 2 - Fundamentação Teórica  
3. Capítulo 3 - Metodologia  
4. Capítulo 4 - Desenvolvimento do Sistema  
5. Capítulo 5 - Resultados  
6. Capítulo 6 - Conclusão  
7. Referências Bibliográficas  
8. Anexos

---

# CAPÍTULO 1 - INTRODUÇÃO

## 1.1 Contextualização

O empreendedorismo angolano enfrenta desafios estruturais relacionados à validação de ideias, acesso a orientação técnica, análise de mercado e conformidade legal. Muitos empreendedores iniciam negócios sem instrumentos de diagnóstico e sem métricas confiáveis de viabilidade.

Neste contexto, surge a AngoStart como plataforma digital orientada a dados para reduzir incerteza em fases iniciais de negócios, fornecendo um fluxo integrado de submissão de ideias, análise inteligente e acompanhamento de desenvolvimento.

## 1.2 Problema de pesquisa

Como desenvolver uma plataforma tecnológica, adaptada ao contexto angolano, capaz de apoiar de forma prática e estruturada a validação de ideias de negócio, com segurança, escalabilidade e governança por perfis de utilizador?

## 1.3 Justificativa

O projeto justifica-se por três razões centrais:

- Necessidade de instrumentos digitais para decisão empreendedora baseada em evidências;
- Carência de plataformas locais com foco simultâneo em validação, legalização e acompanhamento estratégico;
- Potencial de impacto socioeconómico no fortalecimento de micro e pequenas iniciativas empresariais em Angola.

## 1.4 Objetivos

### Objetivo geral

Desenvolver uma plataforma inteligente (AngoStart) para validação e desenvolvimento de negócios em Angola, com base em arquitetura SaaS modular, análise assistida por IA e gestão por perfis.

### Objetivos específicos

- Implementar autenticação segura com JWT e controle por papéis;
- Permitir submissão estruturada de ideias com localização;
- Gerar questionários dinâmicos orientados ao contexto da ideia;
- Executar análise de viabilidade com pontuação e recomendações;
- Disponibilizar módulos de orientação legal e checklist estratégico;
- Implementar sistema de planos (free/pro/premium) com bloqueio por feature;
- Disponibilizar gestão administrativa de utilizadores, perfis e relatórios.

---

# CAPÍTULO 2 - FUNDAMENTAÇÃO TEÓRICA

## 2.1 Empreendedorismo digital

Empreendedorismo digital refere-se à criação e escalabilidade de negócios com apoio intensivo de tecnologias de informação. Em contextos emergentes, como Angola, plataformas digitais reduzem barreiras de entrada, aceleram validação de hipóteses e facilitam o acesso a mentoria e investimento.

## 2.2 Plataformas SaaS

Software as a Service (SaaS) é um modelo de entrega de software por assinatura, com acesso via web, manutenção centralizada e atualização contínua. As vantagens incluem menor custo inicial para utilizadores, gestão simplificada e alta capacidade de evolução incremental por módulos.

## 2.3 API REST

APIs REST estruturam comunicação entre cliente e servidor por recursos e métodos HTTP (GET, POST, PATCH, PUT). No AngoStart, esse padrão permite desacoplamento entre frontend e backend, facilitando integração, manutenção e futura expansão para aplicações móveis.

## 2.4 Inteligência artificial aplicada a negócios

A IA aplicada a negócios permite transformar dados desestruturados em recomendações práticas. No projeto, o motor de viabilidade utiliza regras e pontuação para classificar ideias em viável/inviável, além de identificar pontos fortes, pontos fracos e ajustes estratégicos.

## 2.5 Sistemas de informação

Um sistema de informação integra pessoas, processos, dados e tecnologia para apoiar decisões. O AngoStart materializa este conceito ao combinar autenticação, workflows de submissão, processamento analítico, persistência e visualização de resultados.

## 2.6 WebSockets

WebSockets suportam comunicação bidirecional em tempo real (chat, notificações e chamadas). Embora conste como componente de arquitetura-alvo do projeto, a implementação operacional de comunicação em tempo real encontra-se em estágio de evolução, não sendo a versão corrente o estado final previsto.

## 2.7 Sistemas de recomendação

Sistemas de recomendação sugerem ações com base em perfis e dados contextuais. Na AngoStart, esse conceito aparece em módulos de checklist estratégico, orientação legal e recomendações de melhoria da viabilidade da ideia.

---

# CAPÍTULO 3 - METODOLOGIA

## 3.1 Tipo de pesquisa

A pesquisa é aplicada, de abordagem mista (qualitativa-quantitativa), com natureza tecnológica e caráter de desenvolvimento experimental de software.

## 3.2 Ferramentas utilizadas

- **Frontend:** React 19, Vite, CSS;
- **Backend:** Node.js, Express;
- **Base de dados:** MySQL;
- **Segurança:** JWT, bcryptjs, helmet, CORS;
- **Validação:** Zod;
- **Relatórios:** jsPDF, jspdf-autotable;
- **Versionamento:** Git (repositório local).

## 3.3 Processo de desenvolvimento

O desenvolvimento seguiu abordagem modular por fases:

1. Base de autenticação e perfis;
2. Cadastro e gestão de ideias;
3. Questionário dinâmico;
4. Análise de viabilidade;
5. Estratégia e legalização;
6. Marketplace e assinaturas;
7. Administração e relatórios.

## 3.4 Arquitetura do sistema

A arquitetura adota modelo em camadas:

- **Apresentação (Frontend):** páginas e componentes React;
- **Aplicação (Backend):** rotas, controladores e serviços;
- **Dados (Persistência):** modelos SQL e acesso via `mysql2/promise`.

O backend centraliza regras de negócio e segurança, enquanto o frontend consome APIs autenticadas por token.

---

# CAPÍTULO 4 - DESENVOLVIMENTO DO SISTEMA

## 4.1 Estrutura do backend (API REST)

O backend está organizado em `routes`, `controllers`, `services`, `models`, `middlewares`, `config` e `utils`, com separação clara de responsabilidades.

### 4.1.1 Rotas principais implementadas

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/switch-role`
- `PATCH /api/v1/auth/profile`

- `POST /api/v1/ideas`
- `GET /api/v1/ideas/mine`
- `GET /api/v1/ideas/marketplace`
- `GET /api/v1/ideas/:id`
- `PATCH /api/v1/ideas/:id/status`

- `POST /api/v1/questionnaire/generate`
- `POST /api/v1/questionnaire/:sessionId/answers`
- `GET /api/v1/questionnaire/:sessionId`

- `POST /api/v1/analysis/viability`

- `GET /api/v1/legal/flow`
- `GET /api/v1/legal/progress`
- `POST /api/v1/legal/progress`
- `POST /api/v1/legal/company-guide`
- `GET /api/v1/legal/company-guide/latest`

- `GET /api/v1/strategy/checklist`
- `GET /api/v1/strategy/progress`
- `POST /api/v1/strategy/progress`

- `GET /api/v1/subscription/plans`
- `GET /api/v1/subscription/current`
- `POST /api/v1/subscription/change`

- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:id/verification`
- `GET /api/v1/admin/investors`
- `GET /api/v1/admin/investors/:id`
- `GET /api/v1/admin/reports/performance`

### 4.1.2 Segurança e controle de acesso

- Autenticação por JWT;
- Middleware `requireAuth`;
- RBAC por `requireRole`;
- Controle por plano em `requirePlanFeature` (free/pro/premium);
- Validação de payload com Zod;
- Hash de palavra-passe com bcrypt.

## 4.2 Estrutura do frontend

O frontend está concentrado em páginas React, com destaque para `Dashboards.jsx`, que implementa múltiplos módulos por perfil de utilizador. A comunicação com o backend é feita por serviços em `src/services/*.js`, com cliente HTTP padronizado e tratamento de erros.

### 4.2.1 Funcionalidades de interface relevantes

- Fluxo multi-etapas de submissão de ideia;
- Módulo de perguntas dinâmicas;
- Resultado de viabilidade com score e recomendações;
- Gestão de usuários e verificações no painel admin;
- Relatórios com filtro por mês e exportação PDF;
- Suporte a tema e responsividade para dispositivos móveis.

## 4.3 Integração com Google Maps

A integração atual utiliza mapa incorporado por `iframe` com query dinâmica baseada em cidade/região/endereço, além de captura opcional de latitude/longitude por geolocalização do navegador. A funcionalidade apoia análise contextual da ideia por localização.

## 4.4 Sistema de análise de viabilidade

O motor de viabilidade está implementado no backend e calcula:

- status (`viavel` ou `inviavel`);
- score (0 a 100);
- pontos fortes;
- pontos fracos;
- ajustes recomendados;
- resumo textual.

A lógica considera problema, diferencial, público-alvo, capital inicial, localização e completude das respostas do questionário. O resultado é persistido na tabela `viability_reports`.

## 4.5 Sistema de assinaturas

O módulo de assinatura define catálogo local com três planos:

- **Free:** recursos básicos;
- **Pro:** questionário dinâmico, análise de viabilidade e checklist estratégico;
- **Premium:** recursos do Pro + orientação legal avançada.

O controle de acesso por feature está operacional no backend via middleware.

## 4.6 Chat e videochamadas

No estado atual do código analisado:

- Há elementos de interface relacionados à comunicação entre perfis;
- Não há implementação backend operacional de WebSocket/Socket.IO ativa para chat em tempo real;
- Não há módulo funcional de videochamadas em produção no estado corrente do projeto.

Portanto, esta parte permanece como componente de evolução futura.

## 4.7 Integração de APIs externas

### 4.7.1 Integrações efetivas no estado atual

- Google Maps (embed e contexto geográfico);
- Exportação PDF local (bibliotecas JS no frontend).

### 4.7.2 Integrações previstas na arquitetura, mas não concluídas operacionalmente

- Stripe (pagamentos reais);
- Resend (e-mail transacional);
- Alibaba Cloud ID Verification (KYC automatizado);
- Documentero (automação documental);
- WebSockets para chat/chamadas.

---

# CAPÍTULO 5 - RESULTADOS

## 5.1 Funcionalidades implementadas

Com base no código-fonte analisado, destacam-se como implementadas:

- Autenticação e autorização por papéis;
- Cadastro de usuários multi-perfil com atualização de perfil;
- Submissão e gestão de ideias;
- Questionário dinâmico contextual;
- Análise de viabilidade com persistência em base de dados;
- Módulo de legalização e checklist estratégico;
- Marketplace de ideias;
- Gestão de assinaturas por plano;
- Painel administrativo com verificação de perfis;
- Relatórios de performance com exportação em PDF.

## 5.2 Benefícios para empreendedores angolanos

- Melhoria na qualidade de decisão antes de investir capital;
- Maior clareza sobre riscos e prioridades do negócio;
- Apoio estruturado para formalização legal;
- Acesso a ambiente único para validação, acompanhamento e visibilidade de ideias;
- Potencial de conexão com mentores e investidores em ambiente controlado.

---

# CAPÍTULO 6 - CONCLUSÃO

## 6.1 Contribuições do projeto

O projeto AngoStart apresenta contribuição prática e acadêmica ao propor um sistema de informação orientado ao ecossistema empreendedor angolano, com arquitetura modular, base de dados robusta e mecanismos de apoio à decisão por análise inteligente.

Do ponto de vista de engenharia de software, o projeto demonstra:

- separação em camadas;
- segurança por token e perfis;
- expansão incremental por módulos;
- base para escalabilidade funcional.

## 6.2 Limitações

- Forte concentração de lógica de interface em um único arquivo de dashboard (alto acoplamento frontend);
- Ausência operacional de módulos de comunicação em tempo real (chat/voz/vídeo);
- Integrações externas estratégicas ainda em estado parcial (Stripe, Resend, KYC, Documentero);
- Necessidade de maior cobertura de testes automatizados.

## 6.3 Trabalhos futuros

- Implementar microserviço ou módulo dedicado para comunicação em tempo real (WebSocket/Socket.IO);
- Integrar gateway de pagamento real com webhooks e reconciliação;
- Implementar pipeline de KYC automatizado;
- Modularizar frontend em componentes e páginas com menor acoplamento;
- Adicionar testes unitários, integração e ponta-a-ponta;
- Criar observabilidade com logs estruturados, métricas e tracing;
- Evoluir motor de IA para abordagem híbrida (regras + modelos estatísticos/ML).

---

# REFERÊNCIAS BIBLIOGRÁFICAS

PRESSMAN, R. S.; MAXIM, B. R. *Engenharia de Software: Uma Abordagem Profissional*. 8. ed. Porto Alegre: AMGH, 2016.  

SOMMERVILLE, I. *Software Engineering*. 10th ed. Boston: Pearson, 2016.  

FIELDING, R. T. *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral Dissertation, University of California, Irvine, 2000.  

NEWMAN, S. *Building Microservices*. 2nd ed. Sebastopol: O'Reilly Media, 2021.  

RICHARDSON, C. *Microservices Patterns*. Shelter Island: Manning, 2018.  

NIELSEN, J. *Usability Engineering*. San Diego: Morgan Kaufmann, 1994.  

MARTIN, R. C. *Clean Architecture*. Boston: Prentice Hall, 2017.  

Documentação oficial:

- Node.js. Disponível em: <https://nodejs.org/>.  
- Express.js. Disponível em: <https://expressjs.com/>.  
- React. Disponível em: <https://react.dev/>.  
- Vite. Disponível em: <https://vitejs.dev/>.  
- MySQL. Disponível em: <https://www.mysql.com/>.  
- JSON Web Token (JWT). Disponível em: <https://jwt.io/>.  

---

# ANEXOS

## ANEXO A - Estrutura da base de dados (resumo)

Base principal: `angostartbd`.

Tabelas nucleares:

- `users`
- `user_subscriptions`
- `ideas`
- `questionnaire_sessions`
- `questionnaire_answers`
- `viability_reports`
- `legal_checklist_progress`
- `legal_company_guides`
- `strategic_checklist_progress`
- `empreendedor_profiles`
- `mentor_profiles`
- `investidor_profiles`

Relacionamentos críticos:

- `ideas.created_by -> users.id`
- `user_subscriptions.user_id -> users.id`
- `questionnaire_sessions.user_id -> users.id`
- `questionnaire_sessions.idea_id -> ideas.id`
- `questionnaire_answers.session_id -> questionnaire_sessions.id`
- `viability_reports.idea_id -> ideas.id`
- `viability_reports.session_id -> questionnaire_sessions.id`

## ANEXO B - Estrutura de pastas do projeto (visão geral)

```text
angostart/
|-- src/
|   |-- Pages/
|   |   |-- Dashboards.jsx
|   |   |-- HomePage.jsx
|   |   `-- CriarContaPage.jsx
|   |-- components/
|   |-- services/
|   |-- style/
|   |-- App.jsx
|   `-- main.jsx
|-- server/
|   |-- sql/
|   |   `-- schema.sql
|   `-- src/
|       |-- config/
|       |-- controllers/
|       |-- middlewares/
|       |-- models/
|       |-- routes/
|       |-- services/
|       |-- app.js
|       `-- server.js
|-- package.json
`-- RELATORIO_TFC_ANGOSTART.md
```

## ANEXO C - Fluxos de funcionamento (resumo)

### Fluxo 1: Registro e autenticação

1. Utilizador registra conta (`/auth/register`);
2. Sistema valida dados e cria perfil por role;
3. Login emite JWT (`/auth/login`);
4. Frontend persiste token e carrega dashboard.

### Fluxo 2: Submissão de ideia e análise

1. Empreendedor preenche formulário por fases;
2. Frontend envia ideia (`/ideas`);
3. Sistema gera questionário dinâmico (`/questionnaire/generate`);
4. Respostas são guardadas (`/questionnaire/:id/answers`);
5. Motor de viabilidade processa dados (`/analysis/viability`);
6. Resultado é exibido no dashboard e persistido.

### Fluxo 3: Governança por assinatura

1. Utilizador consulta plano atual (`/subscription/current`);
2. Ao aceder recurso premium, middleware valida feature;
3. Se permitido, rota executa normalmente;
4. Se bloqueado, API retorna erro de autorização por plano.

### Fluxo 4: Administração

1. Admin consulta utilizadores e perfis (`/admin/users`);
2. Admin aprova/rejeita verificação (`/admin/users/:id/verification`);
3. Dashboard atualiza métricas e relatórios (`/admin/reports/performance`).

---

**Nota metodológica:** Este relatório foi elaborado com base na análise técnica do código-fonte disponível no projeto AngoStart, refletindo o estado funcional observado no momento da avaliação.
