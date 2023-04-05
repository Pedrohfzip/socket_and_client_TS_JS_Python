"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const users = [
    { matricula: "1234", senha: "senha1234" },
    { matricula: "5678", senha: "senha5678" },
];
const server = net_1.default.createServer((socket) => {
    console.log("Cliente conectado.");
    // Envie uma mensagem de boas-vindas para o cliente.
    socket.write("Bem-vindo! Você gostaria de fazer login (L) ou se cadastrar (C)?");
    // Registre os dados de login do usuário.
    let matricula;
    let senha;
    let isRegistering = false;
    // Crie um ouvinte para os dados recebidos do cliente.
    socket.on("data", (data) => {
        const message = data.toString().trim();
        if (!isRegistering) {
            // Verifique se o usuário deseja fazer login ou se cadastrar.
            if (message.toUpperCase() === "L") {
                socket.write("Por favor, digite sua matrícula e senha separados por vírgula:");
            }
            else if (message.toUpperCase() === "C") {
                isRegistering = true;
                socket.write("Por favor, digite uma nova matrícula e senha separados por vírgula:");
            }
            else {
                socket.write("Opção inválida. Você gostaria de fazer login (L) ou se cadastrar (C)?");
            }
        }
        else {
            // Divida a mensagem em matrícula e senha.
            const [newMatricula, newSenha] = message.split(",");
            matricula = newMatricula.trim();
            senha = newSenha.trim();
            // Adicione o usuário ao array de usuários.
            users.push({ matricula, senha });
            isRegistering = false;
            socket.write("Cadastro concluído. Você pode fazer login agora.");
        }
        // Verifique se o usuário já está registrado.
        const user = users.find((u) => u.matricula === matricula && u.senha === senha);
        // Se o usuário estiver registrado, permita que ele faça login.
        if (user) {
            socket.write("Bem-vindo, " + user.matricula + "! Você está conectado.");
        }
        // Caso contrário, peça que o usuário se cadastre.
        else if (!isRegistering) {
            socket.write("Você não está registrado. Por favor, digite sua matrícula e senha separados por vírgula:");
        }
    });
    // Lide com o fechamento do soquete.
    socket.on("close", () => {
        console.log("Cliente desconectado.");
    });
});
// Inicie o servidor na porta 3000.
server.listen(3000, () => {
    console.log("Servidor socket ouvindo na porta 3000.");
});
