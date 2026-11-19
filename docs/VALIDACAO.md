# Validação executada

Data: 16/11/2026.

## Automatizada

`npm test`: **13 testes aprovados, 0 falhas**. Casos: distribuição inicial; fluxo completo e protocolo único; obrigatoriedade e cliente inativo; responsável e transições; solução obrigatória e imutabilidade após conclusão; isolamento de técnico e restrição de cadastros; proibição de reatribuição pelo técnico; cadastro/edição de cliente mantendo histórico; unicidade de e-mail; proteção da sessão e do último administrador; inativação de técnico com chamados pendentes; reabertura da base persistida; proteção contra base inválida/versão desconhecida.

`npm run build`: verificação TypeScript e compilação de produção aprovadas. As fontes Inter são empacotadas localmente.

## Navegador

Validação na prévia local, comparando a aparência do login e do painel com o contexto retornado pelo Figma. Foram executados:

- Login como administrador e conferência dos indicadores 4/3/2/3.
- Cadastro de cliente com submissão vazia, exibição de erros e posterior gravação válida.
- Busca do cliente recém-criado.
- Criação de AUT-0013 vinculado ao novo cliente e a Marina Costa.
- Atualização para Em atendimento e inclusão de observação no histórico.
- Saída e entrada como técnico; cadastros administrativos ausentes e lista apenas com seus chamados.
- Mudança para Aguardando peça e retorno para Em atendimento.
- Tentativa de conclusão sem solução, bloqueada com mensagem no campo.
- Conclusão com solução e recarga da página, preservando status e histórico.
- Filtros combinados de status, prioridade e texto; estado vazio quando não há correspondência.
- Cadastro de usuário com e-mail duplicado, bloqueado; novo e-mail válido salvo.
- Edição e inativação do usuário criado sem chamados.
- Cancelamento da restauração preservando o usuário inativo.
- Confirmação da restauração, retornando aos dados iniciais para a demonstração.

O teste no navegador foi realizado em viewport desktop. Os breakpoints de notebook e mobile estão implementados, mas não foram verificados visualmente em cada dimensão nesta execução. As interações usam persistência local e login simulado, conforme a especificação.

## Ajustes observados

Foi corrigido um conflito entre a classe de botão secundário e uma utilidade de Tailwind que produzia contorno indevido. O modificador agora se chama `btn-outline`.

## Limites

Não foram testados autenticação de servidor, sincronização remota ou banco de dados, pois não integram o protótipo. As regras de perfil são demonstrativas de frontend. Não houve publicação ou configuração de hosting.
