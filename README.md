# Processamento de Dados CSV

Este serviço lê um arquivo CSV chamado `data.csv` e cria um arquivo de saída `output.json` no diretório output.

## Pré-requisitos

- **Docker**: Para buildar e iniciar a imagem do servidor em Node
- **Linux/MacOS**: O serviço pode ser executado tanto em sistemas Linux/MacOS.

## Como Rodar

### 1. Clonar o repositório

Clone o repositório para o seu ambiente local.

```bash
git clone https://github.com/seu-usuario/projeto-csv.git
cd projeto-csv
```

### 2. Inicializar o serviço

Para Linux/MacOS:

```bash
./start.sh
```

### 3. Processar arquivo

Entre no navegador pela rota http://localhost:3000/process. Se tudo ocorrer certo, a resposta será: "Iniciando o processamento do arquivo CSV".

### 3. Ler saída

Veja na pasta output o último arquivo json gerado. Os campos de validação e formatação de valores são os últimos isCpfValid, isCnpjValid, isPrestacaoValid, formattedTotal, formattedPrestacao.
Ex:

```json
    "isCpfValid": false,
    "isCnpjValid": false,
    "isPrestacaoValid": false,
    "formattedTotal": "R$ 83.720,19",
    "formattedPrestacao": "R$ 17.524,03"
```