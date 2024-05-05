

export default function Vendas(){
    return(
        <>
        <div className="flex flex-col w-full text-white p-4">
           <h1 className="font-semibold text-lg">ACOMPANHAMENTO DE VENDAS</h1>
            <div className="inline-flex w-full bg-gray-800 h-16 rounded-lg">
                {/*Conteudo da barra de Totais*/}
            </div>
            <div className="inline-flex w-full mt-1 gap-2 ">
                <div className="inline-flex w-5/12  items-end  h-[calc(100vh-180px)]">{/*DIV DO TOP3*/}
                    <div className="inline-flex rounded-t-lg  w-1/3 h-1/2  bg-blue-600"> </div>
                    <div className="inline-flex rounded-t-lg   w-1/3 h-2/3 bg-yellow-600"> </div>
                    <div className="inline-flex rounded-t-lg   w-1/3 h-1/3 bg-teal-600"> </div>

                   

                </div>
                <div className="flex flex-col w-2/3 bg-gray-800 rounded-lg">


                </div>


            </div>

            </div>
        </>
    )
}