import { EstoqueProps, FormProps, ProdutosProps } from "@/pages/estoque";
import { Button, FloatingLabel, Modal, Select, Spinner, Table, Textarea, TextInput, ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi";
import { toast } from "react-toastify";
import { ModalQuant } from "./modalQuantidade";
import { EmpresaProps } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";



interface DataProps {

    setOpenModal: (open: boolean) => void
    produtos: Array<ProdutosProps>
    empresas: Array<EmpresaProps>
    usuario: string,
    id_usuario: string,
    reqDadosEstoq:(dados:FormProps)=>Promise<void>
}
interface MovProps {
    id_produto: number,
    produto: string,
    quantidade: number
}

export function ModalMov({ setOpenModal, produtos, empresas, id_usuario, usuario,reqDadosEstoq }: DataProps) {
    const [scannedCode, setScannedCode] = useState<string>('')
    const [arrayMov, setArrayMov] = useState<Array<MovProps>>([])
    const [quantidadeManual, setQuantidadeManual] = useState<number>(0);
    const [descricao, setDescricao] = useState<string>('')
    const [modalQuant, setModalQuant] = useState<boolean>(false)
    const [manual, setManual] = useState<boolean>(false)
    const [selectEmpresa, setEmpresa] = useState<{ id_empresa: string, empresa: string }>({ empresa: '', id_empresa: '' })






    const analisarProduto = (scanned: string) => {
        const item = produtos.find(obj => obj.cod_prod === scanned);
        console.log(produtos)

        if (!item) {
            toast.info('Produto não cadastrado');
            return;
        }

        setArrayMov((prevArrayMov) => {
            const itemExistente = prevArrayMov.find(produto => produto.id_produto === item.id_produto);

            if (itemExistente) {
                // Atualiza a quantidade do item existente
                return prevArrayMov.map(produto =>
                    produto.id_produto === item.id_produto
                        ? { ...produto, quantidade: produto.quantidade + 1 }
                        : produto
                );

            } else {
                setQuantidadeManual(0)
                // Adiciona um novo item ao array
                return [
                    ...prevArrayMov,
                    {
                        id_produto: item.id_produto,
                        produto: item.descricao,
                        quantidade: 1 // Começa com 1 unidade
                    }
                ];
            }
        });
    };


    const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const novaQuantidade = Number(e.target.value);
        setQuantidadeManual(novaQuantidade);

        // Atualiza a quantidade do último produto no array
        setArrayMov((prevArrayMov) => {
            const novoArray = [...prevArrayMov];
            const ultimoItem = novoArray[novoArray.length - 1];
            if (ultimoItem) {
                ultimoItem.quantidade = novaQuantidade;
            }
            return novoArray;
        });
    };



    const handleDeletarProduto = (index: number) => {
        const novoArray = [...arrayMov]
        novoArray.splice(index, 1)
        setArrayMov(novoArray)
    }


    const handleMovimentar = async (tipo:string) => {
        if(!descricao){
            toast.info('Descreva a movimentação')
            return
        }
        if(!selectEmpresa.id_empresa){
            toast.info('Selecione a empresa de destino')
        }
        try {
            const response = await toast.promise(api.put("/estoque/movimentar", {
                descricao: descricao,
                tipo,
               // quantidade: number
                 id_empresa:selectEmpresa.id_empresa,
                 empresa: selectEmpresa.empresa,
                 // data: new Date(),
                // status: '',
                id_usuario:id_usuario,
                usuario: usuario,
                 produtos:arrayMov
            }),
        {error:'Erro ao movimentar',
            success:'Movimentado com sucesso',
            pending:'Movimentando...'
        }) 
            reqDadosEstoq({descricao:'',id_produto:null,grupo:''})
        } catch (error) {
            console.log(error)
        }
    }






    useEffect(() => {
        let currentBarcode = '';
        let timeout: ReturnType<typeof setTimeout>;


        const handleKeyPress = (event: KeyboardEvent) => {
         
            // Verifica se a tecla "Enter" foi pressionada
            if (event.key === 'Enter') {
                // setScannedCode(currentBarcode);
                analisarProduto(currentBarcode)
                currentBarcode = ''; // Reinicia o código de barras após a leitura
                // setModal(false)
            } if (event.key === 'F2') {
                setModalQuant(true)

            } else {
                // Acumula os caracteres do código de barras
                currentBarcode += event.key;
            }

            // Limpa o buffer se não houver atividade por 300ms
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                currentBarcode = '';
            }, 300);
        };

        // Adiciona o ouvinte de eventos para capturar as teclas pressionadas
        document.addEventListener('keydown', handleKeyPress);

        // Remove o ouvinte de eventos quando o componente é desmontado
        return () => {
            document.removeEventListener('keydown', handleKeyPress);


        };
    }, []);

    return (
        <>
            <ModalQuant setOpen={setModalQuant} setQuantidade={setQuantidadeManual} openModal={modalQuant} produto={arrayMov[arrayMov.length - 1]?.produto} quantidade={quantidadeManual} handleQuantidadeChange={handleQuantidadeChange} />
            <Modal size={'4xl'} show onClose={() => setOpenModal(false)} popup>
                <Modal.Header>
                    <ToggleSwitch
                        checked={manual}
                        label="Manual"
                        onChange={() => setManual(!manual)}
                        theme={{ toggle: { base: "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all " } }}
                    />


                </Modal.Header>

                <Modal.Body>
                    <div className="inline-flex divide-x-2 gap-2 w-full justify-center items-center">
                        {arrayMov.length > 0 ? <> <div className="flex flex-col justify-center w-full p-2 gap-3 " >
                            <h1 className="text-lg border-b-2 text-center font-semibold">{arrayMov[arrayMov.length - 1]?.produto} - {arrayMov[arrayMov.length - 1].quantidade}</h1>
                            <span>{'F2 - ALTERAR QUANTIDADE'}</span>

                        </div>
                            <div className="flex flex-col justify-center w-full p-2" >
                                <h1 className="text-lg border-b-2 text-center p-2 font-semibold">MOVIMENTAÇÃO</h1>

                                <div className="overflow-x-auto overflow-y-auto max-h-[40vh]">
                                    <Table theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-sm text-black" } } }} >
                                        <Table.Head>
                                            <Table.HeadCell>Produto</Table.HeadCell>
                                            <Table.HeadCell>Quantidade</Table.HeadCell>
                                            <Table.HeadCell></Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y-2">
                                            {arrayMov.map((item, index) => (
                                                <Table.Row className="font-semibold text-base" key={Number(item.id_produto)}>
                                                    <Table.Cell>{item.produto}</Table.Cell>
                                                    <Table.Cell>{item.quantidade}</Table.Cell>
                                                    <Table.Cell><button onClick={() => handleDeletarProduto(index)} className="hover:text-red-600"><HiTrash size={16} /></button></Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                                <div className="space-y-2 mt-1">
                                    <Textarea rows={2} value={descricao} onChange={e => setDescricao(e.target.value.toUpperCase())} placeholder="DESCREVA A MOVIMENTAÇÃO" />

                                    <Select className="font-semibold" onChange={e => {
                                        const empresa = empresas.find(item => item.id === e.target.value)
                                        if (!empresa) {
                                            setEmpresa({ empresa: '', id_empresa: '' })
                                            return
                                        }
                                        console.log(empresa)
                                        setEmpresa({ id_empresa: empresa.id, empresa: empresa.nome })
                                    }} sizing={'sm'} id="empresa" required >
                                        <option value={''}>Selecione a empresa de destino</option>
                                        {empresas.map(item => (
                                            <option className="font-semibold" key={item.id} value={item.id}>{item.nome}</option>
                                        ))}
                                    </Select>

                                </div>

                  
                            </div>
                   
                        </> : <Spinner aria-label="Extra large spinner example" size="xl" />
                        }
                    </div>

                    <div className="inline-flex w-full justify-around mt-2">
                    <Button onClick={()=>handleMovimentar('ENTRADA')} color={'success'}>ENTRADA</Button>
                    <Button color={'failure'} onClick={()=>handleMovimentar('SAIDA')}>SAÍDA</Button>
                    </div>

                </Modal.Body>
               
                  

                

            </Modal>
        </>
    )
}