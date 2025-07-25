"use client";

import { useContext, useState } from "react";
import { Avatar, Label } from "flowbite-react";
import { AuthContext } from "@/store/AuthContext";
import Router from "next/router";
import Image from "next/image";

import { LogIn, Menu } from "lucide-react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModalAtivosInativos } from "../modals/modalAtivosInativos";
import LinkNavigate from "../Link";
import { FaBell } from "react-icons/fa";
import { Historico } from "../vendas/historico/Historico";


export function Header({ path }: { path?: string }) {
  const {
    usuario,
    empresas,
    selectEmp,
    setSelectEmp,
    permissoes,
    infoEmpresa,
    signOut,
  } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white px-3 py-1">
      <div className="flex items-center w-full justify-between">
        {/* LOGO + Empresa */}
       
        <div className="flex items-center gap-3">
          <Image width={40} height={40} src="/improved_logo.png" alt="Logo" />
          <div className="sm:flex flex-col">
            <Label className="text-xs" value="AFAP Gestão - V 2.0" />
            <Select  value={selectEmp} onValueChange={setSelectEmp}>
              <SelectTrigger className="w-[150px] h-5 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {empresas
                    ?.filter((emp) => permissoes.includes(`EMP${emp.id}`))
                    .map((emp) => (
                      <SelectItem
                        key={emp.id}
                        value={emp.id}
                        className="text-xs"
                      >
                        {emp.nome}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* MOBILE: Menu hambúrguer */}
        <div className="lg:hidden flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-4">
              <div className="flex flex-col gap-4 text-sm">
                <h3 className="font-bold mb-2">Menu</h3>

                <span className="font-semibold text-gray-500">
                  Administrativo
                </span>
                <LinkNavigate href="/dashboard/admcontrato">
                  Administrar Contrato
                </LinkNavigate>
                <LinkNavigate href="/dashboard/estoque">Estoque</LinkNavigate>
                <LinkNavigate href="/dashboard/caixa">Caixa</LinkNavigate>
                <LinkNavigate href="/dashboard/renovacao">
                  Renovação
                </LinkNavigate>
                <LinkNavigate href="/dashboard/cobranca">Cobrança</LinkNavigate>
                <LinkNavigate href="/dashboard/gerenciarAdministrativo">
                  Gerenciar
                </LinkNavigate>
                <LinkNavigate href="/dashboard/financeiro">
                  Financeiro
                </LinkNavigate>
                <LinkNavigate href="/dashboard/analyze">DashBoard</LinkNavigate>
                <LinkNavigate href="/dashboard/sorteio">Sorteios</LinkNavigate>
                <LinkNavigate href="/dashboard/sorteio/configuracoes">
                  Configurações de Sorteio
                </LinkNavigate>

                <span className="font-semibold text-gray-500 mt-4">
                  Comercial
                </span>
                <LinkNavigate href="/dashboard/vendas">Vendas</LinkNavigate>
                <button onClick={() => setOpen(true)}>Ativos/Inativos</button>
                <LinkNavigate href="/dashboard/conveniados">
                  Conveniados
                </LinkNavigate>
                <LinkNavigate href="/chart">Gráficos</LinkNavigate>

                {permissoes.includes(
                  "EMP4e61a06f-dee3-4c74-8b31-aca0d771dbff"
                ) && (
                  <LinkNavigate href="/dashboard/afap-saude">
                    Afap Saúde
                  </LinkNavigate>
                )}

                <span className="font-semibold text-gray-500 mt-4">
                  Serviços
                </span>
                <LinkNavigate href="/dashboard/servicos/listarObitos">
                  Óbitos
                </LinkNavigate>
                <LinkNavigate href="/dashboard/servicos/convalescencia/listagem">
                  Convalescentes
                </LinkNavigate>

                {permissoes.includes("CFG1") && (
                  <>
                    <span className="font-semibold text-gray-500 mt-4">
                      Configurações
                    </span>
                    <LinkNavigate href="/settings/usuario">
                      Usuários
                    </LinkNavigate>
                    <LinkNavigate href="/settings/empresas">
                      Empresa
                    </LinkNavigate>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* DESKTOP: Menubar normal */}
        <div className="hidden lg:flex">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>Administrativo</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/admcontrato">
                    Administrar Contrato
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/estoque">Estoque</LinkNavigate>
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/caixa">Caixa</LinkNavigate>
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/renovacao">
                    Renovação
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/cobranca">
                    Cobrança
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/gerenciarAdministrativo">
                    Gerenciar
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/financeiro">
                    Financeiro
                  </LinkNavigate>
                </MenubarItem>

                <MenubarSub>
                  <MenubarSubTrigger>Sorteios</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>
                      <LinkNavigate href="/dashboard/sorteio">
                        Sorteios
                      </LinkNavigate>
                    </MenubarItem>
                    <MenubarItem>
                      <LinkNavigate href="/dashboard/sorteio/configuracoes">
                        Configurar Parâmetros
                      </LinkNavigate>
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Comercial</MenubarTrigger>
              <MenubarContent>

              <MenubarSub>
                  <MenubarSubTrigger>Vendas</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem>
                      <LinkNavigate href="/dashboard/vendas/acompanhamento">
                        Acompanhamento
                      </LinkNavigate>
                    </MenubarItem>
                    <MenubarItem asChild>
                      <Historico/>
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
             
                <MenubarItem
                  className="cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  Ativos/Inativos
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/conveniados">
                    Conveniados
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem disabled={!permissoes?.includes("COM2.0")}>
                  <LinkNavigate href="/dashboard/analyze">
                    DashBoard
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/cobranca/rotas">
                    Rota de Cobrança
                  </LinkNavigate>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* <MenubarMenu>
              <MenubarTrigger asChild>
                <button
                  className="disabled:cursor-not-allowed disabled:text-gray-400"
                  onClick={() => Router.push("/dashboard/afap-saude")}
                >
                  Afap Saúde
                </button>
              </MenubarTrigger>
            </MenubarMenu> */}

            <MenubarMenu>
              <MenubarTrigger>Serviços</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/servicos/listarObitos">
                    Óbitos
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem>
                  <LinkNavigate href="/dashboard/servicos/convalescencia/listagem">
                    Convalescentes
                  </LinkNavigate>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Configurações</MenubarTrigger>
              <MenubarContent>
                <MenubarItem disabled={!permissoes.includes("CFG1")}>
                  <LinkNavigate href="/settings/usuario">Usuários</LinkNavigate>
                </MenubarItem>
                <MenubarItem disabled={!permissoes.includes("CFG1")}>
                  <LinkNavigate href="/settings/empresas">Empresa</LinkNavigate>
                </MenubarItem>
                <MenubarItem >
                  <LinkNavigate href="/dashboard/auditoria">Auditoria</LinkNavigate>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* USUÁRIO */}
        <div className="hidden sm:flex items-center gap-4">
          <button>
            <FaBell size={14} />
          </button>
          <button onClick={signOut}>
            <LogIn color="black" size={15} />
          </button>
          <Avatar size="sm" rounded img={usuario?.image} />

          <span className="text-xs font-semibold">{usuario?.nome}</span>
        </div>
      </div>

      {/* Modal */}

      <ModalAtivosInativos
        usuario={usuario?.nome}
        logo={infoEmpresa?.logoUrl}
        open={open}
        onClose={() => setOpen(false)}
        id_empresa={selectEmp}
      />
    </header>
  );
}
