# RESPOSTAS TÉCNICAS PARA DEFESA - ANGOSTART

Este documento reúne respostas detalhadas para perguntas técnicas que podem surgir durante a defesa do projeto AngoStart. O objetivo é fornecer uma narrativa sólida, técnica e estratégica sobre as decisões de arquitetura, segurança, escalabilidade e manutenção do sistema.

---

## 1) Arquitetura do Sistema

### 1.1 Qual é a arquitetura do sistema e como as diferentes partes se comunicam?

A AngoStart foi desenhada com arquitetura cliente-servidor, organizada em camadas lógicas para facilitar manutenção, segurança e evolução. No frontend, usamos React com Vite para construir uma interface SPA (Single Page Application) responsiva e modular. No backend, usamos Node.js com Express para expor uma API REST responsável por regras de negócio, autenticação, autorização e integração com serviços externos. A persistência é feita em MySQL, com modelo relacional.

A comunicação entre frontend e backend ocorre por HTTP/HTTPS através de endpoints REST. O frontend envia requisições usando métodos como GET, POST, PUT/PATCH e DELETE, transportando token JWT no cabeçalho `Authorization` quando o recurso exige autenticação. O backend valida esse token em middleware, resolve permissões por papel (RBAC), executa regras e retorna JSON padronizado para a interface renderizar. Isso mantém o frontend desacoplado da lógica crítica e torna possível, no futuro, adicionar um cliente mobile reaproveitando a mesma API.

Também há separação por responsabilidades no backend: rotas recebem a requisição, controladores coordenam o fluxo e serviços executam regras de negócio mais complexas. Essa divisão reduz acoplamento, facilita testes e permite escalar partes específicas sem reescrever o sistema completo.

### 1.2 Como você decidiu usar Node.js e React para este projeto?

A escolha foi orientada por critérios técnicos e contextuais:

1. **Produtividade e ecossistema:** React e Node.js têm enorme ecossistema de bibliotecas, o que acelera entrega de funcionalidades (autenticação, validação, relatórios, integração com IA e dashboards).
2. **Unificação de linguagem:** usar JavaScript/TypeScript no frontend e backend reduz fricção entre camadas, melhora onboarding e simplifica manutenção.
3. **Modelo assíncrono do Node.js:** adequado para APIs com muitas operações de I/O (base de dados, chamadas externas e autenticação), permitindo boa performance em cargas concorrentes.
4. **Componentização no React:** facilita construir interfaces por domínio (ideias, questionário, análise, legalização, administração), com reutilização e evolução incremental.
5. **Aderência ao objetivo do projeto:** por ser uma plataforma SaaS em evolução, era importante priorizar stack flexível, com curva de desenvolvimento rápida e excelente suporte comunitário.

---

## 2) Banco de Dados

### 2.1 Qual é o esquema do banco de dados e como você o projetou?

O banco foi modelado de forma relacional, centrado nas entidades principais da plataforma: utilizadores, papéis/perfis, ideias de negócio, respostas de questionários, análises de viabilidade, planos/assinaturas e dados administrativos. O desenho foi orientado por normalização para evitar redundância desnecessária, mantendo clareza no domínio.

Em termos práticos, a modelagem seguiu estes princípios:

- **Integridade referencial:** chaves primárias e estrangeiras garantem consistência entre usuários, ideias e análises.
- **Rastreabilidade:** campos de auditoria como data de criação/atualização ajudam em governança e suporte.
- **Evolução por módulos:** entidades foram organizadas de modo que novos recursos (ex.: marketplace, novos relatórios, novos níveis de plano) possam ser adicionados com baixo impacto em tabelas existentes.
- **Compatibilidade com regras de negócio:** estrutura pensada para suportar fluxo real do usuário: cadastro -> submissão de ideia -> questionário -> análise -> recomendações -> acompanhamento.

### 2.2 Como você lidou com a escalabilidade e a segurança do banco de dados?

Para escalabilidade, o projeto foi preparado com:

- **Índices em campos críticos** (como chaves de relacionamento e campos de busca frequente), reduzindo latência de consultas comuns.
- **Paginação e filtros em endpoints de listagem**, evitando cargas excessivas em consultas amplas.
- **Separação de responsabilidades na API**, permitindo otimização pontual das queries sem alterar o frontend.
- **Planeamento para crescimento horizontal**, com possibilidade de read replicas e cache em cenários de alto tráfego.

Para segurança:

- **Credenciais fora do código**, usando variáveis de ambiente.
- **Princípio do menor privilégio** no acesso ao banco.
- **Validação de entrada no backend** (com esquema de validação), reduzindo risco de payloads maliciosos.
- **Uso de queries parametrizadas**, mitigando SQL Injection.
- **Hash de senhas com bcrypt**, impedindo armazenamento de senha em texto simples.
- **Controle de acesso por token + papel**, para garantir que cada usuário só acesse o que lhe pertence.

---

## 3) Autenticação e Autorização

### 3.1 Como você implementou a autenticação e autorização para os usuários?

A autenticação foi implementada com JWT (JSON Web Token). No login, após validar credenciais (email/username e senha com comparação segura do hash), o backend gera um token assinado com tempo de expiração e metadados do usuário (como id e papel). O frontend armazena esse token e o envia em cada requisição protegida.

A autorização foi implementada com RBAC (Role-Based Access Control). Além de validar se o token é válido, middlewares verificam o papel do usuário (por exemplo: empreendedor, mentor, investidor, administrador) e o plano de assinatura quando necessário. Assim, o sistema controla acesso por função e por nível de subscrição, evitando exposição indevida de funcionalidades premium.

### 3.2 Qual é o fluxo de autenticação e como você protege as rotas?

O fluxo segue etapas claras:

1. Usuário registra conta ou faz login.
2. Backend valida dados e credenciais.
3. Token JWT é emitido e devolvido ao cliente.
4. Frontend inclui o token no cabeçalho de requisições protegidas.
5. Middleware valida assinatura e expiração do token.
6. Middleware de autorização valida permissões por papel/plano.
7. Apenas então a lógica da rota é executada.

A proteção de rotas ocorre em duas camadas:

- **Frontend:** guardas de navegação ocultam páginas sem sessão/permissão, melhorando UX.
- **Backend (camada obrigatória):** validação efetiva da segurança, impedindo acesso mesmo que alguém tente chamar a API manualmente.

Também usamos CORS com whitelist de origens e práticas de hardening para reduzir risco de abuso em produção.

---

## 4) Integração com IA

### 4.1 Como você usou a IA para gerar parte ou todo o código?

A IA foi usada como acelerador de produtividade em tarefas assistidas, não como substituta da engenharia. Ela ajudou principalmente em:

- geração inicial de estruturas repetitivas (boilerplate);
- refinamento de componentes e validações;
- sugestões de organização de código e melhorias de legibilidade;
- apoio na documentação técnica e estruturação de respostas.

Todo código sugerido foi revisto, ajustado e validado manualmente antes de ser integrado. Em áreas críticas (segurança, autenticação, controle de acesso e regras de negócio), as decisões finais foram tomadas por revisão humana com testes locais.

### 4.2 Quais são as limitações da IA e como você as superou?

As principais limitações observadas foram:

1. **Sugestões genéricas sem contexto total do projeto;**
2. **Risco de propor bibliotecas ou padrões inadequados para o domínio;**
3. **Possíveis inconsistências entre camadas (frontend/backend);**
4. **Falta de validação de requisitos específicos de Angola e do negócio.**

Para superar isso, aplicamos um processo de validação:

- revisão crítica de cada sugestão;
- adaptação para padrões do projeto;
- testes de integração e validação funcional;
- foco em segurança e coerência arquitetural;
- documentação do racional técnico para justificar cada decisão.

Ou seja, a IA foi ferramenta de apoio; a responsabilidade técnica e arquitetural permaneceu humana.

---

## 5) Desempenho e Escalabilidade

### 5.1 Como você otimizou o desempenho do aplicativo?

As otimizações foram aplicadas em frontend, backend e banco:

- **Frontend:** componentização, redução de renderizações desnecessárias, organização de estado e carregamento eficiente de páginas.
- **Backend:** middlewares enxutos, tratamento assíncrono adequado, respostas JSON objetivas e separação de regras para evitar processamento redundante.
- **Banco de dados:** consultas otimizadas, índices em campos estratégicos e uso de paginação.
- **Rede/infra:** configuração de CORS, ambiente de produção dedicado e estrutura pronta para cache onde necessário.

Também priorizamos medição prática: identificar endpoints mais usados, observar tempo de resposta e ajustar as rotas críticas primeiro.

### 5.2 Como você planeja escalar o aplicativo para lidar com um grande número de usuários?

O plano de escalabilidade combina estratégia técnica e operacional:

1. **Escala horizontal da API**, com múltiplas instâncias atrás de balanceador.
2. **Cache para dados de leitura frequente** (ex.: sessões e consultas recorrentes).
3. **Filas para tarefas pesadas** (relatórios extensos, processamento assíncrono e integrações externas).
4. **Banco com replicação/leitura distribuída** conforme crescimento.
5. **Observabilidade** (logs, métricas, alertas) para agir antes de degradação.
6. **CD/CI com deploy contínuo controlado**, reduzindo risco de downtime.

Essa abordagem permite crescimento progressivo sem necessidade de reescrever a arquitetura base.

---

## 6) Segurança

### 6.1 Quais são as principais preocupações de segurança para este aplicativo?

As preocupações principais são:

- vazamento de dados pessoais de usuários e ideias de negócio;
- acesso indevido por falhas de autenticação/autorização;
- ataques comuns em aplicações web (SQL Injection, XSS, CSRF, brute force);
- exposição de segredos (chaves e credenciais) em repositório ou logs;
- abuso de endpoints por automação maliciosa.

Como a plataforma trata informação sensível de empreendedores, segurança foi requisito de base e não apenas um complemento.

### 6.2 Como você protege os dados dos usuários e evita ataques comuns?

A proteção é feita em camadas:

- **Autenticação segura:** JWT com expiração e validação de assinatura.
- **Autorização por papel/plano:** RBAC para restringir cada rota.
- **Hash de senha:** bcrypt para armazenamento seguro.
- **Validação de entrada:** bloqueio de payloads inválidos antes da lógica de negócio.
- **Queries parametrizadas:** prevenção de SQL Injection.
- **CORS e headers de segurança:** mitigação de uso indevido entre origens.
- **Segredos em variáveis de ambiente:** sem hardcode de credenciais.
- **Monitoramento e logs:** para detectar comportamento suspeito.

Em produção, o uso de HTTPS e políticas adequadas de deploy complementam essa proteção.

---

## 7) Testes e Depuração

### 7.1 Como você testou e depurou o aplicativo?

O processo combinou testes funcionais e depuração contínua:

- testes manuais orientados por fluxo de negócio (registro, login, criação de ideia, análise e acesso por perfil);
- validação de endpoints com diferentes cenários (sucesso, erro de validação, token inválido e acesso sem permissão);
- inspeção de logs no backend para identificar exceções e gargalos;
- verificação de comportamento no frontend para estados de erro, loading e sessão expirada.

Além disso, cada funcionalidade nova passou por verificação incremental para evitar regressões no fluxo principal da plataforma.

### 7.2 Quais são os principais desafios que você enfrentou e como os superou?

Os principais desafios foram:

1. **Garantir coerência entre regras de frontend e backend:** resolvido centralizando validações críticas no backend.
2. **Conciliar velocidade de entrega com segurança:** resolvido com priorização de controles mínimos obrigatórios desde o início.
3. **Manter o sistema modular com novas funcionalidades:** resolvido com separação por camadas e organização por domínio.
4. **Adaptar sugestões de IA ao contexto real do projeto:** resolvido com revisão humana e testes.

A superação veio da estratégia de desenvolvimento incremental, revisão contínua e foco em fundamentos sólidos (arquitetura, segurança e integridade dos dados).

---

## 8) Implantação e Manutenção

### 8.1 Como você planeja implantar e manter o aplicativo?

O plano de implantação atual usa frontend em GitHub Pages e backend em Railway, com separação de ambientes e variáveis de configuração por ambiente. O fluxo de manutenção inclui versionamento com Git, integração contínua e deploy controlado.

Na operação contínua, a manutenção contempla:

- monitoramento de disponibilidade e erros;
- backup periódico de base de dados;
- rotação segura de segredos e credenciais;
- revisão de dependências para correções de segurança;
- documentação técnica para facilitar suporte e evolução da equipa.

### 8.2 Quais são os planos para atualizações e melhorias futuras?

Os próximos ciclos de melhoria incluem:

1. **Aprimorar motores de recomendação/IA** para análises mais personalizadas.
2. **Evoluir analytics e relatórios** para visão executiva de desempenho dos usuários.
3. **Expandir funcionalidades de colaboração** entre empreendedores, mentores e investidores.
4. **Fortalecer testes automatizados** para aumentar confiabilidade em cada release.
5. **Melhorar observabilidade e SRE básico**, com métricas e alertas mais completos.
6. **Preparar arquitetura para maior escala**, conforme crescimento de adoção.

Assim, a plataforma mantém uma base estável no presente e uma trilha clara de evolução técnica e de produto para o futuro.

---

## Conclusão para Apresentação Oral

Se essas perguntas forem feitas na defesa, a linha de resposta deve mostrar que as decisões não foram aleatórias: cada escolha técnica foi guiada por equilíbrio entre viabilidade de implementação, segurança, escalabilidade e aderência ao problema real do empreendedor angolano. A principal mensagem é que o projeto já entrega valor prático, mantendo base arquitetural robusta para crescer com qualidade.
