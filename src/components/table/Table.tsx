import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import React from "react";

export interface TableProps<Row> {
  columns: Array<{
    title: string;
    renderCell: (row: Row) => React.ReactNode;
  }>;
  rows: Array<Row>;
  getId: (row: Row) => string;
  rowLink?: <RouteType>(row: Row) => LinkProps<RouteType>["href"];
}

export function Table<Row>({
  columns,
  rows,
  getId,
  rowLink,
}: TableProps<Row>): React.ReactNode {
  return (
    <div className="border border-muted rounded-lg backdrop-blur bg-white/50 dark:bg-black/50">
      <table className="w-full text-sm text-left rtl:text-right table-fixed sm:table-auto">
        <thead className="text-xs uppercase text-muted">
          <tr>
            {columns.map((column) => (
              <th
                key={column.title}
                scope="col"
                className="p-1 first:pl-2 last:pr-2"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const element = (
              <tr
                key={getId(row)}
                className={clsx(
                  "border-t border-muted",
                  rowLink && "hover:bg-hover"
                )}
              >
                {columns.map((column) => (
                  <td key={column.title} className="p-1 first:pl-2 last:pr-2">
                    {column.renderCell(row)}
                  </td>
                ))}
              </tr>
            );
            return rowLink ? (
              <Link key={getId(row)} href={rowLink(row)}>
                {element}
              </Link>
            ) : (
              element
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
