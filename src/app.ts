import express, { Request, Response } from 'express';
import { saveOutput } from './output';
import { parseCSV , validateData, ParsedData} from './csv_parser';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/process', async (req: Request, res: Response) => {
  res.status(200).send('Iniciando o processamento do arquivo CSV');
  
  try {
    console.log("Inicio do processamento do arquivo CSV em:", new Date().toLocaleTimeString());
    const data : ParsedData[] = await parseCSV('data.csv');
    if (!data) {
      throw new Error('Erro ao ler o arquivo CSV');
    }

    const results : Object = validateData(data);
    if (!results) {
      throw new Error('Erro ao validar os dados');
    }

    const saveOutputResult : boolean = await saveOutput(results);
    if (!saveOutputResult) {
      throw new Error('Erro ao salvar o arquivo JSON');
    }
    
    console.log("Fim do processamento do arquivo CSV em:", new Date().toLocaleTimeString());
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
