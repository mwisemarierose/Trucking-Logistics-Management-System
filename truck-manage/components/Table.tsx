/* eslint-disable */
// @ts-nocheck
import React from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useTranslation } from "react-i18next";
import DataPagination from "./DataPagination";
import "./scss/table.scss";

interface TableData {
  data: any;
  columns: any;
  title: string;
}

type DefaultProps = {
  placeholder?: string;
};

const tableDefaultProps = {
  placeholder: "Filter by cohort, program, and rating",
} as DefaultProps;

function DataTable({
  data,
  columns,
  title,
  placeholder,
}: TableData & tableDefaultProps) {
  const sortedData = React.useMemo(() => [...data], []);
  const { t } = useTranslation();
  const sortedColumns = React.useMemo(() => [...columns], []);
  const TableInstance = useTable(
    { data: sortedData, columns: sortedColumns, initialState: { pageSize: 3 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    setGlobalFilter,
    getTableBodyProps,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    gotoPage,
    pageCount,
    setPageSize,
    pageOptions,
    headerGroups,
    prepareRow,
    state,
  } = TableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <div className="data-table">
      <div className="header">
        <h2 className="title">{title}</h2>
        <input
          defaultValue={globalFilter || ""}
          placeholder={placeholder}
          className="filter-input"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>
      <div>
        <table {...getTableProps()} className="table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    className={`thead ${
                      column.isSorted ? "sorted" : ""
                    }`}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {data.length !== 0 ? (
              page.map((row) => {
                prepareRow(row);
                const rowTheme = row.index % 2 !== 0 ? "odd-row" : "even-row";

                return (
                  <tr className={rowTheme} {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td className="data-cell" {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="no-data">
                    {t("No data currently")}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <DataPagination
          pageOptions={pageOptions}
          canNextPage={canNextPage}
          gotoPage={gotoPage}
          columnLength={columns.length}
          canPreviousPage={canPreviousPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          previousPage={previousPage}
          nextPage={nextPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
        />
      </div>
    </div>
  );
}

export default DataTable;
