const express = require("express");
const axios = require("axios");
const router = express.Router();

const JAVA_API_URL = process.env.JAVA_API_URL;
const ADMIN_AUTH = "Basic " + Buffer.from("admin:admin123").toString("base64");

const sendRequest = async ({ url, data, headers = {} }) => {
    const response = await axios.post(`${JAVA_API_URL}${url}`, data, {
        headers: {
            "Content-Type": "application/json",
            ...headers
        }
    });
    return response;
};

router.post("/login", async (req, res) => {
    try {
        const response = await sendRequest({
            url: "/auth/login",
            data: req.body
        }); 

        const { token, nome, id, role } = response.data;
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            maxAge: 24 * 60 * 60 * 1000, // 1 dia
            sameSite: "Strict"
        });

        res.status(200).json({ nome, role, id });

    } catch (err) {
        console.error("[login] Erro ao autenticar:", err.response?.data || err.message);
        res.status(err.response?.status || 500).json({
            erro: err.response?.data || "Erro ao autenticar com a API Java"
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const response = await sendRequest({
            url: "/auth/register",
            data: req.body,
            headers: { Authorization: ADMIN_AUTH }
        });

        const { token, nome, id, role } = response.data;

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "Strict"
        });

        res.status(200).json({ nome, role, id });

    } catch (err) {
        res.status(err.response?.status || 500).json({
            erro: err.response?.data || "Erro ao registrar na API Java"
        });
    }
});

module.exports = router;