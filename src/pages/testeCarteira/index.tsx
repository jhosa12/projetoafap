import Image from "next/image"
import carteiraDep from "../../../public/CarteiraDep2019.jpg"

export default function Carteiras(){
    return(
      <div className="flex flex-col w-full text-white h-[calc(100vh-100px)] justify-center items-center">
          <div className="flex relative w-[360px] text-sm text-black justify-center items-center ">
        <Image alt={'carteiraDep'} src={carteiraDep} className="object-cover h-[220px]" ></Image>
        <span className="absolute z-20  top-[102px]  left-2">JOSE HENRIQUE</span>
        <span className="absolute z-20  top-[131px]  left-2">1358</span>
        <span className="absolute z-20  top-[131px]  left-[115px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[131px]  left-[235px]">PRIMO</span>
        <span className="absolute z-20  top-[161px]  left-2">GOLD PRIME 5</span>
        <span className="absolute z-20  top-[191px]  left-2">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[127px]">{new Date().toLocaleDateString()}</span>
        <span className="absolute z-20  top-[191px]  left-[244px]">{new Date().toLocaleDateString()}</span>
        </div>
     

      </div>
    )
}