import SideBar from "@/components/sideBar"
import { MdOutlineNotifications } from "react-icons/md";
export default function testeLayout() {
  return (
    <div className="flex bg-slate-100">
      <SideBar />
      <div className="flex flex-col w-full">
        <div className=" shadow-sm flex flex-row justify-end items-center h-[70px]">
          <button className="rounded-lg mr-5 cursor-pointer hover:bg-slate-400"><MdOutlineNotifications size={25} /></button>
          <div className="bg-slate-300 mr-2 rounded-full w-[60px] h-[60px]"></div>
          <span className="flex flex-col mr-10 font-medium justify-center items-center">Henrique Freitas <span className="flex items-end text-[12px] font-sans">Consultor</span></span>
        </div>
        <div className=" flex flex-col w-full h-full">
          <h1 className="pl-4 pt-1 mb-2 font-medium w-full text-[20px]">Cadastro de Plano</h1>
          <div className="flex flex-row pl-4 gap-2">
            <div className="flex flex-col border-[1px] gap-1 border-slate-300  rounded-lg w-1/2 h-[220px]  shadow-lg">
              <h1 className="ml-2">Dados do Titular</h1>
              <div  className="flex flex-row gap-1 pl-2 pr-2 w-full h-[32px]">
                <input placeholder="Nome" className="p-2 rounded-lg w-3/5 border-2" type="text"></input>
                <input placeholder="Data Nasc." className="p-2 rounded-lg w-1/5 border-2" type="text"></input>
                <select className=" items-center justify-center pl-2 rounded-lg w-[74px] border-2">
                  <option>Sexo</option>
                  <option>M</option>
                  <option>F</option>
                </select>
              </div>
              <div  className="flex flex-row pl-2 pr-2 gap-1 w-full h-[32px]">
                <input placeholder="CEP" className=" p-2 rounded-lg w-1/5 border-2" type="text"/>
                <input placeholder="Endereço" className=" p-2 rounded-lg w-3/5 border-2" type="text"/>
                <input placeholder="Nº" className=" p-2 rounded-lg w-[75px] border-2" type="text"/>
                
              </div>
               <div  className=" flex flex-row pl-2 pr-2 gap-1 w-full h-[32px]">
                 <input placeholder="Bairro" className="p-2 rounded-lg w-3/6 border-2" type="text"></input>
                 <input placeholder="Referência" className="p-2 rounded-lg w-3/6 border-2" type="text"></input>
                <select  className=" items-center justify-center pl-2 rounded-lg w-[150px] border-2">
                  <option>Cedro</option>
                  <option>Lavras</option>
                  <option>Amaniutuba</option>
                </select>
                <select className="items-center justify-center rounded-lg w-[75px] border-2">
                  <option>CE</option>
                </select>
              </div>
               <div  className="flex flex-row pl-2 pr-2 gap-1 w-full h-[32px]">
                 <input placeholder="Email" className=" p-2 rounded-lg w-2/3 border-2" type="email"></input>
                <input placeholder="RG" className=" p-2 rounded-lg w-1/2 border-2" type="text"></input>
                <input placeholder="CPF" className=" p-2 rounded-lg w-1/2 border-2" type="text"></input>
               
              </div>
             <div  className="flex flex-row pl-2 pr-2 gap-1 w-full h-[32px]">
                 <input placeholder="Nome" className="placeholder-slate-400 p-2 rounded-lg w-3/5 border-[1px] border-gray-400" type="text"></input>
                <input placeholder="Data Nasc." className=" p-2 rounded-lg w-1/5 border-2" type="text"></input>
                <select  className=" items-center justify-center pl-2 rounded-lg w-[75px] border-2">
                  <option>Sexo</option>
                  <option>M</option>
                  <option>F</option>
                </select>
              </div>

             
            </div>
            <div className="border-[1px] border-slate-300 rounded-lg w-1/2 h-[220px]  shadow-lg"></div>
          </div>
          <div className="border-[1px] border-slate-300 rounded-lg mt-3  w-11/12 h-1/2 shadow-lg"></div>
        </div>
      </div>

    </div>
  );
}