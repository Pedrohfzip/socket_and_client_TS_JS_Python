"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const client = new net_1.default.Socket();
const PORT = 3000; // porta em que o servidor está escutando
const HOST = "localhost"; // endereço do servidor
client.connect(PORT, HOST, () => {
    console.log("Conectado ao servidor");
});
client.on("data", (data) => {
    console.log(`Dados recebidos do servidor: ${data}`);
});
client.on("close", () => {
    console.log("Conexão com o servidor encerrada");
});
// // envia uma mensagem para o servidor
// client.write("Olá, servidor!");
// // fecha a conexão com o servidor
// client.end();
