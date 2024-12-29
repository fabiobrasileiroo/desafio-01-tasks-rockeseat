import fs from 'node:fs';
import { Readable } from 'node:stream';
import { stringify } from 'csv-stringify';

async function run() {
  try {
    // Faz a requisição GET para buscar os dados
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }

    const tasks = await response.json();

    // Cria uma stream legível a partir dos dados recebidos
    const taskStream = Readable.from(tasks);

    // Cria uma stream para converter os dados em CSV
    const csvStream = stringify({
      header: true, // Adiciona o cabeçalho automaticamente
      columns: ['id', 'title', 'description', 'completed_at', 'created_at', 'updated_at'], // Define as colunas
    });

    // Cria um stream de escrita para o arquivo CSV
    const writeStream = fs.createWriteStream('./tasks_export.csv');

    // Encadeia as streams: dados -> CSV -> arquivo
    taskStream.pipe(csvStream).pipe(writeStream);

    writeStream.on('finish', () => {
      console.log('Dados salvos em tasks_export.csv com sucesso.');
    });

    writeStream.on('error', (err) => {
      console.error(`Erro ao escrever no arquivo: ${err.message}`);
    });
  } catch (error) {
    console.error(`Erro: ${error.message}`);
  }
}

run();
