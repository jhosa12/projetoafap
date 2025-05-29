
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
  } from "@tanstack/react-table";
  import { Input } from "@/components/ui/input";
  import { useState } from "react";
  
  interface DataTableProps <TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    children?: React.ReactNode;
    maxHeight?: string
  }
  
  export function DataTable< TData,>({ columns, data,children,maxHeight }: DataTableProps<TData>) {
    const [globalFilter, setGlobalFilter] = useState("");
  
    const table = useReactTable({
      data,
      columns,
      state: {
        globalFilter,
      },
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: "includesString",
    });
  
    return (
      <div className="space-y-2 mt-1">

        <div className=" inline-flex ml-1 space-x-2">
        
        <Input
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm h-8  focus:outline-none focus:border-0 focus:ring-0"
        />
        {children}
          
        </div>
      
       
        <div  className={` overflow-y-auto w-full ${maxHeight}`}>
          <Table >
            <TableHeader className="text-xs uppercase">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead  className="sticky top-0 z-10 text-black"   key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="text-xs">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow  key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
    
      </div>
    );
  }
  