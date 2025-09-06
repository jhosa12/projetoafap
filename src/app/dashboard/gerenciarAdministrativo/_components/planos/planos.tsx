import { api } from "@/lib/axios/apiClient"
import { MdDelete } from "react-icons/md";
import { RiSaveFill } from "react-icons/ri";
import { IoMdAddCircle } from "react-icons/io";
import { TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";


interface PlanosProps{
    id_plano:number,
    descricao:string,
    limite_dep:number,
    valor:number,
    acrescimo:number 
    }
interface DadosProps{
    carregarDados:()=>Promise<void>
    arrayPlanos:Array<PlanosProps>,
    setarPlanos:(planoContas:Array<PlanosProps>)=>void

}

interface FormProps{
    descricao:string,
    limite:number,
    valor:number
}

export function GerenciarPlanos({carregarDados,arrayPlanos,setarPlanos}:DadosProps){
    const {register,watch,setValue,handleSubmit} = useForm<FormProps>()


const handleDescricao=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayPlanos]
    novoArray[index].descricao = event.target.value.toUpperCase()
    setarPlanos(novoArray)

}
const handleLimite=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayPlanos]
    novoArray[index].limite_dep = Number(event.target.value)
    setarPlanos(novoArray)

}
const handleValor=(index:number,event:React.ChangeEvent<HTMLInputElement>)=>{
    const novoArray = [...arrayPlanos]
    novoArray[index].valor = Number(event.target.value)
    setarPlanos(novoArray)

}

    const editarPlano = async(index:number)=>{
        const plano = arrayPlanos[index]
         toast.promise(
            api.put('/gerenciarAdministrativo/editarplano',{
                id_plano:plano.id_plano,
                descricao:plano.descricao,
                limite_dep:plano.limite_dep,
                valor:plano.valor

            }),
            {
                error:'Erro ao editar plano',
                loading:'Editando',
                success:()=>{
                    carregarDados()
                    return 'Editado com sucesso'}
            }
        )

    }

const deletarPlano = async(id_plano:number)=>{

    
    toast.promise(
        api.delete('/gerenciarAdministrativo/deletarplano',{
            data:{
                id_plano,
            }
        }),
        {
            error:'Erro ao deletar plano de conta',
            loading:'Deletando...',
            success:()=>{
                carregarDados()
                return 'Deletado com sucesso!'}
        }
    )

    

}



const adicionarPlano:SubmitHandler<FormProps> = async(data)=>{
    if(!data.descricao||!data.limite||!data.valor){
        toast.info('Preencha todos os campos!')
        return;
    }
 
        toast.promise(
            api.post('/gerenciarAdministrativo/adicionarPlano',{
                    limite_dep:Number(data.limite),
                    descricao:data.descricao.toUpperCase(),
                    valor :Number(data.valor) 
            }),
            {
                error:(error)=>{

                    return error.response.data.error},
                loading:'Adicionando...',
                success:'Adicionado com sucesso!'
            }
        )

   

    carregarDados()

}









    return(
        <div className="flex flex-col text-black font-semibold bg-white rounded-lg justify-between p-2 w-full max-h-[calc(100vh-130px)]   gap-2">
     
       
        <h1 className="flex w-full  font-medium">PLANOS</h1>


     
            <form onSubmit={handleSubmit(adicionarPlano)}  className="flex flex-row p-2 gap-2 w-5/12">
          
           
          <TextInput sizing={"sm"} value={watch('descricao')?.toUpperCase()} {...register('descricao')} placeholder="DESCRIÇÃO" autoComplete="off" type="text" required className="w-full "/>
          <TextInput sizing={"sm"}  {...register('limite')} placeholder="LIMITE" autoComplete="off" type="number" required className="  w-1/4  "/>
          <TextInput sizing={"sm"} {...register('valor')} placeholder="VALOR" autoComplete="off" type="number" required className="  w-1/4  "/>
          <button type="submit" className="font-semibold rounded-lg bg-blue-600 px-2 py-1 text-white hover:underline"><IoMdAddCircle size={20}/></button>
            </form>
        <table 
         className="block  overflow-y-auto overflow-x-auto text-xs text-left rtl:text-center border-collapse rounded-lg ">
            <thead className="sticky top-0 z-10  text-xs uppercase bg-gray-200 ">
                <tr>
                    <th scope="col" className=" px-4 py-2 whitespace-nowrap">
                        ID PLANO
                    </th>
               
                    <th scope="col" className="px-10 py-2">
                        DESCRIÇÃO
                    </th>
                    <th scope="col" className="px-10 py-2  whitespace-nowrap">
                        Limite Dep.
                    </th> 
                    <th scope="col" className="px-12 py-2 whitespace-nowrap">
                        VALOR R$
                    </th> 
                    <th scope="col" className="px-10 py-2">
                        AÇÕES
                    </th>
                </tr> 
            </thead>
            <tbody className="">
                {arrayPlanos?.map((item,index)=>(
               <tr key={index}  className={ `border-b  bg-gray-100 border-gray-300 w-full  `}>
                <td scope="row"  className="px-5 py-1  whitespace-nowrap">
                       {item.id_plano}
                </td>
                <td className="px-10 py-1 w-full whitespace-nowrap">
                    <TextInput sizing={'sm'} onChange={(event)=>handleDescricao(index,event)}  value={item.descricao} className="flex bg-transparent w-full " type="text" />
                </td>   
                <td className="px-10 py-1 w-full ">
                <TextInput sizing={'sm'} onChange={(event)=>handleLimite(index,event)}  value={item.limite_dep} className="flex bg-transparent w-full pl-2" type="text" />
                   
                </td>
                <td className="px-12 py-1 w-full ">
                    <TextInput sizing={'sm'} onChange={(event)=>handleValor(index,event)}  value={item.valor} className="flex bg-transparent w-full"/>
                </td>
                <td className="px-10 py-4 flex  text-center h-full text-gray-500 gap-2 ">
                    <button onClick={()=>editarPlano(index)} className=" hover:text-blue-600 "><RiSaveFill size={17}/></button>
                    <button onClick={()=>deletarPlano(item.id_plano)} className="  hover:text-red-600"><MdDelete size={17}/></button>
                </td>
               </tr>
               ))}
    
                
               
            </tbody>
        
        </table>
    
        
        </div>

    )
}