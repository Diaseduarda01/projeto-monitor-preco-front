const params = new URLSearchParams(window.location.search);
const produtoId = params.get("id");

function preencherFormulario(produto) {
  document.querySelector("#produtoAtivo").checked = produto.status === "Ativo";
  document.querySelector('input[placeholder="Ex: Notebook Dell XPS 13"]').value = produto.nome;
  document.querySelector('input[placeholder="https://www.exemplo.com/produto"]').value = produto.url;
  document.querySelector('input[placeholder="Ex: price-tag, product-title"]').value = produto.classe;
  document.querySelector('input[placeholder="Ex: 3500"]').value = produto.precoDesejado;
}

fetch(`/produtos/${produtoId}`, {
  method: "GET",
  headers: { "Content-Type": "application/json" },
  credentials: "include"
})
  .then(res => res.ok ? res.json() : Promise.reject("Erro ao buscar produto"))
  .then(produto => preencherFormulario(produto))
  .catch(err => console.error(err));

document.querySelector(".btn-success").addEventListener("click", (e) => {
  e.preventDefault();

  const produtoAtualizado = {
    nome: document.querySelector('input[placeholder="Ex: Notebook Dell XPS 13"]').value,
    url: document.querySelector('input[placeholder="https://www.exemplo.com/produto"]').value,
    classe: document.querySelector('input[placeholder="Ex: price-tag, product-title"]').value,
    precoDesejado: parseFloat(document.querySelector('input[placeholder="Ex: 3500"]').value),
    status: document.querySelector("#produtoAtivo").checked ? "Ativo" : "Inativo"
  };

  fetch(`/produtos/${produtoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(produtoAtualizado)
  })
  .then(res => {
    if (!res.ok) throw new Error("Erro ao atualizar produto");
    alert("✅ Produto atualizado com sucesso!");
    setTimeout(() => {
      window.location.href = "/dashboard.html"; 
    }, 2000);
  })
  .catch(err => alert(`❌ ${err}`));
});