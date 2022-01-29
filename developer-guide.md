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

## Common Scripts
Adventure Bot uses Yarn Workspaces. You may run commands in any particular workspace via the aliases `web` and `game`. For example, to add a dependency to game: `yarn game add <dep>`, or to run build web: `yarn web build`, etc. [Read more Here](https://classic.yarnpkg.com/lang/en/docs/workspaces/)

```sh
# Common Global Commands
yarn lint
yarn format # or yarn format:write
yarn build # runs build on all packages
yarn dev # runs dev on all packages

# Common Game Commands
yarn game start # Start the bot interaction listeners
yarn game build # Transpile TS to JS
yarn game dev # Build, but watches for changes

# Common Web Commands
yarn web start # Start the built project
yarn web build # Compile the Next.js Application
yarn web dev # Build, but watches for changes
```

or

```sh
npm run start:dev
```

## Redux Devtools

To start a Redux Devtools server:

```sh
yarn redux-devtools
```

or

```sh
npx redux-devtools
```

## Debugging

You can hit F5 to Run and Debug in VS Code to debug the application. Add `debugger` to the code or add breakpoints to step through code line by line.
