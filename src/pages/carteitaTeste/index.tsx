import carteiraDep from "../../../public/carteiraDep.jpeg"
import Image from "next/image";

export default function CarteiraDep(){
    const dataAtual = new Date();
    //  const dt = dataAtual.toLocaleDateString('pt-BR', options)
    const venc = new Date(dataAtual.getFullYear() + 1, dataAtual.getMonth(), dataAtual.getDate())
  
    return (
        <div className="flex flex-col w-full px-2">
          <div className="grid  grid-cols-2 w-full justify-items-center gap-2">
            {//dependentes.map((item, index) => {
             // return (
                <div  className="flex col-span-1 relative w-[360px] text-sm text-black items-center justify-center">
                  <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" />
                  <span className="absolute top-[102px] left-2">JOSÉ HENRIQUE BATISTA DE FREITAS</span>
                  <span className="absolute  top-[131px] left-2">1254</span>
                  <span className="absolute  top-[131px] left-[115px]">{new Date().toLocaleDateString()}</span>
                  <span className="absolute  top-[131px] left-[235px]">PRIMO</span>
                  <span className="absolute  top-[161px] left-2">GOLD PiRIME 5</span>
                  <span className="absolute  top-[191px] left-2">{venc.toLocaleDateString()}</span>
                  <span className="absolute  top-[191px] left-[127px]">{dataAtual.toLocaleDateString()}</span>
                  <span className="absolute top-[191px] left-[244px]">{dataAtual.toLocaleDateString()}</span>
                </div>
          //    );
           // })
           }
          </div>
        </div>
      );
}