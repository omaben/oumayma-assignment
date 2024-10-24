'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import type { TableProps } from '@mui/material/Table';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { SortAscending } from '@phosphor-icons/react';
import { SortDescending } from '@phosphor-icons/react/dist/ssr';

export interface ColumnDef<TRowModel> {
  align?: 'left' | 'right' | 'center';
  field?: keyof TRowModel;
  formatter?: (row: TRowModel, index: number) => React.ReactNode;
  hideName?: boolean;
  name: string;
  width?: number | string;
  sortable?: number;
  onSort?: () => void;
  activeSort?: boolean;
}

type RowId = number | string;

export interface DataTableProps<TRowModel> extends Omit<TableProps, 'onClick'> {
  columns: ColumnDef<TRowModel>[];
  hideHead?: boolean;
  hover?: boolean;
  onClick?: (event: React.MouseEvent, row: TRowModel) => void;
  onDeselectAll?: (event: React.ChangeEvent) => void;
  onDeselectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
  onSelectAll?: (event: React.ChangeEvent) => void;
  onSelectOne?: (event: React.ChangeEvent, row: TRowModel) => void;
  rows: TRowModel[];
  selectable?: boolean;
  selected?: Set<RowId>;
  uniqueRowId?: (row: TRowModel) => RowId;
}

export function DataTable<TRowModel extends object & { id?: RowId | null }>({
  columns,
  hideHead,
  hover,
  onClick,
  onDeselectAll,
  onDeselectOne,
  onSelectOne,
  onSelectAll,
  rows,
  selectable,
  selected,
  uniqueRowId,
  ...props
}: DataTableProps<TRowModel>): React.JSX.Element {
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Table {...props}>
      <TableHead
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          ...(hideHead && { visibility: 'collapse', '--TableCell-borderWidth': 0 }),
        }}
      >
        <TableRow>
          {selectable ? (
            <TableCell padding="checkbox" sx={{ width: '40px', minWidth: '40px', maxWidth: '40px' }}>
              <Checkbox
                checked={selectedAll}
                indeterminate={selectedSome}
                onChange={(event: React.ChangeEvent) => {
                  if (selectedAll) {
                    onDeselectAll?.(event);
                  } else {
                    onSelectAll?.(event);
                  }
                }}
              />
            </TableCell>
          ) : null}
          {columns.map(
            (column): React.JSX.Element => (
              <TableCell
                key={column.name}
                sx={{
                  width: column.width,
                  minWidth: column.width,
                  maxWidth: column.width,
                  justifyContent: 'center',
                  cursor: column.sortable ? 'pointer' : 'initial',
                  ...(column.align && { textAlign: column.align }),
                }}
                onClick={() => {
                  if (column.sortable && column.onSort) {
                    column.onSort();
                  }
                }}
              >
                <Box display={'flex'} color={column.activeSort ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-primary)'}>
                  {column.hideName ? null : column.name}
                  {column.sortable ? (
                    <Typography display={'contents'}>
                      {column.sortable === -1 ? <SortAscending /> : <SortDescending />}
                    </Typography>
                  ) : null}
                </Box>
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index): React.JSX.Element => {
          const rowId = row.id ? row.id : uniqueRowId?.(row);
          const rowSelected = rowId ? selected?.has(rowId) : false;

          return (
            <TableRow
              hover={hover}
              key={rowId ?? index}
              selected={rowSelected}
              {...(onClick && {
                onClick: (event: React.MouseEvent) => {
                  onClick(event, row);
                },
              })}
              sx={{ ...(onClick && { cursor: 'pointer' }) }}
            >
              {selectable ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={rowId ? rowSelected : false}
                    onChange={(event: React.ChangeEvent) => {
                      if (rowSelected) {
                        onDeselectOne?.(event, row);
                      } else {
                        onSelectOne?.(event, row);
                      }
                    }}
                    onClick={(event: React.MouseEvent) => {
                      if (onClick) {
                        event.stopPropagation();
                      }
                    }}
                  />
                </TableCell>
              ) : null}
              {columns.map(
                (column): React.JSX.Element => (
                  <TableCell key={column.name} sx={{ ...(column.align && { textAlign: column.align }) }}>
                    {
                      (column.formatter
                        ? column.formatter(row, index)
                        : column.field
                          ? row[column.field]
                          : null) as React.ReactNode
                    }
                  </TableCell>
                )
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
