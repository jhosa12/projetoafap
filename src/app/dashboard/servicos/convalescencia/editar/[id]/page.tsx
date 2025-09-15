'use client'

import React, { useContext, useState } from "react"
import FormularioConv from "../../../_components/convalescentes/formulario-conv";


export default function EditarConv() {


    return (
        <>
            <div className="flex flex-col w-full pl-10 pr-10 pt-4">
                {/* Cabeçalho da página */}
                <div className="flex flex-col p-2 gap-4 items-center">
                    <h1 className="w-full justify-between scroll-m-20 text-gray-800 pb-2 
                    text-2xl font-semibold tracking-tight first:mt-0">
                        Registro de Convalescença
                    </h1>

                <FormularioConv />
                </div>
                </div>
        </>
    );
}
