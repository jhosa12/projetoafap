
export function converterDataParaISO(dataString: string | Date | null | undefined): string | null {
  if (!dataString) return null;


  if (dataString instanceof Date) {
    if (!isNaN(dataString.getTime()))
      return dataString.toISOString()


    return null
  }


  if (typeof dataString === 'string' && dataString.includes('/')) {
    const partes = dataString.split(' ')[0].split('/');
    if (partes.length === 3) {
      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10);
      const ano = parseInt(partes[2], 10);


      if (!isNaN(dia) && !isNaN(mes) && !isNaN(ano) &&
        ano > 1900 && ano < 2100 &&
        mes >= 1 && mes <= 12 &&
        dia >= 1 && dia <= 31) {
        // Constrói a data em UTC para evitar problemas de fuso horário. O mês em Date.UTC é 0-indexado (0 = Janeiro).
        const dataUTC = new Date(Date.UTC(ano, mes - 1, dia, 12, 0, 0));

        // Checagem final para garantir que a data construída é válida (ex: evita "31/02/2025")
        if (dataUTC.getUTCFullYear() === ano && dataUTC.getUTCMonth() === mes - 1 && dataUTC.getUTCDate() === dia) {
          return dataUTC.toISOString();
        }
      }
    }
  }
  const data = new Date(dataString);
  return !isNaN(data.getTime()) ? data.toISOString() : null;

}