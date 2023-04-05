const dgram = require("dgram");
const fs = require("fs");

const client = dgram.createSocket("udp4");
const serverPort = 5000;
const serverAddress = "localhost";

// Função que envia um arquivo para o servidor
function sendFile(filePath) {
  // Extrai o nome do arquivo do caminho
  const fileName = filePath.split("/").pop();

  // Cria uma mensagem com o nome do arquivo
  const message = `UPLOAD ${fileName}`;

  // Envia a mensagem para o servidor
  client.send(message, serverPort, serverAddress, (error) => {
    if (error) {
      console.log(`Erro ao enviar mensagem: ${error}`);
      return;
    }

    console.log(`Enviando arquivo ${filePath} para o servidor...`);

    // Lê o conteúdo do arquivo e envia em pedaços de 1024 bytes
    const fileStream = fs.createReadStream(filePath);
    fileStream.on("data", (chunk) => {
      client.send(chunk, serverPort, serverAddress);
    });

    // Indica ao servidor que a transferência foi concluída
    fileStream.on("end", () => {
      const message = "TRANSFERENCIA CONCLUIDA";
      client.send(message, serverPort, serverAddress);
    });
  });
}

// Função que solicita um arquivo ao servidor
function downloadFile(fileName) {
  // Cria uma mensagem com o nome do arquivo
  const message = `DOWNLOAD ${fileName}`;

  // Envia a mensagem para o servidor
  client.send(message, serverPort, serverAddress, (error) => {
    if (error) {
      console.log(`Erro ao enviar mensagem: ${error}`);
      return;
    }

    console.log(`Baixando arquivo ${fileName} do servidor...`);

    // Cria um stream de escrita para salvar o arquivo
    const fileStream = fs.createWriteStream(`./${fileName}`);

    // Recebe o conteúdo do arquivo em pedaços de 1024 bytes
    client.on("message", (message, remote) => {
      if (message == "ARQUIVO NAO ENCONTRADO") {
        console.log("Arquivo não encontrado no servidor");
        fileStream.end();
        return;
      }

      if (message == "TRANSFERENCIA CONCLUIDA") {
        console.log(`Arquivo ${fileName} baixado com sucesso!`);
        fileStream.end();
        return;
      }

      fileStream.write(message);
    });
  });
}

// Exemplo de uso
sendFile("ex.txt");
downloadFile("example.txt");
