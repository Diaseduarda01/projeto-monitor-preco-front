function waitForElement(selector, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
  
      const obs = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) {
          obs.disconnect();
          resolve(found);
        }
      });
  
      obs.observe(document.documentElement, { childList: true, subtree: true });
  
      setTimeout(() => {
        obs.disconnect();
        reject(new Error('timeout'));
      }, timeout);
    });
  }
  
  async function listar() {
    console.log('[listar] início');

    const idUsuarioVar = sessionStorage.getItem("ID_USUARIO");
  
    let tabela = document.getElementById('tabela-produtos') || document.querySelector('#datatablesSimple tbody');
    if (!tabela) {
      try {
        tabela = await waitForElement('#tabela-produtos', 3000);
        console.log('[listar] tbody encontrado após espera');
      } catch (err) {
        console.warn('[listar] tbody não encontrado após espera. Tentando fallback...');
        tabela = document.querySelector('#datatablesSimple tbody') || document.getElementById('tabela-produtos');
        if (!tabela) {
          console.error('[listar] ERRO: elemento <tbody id="tabela-produtos"> não existe no DOM. Abortando listagem.');
          return;
        }
      }
    }
  
    let resposta;
    try {
      resposta = await fetch(`/historico/lista-produtos/${idUsuarioVar}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
    } catch (e) {
      console.error('[listar] Erro de rede no fetch:', e);
      return;
    }
  
    if (!resposta.ok) {
      const texto = await resposta.text().catch(() => '(não foi possível ler corpo)');
      console.error('[listar] resposta não OK', resposta.status, texto);
      return;
    }
  
    let dados;
    try {
      dados = await resposta.json();
    } catch (e) {
      console.error('[listar] falha ao parsear JSON:', e);
      return;
    }
  
    if (!Array.isArray(dados)) {
      console.error('[listar] dados inesperados (esperado array):', dados);
      return;
    }
  
    tabela.innerHTML = '';
    const frag = document.createDocumentFragment();
  
    dados.forEach(produto => {
      const tr = document.createElement('tr');
  
      const precoDesejado = Number(produto.precoDesejado || 0);
      const precoAtual = Number(produto.precoAtual || 0);
      const nome = produto.nome ?? '';
      const status = produto.status ?? '';
      const id = produto.id ?? '';
  
      tr.innerHTML = `
        <td>${nome}</td>
        <td>R$ ${precoDesejado.toFixed(2)}</td>
        <td>R$ ${precoAtual.toFixed(2)}</td>
        <td>${status}</td>
        <td><button class="btn btn-sm btn-danger" onclick="removerProduto('${id}')">Remover</button></td>
      `;
      frag.appendChild(tr);
    });
  
    tabela.appendChild(frag);
    console.log(`[listar] tabela populada com ${dados.length} itens`);

}