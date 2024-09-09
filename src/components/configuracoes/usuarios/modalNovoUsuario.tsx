import { ChangeEvent, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import sharp from 'sharp';
import { MdOutlineFileUpload } from "react-icons/md";
import { Button, Card, FloatingLabel, Modal, ToggleSwitch } from "flowbite-react";
import { Permissoes } from "./permissoes/permisssoes";
import { ModalPassword } from "./modalPassword";




interface Usuario{
    nome:string,
    senhaAtual:string,
    usuario:string,
    password:string,
    id_user:string,
    cargo:string,
    file:File|undefined,
    avataUrl:string,
    repSenha:string,
    editar:boolean,
    image:string,
    permissoes:Array<string>
    
  }
interface UsuarioProps{
    setarDadosUsuario : (fields:Partial<Usuario>)=>void,
    dadosUser:Partial<Usuario>
    show:boolean,
    setModal:(open:boolean)=>void
    handlePermission:(permission:string)=>void
    handleNovoCadastro:()=>Promise<void>;
    handleEditarCadastro:()=>Promise<void>

}




export function ModalNovoUsuario({setarDadosUsuario,dadosUser,setModal,show,handlePermission,handleEditarCadastro,handleNovoCadastro}:UsuarioProps) {
  const [modalPass,setModalPass] = useState<boolean>(false)
    
   



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
       
<Modal dismissible size={'7xl'} show={show} onClose={()=>setModal(false)} popup>
           
          <Modal.Header />   
                    <Modal.Body>
                    
                        <div className="inline-flex w-full gap-2 ">

<Card theme={{root:{children:"flex h-full flex-col  gap-4 p-6"}}} >
    <div className="flex w-full relative">
                            <label className="flex w-60 h-40 justify-center cursor-pointer rounded-lg items-center border-[1px]">
                                <span className="z-50 absolute opacity-40 transition-all hover:scale-125">
                                    <MdOutlineFileUpload size={25}/>
                                </span>
                                <input  className="hidden" onChange={handleFile} type="file" accept="image/png,image/jpeg"></input>
                                {dadosUser.avataUrl && !dadosUser.image && <img className="w-full h-full object-cover rounded-lg" src={dadosUser.avataUrl} alt="fotoUser" width={150} height={100}></img>}

                                {dadosUser.image && !dadosUser.avataUrl && <img className="w-full h-full object-cover rounded-lg" src={`data:image/jpeg;base64,${dadosUser.image}`} alt="fotoUser" width={150} height={100}></img>}

                            </label>
                            </div>
                        <div className="flex flex-col  w-full gap-2">
                        
                               
                                <FloatingLabel variant='standard' label="Nome" required  type="text" value={dadosUser.nome} onChange={e => setarDadosUsuario({...dadosUser,nome:e.target.value})}  />
                            
                         
                           
                              
                                <FloatingLabel label="Usuário" variant="standard" required type="text" value={dadosUser.usuario} onChange={e => {setarDadosUsuario({...dadosUser,usuario:e.target.value}) }}  />
                          
                           
                                <FloatingLabel label="Cargo" variant="standard" required type="text" value={dadosUser.cargo} onChange={e => {setarDadosUsuario({...dadosUser,cargo:e.target.value}) }}  />
                               {!dadosUser.id_user ? 
                               <FloatingLabel label="Senha" variant="standard" required type="text" value={dadosUser.password} onChange={e => {setarDadosUsuario({...dadosUser,password:e.target.value}) }} />:
                               <Button onClick={()=>setModalPass(true)}>
                                Alterar Senha
                               </Button>
                                }
                        </div>

                        </Card>
                       

                     <Permissoes handlePermission={handlePermission} permissions={dadosUser.permissoes??[]}/>
                        </div>

                        <div className="flex w-full justify-end">
                           {dadosUser.id_user ? <Button onClick={()=>handleEditarCadastro()}>Gravar alterações</Button>:<Button onClick={()=>handleNovoCadastro()}>Salvar</Button>}
                        </div>
                      
                        </Modal.Body>


                   <ModalPassword id_user={dadosUser.id_user??''} openModal={modalPass} setOpenModal={setModalPass}/>
               
                </Modal>
       
    )
}
