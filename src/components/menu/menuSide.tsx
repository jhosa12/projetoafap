


import { AuthContext, signOut } from "@/contexts/AuthContext";
import {  Drawer, Sidebar } from "flowbite-react";
import Link from "next/link";
import { useContext } from "react";
import { FaMoneyBillTrendUp } from "react-icons/fa6";



import { GiCardRandom } from "react-icons/gi";
import { HiBriefcase, HiCog } from "react-icons/hi";
import { HiArrowSmallLeft, HiMiniRectangleStack, HiWallet } from "react-icons/hi2";
import { MdMedicalServices } from "react-icons/md";

interface DataProps {
  isOpen: boolean,
  setClose: (open: boolean) => void
}

export default function SideBar({ isOpen, setClose }: DataProps) {

  const { permissoes } = useContext(AuthContext)

  return (
    <>


      <Drawer open={isOpen} onClose={() => setClose(false)}>
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Collapse label="Administrativo" icon={HiWallet}>
                  <Sidebar.Item as={Link} href='/admcontrato' > Administrar Contrato</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/reagendamento' >Reagendamento</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/caixa' >Caixa</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/renovacao' >Renovaçao</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/cobranca' >Cobrança</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/estoque' >Estoque</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/gerenciarAdministrativo' >Gerenciar</Sidebar.Item>
                </Sidebar.Collapse>
                <Sidebar.Collapse icon={HiBriefcase} label="Comercial">
                  <Sidebar.Item as={Link} href='/vendas' >Vendas</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/conveniados' >Conveniados</Sidebar.Item>
                </Sidebar.Collapse>
                <Sidebar.Item as={Link} href='/afapSaude' icon={MdMedicalServices}>
                  Afap Saúde
                </Sidebar.Item>
                <Sidebar.Collapse icon={HiMiniRectangleStack} label="Serviços">
                  <Sidebar.Item as={Link} href='/servicos/listarObitos' >Óbitos</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/servicos/convalescencia/listagem' >Convalescentes</Sidebar.Item>
                </Sidebar.Collapse>

                <Sidebar.Collapse icon={GiCardRandom} label="Sorteio">
                  <Sidebar.Item as={Link} href='/sorteio' >Sortear</Sidebar.Item>
                  <Sidebar.Item as={Link} href='/sorteio/configuracoes' >Configurar Parâmetros</Sidebar.Item>
                </Sidebar.Collapse>
                <Sidebar.Item as={Link} href='/financeiro' icon={FaMoneyBillTrendUp}>
                  Financeiro
                </Sidebar.Item>
                {permissoes?.includes("CFG1") && (
                  <Sidebar.Item as={Link} href='/configuracoes' icon={HiCog}>
                    Configurações
                  </Sidebar.Item>
                )}

                <Sidebar.Item icon={HiArrowSmallLeft}>
                  <button onClick={signOut}> Sign Up</button>
                </Sidebar.Item>



                <Sidebar.Item as={Link} href='/cod' icon={HiCog}>
                  BRCODE
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </Drawer.Items>
      </Drawer>

    </>
  )
}