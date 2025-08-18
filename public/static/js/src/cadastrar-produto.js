function cadastrar(event) {
    event.preventDefault();

    const nomeVar = document.getElementById("input_nome").value;
    const urlVar = document.getElementById("input_url").value;
    const classeVar = document.getElementById("input_classe").value;
    const precoDesejadoVar = document.getElementById("input_preco_desejado").value;
    const ativoVar = true;
    const idUsuarioVar = sessionStorage.getItem("ID_USUARIO");

    console.log("Iniciando cadastro com dados:", { nome: nomeVar, url: urlVar, classe: classeVar, precoDesejado: precoDesejadoVar, ativo: ativoVar, idUsuario: idUsuarioVar });

    fetch("/produtos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
            nome: nomeVar,
            url: urlVar,
            classe: classeVar,
            precoDesejado: precoDesejadoVar,
            ativo: ativoVar,
            idUsuario: idUsuarioVar
        }),
    })
    .then((resposta) => {
        console.log("Resposta recebida do servidor:", resposta);

        if (resposta.ok) {
            resposta.json().then(data => {
                console.log("Cadastro efetuado com sucesso. Dados retornados:", data);
            });
            
            // exibirMensagemSucesso("Cadastro realizado com sucesso! Redirecionando...");
            // limparFormularioCadastro();
        
            setTimeout(() => {
                window.location.href = "/dashboard.html"; 
            }, 2000);
        
        } else {
            resposta.text().then((texto) => {
                console.error("Erro no cadastro:", texto);
            });
            throw "Houve um erro ao tentar realizar o cadastro!";
        }
    })
    .catch((erro) => {
        console.error(`#ERRO: ${erro}`);
    });
}