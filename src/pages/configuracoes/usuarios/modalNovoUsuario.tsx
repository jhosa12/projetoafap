import { ChangeEvent, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { IoIosClose } from "react-icons/io";
import { MdOutlineFileUpload } from "react-icons/md";

interface ModalProps {

    setarModalEditar: () => void
}

interface PermissionsProps{
    button:string
}
interface UsuarioProps{
    nome:string,
    usuario:string,
    password:string,
    id:number,
    cargo:string,
    email:string,
    telefone:string,
    permissoes:PermissionsProps
}


export default function modalNovoUsuario({ setarModalEditar }: ModalProps) {
    const [avatarURL,setAvatarURL] = useState('');
    const  [imageAvatar,setImageAvatar] = useState<File>();

    const handleFile = (e:ChangeEvent<HTMLInputElement>)=>{
        if(!e.target.files){
            return;
        }

const image = e.target.files[0];
if(!image ){
    return;
}
if(image.type==='image/jpeg' || image.type==='image/png'){
    setImageAvatar(image);
    setAvatarURL(URL.createObjectURL(e.target.files[0]))

}


    }
    return (
        <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">

            <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
                <div className="fixed flex flex-col  w-2/4 p-4 rounded-lg  shadow bg-gray-800">
                    <button type="button" onClick={() => setarModalEditar()} className="absolute cursor-pointer top-0 right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                        <IoIosClose size={30} />
                    </button>
                    <h1 className="flex flex-row justify-start mb-4 border-b-[1px] text-lg border-gray-500 font-semibold mt-2 gap-2 text-white">EDITAR DADOS</h1>

                    <form >
                        <div className="inline-flex w-full gap-2 ">
                            <label className="flex w-60 h-40 justify-center cursor-pointer rounded-lg items-center border-[1px]">
                                <span className="z-50 absolute opacity-40 transition-all hover:scale-125">
                                    <MdOutlineFileUpload size={25}/>
                                </span>
                                <input className="hidden" onChange={handleFile} type="file" accept="image/png,image/jpeg"></input>
                                {avatarURL && <img src={avatarURL} alt="" width={150} height={100}></img>}

                            </label>
                        <div className="grid  grid-cols-2 gap-2  w-full">
                         
                            <div className=" col-span-1">
                                <label className="block  text-xs font-medium  text-white">NOME</label>
                                <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className=" col-span-1">
                                <label className="block  text-xs font-medium  text-white">CARGO</label>
                                <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className=" col-span-1">
                                <label className="block text-xs font-medium  text-white">E-MAIL</label>
                                <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div className=" col-span-1">
                                <label className="block  text-xs font-medium  text-white">TELEFFONE</label>
                                <input type="text" value={''} onChange={e => { }} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                            </div>

                        </div>


                        </div>
                      
             


                    </form>
                </div>
            </div>
        </div>
    )
}
