const express = require("express");
const axios = require("axios");
const router = express.Router();

const JAVA_API_URL = process.env.JAVA_API_URL;

const sendRequest = async ({ url, method = "get", data = {}, headers = {} }) => {
    const response = await axios({
        method,
        url: `${JAVA_API_URL}${url}`,
        data,
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    });
    return response;
};

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ erro: "Não autorizado" });
    }
    req.authHeader = { Authorization: `Bearer ${token}` };
    next();
};

router.use(authMiddleware);

// 1. Histórico
router.get("/listar-historico/:produtoId/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/listar-historico/${req.params.produtoId}/${req.params.usuarioId}`,
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET listar-historico] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar histórico" });
    }
});

// 2. Produtos
router.get("/listar-produtos/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/listar-produtos/${req.params.usuarioId}`, 
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET listar-produtos] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar produtos" });
    }
});

// 3. Total monitorados
router.get("/total-monitorados/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/total-monitorados/${req.params.usuarioId}`,
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET total-monitorados] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar total monitorados" });
    }
});

// 4. Total próximos preço desejado
router.get("/total-proximos-preco-desejado/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/total-proximos-preco-desejado/${req.params.usuarioId}`,
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET total-proximos-preco-desejado] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar total próximos" });
    }
});

// 5. Total no preço desejado
router.get("/total-no-preco-desejado/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/total-no-preco-desejado/${req.params.usuarioId}`,
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET total-no-preco-desejado] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar total no preço desejado" });
    }
});

// 6. Total dias monitoramento
router.get("/total-dias-monitoramento/:produtoId/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/total-dias-monitoramento/${req.params.produtoId}/${req.params.usuarioId}`,
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET total-dias-monitoramento] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar dias monitoramento" });
    }
});

// 7. Preço desejado
router.get("/preco-desejado/:produtoId/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/preco-desejado/${req.params.produtoId}/${req.params.usuarioId}`,
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET preco-desejado] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar preço desejado" });
    }
});

// 8. Preço atual
router.get("/preco-atual/:produtoId/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/preco-atual/${req.params.produtoId}/${req.params.usuarioId}`,
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET preco-atual] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar preço atual" });
    }
});

// 9. Variação porcentual
router.get("/variacao-porcentual/:produtoId/:usuarioId", async (req, res) => {
    try {
        const response = await sendRequest({
            url: `/historico/variacao-porcentual/${req.params.produtoId}/${req.params.usuarioId}`,
            headers: req.authHeader
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        console.error("[GET variacao-porcentual] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar variação" });
    }
});

module.exports = router;