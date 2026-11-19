# Autopack Service — Especificação do protótipo

Versão: 1.0 | Autor: Felipe Marconi Gomes de Araujo | Data: 16/11/2026

## 1. Contexto e finalidade

Projeto acadêmico de um sistema web para gestão de chamados de assistência técnica de equipamentos industriais. Resolve a dispersão de solicitações em mensagens e planilhas, permitindo visualizar prioridades, responsáveis e histórico de atendimento. Usar somente empresas, contatos e atendimentos fictícios. O nome identifica a proposta acadêmica e não implica um produto oficial da empresa.

Objetivo da demonstração: entrar no sistema, cadastrar um cliente, abrir um chamado, atribuir um técnico, registrar uma atualização e concluir o atendimento, com atualização automática do painel.

## 2. Público e requisitos de usuário

Público adulto, aproximadamente 18 a 65 anos: profissionais de suporte, técnicos de manutenção e gestores. Conhecimento básico de informática. Interface em português brasileiro, adequada ao uso diário em computador.

| ID | Perfil | Necessidade |
| --- | --- | --- |
| RU01 | Administrador | Cadastrar clientes e usuários e organizar chamados |
| RU02 | Administrador | Visualizar volume e prioridades dos atendimentos |
| RU03 | Técnico | Consultar seus chamados e registrar o trabalho realizado |
| RU04 | Técnico | Alterar o andamento dos atendimentos sob sua responsabilidade |

O cliente é uma entidade cadastrada; não acessa o sistema nesta versão.

## 3. Requisitos funcionais

| ID | Requisito | Critério de aceite |
| --- | --- | --- |
| RF01 | Login demonstrativo com seleção de perfil | Entrar como administrador ou técnico e sair pelo menu do perfil |
| RF02 | Painel com indicadores calculados | Quantidades refletem os chamados visíveis e suas alterações |
| RF03 | Cadastro e edição de clientes | Exigir razão social, contato e e-mail válido; manter dados após recarga |
| RF04 | Abertura de chamados | Exigir cliente ativo, título, equipamento, descrição e prioridade; gerar protocolo único |
| RF05 | Pesquisa e filtros combinados | Pesquisar protocolo, título ou cliente e filtrar por status, prioridade e responsável |
| RF06 | Detalhamento e atribuição | Administrador pode atribuir ou trocar o técnico ativo responsável |
| RF07 | Atualização de status | Seguir as transições definidas e registrar cada mudança no histórico |
| RF08 | Histórico de atendimento | Adicionar observações com autor e data; preservar registros anteriores |
| RF09 | Gestão de usuários | Administrador cadastra, edita e ativa/inativa usuários demonstrativos |
| RF10 | Separação de perfis na interface | Administrador acessa todos os módulos; técnico vê apenas painel e seus chamados |
| RF11 | Persistência local | Cadastros e mudanças continuam disponíveis ao recarregar o mesmo navegador |
| RF12 | Restaurar dados de demonstração | Administrador confirma a restauração e recupera a base fictícia inicial |

## 4. Regras de negócio

- Status: Aberto, Em atendimento, Aguardando peça, Concluído.
- Transições: Aberto → Em atendimento; Em atendimento → Aguardando peça ou Concluído; Aguardando peça → Em atendimento. Concluído encerra o fluxo nesta versão.
- Chamado novo começa Aberto. Para iniciar atendimento, deve ter técnico ativo responsável. Para concluir, exigir uma observação de solução.
- Prioridade: Baixa, Média e Alta. Sempre apresentar texto junto à cor.
- Protocolo: AUT-0001, AUT-0002 e assim por diante, sem reutilizar números já emitidos na base atual.
- E-mail de usuário deve ser único, desconsiderando maiúsculas e espaços nas extremidades.
- Cliente com histórico pode ser inativado; não excluir registros vinculados. Inativos não aparecem nas opções de novos chamados.
- Não permitir inativar o usuário da sessão nem o último administrador ativo. Técnico com chamados não concluídos deve ter esses chamados reatribuídos antes de ser inativado.
- Técnico só consulta e atualiza seus próprios chamados. Administrador acessa todos. São regras demonstrativas do frontend, sem garantia de segurança de servidor.
- Datas e horas em pt-BR; guardar timestamps ISO para ordenação consistente.

## 5. Telas e navegação

| Tela | Conteúdo obrigatório |
| --- | --- |
| Login | Marca tipográfica, descrição curta, escolha de perfil e aviso de ambiente demonstrativo |
| Painel | Quatro indicadores, distribuição por status, chamados recentes e botão Novo chamado para administrador |
| Chamados | Busca, filtros, contagem de resultados, tabela e formulário de criação |
| Detalhes do chamado | Protocolo, cliente, equipamento, prioridade, responsável, status, descrição e histórico cronológico |
| Clientes | Busca, lista, formulário de cadastro/edição e ativação/inativação |
| Usuários | Busca, perfil, situação e formulário de cadastro/edição |

Navegação autenticada: sidebar com Painel, Chamados, Clientes e Usuários, conforme perfil. Cabeçalho com título da página e identificação da sessão. Detalhes acessíveis pelo protocolo da tabela. Formulários em painéis laterais ou modais, com Cancelar e Salvar. Não criar botões sem ação prevista.

Indicadores do painel: Abertos, Em atendimento, Aguardando peça e Concluídos, calculados sobre a base visível ao perfil. Sem percentuais de crescimento ou indicadores inventados. Distribuição por status usa os mesmos dados.

## 6. Direção visual e tokens

Desktop first. Layout principal em frame de 1440 × 1024 px; verificar também 1280 × 800 px. Estética de software de operação industrial: clara, organizada e com tabelas legíveis. A paleta abaixo é proposta para o projeto, não uma reprodução de identidade oficial.

| Token | Valor | Aplicação |
| --- | --- | --- |
| color/primary | #17324D | Sidebar, títulos e elementos de marca |
| color/secondary | #007F78 | Botões principais, links e seleção |
| color/tertiary | #F4B942 | Destaques pontuais |
| color/background | #F4F7FA | Fundo da aplicação |
| color/surface | #FFFFFF | Cards, modais e tabelas |
| color/text | #172B3A | Texto principal |
| color/text-muted | #526477 | Texto secundário |
| color/border | #DCE3EB | Bordas e separadores |
| color/danger | #B42318 | Erros e ações destrutivas |
| color/success | #157347 | Conclusão e confirmação |

Usar texto branco sobre primary e secondary; texto escuro sobre tertiary. Estados de status usam fundos suaves, texto escuro e rótulo explícito. Garantir contraste mínimo de 4,5:1 em texto normal.

Tipografia: Inter, com fallback system-ui, sans-serif.

| Estilo | Tamanho / entrelinha | Peso |
| --- | --- | --- |
| Display de indicador | 32 / 40 px | 700 |
| Título de página | 28 / 36 px | 700 |
| Título de seção | 20 / 28 px | 600 |
| Texto principal | 16 / 24 px | 400 |
| Tabela, botão e campo | 14 / 20 px | 400 ou 600 |
| Legenda | 12 / 16 px | 400 |

Espaçamentos: tokens space/1=4, space/2=8, space/3=12, space/4=16, space/6=24, space/8=32 e space/12=48 px. Padding de página 32 px; padding de card 24 px; distância entre seções 24 px; distância entre rótulo e campo 8 px. Sidebar 240 px; cabeçalho 72 px; campos e botões com altura mínima de 44 px; linha de tabela mínima de 56 px. Raio: 8 px nos controles, 12 px nos cards. Bordas de 1 px e sombras discretas.

Responsividade: abaixo de 1024 px, recolher sidebar e organizar cards em duas colunas; abaixo de 640 px, usar uma coluna, menu em drawer e formulários ocupando a largura disponível. Tabelas podem ter rolagem horizontal em contêiner próprio.

## 7. Figma: estrutura obrigatória

- Páginas: 00 Foundations, 01 Components e 02 Screens.
- Criar variáveis de cores, espaçamentos e raios; aplicar bindings aos elementos. Criar estilos de texto reutilizáveis com os tamanhos definidos.
- Usar Auto Layout em sidebar, cabeçalhos, cards, formulários, tabelas e agrupamentos. Reservar posicionamento absoluto apenas a elementos que realmente precisem dele.
- Componentes reutilizáveis: Button, Input, Select, Badge, SidebarItem, StatCard, TableRow, Modal/Drawer e EmptyState.
- Documentar variantes pertinentes: padrão, hover, foco, desabilitado e erro, conforme o componente.
- Usar Fill container e Hug contents de forma coerente, evitando composição inteira por coordenadas fixas.
- Desenhar as seis telas, um formulário de novo chamado e estados de vazio, validação e sucesso. Usar o mesmo sistema de componentes em todas elas.
- Criar primeiro Foundations e Components e uma tela de Painel para validar o padrão; depois expandir às demais telas.
- Guardar link do arquivo e IDs dos frames para a implementação via MCP.

## 8. Especificações técnicas

- Dispositivo preferencial: notebook ou desktop, teclado e mouse.
- Stack proposta: React, TypeScript, Vite, Tailwind CSS e React Router. Ícones de uma única biblioteca, como Lucide.
- Armazenamento: sem banco de dados nesta versão. Persistência em localStorage, por meio de uma camada repository substituível futuramente por uma API.
- Login e permissões são simulados; não coletar senhas reais. A sessão guarda somente o identificador do usuário demonstrativo.
- Estrutura sugerida: src/components, src/layouts, src/pages, src/types, src/data, src/repositories e src/styles.
- Separar dados, regras e apresentação. Versionar o esquema armazenado e não sobrescrever dados do usuário a cada carregamento.
- Entidades: Cliente (id, razão social, contato, e-mail, telefone, cidade, ativo); Usuário (id, nome, e-mail, perfil, ativo); Chamado (id, protocolo, clienteId, equipamento, título, descrição, prioridade, status, responsávelId, criadoEm, atualizadoEm); Histórico (id, chamadoId, autorId, tipo, mensagem, criadoEm).
- Base inicial: 8 clientes fictícios, 1 administrador, 3 técnicos e 12 chamados distribuídos entre os quatro status. Contatos usam domínio example.com. Não vincular a clientes reais.
- Configuração sem chaves de API ou serviços pagos. Sem envio real de e-mails, integração com equipamentos ou upload de anexos nesta versão.
- Navegação por teclado, foco visível, labels associados aos campos, mensagens de erro próximas ao campo e confirmação de sucesso após salvar.

## 9. Prompts de execução

### Prompt para o layout no Figma

Atue como designer de produto. Use a especificação completa deste documento como fonte de verdade para criar no Figma o Autopack Service. Crie primeiro Foundations, variáveis com bindings, estilos de texto e componentes com Auto Layout. Em seguida monte o Painel desktop para validar o padrão visual. Depois crie Login, Chamados, Detalhes, Clientes e Usuários, além do formulário de novo chamado e estados de validação e vazio. Use dados fictícios em português, hierarquia legível e componentes compartilhados. Faça a criação e inspeção pelo MCP e informe os IDs dos frames e o link do arquivo. Verifique Auto Layout, bindings e consistência antes de encerrar. Não amplie o escopo funcional definido.

### Prompt para implementação local após o layout

Atue como desenvolvedor frontend. Leia este design.md e consulte via MCP o arquivo Figma e os frames indicados pelo usuário. Inspecione componentes, variáveis, dimensões e espaçamentos antes de implementar. Desenvolva o protótipo local em React, TypeScript, Vite e Tailwind, mantendo fidelidade ao Figma e cobrindo RF01 a RF12. Use localStorage através de repositories, dados fictícios e login demonstrativo sem senhas. Implemente as ações visíveis, validações, filtros combinados, histórico e indicadores derivados dos dados. Trabalhe primeiro na estrutura e em um fluxo completo de chamado; depois conclua clientes e usuários. Execute build e valide o roteiro da seção 10. Registre limitações e não declare verificações que não foram executadas. Não publique nem use plataformas que geram o projeto inteiro em nuvem.

Para uma ferramenta que não lê Markdown, colar o documento inteiro junto do prompt da etapa. Antes da implementação, informar o link e os IDs reais do Figma; nunca inventá-los.

## 10. Roteiro de validação e apresentação

1. Entrar como administrador e observar os indicadores iniciais.
2. Cadastrar um cliente fictício e abrir um chamado vinculado a ele.
3. Confirmar novo protocolo, resultado da busca e incremento no indicador Abertos.
4. Atribuir técnico e iniciar atendimento; conferir histórico e atualização dos indicadores.
5. Entrar como esse técnico, verificar que só vê seus chamados e registrar uma observação.
6. Marcar Aguardando peça, retomar Em atendimento e concluir com descrição da solução.
7. Recarregar a página e confirmar a persistência. Testar filtro sem resultados e formulário inválido.
8. Como administrador, cadastrar e editar um usuário; verificar unicidade de e-mail e bloqueios de inativação.
9. Testar restauração com cancelamento e confirmação. Executar build de produção.

Evidências a reunir durante a execução: este documento, prompt inicial, capturas do Figma com Auto Layout e variáveis, consulta do layout pelo MCP, árvore do projeto no VS Code, registro de um ajuste justificado e demonstração final. Registrar tempo real de cada etapa; não inventar estimativas como medições.

Roteiro sugerido de fala, ajustável ao tempo dado pelo professor: problema e público; especificação e decisões; criação do Figma com MCP; leitura do layout e implementação local; demonstração do fluxo; limitações e aprendizados. Apresentações previstas para 19 e 26 de novembro, conforme enunciado.

## 11. Limites e evolução

O protótipo demonstra uma operação em um navegador. Não possui autenticação real, segurança de servidor, sincronização entre computadores ou backup automático. Evolução possível após a atividade: API Node.js, PostgreSQL, autenticação e autorização no servidor. Esses itens não fazem parte da primeira entrega.
