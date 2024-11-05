




export function ajustarData(startDate: Date|undefined,endDate?: Date): {dataIni:string|undefined,dataFim:string|undefined} {
  let  dataIn:Date|undefined = startDate && new Date(startDate)
   let dataOut:Date|undefined =endDate && new Date(endDate)

   if (dataIn){
    dataIn?.setTime(dataIn?.getTime() - dataIn?.getTimezoneOffset()*60*1000)
    //dataOut.setTime(dataOut.getTime() - dataOut.getTimezoneOffset()*60*1000)
    dataIn.setUTCHours(0,0,0,0)
  

   }else{
    dataIn = undefined
   }

   if(dataOut){
    dataOut.setUTCHours(23,59,59,999)
   }else{
    dataOut = undefined
   }
  
  



    return {
        dataIni: dataIn?.toISOString(),
        dataFim: dataOut?.toISOString()
    }
    
} 


