import { ChangeEvent, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { Permissoes } from "./permissoes/permisssoes";
import { ModalPassword } from "./modalPassword";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PerfisUser } from "./perfisUser";
import { UsuarioProps } from "../_types/editar-usuario";
import { ActionsFunctionsApi } from "@/types/actions";
import { Settings } from "lucide-react";



interface DataProps {
    setarDadosUsuario: (fields: Partial<UsuarioProps>) => void,
    dadosUser: Partial<UsuarioProps>
    show: boolean,
    setModal: (open: boolean) => void
    handlePermission: (permission: string) => void
    handleNovoCadastro: ({actions}:ActionsFunctionsApi) => Promise<void>;
    handleEditarCadastro: () => Promise<void>
}


export function ModalNovoUsuario({ setarDadosUsuario, dadosUser, setModal, show, handlePermission, handleEditarCadastro, handleNovoCadastro }: DataProps) {
    const [modalPass, setModalPass] = useState<boolean>(false)
    const [modalPermissoes, setModalPermissoes] = useState<boolean>(false)



    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const imagem = e.target.files[0];
        if (!imagem) {
            return;
        }
        if (imagem.type === 'image/jpeg' || imagem.type === 'image/png') {
            setarDadosUsuario({ ...dadosUser, file: imagem, avatarUrl: URL.createObjectURL(e.target.files[0]), image: '' })

        }


    }
    return (

        <Dialog open={show} onOpenChange={setModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{dadosUser.id_user ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
                </DialogHeader>

                <div className="w-full">

                    <Card className="flex h-full flex-col gap-4 p-6">
                        <div className="flex w-full relative">
                            <label htmlFor="file" className="flex w-full h-40 justify-center cursor-pointer rounded-lg items-center border-[1px]">
                                <span className="z-50 absolute opacity-40 transition-all hover:scale-125">
                                    <MdOutlineFileUpload size={25} />
                                </span>
                                <input id="file" className="hidden" onChange={handleFile} type="file" accept="image/png,image/jpeg"></input>
                                {dadosUser.avatarUrl && !dadosUser.image && <img className="w-full h-full object-cover rounded-lg" src={dadosUser.avatarUrl} alt="fotoUser" width={150} height={100}></img>}

                                {dadosUser.image && !dadosUser.avatarUrl && <img className="w-full h-full object-cover rounded-lg" src={`${dadosUser.image}`} alt="fotoUser" width={150} height={100}></img>}

                            </label>
                        </div>
                        <div className="flex flex-col  w-full gap-3">
                            <div className="grid gap-1">
                                <Label htmlFor="nome">Nome</Label>
                                <Input id="nome" required type="text" value={dadosUser.nome ?? ''} onChange={e => setarDadosUsuario({ ...dadosUser, nome: e.target.value })} />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="usuario">Usuário</Label>
                                <Input id="usuario" required type="text" value={dadosUser.usuario ?? ''} onChange={e => { setarDadosUsuario({ ...dadosUser, usuario: e.target.value }) }} />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="cargo">Cargo</Label>
                                <Input id="cargo" required type="text" value={dadosUser.cargo ?? ''} onChange={e => { setarDadosUsuario({ ...dadosUser, cargo: e.target.value }) }} />
                            </div>

                            {!dadosUser.id_user ? (
                                <div className="grid gap-1">
                                    <Label htmlFor="senha">Senha</Label>
                                    <Input id="senha" required type="password" value={dadosUser.password ?? ''} onChange={e => { setarDadosUsuario({ ...dadosUser, password: e.target.value }) }} />
                                </div>
                            ) : (
                                <Button onClick={() => setModalPass(true)}>
                                    Alterar Senha
                                </Button>
                            )}

                            <PerfisUser id={dadosUser.id!} perfis={dadosUser.consultor ?? []} id_user={dadosUser.id_user} />
                            
                            <div className="grid gap-1">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setModalPermissoes(true)}
                                    className="flex items-center gap-2"
                                >
                                    <Settings className="h-4 w-4" />
                                    Configurar Permissões
                                </Button>
                            </div>
                        </div>

                    </Card>
                </div>

                <DialogFooter className="sm:justify-end">
                    {dadosUser.id_user ? (
                        <Button variant={'outline'} onClick={() => handleEditarCadastro()}>Gravar alterações</Button>
                    ) : (
                        <Button onClick={() => handleNovoCadastro({actions:{success:()=>setModal(false)}})}>Salvar</Button>
                    )}
                </DialogFooter>

            </DialogContent>

            <ModalPassword id_user={dadosUser.id_user ?? ''} openModal={modalPass} setOpenModal={setModalPass} />

            {/* Modal de Permissões */}
            <Dialog open={modalPermissoes} onOpenChange={setModalPermissoes}>
                <DialogContent className="max-w-[calc(100vw-50px)] max-h-[calc(100vh-50px)]">
                    <DialogHeader>
                        <DialogTitle>Configurar Permissões</DialogTitle>
                    </DialogHeader>
                    
                    <div className="overflow-auto">
                        <Permissoes handlePermission={handlePermission} permissions={dadosUser.permissoes ?? []} />
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalPermissoes(false)}>
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </Dialog>

    )
}
