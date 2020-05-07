# twitter-oauth-example

## overview

node.js + express + passport を使ってtwitter OAUTHのLogin/Logoutをするだけのサンプルです。

## usage

- サーバに本repoをcloneします。
- [twitter開発者サイト](https://developer.twitter.com/)でアプリ登録を行って、Consumer API keysを取得しておきます。
- アプリの情報、デプロイするAppがlistenするポート番号を記入した`config.json`を作成します。
- 以下のコマンドを入力します。

```
cd twitter-auth-example
npm i
node ./app.js
```

## License

MIT
