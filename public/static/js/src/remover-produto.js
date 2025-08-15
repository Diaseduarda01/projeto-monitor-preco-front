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
