'use client'



import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from "../lib/axios/apiClient"
import { destroyCookie } from "nookies"
import {useRouter} from 'next/navigation';
import { AssociadoProps} from '@/types/associado';
import { SignInProps, UserProps } from '@/types/user';
import { EmpresaProps } from '@/types/empresa';
import { PlanosProps } from '@/types/planos';
import { CidadesProps } from '@/types/cidades';
import { ConsultoresProps } from '@/types/consultores';
import { useAuthActions } from '@/hooks/useAuthActions';
import useApiGet from '@/hooks/useApiGet';
import { toast } from 'sonner';




type AuthContextData = {
    usuario?: UserProps;
    consultores: ConsultoresProps[];
    cidades: CidadesProps[];
    planos: PlanosProps[];
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    carregarDados: (id: number) => Promise<void>;
    limparDados: () => void;
    dadosassociado: Partial<AssociadoProps> | AssociadoProps;
    setarDadosAssociado: (fields: Partial<AssociadoProps>) => void;
    permissoes: string[];
    empresas: EmpresaProps[];
    getDadosFixos: () => Promise<void>;
    selectEmp: string;
    setSelectEmp: (empresa: string) => void;
    loading: boolean;
    loadingInfo: boolean;
    infoEmpresa: EmpresaProps | null;
};



export const AuthContext = createContext({} as AuthContextData)


export function signOut() {
    const router = useRouter();
    try {
        destroyCookie(undefined, '@nextauth.token')
        delete api.defaults.headers['Authorization'];
        router.push('/')
    } catch (err) {
        toast.error('Erro ao deslogar')
    }
};


export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {

    const [dadosassociado, setDadosAssociado] = useState<Partial<AssociadoProps>>({});
    const [empresas, setEmpresas] = useState<Array<EmpresaProps>>([])
    const [planos, setPlanos] = useState<Array<PlanosProps>>([]);
    const [cidades, setCidades] = useState<Array<CidadesProps>>([]);
    const [consultores, setConsultores] = useState<Array<ConsultoresProps>>([]);
    const [selectEmp, setSelectEmp] = useState('')
    const [loading, setLoading] = useState(false)
    const { data: infoEmpresa, loading: loadingInfo, postData: reqInfoEmpresa } = useApiGet<EmpresaProps, { id: string }>('/empresa/infoEmpresa')
    const { permissoes, signIn, usuario, signOut } = useAuthActions()


    const getDadosFixos = async () => {
        if (empresas.length > 0 &&
            cidades.length > 0 &&
            consultores.length > 0 &&
            planos.length > 0) return;

        try {
            const response = await api.post("/dadosFixos")

            setEmpresas(response.data.empresas || []);
            setCidades(response.data.cidades || []);
            setConsultores(response.data.consultores || []);
            setPlanos(response.data.planos || []);
        } catch (error) {
            console.log(error)
        }

    }


    useEffect(()=>{
        if(!usuario)signOut()
    },[usuario])



    useEffect(() => {
        if (selectEmp) {
            reqInfoEmpresa({ id: selectEmp })
            // limparDados()
        }
    }, [selectEmp])

    useEffect(() => {
        if(permissoes && permissoes.length > 0){
            const emp = permissoes?.find((item: string) => item.startsWith('EMP'));
            emp && setSelectEmp(emp?.split('EMP')[1] ?? '');
        }
     
    }, [permissoes])


    const carregarDados = async (id: number) => {
        setLoading(true)
        limparDados();
        try {
            const response = await api.post('/associado', {
                id_global: id,
                empresa: selectEmp
            });

            setDadosAssociado(response.data);
        } catch (error) {
            toast.error('Erro na requisição');
        }
        setLoading(false)
    };

    const setarDadosAssociado = useCallback((fields: Partial<AssociadoProps>) => {
        setDadosAssociado(prev => ({ ...prev, ...fields }));
    }, []);

    const limparDados = useCallback(() => {
        setDadosAssociado({
            id_global: null,
            acordo: [],
            bairro: '',
            celular1: '',
            celular2: '',
            cep: '',
            cidade: '',
            nome: undefined,
            id_associado: undefined,
            endereco: '',
            mensalidade: [],
            data_nasc: undefined,
            cpfcnpj: undefined,
            dependentes: [],
            telefone: undefined,
            uf: undefined,
            contrato: undefined,
            guia_rua: undefined,
            email: undefined,
            numero: undefined,
            profissao: undefined,
            rg: undefined,
            sexo: undefined
        });
    }, []);




    return (
        <AuthContext.Provider value={{ infoEmpresa, loadingInfo, loading, selectEmp, setSelectEmp, getDadosFixos, planos, consultores, cidades, empresas, permissoes, setarDadosAssociado, limparDados, usuario, signIn, signOut, dadosassociado, carregarDados }}>
            {children}
        </AuthContext.Provider>
    );
}