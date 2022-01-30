# Developing Adventure Bot

## Prerequisites

This guide assumes you have the correct version of Node installed as specified in `.nvmrc`, perhaps via [nvm](https://github.com/nvm-sh/nvm) and `nvm use`.

## Clone this repo

Start by cloning this repo.

```sh
gh repo clone Adventure-Bot/adventure-bot
```

```sh
git clone git@github.com:Adventure-Bot/adventure-bot.git
````

## Install dependencies

`yarn` or `npm i`

## Create your bot token

Follow this guide: [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

You should now have a bot token.

## Setup your .env

`cp example.env .env`

Replace the `token` value with the [your bot token](#create-your-bot-token).

## Invite the bot to your server

Follow this guide:
[Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links)

The permissions required are `545192934464`. 

You can replace `YOUR_CLIENT_ID_HERE` in the URL below to create an invite link for your bot.

https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID_HERE&permissions=545192934464&scope=bot

Visit the link to be prompted to add the bot to your server. Follow the prompts.

You should now have a bot in your Discord server.

## Commands

Adventure Bot uses [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). You may run commands in any particular workspace via the aliases `web` and `game`. For example, to add a dependency to game: `yarn game add <dep>`, or to run build web: `yarn web build`, etc.

### Global Commands

Build all workspaces.

```sh
yarn build
```

Start development for all workspaces.

```sh
yarn dev
```

Lint all workspaces.

```sh
yarn lint
```

Check formatting for all workspaces.

```sh
yarn format
```

Fix the formatting for all workspaces.

```sh
yarn format:write
```

### Game Commands

Start the Discord bot.

```sh
yarn game start
```

Transpile TS to JS.

```sh
yarn game build
```

Build and watch for changes.

```sh
yarn game dev
```

## Web Commands

Compile the Next.js application.

```sh
yarn web build
```

Start the built project.

```sh
yarn web start
```

Build and watch for changes.

```sh
yarn web dev
```

Build and watch for changes (alias)

```sh
npm run start:dev
```

## Redux Devtools

To start a Redux Devtools server:

```sh
yarn redux-devtools
```

## Debugging

You can hit F5 to Run and Debug in VS Code to debug the application. Add `debugger` to the code or add breakpoints to step through code line by line.
