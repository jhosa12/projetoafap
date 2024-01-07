import { useState } from "react"
import { IoIosClose } from "react-icons/io";

type UserData={
    closeModal:boolean,
    nome:string

}
type UserFormProps =UserData & {
    updateFields :(fields:Partial<UserData>)=>void
}

export function ModalBusca({nome,closeModal,updateFields}:UserFormProps){
    const [isOpen,setIsOpen] = useState(false)
    const [dropOpen,setDrop] = useState(false)
    const [criterio,setCriterio]=useState("Buscar Por")
    return(
   <div  className=" absolute w-screen h-[100vh] max-h-full">
    <div className="flex justify-center p-2 w-screen h-2/3 ">
      
        <div className="flex flex-col w-7/12 h-full rounded-lg shadow bg-gray-700">
            <div className="flex w-full items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
            <form className="flex w-3/4">
    <div className="flex w-full">
    <button onClick={()=>setDrop(!dropOpen)} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center rounded-s-lg focus:outline-none  bg-gray-600 hover:bg-gray-600 focus:ring-gray-700 text-white border-gray-600" type="button">{criterio} 
    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
  </svg></button>
 
      {dropOpen && (
          <div className="absolute top-[80px] divide-gray-100 rounded-lg shadow w-44 bg-gray-700">
          <ul className="py-2 text-sm text-gray-200">
          <li >
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Contrato'),setDrop(false)}}>Contrato</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Titular'),setDrop(false)}}>Titular</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white" onClick={()=>{setCriterio('Dependente'),setDrop(false)}}>Dependente</a>
          </li>
          <li>
              <a href="#" className="block px-4 py-2  hover:bg-gray-600 hover:text-white"  onClick={()=>{setCriterio('Endereço'),setDrop(false)}}>Endereço</a>
          </li>
          </ul>
      </div>
      )}
        <div className="relative  w-full">
            <input type="search" autoComplete="off" id="search-dropdown" className="flex justify-center  p-2.5 w-full z-20 text-sm  rounded-e-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500" placeholder="Search" required/>
            <button type="submit" className="absolute top-0 end-0 p-2.5 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"><svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
  </svg></button>
        </div>
    </div>
</form>
                <button onClick={()=>updateFields({closeModal:false})} type="button" className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <IoIosClose size={30}/>
                </button>
            </div>
            <div className="flex flex-col overflow-y-auto mb-1 p-2 md:p-2">
                <p className="text-gray-400 mb-2">Selecione o Contrato:</p>
                <ul className="overflow-y-visible space-y-2 mb-2">
                    <li onClick={()=>updateFields({closeModal:false})}>
                        <label  className="inline-flex items-center justify-between w-full p-2   rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600 text-white bg-gray-600 hover:bg-gray-500">                           
                            <div className="block">
                                <div className="w-full text-base font-semibold"><span className="pr-2">001</span> JOSÉ HENRIQUE BATISTA DE FREITAS </div>
                                <div className="w-full text-gray-400">
                                    Endereço:<span className="pr-2"> Agrovila Ubaldinho</span>
                                    Nº:<span className="pr-2"> 22</span>
                                    Bairro:<span className="pr-2"> Ubaldinho</span>
                                    Cidade:<span className="pr-2"> Cedro/CE</span>
                                    </div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180  text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li onClick={()=>updateFields({closeModal:false})}>
                        <label  className="inline-flex items-center justify-between w-full p-2   rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600 text-white bg-gray-600 hover:bg-gray-500">                           
                        <div className="block">
                                <div className="w-full text-base font-semibold"><span className="pr-2">001</span> JOSÉ HENRIQUE BATISTA DE FREITAS </div>
                                <div className="w-full text-gray-400">
                                    Endereço:<span className="pr-2"> Agrovila Ubaldinho</span>
                                    Nº:<span className="pr-2"> 22</span>
                                    Bairro:<span className="pr-2"> Ubaldinho</span>
                                    Cidade:<span className="pr-2"> Cedro/CE</span>
                                    </div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180  text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li onClick={()=>updateFields({closeModal:false})}>
                        <label  className="inline-flex items-center justify-between w-full p-2  rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600 text-white bg-gray-600 hover:bg-gray-500">                           
                        <div className="block">
                                <div className="w-full text-base font-semibold"><span className="pr-2">001</span> JOSÉ HENRIQUE BATISTA DE FREITAS </div>
                                <div className="w-full text-gray-400">
                                    Endereço:<span className="pr-2"> Agrovila Ubaldinho</span>
                                    Nº:<span className="pr-2"> 22</span>
                                    Bairro:<span className="pr-2"> Ubaldinho</span>
                                    Cidade:<span className="pr-2"> Cedro/CE</span>
                                    </div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li onClick={()=>updateFields({closeModal:false})}>
                        <label  className="inline-flex items-center justify-between w-full p-2 rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600 text-white bg-gray-600 hover:bg-gray-500">                           
                        <div className="block">
                                <div className="w-full text-base font-semibold"><span className="pr-2">001</span> JOSÉ HENRIQUE BATISTA DE FREITAS </div>
                                <div className="w-full text-gray-400">
                                    Endereço:<span className="pr-2"> Agrovila Ubaldinho</span>
                                    Nº:<span className="pr-2"> 22</span>
                                    Bairro:<span className="pr-2"> Ubaldinho</span>
                                    Cidade:<span className="pr-2"> Cedro/CE</span>
                                    </div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li onClick={()=>updateFields({closeModal:false})}>
                        <label  className="inline-flex items-center justify-between w-full p-2  rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600 text-white bg-gray-600 hover:bg-gray-500">                           
                        <div className="block">
                                <div className="w-full text-base font-semibold"><span className="pr-2">001</span> JOSÉ HENRIQUE BATISTA DE FREITAS </div>
                                <div className="w-full text-gray-400">
                                    Endereço:<span className="pr-2"> Agrovila Ubaldinho</span>
                                    Nº:<span className="pr-2"> 22</span>
                                    Bairro:<span className="pr-2"> Ubaldinho</span>
                                    Cidade:<span className="pr-2"> Cedro/CE</span>
                                    </div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li onClick={()=>setIsOpen(!isOpen)}>
                        <label  className="inline-flex items-center justify-between w-full p-2  rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600 text-white bg-gray-600 hover:bg-gray-500">                           
                        <div className="block">
                                <div className="w-full text-base font-semibold"><span className="pr-2">001</span> JOSÉ HENRIQUE BATISTA DE FREITAS </div>
                                <div className="w-full text-gray-400">
                                    Endereço:<span className="pr-2"> Agrovila Ubaldinho</span>
                                    Nº:<span className="pr-2"> 22</span>
                                    Bairro:<span className="pr-2"> Ubaldinho</span>
                                    Cidade:<span className="pr-2"> Cedro/CE</span>
                                    </div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li onClick={()=>setIsOpen(!isOpen)}>
                        <label  className="inline-flex items-center justify-between w-full p-2  rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600 text-white bg-gray-600 hover:bg-gray-500">                           
                        <div className="block">
                                <div className="w-full text-base font-semibold"><span className="pr-2">001</span> JOSÉ HENRIQUE BATISTA DE FREITAS </div>
                                <div className="w-full text-gray-400">
                                    Endereço:<span className="pr-2"> Agrovila Ubaldinho</span>
                                    Nº:<span className="pr-2"> 22</span>
                                    Bairro:<span className="pr-2"> Ubaldinho</span>
                                    Cidade:<span className="pr-2"> Cedro/CE</span>
                                    </div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li onClick={()=>setIsOpen(!isOpen)}>
                        <label  className="inline-flex items-center justify-between w-full p-2  rounded-lg cursor-pointer hover:text-gray-300 border-gray-500 peer-checked:text-blue-500 peer-checked:border-blue-600  text-white bg-gray-600 hover:bg-gray-500">                           
                        <div className="block">
                                <div className="w-full text-base font-semibold"><span className="pr-2">001</span> JOSÉ HENRIQUE BATISTA DE FREITAS </div>
                                <div className="w-full text-gray-400">
                                    Endereço:<span className="pr-2"> Agrovila Ubaldinho</span>
                                    Nº:<span className="pr-2"> 22</span>
                                    Bairro:<span className="pr-2"> Ubaldinho</span>
                                    Cidade:<span className="pr-2"> Cedro/CE</span>
                                    </div>
                            </div>
                            <svg className="w-4 h-4 ms-3 rtl:rotate-180 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
               
                </ul>
              
            </div>
        </div>
    </div>
</div> 


    
    )
}