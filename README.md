# Porygon

Bot de moderação para uma comunidade de Discord, desenvolvido entre 2022 e 2024, feito em Node.js com [discord.js](https://discord.js.org). Os textos, expressões de filtro e configurações ficam em um Firebase Realtime Database, então podem ser alterados sem mexer no código.

> **Projeto antigo.** mantido sem grandes atualizações. Usa o SDK do Firebase na versão 8 (API antiga). Funciona assim, mas não é um exemplo de práticas atuais.

## Funcionalidades

- **Detecção de golpes e phishing:** consulta domínios na API da [Exerra](https://exerra.xyz) e procura padrões de golpe de Steam. Mensagens suspeitas são apagadas e o autor é banido.
- **Filtro de palavras:** apaga mensagens que casam com uma expressão regular configurada e, para um segundo conjunto, também bane o autor.
- **Integração com o AutoMod do Discord:** reage a ações do AutoMod aplicando as mesmas regras de banimento.
- **Filtro de emojis:** remove reações com emojis proibidos e registra em um canal privado de logs.
- **Canais com bloqueio de conteúdo:** em canais configurados, apaga mensagens sem imagem (ou com anexos que não sejam imagem) e avisa o autor por mensagem direta.
- **Moderação por menu de contexto:** silenciar e remover silenciamento de membros (clique direito no usuário > Aplicativos).
- **Comandos de dono (por prefixo):** estatísticas de mensagens do dia, trancar e destrancar canal, e `eval`.

## Requisitos

- Node.js 16.11 ou superior (exigência do discord.js 14)
- Um bot criado no [Discord Developer Portal](https://discord.com/developers/applications)
- Um projeto Firebase com Realtime Database

## Instalação

```bash
git clone https://github.com/weslinho/porygon.git
cd porygon
npm install
cp .env.example .env
```

Preencha o `.env` (veja abaixo) e inicie **a partir da raiz do projeto**, pois os handlers leem as pastas `src/...` por caminho relativo:

```bash
node src/main.js
```

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `PORYGON_TOKEN` | Token do bot. |
| `FIREBASE_CREDENTIALS` | Configuração do Firebase como JSON em uma linha. |
| `INTENTS` | Valor de intents repassado ao discord.js (um único valor). |
| `ACESS` | IDs de usuários autorizados nos comandos de dono, separados por espaço. |
| `GUILD_ID` | ID do servidor onde o bot atua. Os demais servidores são ignorados. |
| `PRIVATE_LOG_CHANNEL_ID` | ID do canal de logs privados (reações com emojis proibidos). |
| `MOD_LOG_CHANNEL_ID` | ID do canal de logs de moderação. |
| `STATS_CHANNEL_ID` | ID do canal usado por padrão no comando `stats`. |

O bot precisa das intents necessárias para ler mensagens, reações e eventos de AutoMod. Ative a **Message Content Intent** no portal do desenvolvedor.

## Estrutura esperada no Firebase

O bot lê dois caminhos do Realtime Database:

**`CdN/Locales`** guarda textos e expressões no formato `grupo/chave`. As chaves usadas pelo código são:

| Grupo | Chaves |
| --- | --- |
| `common` | `prefix`, `embedcolor` |
| `flagged` | `all`, `ban`, `steam`, `emojis`, `phishing` |
| `reason` | `blocked_word`, `phish` |
| `regex` | `userMention` |
| `response` | `emojifilter`, `muted`, `unmuted` |
| `punishment` | `mutedescription`, `unmutedescription` |
| `contentblocker` | `content`, `image` |
| `error` | `locale`, `incorrectusage`, `invalidtime`, `silence`, `userlowerpermission` |

Os textos aceitam marcadores como `{username}`, `{userId}`, `{emoji}`, `{messageUrl}` e `{channelId}`, conforme o contexto. Em `flagged/emojis`, os emojis são separados por `|`. Os valores em `flagged/*` são usados como expressões regulares.

**`CdN/Modules/ContentBlocker/Channels`** é um objeto `{ nome: "ID do canal" }` com os canais onde só imagens são permitidas.

Defina as regras de segurança do Realtime Database para que **somente o bot** possa escrever, já que esses valores controlam banimentos automáticos.

## Comandos

Os comandos de dono usam o prefixo salvo em `common/prefix`: `<prefixo> <comando> [argumentos]`. Só funcionam para os IDs em `ACESS`.

| Comando | Atalhos | Função |
| --- | --- | --- |
| `stats [id do canal]` | | Gera o ranking de mensagens do dia e o gráfico por hora. Sem argumento, usa `STATS_CHANNEL_ID`. |
| `lock` | `l` | Impede o envio de mensagens no canal atual. |
| `unlock` | `u` | Libera o envio de mensagens no canal atual. |
| `evaluate` | `ev`, `eval` | Executa código JavaScript no processo do bot. |

Os menus de contexto **Silenciar** e **Remover** (silenciamento) exigem a permissão *Gerenciar Mensagens* e precisam estar registrados como comandos de usuário do aplicativo no Discord. Esse registro não faz parte deste repositório.

## Aviso de segurança

O comando `eval` executa qualquer código recebido com acesso total ao processo, incluindo o token do bot e as credenciais do Firebase. Use somente com IDs de confiança em `ACESS`, ou remova `src/commands/evaluate.js` se não precisar dele.

Nunca versione o arquivo `.env`.

## Licença

[MIT](LICENSE)
