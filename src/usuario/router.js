const express = require("express");
const axios = require("axios");
const router = express.Router();

const JAVA_API_URL = process.env.JAVA_API_URL;

router.post("/login", async (req, res) => {
    try {
        const response = await axios.post(`${JAVA_API_URL}/auth/login`, req.body, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        res.status(response.status).json(response.data);
    } catch (err) {
        res.status(err.response?.status || 500).json({
            erro: err.response?.data || "Erro ao conectar à API Java"
        });
    }
});

// REGISTER: envia JSON para Spring
router.post("/register", async (req, res) => {
    console.log("Requisição POST /usuarios/register recebida com corpo:", req.body);

    try {
        const username = 'admin';
        const password = 'admin123';
        const basicAuth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

        const response = await axios.post(`${JAVA_API_URL}/auth/register`, req.body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": basicAuth
            }
        });

        console.log("Resposta da API Java no /auth/register:", {
            status: response.status,
            data: response.data,
        });

        res.status(response.status).json(response.data);

    } catch (err) {
        console.error("Erro ao enviar para API Java:", {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message
        });

        res.status(err.response?.status || 500).json({
            erro: err.response?.data || "Erro ao conectar à API Java"
        });
    }
});


module.exports = router;
