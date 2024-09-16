import { Modal, ModalHeader, Spinner } from "flowbite-react";
import { useEffect } from "react";




interface DataProps{
   // setScannedCode:(code:string)=>void
    openModal:boolean,
    setModal:(open:boolean)=>void,
    verficarTicket :(scan:string)=>void
}



export function Scanner({openModal,setModal,verficarTicket}:DataProps){


    useEffect(() => {
        let currentBarcode = '';
        let timeout: ReturnType<typeof setTimeout>;
        
    
        const handleKeyPress = (event: KeyboardEvent) => {
          // Verifica se a tecla "Enter" foi pressionada
          if (event.key === 'Enter') {
          //  setScannedCode(currentBarcode);
          verficarTicket(currentBarcode)
            currentBarcode = ''; // Reinicia o código de barras após a leitura
            setModal(false)
          } else {
            // Acumula os caracteres do código de barras
            currentBarcode += event.key;
          }
    
          // Limpa o buffer se não houver atividade por 300ms
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            currentBarcode = '';
          }, 300);
        };
    
        // Adiciona o ouvinte de eventos para capturar as teclas pressionadas
        document.addEventListener('keypress', handleKeyPress);
    
        // Remove o ouvinte de eventos quando o componente é desmontado
        return () => {
          document.removeEventListener('keypress', handleKeyPress);
        };
      }, []);


    return(


        <Modal popup show onClose={()=>setModal(false)}>
            <ModalHeader/>
            <Modal.Body>
            <div className="flex flex-col w-full justify-center items-center">
            <Spinner aria-label="Extra large spinner example" size="xl" />
            <p>Aguardando leitura......</p>   
            </div>

            </Modal.Body>

        </Modal>
    )
}