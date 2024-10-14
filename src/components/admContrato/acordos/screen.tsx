import Image from 'next/image'
import manutencao from '../../../../public/manutencao.png'


export function AcordosScreen() {
    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <Image width={300} height={200} src={manutencao} alt="manutenção" /> 
        </div>
    )
}
           
