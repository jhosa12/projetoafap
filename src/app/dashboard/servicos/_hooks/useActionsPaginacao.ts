import { useState, useMemo } from 'react';

// Parte 1: O hook para a lógica de exibição dos botões
// -------------------------------------------------------------------

export const DOTS = '...';

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

interface UsePaginationProps {
  totalPageCount: number;
  currentPage: number;
  siblingCount?: number;
}

export const usePagination = ({
  totalPageCount,
  currentPage,
  siblingCount = 1,
}: UsePaginationProps) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPageCount];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
      return [firstPageIndex, DOTS, ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    return range(1, totalPageCount);
  }, [totalPageCount, siblingCount, currentPage]);

  return paginationRange;
};


// Parte 2: O novo hook completo para gerenciar TUDO
// -------------------------------------------------------------------

interface UsePaginatedDataProps<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
  siblingCount?: number;
}

export function usePaginatedData<T>({
  data,
  itemsPerPage,
  initialPage = 1,
  siblingCount = 1,
}: UsePaginatedDataProps<T>) {

  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPageCount = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, data, itemsPerPage]);

  const paginationRange = usePagination({
    currentPage,
    totalPageCount,
    siblingCount,
  });

  // --- FUNÇÕES DE NAVEGAÇÃO ---

  const goToPage = (pageNumber: number) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPageCount));
    setCurrentPage(newPage);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    // Dados e Estado
    currentPageData,
    currentPage,
    totalPageCount,

    // Funções
    goToPage,
    nextPage,
    previousPage,

    // UI
    paginationRange,

    // Helpers
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPageCount,
  };
}