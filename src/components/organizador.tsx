import {ReactNode} from 'react'
interface Props{
    title:string,
    children:ReactNode
}
export function FormWrapper({title,children}:Props){
  return <>
    <h2 className='text-center m-0 mb-2 text-white font-semibold text-[18px]'>{title}</h2>
    <div className='flex w-full justify-center items-center'>{children}</div>
  </>  
}