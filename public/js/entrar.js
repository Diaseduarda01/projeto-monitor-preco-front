function entrar() {
    const emailVar = document.getElementById("email_login_input").value;
    const senhaVar = document.getElementById("senha_login_input").value;

    if (!emailVar || !senhaVar) {
        exibirMensagemErro("Preencha todos os campos antes de continuar.");
        return false;
    }

    fetch("/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar,
        }),
    })
        .then((resposta) => {
            console.log("Status da resposta HTTP:", resposta.status);
            if (resposta.ok) {
                return resposta.json();
            } else {
                return resposta.text().then((texto) => {
                    console.error("Erro no login:", texto);
                    throw new Error("Email ou senha inválidos.");
                });
            }
        })
        .then((json) => {
            sessionStorage.setItem("EMAIL_USUARIO", json.email);
            sessionStorage.setItem("NOME_USUARIO", json.nome);
            sessionStorage.setItem("ID_USUARIO", json.idUsuario);

            console.log("Login bem-sucedido:", json);

            setTimeout(() => {
                window.location.href = "./index-cadastrados.html";
            }, 1000);
        })
        .catch((erro) => {
            console.error("Erro ao realizar o login:", erro.message);
            exibirMensagemErro(erro.message || "Erro ao realizar o login. Tente novamente.");
        })

    return false; 
}