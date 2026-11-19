# Autopack Service

Protótipo acadêmico desktop first de gestão de chamados de assistência técnica. Autoria: Felipe Marconi Gomes de Araujo. O nome e o contexto fazem parte da proposta acadêmica; não é um produto oficial da empresa.

## Abrir no VS Code

1. Instale o Node.js 22.12+ ou 24.x e o VS Code no computador.
2. Extraia o ZIP. Não execute o projeto diretamente de dentro do arquivo compactado.
3. No VS Code, use **Arquivo → Abrir pasta** e selecione a pasta `autopack-service` (aquela com `package.json`).
4. Abra **Terminal → Novo terminal** e execute:

```bash
npm install
npm run dev
```

5. Abra o endereço local indicado no terminal. Mantenha o terminal aberto enquanto usa o sistema. Para parar: `Ctrl+C`.

Se o PowerShell bloquear `npm.ps1`, use `npm.cmd install` e `npm.cmd run dev`, ou selecione o terminal Prompt de Comando no VS Code.

## Entrar e demonstrar

Não há senha. Escolha um dos quatro usuários de exemplo na tela de login. Felipe Araujo é administrador; Marina Costa, Lucas Ribeiro e Pedro Almeida são técnicos.

Fluxo sugerido:

1. Entre como Felipe e confira o painel: 4 abertos, 3 em atendimento, 2 aguardando peça, 3 concluídos.
2. Cadastre um cliente em **Clientes → Novo cliente**.
3. Abra um chamado para esse cliente e atribua Marina Costa. O primeiro novo protocolo é AUT-0013.
4. Abra o protocolo na lista. Mude de Aberto para Em atendimento e registre uma observação.
5. No menu do usuário, use **Sair / trocar usuário** e entre como Marina.
6. Confira que Clientes e Usuários não aparecem e que a lista mostra apenas os chamados de Marina.
7. Altere para Aguardando peça, retome Em atendimento e conclua descrevendo a solução.
8. Recarregue a página: os dados e o histórico permanecem salvos.
9. Volte como administrador para demonstrar edição de cliente, ativação/inativação e cadastro de usuário.
10. Use **Restaurar demonstração** para voltar à base inicial. É exibida uma confirmação; Cancelar preserva os dados.

## Funcionalidades

- Login demonstrativo, sessão por identificador e saída pelo menu do perfil.
- Painel com indicadores calculados e distribuição proporcional por status.
- Abertura e listagem de chamados, busca sem distinção de acentos e filtros combinados.
- Atribuição de técnico ativo, transições válidas e histórico com autor e horário.
- Conclusão somente com solução registrada; chamados concluídos ficam imutáveis.
- Cadastro/edição de clientes e usuários, validação de e-mail e proteção do último administrador.
- Inativação de técnico bloqueada enquanto houver chamados não concluídos sob sua responsabilidade.
- Armazenamento local versionado, sem sobrescrever a base a cada carregamento.
- Formulários com mensagens de erro, navegação por teclado, foco visível e modais nativos com contenção de foco.
- Layout adaptável e tabelas com rolagem horizontal quando necessário.

## Arquitetura

React + TypeScript + Vite + Tailwind CSS + React Router. Tipografia Inter instalada no projeto, sem depender do Google Fonts em tempo de execução.

```text
src/
  components/      Controles, modais, formulários e tabela de chamados
  data/            Base fictícia inicial
  layouts/         Sidebar, cabeçalho e navegação autenticada
  pages/           Login, painel, chamados, detalhes, clientes e usuários
  repositories/    Regras de negócio e acesso ao localStorage
  state/           Estado React e sessão demonstrativa
  styles/          Tokens e estilos derivados do Figma
  types/           Contratos das entidades
tests/             Testes das regras e da persistência
docs/              Método, vínculo com o Figma e validação
```

Os nomes de propriedades no TypeScript estão em inglês; a interface está em português. O arquivo `design.md` mantém os requisitos originais. HashRouter permite recarregar rotas sem configurar um servidor de aplicação.

## Comandos de validação

```bash
npm test
npm run build
npm run preview
```

`npm test` executa 13 testes das regras de negócio e da persistência. `npm run build` verifica os tipos e gera os arquivos em `dist/`. `npm run preview` serve essa compilação localmente; execute-o depois do build. Não abra `dist/index.html` por duplo clique.

## Armazenamento e limites

Não usa banco de dados ou backend. A base fica no localStorage na chave `autopack-service:database:v1`; a sessão guarda apenas um identificador em sessionStorage. Não há autenticação real, segurança de servidor, sincronização entre computadores nem backup automático. Limpar os dados do navegador remove os cadastros. A base pertence à origem do endereço: trocar host ou porta pode fazer aparecer outra base inicial.

O protótipo não solicita tokens, senhas, chaves de API ou serviços pagos. Todos os exemplos usam dados fictícios e e-mails example.com. As restrições de perfil demonstram comportamento de interface e regras de frontend; não oferecem autorização de produção.

## Figma e método da atividade

[Arquivo Figma](https://www.figma.com/design/63yORIr1vHmwOUgA0KFrHa)

Leia `docs/METODO.md` para os frames usados, sequência de ferramentas e roteiro de evidências. O código foi produzido como projeto local editável e não foi publicado. Abra-o no VS Code para a etapa de execução e apresentação no seu computador.
