import socket
import os
# Caminho da pasta de arquivos do servidor
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
server_address = ('localhost', 5000)
sock.bind(server_address)

ip_address = sock.getsockname()[0]
port = sock.getsockname()[1]

file_server_path = './fileServer'
print('Arquivos encontrado em: /fileServer -> Servidor iniciado em', ip_address, 'na porta', port)

while True:
    data, address = sock.recvfrom(4096)

    # Verifica se a mensagem é uma solicitação de download de arquivo
    if data.startswith(b'DOWNLOAD'):

        # Extrai o nome do arquivo da mensagem
        filename = data.split(b' ')[1]

        # Verifica se o arquivo existe no servidor
        file_nEncontrado = "Arquivo não encontrado".encode('utf-8')
        file_path = file_server_path + filename.decode()
        if not os.path.isfile(file_path):
            sock.sendto(file_nEncontrado, address)
            continue

        # Envia o conteúdo do arquivo para o cliente em pedaços de 1024 bytes
        with open(file_path, 'rb') as f:
            file_data = f.read(1024)
            while file_data:
                sock.sendto(file_data, address)
                file_data = f.read(1024)

        # Indica ao cliente que a transferência foi concluída
        transf_concluida = 'Transferência concluída'.encode('utf-8')
        sock.sendto(transf_concluida, address)

    # Verifica se a mensagem é um upload de arquivo
    elif data.startswith(b'UPLOAD'):

        # Extrai o nome do arquivo da mensagem
        filename = data.split(b' ')[1]

        # Monta o caminho completo do arquivo no servidor
        file_path = os.path.join(file_server_path, filename.decode())

        # Recebe o arquivo do cliente em pedaços de 1024 bytes
        with open(file_path, 'wb') as f:
            while True:
                data, address = sock.recvfrom(1024)
                if not data:
                    break
                f.write(data)

        # Indica ao cliente que a transferência foi concluída
        transf_concluida = 'Arquivo enviado com sucesso'.encode('utf-8')
        sock.sendto(transf_concluida, address)

    else:
        # Processa outras mensagens
        pass
