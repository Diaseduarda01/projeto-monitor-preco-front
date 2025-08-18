/**
 * Aguarda até que um elemento apareça no DOM ou o tempo limite seja atingido.
 * @param {string} selector - Seletor CSS do elemento.
 * @param {number} timeout - Tempo máximo de espera em ms.
 * @returns {Promise<Element>}
 */
function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve, reject) => {

    const el = document.querySelector(selector);
    if (el) {
      return resolve(el);
    }

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(() => {
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

  const usuarioId = sessionStorage.getItem("ID_USUARIO");
  if (!usuarioId) {
    return;
  }

  let tabela = document.querySelector('#tabela-produtos') || document.querySelector('#datatablesSimple tbody');

  if (!tabela) {
    try {
      tabela = await waitForElement('#tabela-produtos', 3000);
    } catch {
      tabela = document.querySelector('#datatablesSimple tbody');
      if (!tabela) {
        return;
      }
    }
  }

  let resposta;
  try {
    resposta = await fetch(`/historico/listar-produtos/${usuarioId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
  } catch (e) {
    return;
  }

  if (!resposta.ok) {
    const corpoErro = await resposta.text().catch(() => '(não foi possível ler corpo)')
    return;
  }

  let dados;
  try {
    dados = await resposta.json();
  } catch (e) {
    return;
  }

  if (!Array.isArray(dados)) {
    return;
  }


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