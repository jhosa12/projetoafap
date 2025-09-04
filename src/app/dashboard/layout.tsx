'use client'

import { MenuLateral } from "@/components/layouts/menu";







export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
   // const {loadingInfo} = useContext(AuthContext);
    return (
       <>
       <MenuLateral/>

       { children}
     
       </>

    );
}