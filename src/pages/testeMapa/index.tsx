
import Map from "@/components/Map";
import { MenuLateral } from "@/components/menu";


export default function testeMapa(){
    return(
        <>
        <MenuLateral/>
           <div className="flex justify-center items-center h-screen">
             <Map lat={-6.605182802518718} lng={-39.05961651179807}/>
        </div>
        </>
     
       
    )
}