"use client"

import { useContext, useState } from "react";
import { Avatar, Label } from "flowbite-react";
import { AuthContext } from "@/store/AuthContext";
import Router from "next/router";
import Link from "next/link";
import Image from "next/image";

import { Bell, LogIn, Menu } from "lucide-react";

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

export function Header() {
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
    <header className="w-full border-b border-gray-200 bg-white px-3 py-2">
      <div className="flex items-center w-full justify-between">
        {/* LOGO + Empresa */}
        <div className="flex items-center gap-3">
          <Image width={40} height={40} src="/improved_logo.png" alt="Logo" />
          <div className="sm:flex flex-col">
            <Label value="AFAP Gestão - V 2.0" />
            <Select value={selectEmp} onValueChange={setSelectEmp}>
              <SelectTrigger className="w-[150px] h-6 text-xs">
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

                <span className="font-semibold text-gray-500">Administrativo</span>
                <Link href="/dashboard/admcontrato">Administrar Contrato</Link>
                <Link href="/dashboard/estoque">Estoque</Link>
                <Link href="/dashboard/caixa">Caixa</Link>
                <Link href="/dashboard/renovacao">Renovação</Link>
                <Link href="/dashboard/cobranca">Cobrança</Link>
                <Link href="/dashboard/gerenciarAdministrativo">Gerenciar</Link>
                <Link href="/dashboard/financeiro">Financeiro</Link>
                <Link href="/dashboard/sorteio">Sorteios</Link>
                <Link href="/dashboard/sorteio/configuracoes">Configurações de Sorteio</Link>

                <span className="font-semibold text-gray-500 mt-4">Comercial</span>
                <Link href="/dashboard/vendas">Vendas</Link>
                <button onClick={() => setOpen(true)}>Ativos/Inativos</button>
                <Link href="/dashboard/conveniados">Conveniados</Link>
                <Link href="/chart">Gráficos</Link>

                {permissoes.includes("EMP4e61a06f-dee3-4c74-8b31-aca0d771dbff") && (
                  <Link href="/dashboard/afapSaude">Afap Saúde</Link>
                )}

                <span className="font-semibold text-gray-500 mt-4">Serviços</span>
                <Link href="/dashboard/servicos/listarObitos">Óbitos</Link>
                <Link href="/dashboard/servicos/convalescencia/listagem">Convalescentes</Link>

                {permissoes.includes("CFG1") && (
                  <>
                    <span className="font-semibold text-gray-500 mt-4">Configurações</span>
                    <Link href="/settings/usuario">Usuários</Link>
                    <Link href="/settings/empresas">Empresa</Link>
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
                  <Link href="/dashboard/admcontrato">Administrar Contrato</Link>
                </MenubarItem>
                <MenubarItem><Link href="/dashboard/estoque">Estoque</Link></MenubarItem>
                <MenubarItem><Link href="/dashboard/caixa">Caixa</Link></MenubarItem>
                <MenubarItem><Link href="/dashboard/renovacao">Renovação</Link></MenubarItem>
                <MenubarItem><Link href="/dashboard/cobranca">Cobrança</Link></MenubarItem>
                <MenubarItem><Link href="/dashboard/gerenciarAdministrativo">Gerenciar</Link></MenubarItem>
                <MenubarItem><Link href="/dashboard/financeiro">Financeiro</Link></MenubarItem>
                <MenubarSub>
                  <MenubarSubTrigger>Sorteios</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem><Link href="/dashboard/sorteio">Sorteios</Link></MenubarItem>
                    <MenubarItem><Link href="/dashboard/sorteio/configuracoes">Configurar Parâmetros</Link></MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Comercial</MenubarTrigger>
              <MenubarContent>
                <MenubarItem><Link href="/dashboard/vendas">Vendas</Link></MenubarItem>
                <MenubarItem onClick={() => setOpen(true)}>
                  <span>Ativos/Inativos</span>
                </MenubarItem>
                <MenubarItem><Link href="/dashboard/conveniados">Conveniados</Link></MenubarItem>
                <MenubarItem><Link href="/chart">Gráficos</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger asChild>
                <button
                  disabled={!permissoes.includes("EMP4e61a06f-dee3-4c74-8b31-aca0d771dbff")}
                  className="disabled:cursor-not-allowed disabled:text-gray-400"
                  onClick={() => Router.push("/dashboard/afapSaude")}
                >
                  Afap Saúde
                </button>
              </MenubarTrigger>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Serviços</MenubarTrigger>
              <MenubarContent>
                <MenubarItem><Link href="/dashboard/servicos/listarObitos">Óbitos</Link></MenubarItem>
                <MenubarItem><Link href="/dashboard/servicos/convalescencia/listagem">Convalescentes</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger>Configurações</MenubarTrigger>
              <MenubarContent>
                <MenubarItem disabled={!permissoes.includes("CFG1")}><Link href="/settings/usuario">Usuários</Link></MenubarItem>
                <MenubarItem disabled={!permissoes.includes("CFG1")}><Link href="/settings/empresas">Empresa</Link></MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* USUÁRIO */}
        <div className="hidden sm:flex items-center gap-4">
          <Button variant="secondary">
            <Bell size={20} />
          </Button>
          <Button onClick={signOut} variant="secondary">
            <LogIn size={20} />
          </Button>
          <Avatar rounded img={usuario?.image} />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">{usuario?.nome}</span>
            <span className="text-xs">{usuario?.cargo}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <ModalAtivosInativos
          usuario={usuario?.nome}
          logo={infoEmpresa?.logoUrl}
          open={open}
          onClose={() => setOpen(false)}
          id_empresa={selectEmp}
        />
      )}
    </header>
  );
}
