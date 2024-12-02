import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import "./scss/dataPagination.scss";

function DataPagination({
  pageOptions,
  columnLength,
  canNextPage,
  canPreviousPage,
  pageSize,
  setPageSize,
  gotoPage,
  previousPage,
  nextPage,
  pageIndex,
}: any) {
  return (
    <div>
      {pageOptions.length > 1 && (
        <table className="pagination-table">
          <tfoot>
            <tr>
              <td colSpan={columnLength}>
                <div className="pagination-container">
                  <button
                    type="button"
                    className={`pagination-button ${
                      !canPreviousPage ? "disabled" : ""
                    }`}
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    <ArrowLeftCircleIcon className="pagination-icon" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className={`pagination-button ${
                      !canNextPage ? "disabled" : ""
                    }`}
                  >
                    <ArrowRightCircleIcon className="pagination-icon" />
                  </button>
                  <div className="pagination-controls">
                    <span className="pagination-page-info">
                      Page{" "}
                      <strong>
                        {pageIndex + 1} of {pageOptions.length}
                      </strong>
                    </span>
                    <span className="pagination-goto">
                      | Go to page:{" "}
                      <input
                        type="number"
                        className="pagination-input"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                          const pageNumber = e.target.value
                            ? Number(e.target.value) - 1
                            : 0;
                          gotoPage(pageNumber);
                        }}
                      />
                    </span>
                    <select
                      className="pagination-select"
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                      {[3, 5, 10, 25, 50, 100].map((pgSize) => (
                        <option key={pgSize} value={pgSize}>
                          Show {pgSize}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}

export default DataPagination;
