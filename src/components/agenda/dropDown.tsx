import { useState } from "react"


interface ArrayProps{
    id_med:number,
    espec:string,
    nome:string,
    image:string
    
}
interface EventoProps{
    id_ag :number
    id_med:number
    data:Date
    start:Date
    end:Date
    title:string
    status: string
}

interface DadosProps{
    array:Array<ArrayProps>
    setarDataEvent :(fields:Partial<EventoProps>)=>void
    dataEvent:Partial<EventoProps>

}


export function DropDown({array,setarDataEvent,dataEvent}:DadosProps){
    const [onPress,setOnPress]=useState(false)
    return(
        
  <div className="flex flex-col relative w-full">
      <button onClick={()=>setOnPress(!onPress)} className="flex-shrink-0 w-full justify-between z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
      
         {!dataEvent.title ?"SELECIONE O ESPECIALISTA":dataEvent.title }<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
      </button>
  { onPress &&   <div  className="absolute top-12 z-10 w-full bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >
              {array.map(item=>(
                <li>
                <button onClick={()=> {setarDataEvent({...dataEvent,title:`${item.nome}-(${item.espec})`});setOnPress(!onPress)}} type="button" className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                    <div className="inline-flex items-center gap-4">
                    <img className="w-[36px] h-[36px] rounded-full" src={`data:image/jpeg;base64,${item.image}`} alt="Rounded avatar"></img>
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