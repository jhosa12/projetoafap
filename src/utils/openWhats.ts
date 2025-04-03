import { toast } from "sonner";



const formatPhoneNumber = (phoneNumber: string) => {
    // Remove todos os caracteres que não sejam números
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Verifica se o telefone tem 11 dígitos (2 dígitos DDD + 9 dígitos número)
    if (cleaned.length === 11) {
        // Adiciona o código do país (Brasil: +55)
        return `55${cleaned}`;
    } else {
        toast.error('Número de telefone inválido');
        return null;
    }
};

const handleWhatsAppClick = (celular: string|undefined)=>{

  
    if (!celular) {
      toast.warning('Número inexistente');
      return;
    }
  
  
    const formattedNumber = formatPhoneNumber(celular);
    if (formattedNumber) {
        const message = encodeURIComponent("Olá, gostaria de agendar uma consulta ?");
        const whatsappURL = `whatsapp://send?phone=${formattedNumber}&text=${message}`;
        window.open(whatsappURL);
    }
  }


  export default handleWhatsAppClick