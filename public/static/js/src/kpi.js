/**
 * Busca o valor de uma KPI no backend
 * @param {string} endpoint - Endpoint da API (sem o prefixo /historico)
 * @param {string} elementoId - ID do elemento onde o valor será exibido
 */
async function fetchKPI(endpoint, elementoId) {
    const usuarioId = sessionStorage.getItem("ID_USUARIO");
    if (!usuarioId) {
        console.error(`[fetchKPI] ID_USUARIO não encontrado. Abortando request para "${endpoint}".`);
        return null;
    }

    const url = `/historico/${endpoint}/${usuarioId}`;
    console.log(`[fetchKPI] Iniciando request: ${url}`);

    try {
        const resposta = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (resposta.status === 204) {
            console.warn(`[fetchKPI] Nenhum dado encontrado para ${endpoint}.`);
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
        console.log(`[fetchKPI] KPI "${endpoint}" atualizada com valor: ${valor}`);
        return valor;

    } catch (erro) {
        console.error(`[fetchKPI] Erro de rede para ${endpoint}:`, erro);
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
