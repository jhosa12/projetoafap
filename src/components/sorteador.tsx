import React, { useState, useEffect } from 'react';


interface SorteioButtonProps {
    numeros: number[];
  }
const SorteioButton = ({ numeros }:SorteioButtonProps) => {
    const [sorteado, setSorteado] = useState<number | null>(null);

  const sortearNumero = () => {
    const numeroSorteado = numeros[Math.floor(Math.random() * numeros.length)];
    setSorteado(numeroSorteado);
  };

  return (
    <div>
      <button
        onClick={sortearNumero}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Sortear
      </button>
      {sorteado && <div className="mt-4 text-white text-xl">{sorteado}</div>}
    </div>
  );
};

export default SorteioButton;