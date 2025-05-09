export function normalizarValor(valor: string): number {
  if (!valor) return 0;

  // Caso o número contenha "," e ".", pode ser "1.250,25"
  if (valor.includes('.') && valor.includes(',')) {
    // Remove separador de milhar (ponto), troca vírgula decimal por ponto
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
  }

  // Caso só tenha vírgula: "1250,25"
  if (valor.includes(',') && !valor.includes('.')) {
    return parseFloat(valor.replace(',', '.'));
  }

  // Caso só tenha ponto: "1250.25" (formato internacional)
  return parseFloat(valor);
}
