function editarProduto(id) {
    // Impede comportamento padrão se for chamado a partir de um form
    event?.preventDefault();

    fetch(`${API_URL}/produtos/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // Pegando token do localStorage
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao buscar produto");
            return res.json();
        })
        .then(produto => {
            const nome = prompt("Nome do produto:", produto.nome);
            const precoDesejado = prompt("Preço desejado:", produto.precoDesejado);
            const status = prompt("Status:", produto.status);

            if (!nome || !precoDesejado || !status) {
                alert("❌ Alteração cancelada");
                return;
            }

            return fetch(`${API_URL}/produtos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Token para atualização
                },
                body: JSON.stringify({
                    nome,
                    precoDesejado: parseFloat(precoDesejado),
                    status
                })
            });
        })
        .then(updateRes => {
            if (!updateRes) return; // Se cancelou, não faz nada
            if (!updateRes.ok) throw new Error("Erro ao atualizar produto");
            alert("✅ Produto atualizado com sucesso!");
            location.reload();
        })
        .catch(err => {
            console.error(err);
            alert(`❌ ${err.message}`);
        });
}


const API_URL = "/produtos";

function removerProduto(id) {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;

    fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // Token para autenticação
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao remover produto");
            alert("✅ Produto removido com sucesso!");
            location.reload();
        })
        .catch(err => {
            console.error(err);
            alert(`❌ ${err.message}`);
        });
}
