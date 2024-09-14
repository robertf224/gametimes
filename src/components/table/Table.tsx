import React from "react";

export interface TableProps<Row> {
  columns: Array<{
    title: string;
    renderCell: (row: Row) => React.ReactNode;
  }>;
  rows: Array<Row>;
  getId: (row: Row) => string;
}

export function Table<Row>({
  columns,
  rows,
  getId,
}: TableProps<Row>): React.ReactNode {
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {columns.map((column) => (
            <th key={column.title} scope="col" className="px-6 py-3">
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={getId(row)}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            {columns.map((column) => (
              <td key={column.title} className="px-6 py-4">
                {column.renderCell(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
