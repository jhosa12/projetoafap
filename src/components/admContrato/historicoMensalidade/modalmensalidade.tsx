
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { GiReturnArrow } from "react-icons/gi";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalBody, ModalHeader, TextInput,Datepicker,Select,Checkbox, Button } from "flowbite-react";


interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
}

export function ModalMensalidade({openModal,setOpenModal}:DataProps){
    const {closeModa,data,usuario,dadosassociado,carregarDados,permissoes}=useContext(AuthContext)
    const [desconto,setDesconto] = useState(false)
    const [componentMounted, setComponentMounted] = useState(false);
    const [status,setStatus]=useState('')

        useEffect(()=>{
        //Faz com que o valor pago/total inicie com o valor principal

        closeModa({mensalidade:{...(data.mensalidade || {}),index:data.mensalidade?.index,data_pgto:new Date(),valor_total:data.mensalidade?.valor_principal}})
      
       
        if( data.mensalidade?.index || data.mensalidade?.index===0){
            dadosassociado?.mensalidade && closeModa({
               mensalidadeProx:{...dadosassociado?.mensalidade[data.mensalidade.index+1]},
           })
       
       }
      },[])
      useEffect(()=>{
      
          if((data.mensalidade?.index || data.mensalidade?.index===0) && componentMounted && dadosassociado?.mensalidade && dadosassociado?.mensalidade[data.mensalidade.index+1]){
              closeModa({
                  mensalidade: {
                      ...(status==='P'?dadosassociado?.mensalidade[data.mensalidade?.index +1]:dadosassociado?.mensalidade[data.mensalidade?.index]),
                      valor_total:status==='P'?dadosassociado?.mensalidade[data.mensalidade?.index+1].valor_principal:dadosassociado?.mensalidade[data.mensalidade?.index].valor_principal,
                      index:status==='P'?data.mensalidade?.index+1:data.mensalidade.index,
                    
                      data_pgto:new Date()
                  },
                
                    mensalidadeProx:{...(dadosassociado?.mensalidade[data.mensalidade.index+2]?dadosassociado.mensalidade[data.mensalidade?.index+2]:{})},
                
              });
         
              // Trate qualquer erro aqui
          }
      },[dadosassociado?.mensalidade]) 

      //useEffect(()=>{
        //Faz com que o valor pago/total inicie com o valor principal
             //   if(!data.mensalidade?.valor_total && data.mensalidade?.index){
              //   closeModa({mensalidade:{...(dadosassociado?.mensalidade[data.mensalidade?.index]),index:data.mensalidade?.index,close:true,data_pgto:new Date()}})
               //  }
           //   },[data.mensalidade?.index])
      async function baixarEstornar(status:string,acao:string) {
        setComponentMounted(true)
        setStatus(status)


        if(!data.mensalidade?.form_pagto){
            toast.warn('Informe a forma de pagamento!')
            
            return;
        }
        if(data.mensalidade.form_pagto!=='DINHEIRO'){
            if(!data.mensalidade.banco_dest){
                toast.warn('Informe o banco de destino')
                return;
            }
       
        }
        if(data.mensalidade?.status ===status){
            toast.error(`Mensalidade com ${acao} já realizado`)
            return;
        }
        if(dadosassociado?.contrato?.situacao==='INATIVO'){
            toast.info(`Contrato inativo, impossivel realizar ${acao}!`)
            return

        }
     
        if(data.mensalidadeAnt?.status==='A'|| data.mensalidadeAnt?.status==='E'){
            toast.info('A mensalidade anterior encontra-se em Aberto!')
            return
        }
        if(desconto===true && data.mensalidade?.motivo_bonus===''){
            toast.info("Informe o motivo do desconto!")
            return
        }
        try{
             await  toast.promise(
                api.put('/mensalidade',{
                    id_usuario:usuario?.id,
                    id_mensalidade:data.mensalidade?.id_mensalidade,
                    status:status,
                    data_pgto:status==='A'?null:data.mensalidade?.data_pgto && new Date(data.mensalidade?.data_pgto).toLocaleDateString()===new Date().toLocaleDateString()?new Date():data.mensalidade?.data_pgto?new Date(data.mensalidade?.data_pgto):null,
                    hora_pgto:status==='A'?null:data.mensalidade?.data_pgto && new Date(data.mensalidade?.data_pgto).toLocaleDateString()===new Date().toLocaleDateString()?new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}):data.mensalidade?.hora_pgto?data.mensalidade.hora_pgto:null,
                    usuario:status==='A'?null:usuario?.nome.toUpperCase(),
                    valor_total:status==='A'?null:data.mensalidade?.valor_total,
                    motivo_bonus:status==='A'?null:data.mensalidade?.motivo_bonus?.toUpperCase(),
                    estorno_dt:status==='P'?null:new Date(),
                    estorno_user:status==='P'?null:usuario?.nome,
                    associado:dadosassociado?.nome,
                    form_pagto:status==='A'?null:data.mensalidade?.form_pagto,
                    banco_dest:status==='A'?null:data.mensalidade.banco_dest,
                    empresa:dadosassociado?.empresa
                }),
                {
                  pending: `Efetuando ${acao}`,
                  success: `${acao} efetuada com sucesso`,
                  error: `Erro ao efetuar ${acao}`
                 })

                 if((data.mensalidade?.valor_principal ?? 0)<(data.mensalidade?.valor_total ?? 0) && data.mensalidadeProx && status ==='P'){
                    try{
                        const response = await api.put('/mensalidade',{
                            id_mensalidade:data.mensalidadeProx?.id_mensalidade,
                            valor_principal:Number(data.mensalidadeProx?.valor_principal)-(Number(data.mensalidade?.valor_total)-Number(data.mensalidade?.valor_principal))
                        })
                        
                            // closeModa({mensalidade:{...(data.mensalidade || {}),status:response.data.status}})
                    }catch(err){
                        toast.error('Erro ao Baixar Mensalidade')
                       
                    }  
        }
        if(((data.mensalidade?.valor_principal ?? 0)>(data.mensalidade?.valor_total ?? 0)) && desconto===false && data.mensalidadeProx && status ==='P'){
            try{
                const response = await api.put('/mensalidade',{
                    id_mensalidade:data.mensalidadeProx?.id_mensalidade,
                    valor_principal:Number(data.mensalidadeProx?.valor_principal ?? 0)+Number((data.mensalidade?.valor_principal ?? 0)-Number(data.mensalidade?.valor_total ?? 0))
                })
                    
                    // closeModa({mensalidade:{...(data.mensalidade || {}),status:response.data.status,valor_principal:response.data.valor_principal}})
            }catch(err){
                toast.error('Erro ao Baixar Mensalidade')
                console.log(err)
            } 
          
        }
     //closeModa({mensalidade:{...(data.mensalidade || {}),status:response.data.status}})
        }catch(err){
            toast.error('Erro ao Baixar Mensalidade') 
            console.log(err)
        }
      
       
 
        await carregarDados();
       
      
 
    }
    return(
 



 


<Modal
        className="absolute bg-transparent overflow-y-auto"
        content={"base"}
         show={openModal}
         onClose={()=>setOpenModal(false)}
          size={'4xl'}
           popup 
        
         dismissible
          >
           
            <ModalHeader className="flex text-white items-start justify-between bg-gray-700 rounded-t border-b p-2 border-gray-60">
             <h1 className="text-white">Editar Dados</h1>
                </ModalHeader>
            <ModalBody>
                <div className="grid grid-cols-4 px-2 mt-4 border-b-[1px] border-gray-500 mb-2 pb-2 max-h-[68vh] overflow-y-auto gap-2">
                <div className="mb-1 col-span-1 ">
<label  className="block mb-1 text-xs font-medium  text-black">REFERÊNCIA</label>
<TextInput disabled style={{padding:6}} value={data.mensalidade?.referencia} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),referencia:e.target.value}})} placeholder="REFERÊNCIA"/>
</div>

<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">VENCIMENTO</label>
    <Datepicker disabled={!permissoes.includes('ADM1.2.8')} className="absolute" labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e=>closeModa({mensalidade:{...data.mensalidade,vencimento:new Date(e)}})} value={data.mensalidade?.vencimento && new Date(data.mensalidade?.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})} language="pt-BR" style={{padding:6,paddingLeft:34}}/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">COBRANÇA</label>
    <Datepicker disabled={!permissoes.includes('ADM1.2.9')} className="absolute" labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e=>closeModa({mensalidade:{...data.mensalidade,cobranca:new Date(e)}})} value={data.mensalidade?.cobranca && new Date(data.mensalidade?.cobranca).toLocaleDateString('pt-BR',{timeZone:'UTC'})} language="pt-BR" style={{padding:6,paddingLeft:34}}/>
</div>

<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">VALOR</label>
    <TextInput disabled style={{padding:6}} value={data.mensalidade?.valor_principal} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),valor_principal:Number(e.target.value)}})} placeholder="VALOR PRINCIPAL"/>
</div>

<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">STATUS</label>
    <TextInput theme={{field:{input:{base:'block w-full border disabled:cursor-not-allowed disabled:opacity-50 font-bold'}}}} disabled style={{padding:6}} value={data.mensalidade?.status} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),status:e.target.value}})}  placeholder="STATUS"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">BAIXADA POR</label>
    <TextInput  disabled style={{padding:6}} value={data.mensalidade?.usuario} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),usuario:e.target.value}})} placeholder="BAIXADA POR "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">AGENDADA POR</label>
    <TextInput disabled style={{padding:6}} value={''} onChange={e=>{}} placeholder="AGENDADA POR"/>
</div>
<div className=" gap-2 col-span-4  flex flex-row justify-end">
<button type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22}/>SALVAR</button>


</div>


     
  
        
          </div>
          <div className="grid grid-cols-subgrid  col-span-4">
<label className="flex flex-row justify-center  font-semibold  text-black">BAIXA/STORNO</label>
</div>
          <div className="p-2  grid gap-2 grid-flow-row-dense grid-cols-5">

<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-black">VALOR PAGO</label>
<TextInput style={{padding:6}} value={data.mensalidade?.valor_total} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),valor_total:Number(e.target.value)}})} placeholder="VALOR PAGO"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">RECEBIDO POR</label>
    <TextInput style={{padding:6}} value={''} onChange={e=>{}} placeholder="RECEBIDO POR "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">FORMA PAG.</label>
    <Select  value={data.mensalidade?.form_pagto}  onChange={(e) =>closeModa({mensalidade: { ...data.mensalidade, form_pagto: e.target.value}})}  style={{padding:6}}>
            <option>{''}</option>
            <option value={'DINHEIRO'}>DINHEIRO</option>
            <option value={'PIX'}>PIX</option>
            <option value={'CARTAO'}>CARTÃO</option>
            <option value={'DEPOSITO'}>DEPOSITO</option>
            <option value={'TRANSFERENCIA'}>TRANSFERÊNCIA</option>
            <option value={'BOLETO'}>BOLETO</option>
    </Select>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">BANCO DESTINO</label>
    <Select  value={data.mensalidade?.banco_dest}  onChange={(e) =>closeModa({mensalidade: { ...data.mensalidade, banco_dest: e.target.value}})}  style={{padding:6}}>
            <option>{''}</option>
            <option value={'BANCO DO BRASIL'}>BANCO DO BRASIL</option>
            <option value={'CORA'}>CORA</option>
            <option value={'PAGBANK'}>PAGBANK</option>
            <option value={'CAIXA'}>CAIXA</option>
            <option value={'TON'}>TON</option>
    </Select>
</div>
<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-black">DATA PAG.</label>
<Datepicker disabled={!permissoes.includes('ADM1.2.7')} className="absolute" labelClearButton="Limpar" labelTodayButton="Hoje" onSelectedDateChanged={e=>closeModa({mensalidade:{...data.mensalidade,data_pgto:new Date(e)}})} value={data.mensalidade?.data_pgto && new Date(data.mensalidade?.data_pgto).toLocaleDateString('pt-BR',{timeZone:'UTC'})} language="pt-BR" style={{padding:6,paddingLeft:34,width:'80%'}}/>
</div>
{((data.mensalidade?.valor_total ?? 0)<(data.mensalidade?.valor_principal ?? 0) && data.mensalidade?.valor_total!==undefined)&& data.mensalidade.valor_total>0?(
 <div className="col-span-4 gap-1 mt-1 inline-flex ">
    <div className="flex items-top w-2/12 ">
    <Checkbox  onClick={()=>setDesconto(!desconto)}  checked={desconto} />
    <label  className="ms-2 text-sm font-medium text-gray-700">Desconto</label>
</div>
    <div className="mb-1 w-full">
  <label  className="block mb-1 text-xs font-medium  text-black">INFORME O MOTIVO DO DESCONTO</label>
  <TextInput value={data.mensalidade.motivo_bonus} onChange={e=>closeModa({mensalidade:{...(data.mensalidade || {}),motivo_bonus:e.target.value}})} disabled={!desconto || data.mensalidade.status==='P'} type="text" style={{padding:6}}/>
  </div>
 </div> 
):''}
  

</div>
          </ModalBody>

          <Modal.Footer>
            <div className="inline-flex w-full justify-between gap-4">
            <Button disabled={!permissoes.includes('ADM1.2.5')} color={'success'} onClick={()=>baixarEstornar('P','Baixa')} ><IoIosArrowDropdownCircle className="mr-2 h-5 w-5"/>BAIXAR</Button>
            <Button disabled={!permissoes.includes('ADM1.2.6')} color={'failure'} type="button" onClick={()=>baixarEstornar('A','Estorno')} ><GiReturnArrow className="mr-2 h-5 w-5"/> ESTORNAR</Button>
            </div>
    
        </Modal.Footer>

        </Modal>

)
}