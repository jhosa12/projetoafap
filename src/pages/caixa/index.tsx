import { MenuLateral } from "@/components/menu"

export default function CaixaMovimentar(){

return(
<>
<MenuLateral/>
<div className="flex w-full justify-center p-4">
<div className="flex flex-col w-11/12 border  rounded-lg shadow  border-gray-700 ">
    <div className="bg-gray-800 rounded-t-lg">
    <h1 className="text-gray-300 text-lg p-3 font-medium">Movimentação de Caixa</h1>
    </div>
    <div className="flex flex-col">
        <div className="flex flex-row p-2">
        <input className="block w-full pt-1 pb-1 pl-2 pr-2  border rounded-lg  sm:text-sm bg-gray-800 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"></input>
        </div>
      
        <table></table>
    </div>



</div>
</div>



</>
)




}