import { toast } from "sonner";


interface SendParams {
        phone: string;
        message?: string;
    }


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

const handleWhatsAppClick = ({phone,message:messageSend = ''}:SendParams)=>{

  
    if (!phone) {
      toast.warning('Número inexistente');
      return;
    }
  
  
    const formattedNumber = formatPhoneNumber(phone);
    if (formattedNumber) {
        const message = encodeURIComponent(messageSend);
        const whatsappURL = `whatsapp://send?phone=${formattedNumber}&text=${message}`;
        window.open(whatsappURL);
    }
  }


  export default handleWhatsAppClick