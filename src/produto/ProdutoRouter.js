const express = require("express");
const axios = require("axios");
const router = express.Router();

const JAVA_API_URL = process.env.JAVA_API_URL;
const ADMIN_AUTH = "Basic " + Buffer.from("admin:admin123").toString("base64");

const sendRequest = async ({ url, data, headers = {}, method = "post" }) => {
    const response = await axios({
        method,
        url: `${JAVA_API_URL}${url}`,
        data,
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    });
    console.log(`[sendRequest] ${method.toUpperCase()} ${url} → ${response.status}`);
    return response;
};

// Criar usuário (POST /produtos)
router.post("/", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ erro: "Não autorizado" });

    try {
        const response = await sendRequest({
            url: "/produtos",
            data: req.body,
            headers: { Authorization: `Bearer ${token}` }
        });

        res.status(201).json(response.data);
    } catch (err) {
        console.error("[POST /produtos] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao criar usuário" });
    }
});

// Listar todos os usuários (GET /produtos)
router.get("/", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ erro: "Não autorizado" });

    try {
        const response = await axios.get(`${JAVA_API_URL}/produtos`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.status(200).json(response.data);
    } catch (err) {
        console.error("[GET /produtos] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar usuários" });
    }
});

// Buscar usuário por ID (GET /produtos/:id)
router.get("/:id", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ erro: "Não autorizado" });

    try {
        const response = await axios.get(`${JAVA_API_URL}/produtos/${req.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.status(200).json(response.data);
    } catch (err) {
        console.error("[GET /produtos/:id] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao buscar usuário" });
    }
});

// Atualizar usuário (PUT /produtos/:id)
router.put("/:id", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ erro: "Não autorizado" });

    try {
        const response = await sendRequest({
            url: `/produtos/${req.params.id}`,
            data: req.body,
            headers: { Authorization: `Bearer ${token}` },
            method: "put"
        });

        res.status(200).json(response.data);
    } catch (err) {
        console.error("[PUT /produtos/:id] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao atualizar usuário" });
    }
});

// Deletar usuário (DELETE /produtos/:id)
router.delete("/:id", async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ erro: "Não autorizado" });

    try {
        const response = await axios.delete(`${JAVA_API_URL}/produtos/${req.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.status(204).send();
    } catch (err) {
        console.error("[DELETE /produtos/:id] Erro:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({ erro: err.response?.data || "Erro ao deletar usuário" });
    }
});

module.exports = router;