import React from 'react';
import SorteioButton from '../../components/sorteador';

const numeros = [10,11,12,13,14,15,16,17,18,19]; // ou qualquer outra lista de números

export default function Sorteios(){
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sorteio de Números</h1>
      <SorteioButton numeros={numeros} />
    </div>
  )
}


