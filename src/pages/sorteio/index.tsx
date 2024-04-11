import React from 'react';
import SorteioButton from '../../components/sorteador';

const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // ou qualquer outra lista de números

export default function Sorteios(){
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sorteio de Números</h1>
      <SorteioButton numeros={numeros} />
    </div>
  )
}


