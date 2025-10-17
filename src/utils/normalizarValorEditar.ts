/**
 * Recebe um número ou string e retorna uma string formatada com vírgula como separador decimal.
 * Exemplo: 12.5 => "12,50", "12.5" => "12,50", "12,5" => "12,50"
 */
export function formatarComVirgula(valor: string | number | undefined | null): string {
  if (valor === undefined || valor === null || valor === '') return '';
  const num = typeof valor === 'string'
    ? parseFloat(valor.replace(',', '.'))
    : Number(valor);

  if (isNaN(num)) return '';
  return num.toFixed(2).replace('.', ',');
}