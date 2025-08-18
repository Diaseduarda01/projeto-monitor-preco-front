function removerProduto(id) {
    if (!confirm("Tem certeza que deseja remover este produto?")) return;
  
    fetch(`/produtos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
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

window.removerProduto = removerProduto;