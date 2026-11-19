# Método e evidências — Autopack Service

## 1. Definição

O enunciado foi convertido em `design.md` antes da criação visual. A especificação definiu público adulto, assistência técnica industrial, seis telas, perfis de administrador/técnico, requisitos RF01–RF12, paleta, tipografia, espaçamentos e armazenamento local. Isso delimitou o escopo e reduziu ambiguidades nos prompts.

## 2. Layout com IA e MCP

Ferramentas efetivamente utilizadas: ChatGPT para especificação e implementação, integração MCP do Figma para criação/inspeção do layout, ferramentas locais de edição e terminal para gerar e validar o código, navegador para validação da interface. O VS Code é a etapa de abertura e execução no computador do aluno; não foi operado remotamente nesta conversa.

O Figma foi organizado nas páginas **00 Foundations**, **01 Components** e **02 Screens**. Foram criadas variáveis de cores, espaçamentos e raios, estilos de texto e componentes. As telas usam Auto Layout e instâncias reutilizáveis. O primeiro painel serviu de referência para as telas derivadas.

Durante o trabalho houve limite de chamadas do plano Starter e troca para a conexão da conta estudantil. Mesmo após a troca, a integração reportou os times como Starter. Isso deve ser descrito como limitação observada, sem afirmar que o plano Education foi confirmado.

## 3. Leitura do layout para implementação

A implementação consultou os frames pelo MCP, usando `get_design_context`, com captura do painel para comparação visual. O contexto retornou estrutura React/Tailwind, estilos e tokens; o código foi adaptado para componentes interativos, HTML semântico e regras em uma camada separada.

| Elemento | Frame no Figma | Código principal |
| --- | --- | --- |
| Painel | 5:2 | src/pages/Dashboard.tsx |
| Login | 15:621 | src/pages/Login.tsx |
| Chamados | 15:39 | src/pages/Tickets.tsx |
| Detalhes | 15:480 | src/pages/TicketDetails.tsx |
| Clientes | 15:197 | src/pages/Clients.tsx |
| Usuários | 15:349 | src/pages/Users.tsx |
| Novo chamado preenchido | 18:298 | src/components/TicketForm.tsx |

Arquivo: https://www.figma.com/design/63yORIr1vHmwOUgA0KFrHa

Nenhuma captura do layout foi inserida como imagem na aplicação. Não há imagens de conteúdo no design: a marca é tipográfica, o avatar usa iniciais e o gráfico é composto por elementos de interface. A fonte Inter está incluída como dependência local.

## 4. Prompt de implementação

O prompt de implementação da seção 9 do `design.md` orientou a transformação: ler a especificação, consultar o Figma pelo MCP, implementar React/TypeScript/Vite/Tailwind, separar regras dos componentes, persistir em localStorage e validar o fluxo completo. O pedido de avançar para a próxima etapa autorizou a execução desse plano.

Mudanças necessárias entre layout e código: os campos desenhados viraram inputs/selects reais; os botões ganharam ações; indicadores passaram a ser calculados; perfis passaram a filtrar as rotas e os dados; tabelas ganharam comportamento responsivo; o menu do usuário recebeu a saída da sessão; a restauração recebeu confirmação.

## 5. Evidências para reunir no computador

1. Abrir `design.md` e mostrar os requisitos definidos antes do layout.
2. Mostrar no Figma um card com Auto Layout e um preenchimento ligado a variável.
3. Mostrar os componentes e as seis telas.
4. Mostrar esta conversa com a consulta do layout pelo MCP.
5. Abrir a pasta do projeto no VS Code e explicar `pages`, `components` e `repositories`.
6. Executar `npm test` e `npm run build`.
7. Demonstrar o roteiro do README no navegador.

## 6. Como apresentar

Começar pelo problema: solicitações dispersas dificultam priorização e histórico. Depois mostrar o contexto fornecido à IA, a criação do Figma via MCP e a leitura desse layout para gerar o projeto local. Demonstrar um chamado do cadastro à conclusão, trocar o perfil para técnico e recarregar a página para comprovar persistência. Encerrar com limites reais e evolução possível para API e banco de dados.

Não declarar autenticação segura ou banco de dados: esta versão é um protótipo local. Não inventar tempo economizado: registrar seu próprio tempo de uso e apresentação caso queira comparar.
