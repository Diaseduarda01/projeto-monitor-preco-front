const nomeUsuario = sessionStorage.getItem("NOME_USUARIO") || "Usuário";

const fulanoElement = document.querySelector('.fulano');

const mensagem = `Olá, <b>${nomeUsuario}</b>! Seja bem-vindo(a)!<br>
 A Elay é uma aplicação que ajuda você a monitorar os preços dos produtos que cadastrar,
<br>encontrar as melhores promoções e fazer suas compras no momento certo, economizando tempo e dinheiro.`;

fulanoElement.innerHTML = mensagem;