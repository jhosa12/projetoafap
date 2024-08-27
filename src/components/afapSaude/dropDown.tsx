import { useState } from "react"
import { EventProps, MedicoProps } from "@/pages/afapSaude"


interface DadosProps{
    array:Array<MedicoProps>
    setarDataEvent :(fields:Partial<EventProps>)=>void
    dataEvent:Partial<EventProps>

}
export function DropDown({array,setarDataEvent,dataEvent}:DadosProps){
    const [onPress,setOnPress]=useState(false)
    return(
        
  <div className="flex flex-col relative w-full">
      <button disabled={!dataEvent.editar} onClick={()=>setOnPress(!onPress)} className="flex-shrink-0 w-full justify-between  inline-flex items-center py-2.5 px-4 text-sm font-medium text-center   border  rounded-lg  focus:ring-4 focus:outline-none  bg-gray-700 hover:bg-gray-600 focus:ring-gray-700 text-white border-gray-600" type="button">
      
         {!dataEvent.title ?"SELECIONE O ESPECIALISTA":dataEvent.title }<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
      </button>
  { onPress &&   <div  className="absolute top-12 z-10 w-full  divide-y divide-gray-100 rounded-lg shadow  bg-gray-700">
          <ul className="py-2 text-sm  text-gray-200" >
              {array.map(item=>(
                <li>
                <button onClick={()=> {setarDataEvent({...dataEvent,title:`${item.nome}-(${item.espec})`,id_med:item.id_med});setOnPress(!onPress)}} type="button" className="inline-flex w-full px-4 py-2 text-sm  text-gray-400 hover:bg-gray-600 hover:text-white">
                    <div className="inline-flex items-center gap-4">
                    <img className="w-[36px] h-[36px] rounded-full" src={`${process.env.NEXT_PUBLIC_API_URL}/file/${item.imageUrl}`} alt="Rounded avatar"></img>
                        {item.nome}-{`(${item.espec})`}
                    </div>
                </button>
            </li>
              ))}
         
             
          </ul>
      </div>}
    
  
  </div>


    )
}