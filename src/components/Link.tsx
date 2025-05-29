import Link from "next/link";




export default function LinkNavigate({href,children}:{href:string,children:React.ReactNode}) {
    return <Link className="w-full " href={href}>{children}</Link>;
}