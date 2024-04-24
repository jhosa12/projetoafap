import React, { useContext, useEffect } from 'react';
import SorteioButton from '../../components/sorteador';
import { AuthContext } from '@/contexts/AuthContext';

const numeros = [10,11,12,13,14,15,16,17,18,19]; // ou qualquer outra lista de números

export default function Sorteios(){
  const {usuario,signOut} = useContext(AuthContext)
  useEffect(()=>{

    const user = !!usuario
    if(!user){ 
       signOut()
       return;
   }
  },[usuario])
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sorteio de Números</h1>
      <SorteioButton numeros={numeros} />
    </div>
  )
}


