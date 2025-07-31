var ambiente_processo = 'producao';
var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/index/router.js");
var usuarioRouter = require("./src/usuario/router.js");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/auth", usuarioRouter);


app.listen(PORTA_APP, function () {
    console.log(`
      Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP}/cadastrar.html :. \n\n
        Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:.`);
});
