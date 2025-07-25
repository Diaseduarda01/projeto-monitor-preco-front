function cadastrar(event) {
    event.preventDefault();

    const nomeVar = document.getElementById("nome_cadastro_input").value;
    const emailVar = document.getElementById("email_cadastro_input").value;
    const senhaVar = document.getElementById("senha_cadastro_input").value;


    console.log("Iniciando cadastro com dados:", { nome: nomeVar, email: emailVar });

    fetch("/usuarios/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: nomeVar,
            email: emailVar,
            senha: senhaVar,
        }),
    })
        .then((resposta) => {
            console.log("Resposta recebida do servidor:", resposta);

            if (resposta.ok) {
                resposta.json().then(data => {
                    console.log("Cadastro efetuado com sucesso. Dados retornados:", data);
                });
                exibirMensagemSucesso("Cadastro realizado com sucesso! Redirecionando...");
                setTimeout(() => {
                    window.location.href = "./entrar.html";
                }, 2000);
                limparFormularioCadastro();
            } else {
                resposta.text().then((texto) => {
                    console.error("Erro no cadastro:", texto);
                });
                throw "Houve um erro ao tentar realizar o cadastro!";
            }
        })
        .catch((erro) => {
            document.getElementById("loading").style.display = "none";
            console.error(`#ERRO: ${erro}`);
            exibirMensagemErro("Erro ao realizar o cadastro. Tente novamente.");
        });
}