"use client";

import { useContext, useState } from "react";
import { Avatar, Label } from "flowbite-react";
import { AuthContext } from "@/store/AuthContext";
import Image from "next/image";
import {
  Menu,
  Settings,
  LayoutDashboard,
  Box,
  RefreshCw,
  CreditCard,
  Users,
  PieChart,
  Gift,
  ShoppingCart,
  UserCog,
  Building2,
  FileSearch,
  Activity,
  BarChart2,
  Bell,
  LogOut,
  User,
  Home,
  FileCheck,
  FileClock,
  Settings as SettingsIcon,
  ChevronDown,
  MapPin,
  ListTree,
  FileText,
  NotepadText,
  Notebook,
  NotebookIcon,
  ListCollapse,
  NotebookText,
  ClipboardPlus,
  PiggyBank,
  Car
} from "lucide-react";

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


import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModalAtivosInativos } from "../modals/modalAtivosInativos";
import LinkNavigate from "../Link";

import { Historico } from "@/app/dashboard/gerenciarAdministrativo/_components/metas/historico/ScreenHistorico";
import { CompanySelectionModal } from "@/app/dashboard/empresa/_components/modal_filial";
import { Badge } from "../ui/badge";
import { NotBeforeError } from "jsonwebtoken";



export function Header({ path }: { path?: string }) {
  const {
    usuario,
    empresas,
    selectEmp,
    setSelectEmp,
    permissoes,
    infoEmpresa,
    signOut,
    bairrosEmpresa,
    cidadesEmpresa,
  } = useContext(AuthContext);

  const [openAtivos, setOpenAtivos] = useState(false);
  const [openFilial, setOpenFilial] = useState(true)
  const [openHistorico, setOpenHistorico] = useState(false)

  const isAllDisable = !!!infoEmpresa?.id
  const empresasPermitidas = empresas
    ?.filter((emp) => permissoes.includes(`EMP${emp.id}`))

  return (
    <div className="w-full border-b border-gray-200 bg-white px-3 py-1">
      <div className="flex items-center w-full justify-between">
        {/* LOGO + Empresa */}

        <div className="flex items-center gap-3">
          <Image width={40} height={40} src="/improved_logo.png" alt="Logo" />
          <div className="sm:flex flex-col">
            <Label className="text-xs" value="AFAP Gestão - V 2.0" />
            <Badge variant={'default'} className="justify-center" >{infoEmpresa?.nome}</Badge>
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
                <button onClick={() => setOpenAtivos(true)}>Ativos/Inativos</button>
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
                    <LinkNavigate href="/dashboard/usuarios">
                      Usuários
                    </LinkNavigate>
                    <LinkNavigate href="/dashboard/empresa">
                      Empresa
                    </LinkNavigate>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* DESKTOP: Menubar with Icons */}
        <div className="hidden lg:flex">
          <Menubar className="border-none shadow-none bg-transparent">
            {/* Administrativo */}
            <MenubarMenu>
              <MenubarTrigger
                disabled={isAllDisable}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[highlighted]:bg-accent data-[state=open]:bg-accent hover:bg-accent/80 transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Administrativo
              </MenubarTrigger>
              <MenubarContent className="min-w-[220px] p-2">
                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <FileText className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/admcontrato" >
                    Administrar Contrato
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <Box className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/estoque" >
                    Estoque
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <CreditCard className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/caixa" >
                    Caixa
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <RefreshCw className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/renovacao" >
                    Renovação
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <FileSearch className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/cobranca" >
                    Cobrança
                  </LinkNavigate>
                </MenubarItem>

                <MenubarSub>
                  <MenubarSubTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                    <UserCog className="h-4 w-4" />
                    Gerenciar
                  </MenubarSubTrigger>
                  <MenubarSubContent className="ml-1">
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <ListCollapse className="h-6 w-6" />
                      <LinkNavigate href="/dashboard/gerenciarAdministrativo/planoDeContas">
                        Plano de Contas
                      </LinkNavigate>
                    </MenubarItem>
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <NotebookText className="h-6 w-6" />
                      <LinkNavigate href="/dashboard/gerenciarAdministrativo/planos">
                        Planos
                      </LinkNavigate>
                    </MenubarItem>
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <ClipboardPlus className="h-6 w-6" />
                      <LinkNavigate href="/dashboard/gerenciarAdministrativo/convalescentes">
                        Convalescentes
                      </LinkNavigate>
                    </MenubarItem>
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <PiggyBank className="h-6 w-6" />
                      <LinkNavigate href="/dashboard/gerenciarAdministrativo/metasContas">
                        Metas Contas
                      </LinkNavigate>
                    </MenubarItem>
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <Car className="h-6 w-6" />
                      <LinkNavigate href="/dashboard/gerenciarAdministrativo/veiculos">
                        Veículos
                      </LinkNavigate>
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>




                <MenubarSub>
                  <MenubarSubTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                    <PieChart className="h-4 w-4" />
                    Financeiro
                  </MenubarSubTrigger>
                  <MenubarSubContent >
                    <MenubarItem><LinkNavigate href="/dashboard/financeiro/plano_contas">Plano de Contas</LinkNavigate></MenubarItem>
                    <MenubarItem>Fechamento de Caixa</MenubarItem>
                    <MenubarItem>Contas a Pagar/Receber</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <PieChart className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/financeiro" >
                    Financeiro
                  </LinkNavigate>
                </MenubarItem>

                <MenubarSub>
                  <MenubarSubTrigger
                    disabled={isAllDisable}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                  >
                    <Gift className="h-4 w-4" />
                    <span>Sorteios</span>
                  </MenubarSubTrigger>
                  <MenubarSubContent className="ml-1">
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <Gift className="h-4 w-4" />
                      <LinkNavigate href="/dashboard/sorteio" >
                        Sorteios
                      </LinkNavigate>
                    </MenubarItem>
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <SettingsIcon className="h-4 w-4" />
                      <LinkNavigate href="/dashboard/sorteio/configuracoes" >
                        Configurar Parâmetros
                      </LinkNavigate>
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            {/* Comercial */}
            <MenubarMenu>
              <MenubarTrigger
                disabled={isAllDisable}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[highlighted]:bg-accent data-[state=open]:bg-accent hover:bg-accent/80 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Comercial
              </MenubarTrigger>
              <MenubarContent className="min-w-[220px] p-2">
                <MenubarSub>
                  <MenubarSubTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                    <Activity className="h-4 w-4" />
                    <span>Vendas</span>
                  </MenubarSubTrigger>
                  <MenubarSubContent className="ml-1">
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                      <FileCheck className="h-4 w-4" />
                      <LinkNavigate href="/dashboard/vendas/acompanhamento" >
                        Acompanhamento
                      </LinkNavigate>
                    </MenubarItem>
                    <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => setOpenHistorico(true)}>

                      <FileClock className="h-4 w-4" />
                      <span>Historico</span>

                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>

                <MenubarItem
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                  onClick={() => setOpenAtivos(true)}
                >
                  <Users className="h-4 w-4" />
                  <span>Ativos/Inativos</span>
                </MenubarItem>

                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <Users className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/conveniados" >
                    Conveniados
                  </LinkNavigate>
                </MenubarItem>

                <MenubarItem
                  disabled={!permissoes?.includes("COM2.0")}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BarChart2 className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/analyze" >
                    DashBoard
                  </LinkNavigate>
                </MenubarItem>

                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <MapPin className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/cobranca/rotas" >
                    Rota de Cobrança
                  </LinkNavigate>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Serviços */}
            <MenubarMenu>
              <MenubarTrigger
                disabled={isAllDisable}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[highlighted]:bg-accent data-[state=open]:bg-accent hover:bg-accent/80 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Serviços
              </MenubarTrigger>
              <MenubarContent className="min-w-[180px] p-2">
                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <FileClock className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/servicos/listarObitos" >
                    Óbitos
                  </LinkNavigate>
                </MenubarItem>
                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <User className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/servicos/convalescencia/listagem" >
                    Convalescentes
                  </LinkNavigate>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            {/* Configurações */}
            <MenubarMenu>
              <MenubarTrigger
                disabled={isAllDisable}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[highlighted]:bg-accent data-[state=open]:bg-accent hover:bg-accent/80 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </MenubarTrigger>
              <MenubarContent className="min-w-[180px] p-2">
                <MenubarItem
                  disabled={!permissoes.includes("CFG1")}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Users className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/usuarios" >
                    Usuários
                  </LinkNavigate>
                </MenubarItem>

                <MenubarItem
                  disabled={!permissoes.includes("CFG1")}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Building2 className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/empresa" >
                    Empresa
                  </LinkNavigate>
                </MenubarItem>

                <MenubarItem className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                  <FileSearch className="h-4 w-4" />
                  <LinkNavigate href="/dashboard/auditoria" >
                    Auditoria
                  </LinkNavigate>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* USUÁRIO */}
        <div className="hidden sm:flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-accent transition-colors relative">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenFilial(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 h-8 text-xs font-medium rounded-md border-border/40 hover:bg-accent/80 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>TROCAR FILIAL</span>
          </Button>

          <div className="relative group">
            <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-accent transition-colors">
              <Avatar size="sm" rounded img={usuario?.image} />
              <span className="text-xs font-medium">{usuario?.nome}</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </button>

            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-popover border border-border/50 py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button
                onClick={signOut}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}

      <ModalAtivosInativos
        usuario={usuario?.nome}
        logo={infoEmpresa?.logoUrl}
        open={openAtivos}
        onClose={() => setOpenAtivos(false)}
        id_empresa={selectEmp}
        cidadesEmpresa={cidadesEmpresa}
        bairrosEmpresa={bairrosEmpresa}
      />

      {openHistorico && <Historico open={openHistorico} setOpen={setOpenHistorico} />}

      <CompanySelectionModal
        companies={empresasPermitidas}
        onOpenChange={() => setOpenFilial(false)}
        onSelectCompany={(emp) => setSelectEmp(emp.id)}
        open={openFilial}

      />
    </div>
  );
}
