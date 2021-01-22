# riot_project

This is a frontend application that uses the RIOT GAMES API to get match history data from users.

## cors_proxy_server

The RIOT GAMES API only allows for requests with a cors header, meaning that a cors proxy server is required to make requests.<br />
To setup the proxy server, browse to the `cors_proxy_server` directory and run:

```bash
node index.js
```

## The application

An API key is required in order to run the application (Resets every 24hours unless its a permanent key)<br />
This can be found here: [RIOT GAMES API](https://developer.riotgames.com/)<br />
After this browse to `riot_project/src/config` and add your API key.<br />
To start the application, browse to the `riot_project` directory and run:

```bash
npm start
```
