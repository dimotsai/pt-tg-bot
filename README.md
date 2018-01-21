# pt-tg-bot
A telegram bot that can show PT status

## Installation
```
git clone https://github.com/dimotsai/pt-tg-bot
cd pt-tg-bot
npm install
```

## Configuration
### Bot Token
You may want to create a telegram bot by talking to @BotFather. And then you can set the received bot token  in `config/default.properties`.
### Authentication to your PT server
To be able to query your PT server, a auth token is required. To get the token, open the monitoring page and enter your password. Copy the stored cookie in your browser to the config. After that, you have completed your configuration.

## Usage
To launch the bot, type the following commands in the project directory:
```
npm start
```

Commands:
```
/pairs
/dca
```