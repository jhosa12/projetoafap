import { useState, useEffect } from 'react';

export default function BarCode(){
  const [barcode, setBarcode] = useState<string>('');
  const [scannedCode, setScannedCode] = useState<string>('');

  useEffect(() => {
    let currentBarcode = '';
    let timeout: ReturnType<typeof setTimeout>;
    

    const handleKeyPress = (event: KeyboardEvent) => {
      // Verifica se a tecla "Enter" foi pressionada
      if (event.key === 'Enter') {
        setScannedCode(currentBarcode);
        console.log('Código de barras lido:', currentBarcode);
        currentBarcode = ''; // Reinicia o código de barras após a leitura
      } else {
        // Acumula os caracteres do código de barras
        currentBarcode += event.key;
      }

      // Limpa o buffer se não houver atividade por 300ms
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentBarcode = '';
      }, 300);
    };

    // Adiciona o ouvinte de eventos para capturar as teclas pressionadas
    document.addEventListener('keypress', handleKeyPress);

    // Remove o ouvinte de eventos quando o componente é desmontado
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  return (
    <div className='text-white'>
      <h1>Leitor de Código de Barras</h1>
      <p className='text-white'>Código lido: {scannedCode}</p>
    </div>
  );
};


