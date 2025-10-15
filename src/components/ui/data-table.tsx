
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
  PaginationState,
  getPaginationRowModel,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageSize?:number
  children?: React.ReactNode;
  maxHeight?: string
  rowSelection?: RowSelectionState
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>
  onRowClick?: (row: TData) => void;
  //rowSelect:boolean
}

export function DataTable<TData,>({
  columns,
  data,
  pageSize=10,
  children,
  maxHeight,
  rowSelection,
  setRowSelection,
  onRowClick,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      rowSelection
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: false,
    globalFilterFn: "includesString",
  });

  return (
    <div className="space-y-2 mt-1">

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-start sm:items-center ml-1">

        <Input
          placeholder="Buscar..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full sm:max-w-sm h-8 focus:outline-none focus:border-0 focus:ring-0"
        />
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <span className="hidden sm:inline">Linhas: </span>{table.getState().pagination.pageSize}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Linhas por página</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup

                value={`${table.getState().pagination.pageSize}`}

                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                {[3, 5, 10, 15, 20, 30, 50].map((pageSize) => (
                  <DropdownMenuRadioItem
                    key={pageSize}
                    value={`${pageSize}`}
                  >
                    {pageSize}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {children}
        </div>
      </div>

      <div className={"relative w-full overflow-hidden border rounded-md"}>
        <div className={`overflow-y-auto w-full ${maxHeight}`}>
          <Table className="min-w-full relative">
            <TableHeader className="text-xs capitalize">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="sticky top-0 z-10 bg-white whitespace-nowrap px-2 py-2 sm:px-4 sm:py-3 border-b" key={header.id}>
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
                  <TableRow
                    key={row.id}
                    data-state={rowSelection && row.getIsSelected() && "selected"}
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row.original);
                      } else if (rowSelection) {
                        row.toggleSelected();
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-4">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-20"
          >
            <span className="hidden sm:inline">Anterior</span>
            <span className="sm:hidden">←</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-20"
          >
            <span className="hidden sm:inline">Próximo</span>
            <span className="sm:hidden">→</span>
          </Button>
        </div>
      </div>
    </div>
  );
}