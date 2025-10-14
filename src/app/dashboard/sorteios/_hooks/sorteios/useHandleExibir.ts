interface ExibirProps {
  setConfetes: (value: boolean) => void;
  setGanhador: (value: any) => void;
}

export function useHandleExibir({ setConfetes, setGanhador }: ExibirProps) {

  async function exibir(sorteado: number) {
    const audio = new Audio('/audio/som2.mp3');
    if (sorteado !== 0) {
      await audio.play();
      setConfetes(true);
    } else {
      setGanhador({ associado: { nome: '', endereco: '', bairro: '', numero: null, cidade: '' } });
      setConfetes(false);
    }
  }

  return { exibir };
}