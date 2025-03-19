







export function removerFusoDate(date: Date): { newDate: string } {
    const atual = new Date();
    const dateTime = new Date(date);
    dateTime.setHours(atual.getHours(), atual.getMinutes(), atual.getSeconds(), 0);
    const data = new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60 * 1000);
    return { newDate: data.toISOString() };
}
  
  
  




