/**
 * Busca o valor de uma KPI no backend
 * @param {string} endpoint - Endpoint da API (sem o prefixo /historico)
 * @param {string} elementoId - ID do elemento onde o valor será exibido
 */
async function fetchKPI(endpoint, elementoId) {
    const usuarioId = sessionStorage.getItem("ID_USUARIO");
    if (!usuarioId) {
        return null;
    }

    const url = `/historico/${endpoint}/${usuarioId}`;

    try {
        const resposta = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (resposta.status === 204) {
            document.getElementById(elementoId).textContent = 0;
            return 0;
        }

        if (!resposta.ok) {
            const erroTxt = await resposta.text().catch(() => '(corpo não lido)');
            console.error(`[fetchKPI] Erro HTTP ${resposta.status} para ${endpoint}:`, erroTxt);
            return null;
        }

        const valor = await resposta.json();
        document.getElementById(elementoId).textContent = valor;
        return valor;

    } catch (erro) {
        return null;
    }
}

/**
 * Atualiza todas as KPIs em paralelo
 */
async function atualizarKPIs() {
    console.log('[atualizarKPIs] Iniciando atualização das KPIs...');
    
    await Promise.all([
        fetchKPI('total-monitorados', 'kpi-total-monitorados'),
        fetchKPI('total-proximos-preco-desejado', 'kpi-proximos-preco'),
        fetchKPI('total-no-preco-desejado', 'kpi-no-preco')
    ]);

    console.log('[atualizarKPIs] Atualização das KPIs concluída.');
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarKPIs);
