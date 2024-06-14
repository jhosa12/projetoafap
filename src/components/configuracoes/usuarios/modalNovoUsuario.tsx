import { ChangeEvent, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import sharp from 'sharp';
import { MdOutlineFileUpload } from "react-icons/md";



interface PermissoesProps {
    nome:string,
    val:boolean,
    tela:string
  }
interface Usuario{
    nome:string,
    senhaAtual:string,
    usuario:string,
    password:string,
    id:number|null,
    cargo:string,
    file:File|undefined,
    avataUrl:string,
    repSenha:string,
    editar:boolean,
    image:string
  
  }
interface UsuarioProps{
    setarDadosUsuario : (fields:Partial<Usuario>)=>void,
    dadosUser:Partial<Usuario>

}




export function ModalNovoUsuario({setarDadosUsuario,dadosUser}:UsuarioProps) {
  
    
   



    const handleFile = (e:ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files){
            return;
        }

const imagem = e.target.files[0];
if(!imagem ){
    return;
}
if(imagem.type==='image/jpeg' || imagem.type==='image/png'){
    setarDadosUsuario({...dadosUser,file:imagem,avataUrl:URL.createObjectURL(e.target.files[0]),image:''})
}


    }
    return (
       

           
                <div className=" flex flex-col  p-4 rounded-lg  shadow bg-gray-800">
                    
                    <h1 className="flex flex-row justify-start mb-4 border-b-[1px] text-lg border-gray-500 font-semibold mt-2 gap-2 text-white">ADICIONAR USUÁRIO</h1>

                    
                        <div className="inline-flex w-full gap-2 ">
                            <label className="flex w-60 h-40 justify-center cursor-pointer rounded-lg items-center border-[1px]">
                                <span className="z-50 absolute opacity-40 transition-all hover:scale-125">
                                    <MdOutlineFileUpload size={25}/>
                                </span>
                                <input  className="hidden" onChange={handleFile} type="file" accept="image/png,image/jpeg"></input>
                                {dadosUser.avataUrl && !dadosUser.image && <img className="w-full h-full object-cover rounded-lg" src={dadosUser.avataUrl} alt="fotoUser" width={150} height={100}></img>}

                                {dadosUser.image && !dadosUser.avataUrl && <img className="w-full h-full object-cover rounded-lg" src={`data:image/jpeg;base64,${dadosUser.image}`} alt="fotoUser" width={150} height={100}></img>}

                            </label>
                        <div className="grid  grid-cols-2 gap-2  w-full">
                        <div className=" col-span-1">
                                <label className="block  text-xs font-medium  text-white">NOME</label>
                                <input required  type="text" value={dadosUser.nome} onChange={e => setarDadosUsuario({...dadosUser,nome:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                         
                            <div className=" col-span-1">
                                <label className="block  text-xs font-medium  text-white">USUÁRIO</label>
                                <input required type="text" value={dadosUser.usuario} onChange={e => {setarDadosUsuario({...dadosUser,usuario:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className=" col-span-1">
                                <label className="block  text-xs font-medium  text-white">CARGO</label>
                                <input required type="text" value={dadosUser.cargo} onChange={e => {setarDadosUsuario({...dadosUser,cargo:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            {dadosUser.editar &&
                              <div className=" col-span-1">
                              <label className="block  text-xs font-medium  text-white">SENHA ATUAL</label>
                              <input required={!dadosUser.editar} type="password" value={dadosUser.senhaAtual} onChange={e => setarDadosUsuario({...dadosUser,senhaAtual:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                          </div>

                            }
                          
                            <div className=" col-span-1">
                                <label className="block  text-xs font-medium  text-white">NOVA SENHA</label>
                                <input required={!dadosUser.editar} type="password" value={dadosUser.password} onChange={e => {setarDadosUsuario({...dadosUser,password:e.target.value}) }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className=" col-span-1">
                                <label className="block  text-xs font-medium  text-white">REPITA A SENHA</label>
                                <input required={!dadosUser.editar} type="password" value={dadosUser.repSenha} onChange={e => setarDadosUsuario({...dadosUser,repSenha:e.target.value})} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                         

                        </div>


                        </div>
                      
             


                   
                </div>
           
       
    )
}
