
import { AuthContext } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useContext } from 'react';
import fototeste from '../../../public/fototeste.jpeg'
export default function Vendas() {
    const { usuario } = useContext(AuthContext)
    return (
        <>
            <div className="flex flex-col w-full text-white p-4">
                <h1 className="font-semibold text-lg">ACOMPANHAMENTO DE VENDAS</h1>
                <div className="inline-flex w-full bg-gray-800 h-16 rounded-lg">
                    {/*Conteudo da barra de Totais*/}
                </div>
                <div className="flex w-full mt-1 gap-2 ">
                    <div className="flex flex-grow w-5/12  items-end justify-center lg:h-[calc(100vh-180px)]">{/*DIV DO TOP3*/}

                        <div className="flex flex-col w-1/3 h-2/3 items-center gap-2 ">
                            <div className=" rounded-full overflow-hidden border-[2px] border-blue-600">
                                <Image
                                    className="object-cover"
                                    src={usuario?.dir ? `${usuario.dir}` : fototeste}
                                    width={70}
                                    height={70}
                                    alt=""
                                />
                            </div><div className="inline-flex rounded-t-lg h-full  w-full  bg-blue-600"></div></div>
                        <div className="flex flex-col w-1/3 h-4/5 items-center gap-2">
                        <div className=" rounded-full overflow-hidden border-[2px] border-yellow-600 ">
                                <Image
                                    className="object-cover"
                                    src={usuario?.dir ? `${usuario.dir}` : fototeste}
                                    width={70}
                                    height={70}
                                    alt=""
                                />
                            </div>
                            <div className="inline-flex h-full w-full rounded-t-lg   bg-yellow-600 "> </div></div>
                        <div className="flex flex-col w-1/3 h-1/2 items-center gap-2">
                        <div className=" rounded-full overflow-hidden border-[2px] border-teal-600">
                                <Image
                                    className="object-cover"
                                    src={usuario?.dir ? `${usuario.dir}` : fototeste}
                                    width={70}
                                    height={70}
                                    alt=""
                                />
                            </div>
                             <div className="inline-flex rounded-t-lg h-full w-full   bg-teal-600  "> </div></div>

                    </div>
                    <div className="flex flex-col w-2/3 bg-gray-800 rounded-lg">
                    </div>


                </div>

            </div>
        </>
    )
}