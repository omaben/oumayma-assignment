'use client';

import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

interface PaginationProps {
  count: number;
  page: number;
  limit: number;
  onPageChange: Function;
  onRowsPerPageChange: Function;
}

export function DataTablePagination({
  count,
  page,
  limit,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps): React.JSX.Element {
  const handleOnPagechange = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    onPageChange(page);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onRowsPerPageChange(event.target.value);
  };
  return (
    <TablePagination
      component="div"
      count={count}
      onPageChange={handleOnPagechange}
      onRowsPerPageChange={handleRowsPerPageChange}
      page={page}
      rowsPerPage={limit}
      rowsPerPageOptions={[5, 10, 25, 50, 100, 500]}
    />
  );
}
