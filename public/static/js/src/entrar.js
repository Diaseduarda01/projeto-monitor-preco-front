function entrar() {
    const emailVar = document.getElementById("email_login_input").value;
    const senhaVar = document.getElementById("senha_login_input").value;

    if (!emailVar || !senhaVar) {
        alert("Preencha todos os campos antes de continuar.");
        return false;
    }

    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: emailVar,
            senha: senhaVar,
        }),
    })
    .then((resposta) => {
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
        sessionStorage.setItem("NOME_USUARIO", json.nome);
        sessionStorage.setItem("ROLE_USUARIO", JSON.stringify(json.role));
        sessionStorage.setItem("ID_USUARIO", json.id)
        console.log(json.id)

        console.log("Login bem-sucedido:", json);

        setTimeout(() => {
            window.location.href = "../dashboard.html";
        }, 1000);
    })
    .catch((erro) => {
        console.error("Erro ao realizar o login:", erro.message);
        alert(erro.message || "Erro ao realizar o login. Tente novamente.");
    });

    return false; 
}