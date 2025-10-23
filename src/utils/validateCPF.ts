export function validateCPF(cpf: string): boolean {

   if(!cpf){
    return true;
   }
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se não é uma sequência repetida
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Valida os dois dígitos verificadores
  for (let j = 9; j < 11; j++) {
    let soma = 0;
    for (let i = 0; i < j; i++) {
      soma += parseInt(cpf.charAt(i)) * (j + 1 - i);
    }
    const resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11 ? 0 : resto !== parseInt(cpf.charAt(j))) {
      return false;
    }
  }

  return true;
}
