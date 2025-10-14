interface ZerarSorteioProps {
  setConfetes: (value: boolean) => void;
  premios: any[];
  setPremioAtual: (value: any | undefined) => void;
  setSorteado: (value: number) => void;
}

export function useZerarSorteio({ setConfetes, premios, setPremioAtual, setSorteado }: ZerarSorteioProps) {
  function zerarSorteio() {
    setConfetes(false);
    const premioSort = premios?.find(item => item.status !== 'S');
    setPremioAtual(premioSort ? premioSort : undefined);
    setSorteado(0);
  }

  return { zerarSorteio };
}