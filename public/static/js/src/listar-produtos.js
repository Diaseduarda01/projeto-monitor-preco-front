/**
 * Aguarda até que um elemento apareça no DOM ou o tempo limite seja atingido.
 * @param {string} selector - Seletor CSS do elemento.
 * @param {number} timeout - Tempo máximo de espera em ms.
 * @returns {Promise<Element>}
 */
function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve, reject) => {
    console.log(`[waitForElement] Aguardando elemento: "${selector}" (timeout: ${timeout}ms)`);

    // Verifica se o elemento já existe
    const el = document.querySelector(selector);
    if (el) {
      console.log(`[waitForElement] Elemento encontrado imediatamente: "${selector}"`);
      return resolve(el);
    }

    // Observa alterações no DOM
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        console.log(`[waitForElement] Elemento encontrado: "${selector}"`);
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Timeout
    setTimeout(() => {
      console.warn(`[waitForElement] Tempo esgotado para encontrar: "${selector}"`);
      observer.disconnect();
      reject(new Error(`Timeout ao esperar elemento: ${selector}`));
    }, timeout);
  });
}

function irParaEditarProduto(id) {
  window.location.href = `editar-produto.html?id=${id}`;
}

/**
 * Lista produtos do histórico do usuário e insere na tabela.
 */
async function listar() {
  console.log('[listar] Iniciando listagem de produtos...');

  const usuarioId = sessionStorage.getItem("ID_USUARIO");
  if (!usuarioId) {
    console.error('[listar] ID_USUARIO não encontrado no sessionStorage.');
    return;
  }

  let tabela = document.querySelector('#tabela-produtos') || document.querySelector('#datatablesSimple tbody');

  if (!tabela) {
    console.log('[listar] Tabela não encontrada, aguardando carregamento do DOM...');
    try {
      tabela = await waitForElement('#tabela-produtos', 3000);
    } catch {
      console.warn('[listar] Falha ao encontrar "#tabela-produtos", tentando fallback...');
      tabela = document.querySelector('#datatablesSimple tbody');
      if (!tabela) {
        console.error('[listar] Nenhum elemento de tabela encontrado. Abortando.');
        return;
      }
    }
  }

  let resposta;
  try {
    console.log(`[listar] Buscando dados do endpoint: /historico/listar-produtos/${usuarioId}`);
    resposta = await fetch(`/historico/listar-produtos/${usuarioId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
  } catch (e) {
    console.error('[listar] Erro de rede durante fetch:', e);
    return;
  }

  if (!resposta.ok) {
    const corpoErro = await resposta.text().catch(() => '(não foi possível ler corpo)');
    console.error(`[listar] Resposta não OK (${resposta.status}):`, corpoErro);
    return;
  }

  let dados;
  try {
    dados = await resposta.json();
  } catch (e) {
    console.error('[listar] Erro ao interpretar JSON:', e);
    return;
  }

  if (!Array.isArray(dados)) {
    console.error('[listar] Formato inesperado: esperado array, recebido:', dados);
    return;
  }

  console.log(`[listar] ${dados.length} produtos recebidos. Renderizando tabela...`);

  tabela.innerHTML = '';
  const fragment = document.createDocumentFragment();

  dados.forEach(produto => {
    const tr = document.createElement('tr');

    const precoDesejado = Number(produto.precoDesejado) || 0;
    const ultimoPreco = Number(produto.ultimoPreco) || 0;

    tr.onclick = () => {
        window.location.href = `../dashboard-produto.html?id=${produto.id ?? ''}`;
    };
  
    tr.innerHTML = `
      <td>${produto.nome ?? ''}</td>
      <td>R$ ${precoDesejado.toFixed(2)}</td>
      <td>R$ ${ultimoPreco.toFixed(2)}</td>
      <td>${produto.status ?? ''}</td>
      <td style="display: flex; gap: 8px;">
        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); irParaEditarProduto('${produto.id ?? ''}')">
          Editar
        </button>
        <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); removerProduto('${produto.id ?? ''}')">
          Remover
        </button>
      </td>
    `;
    
    fragment.appendChild(tr);
  });

  tabela.appendChild(fragment);
  console.log('[listar] Tabela atualizada com sucesso.');
}

function editarProduto(id, event) {
  event?.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("❌ Usuário não autenticado!");
    return;
  }

  fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
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

    return fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        nome,
        precoDesejado: parseFloat(precoDesejado),
        status
      })
    });
  })
  .then(updateRes => {
    if (!updateRes) return;
    if (!updateRes.ok) throw new Error("Erro ao atualizar produto");
    alert("✅ Produto atualizado com sucesso!");
    location.reload();
  })
  .catch(err => {
    console.error(err);
    alert(`❌ ${err.message}`);
  });
}

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
