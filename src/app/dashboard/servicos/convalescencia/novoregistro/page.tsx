import { Suspense } from "react";
import ConvalescenciaNovo from "../../_components/convalescentes/convalescente-novo";







export default function NovoRegistroConv(){



return(

    <Suspense fallback={<div>Carregando......</div>}>
             <ConvalescenciaNovo/>
    </Suspense>
   
)


}