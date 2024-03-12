
import Map from "@/components/Map";
import { MenuLateral } from "@/components/menu";


export default function testeMapa(){
    return(
        <>
        <MenuLateral/>
           <div className="flex justify-center items-center h-screen">
             <Map lat={-6.604485482851719} lng={-39.067270917454486}/>
        </div>
        </>
     
       
    )
}