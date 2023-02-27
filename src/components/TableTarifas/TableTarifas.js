import React from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Table from "@mui/material/Table";

function TableTarifas({ data, clearPage }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    setPage(0);
  }, [clearPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = data;
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const columns = [
    {
      id: "concessionaria",
      label: "Concessionária",
      minWidth: 100,
      maxWidth: 100,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "subgrupo",
      label: "Subgrupo",
      minWidth: 60,
      maxWidth: 60,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "modalidade",
      label: "Modalidade",
      minWidth: 190,
      maxWidth: 190,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "classe",
      label: "Classe",
      minWidth: 120,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "subclasse",
      label: "Subclasse",
      minWidth: 220,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "detalhe",
      label: "Detalhe",
      minWidth: 220,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "posto",
      label: "Posto",
      minWidth: 100,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "unidade",
      label: "Unidade",
      minWidth: 80,
      maxWidth: 80,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "acessante",
      label: "Acessante",
      minWidth: 100,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "totalTUSD",
      label: "Total TUSD",
      minWidth: 70,
      align: "left",
      format: (value) => formatter.format(value),
    },
    {
      id: "totalTE",
      label: "Total TE",
      minWidth: 80,
      align: "left",
      format: (value) => formatter.format(value),
    },
    {
      id: "TUSDFioB",
      label: "TUSD Fio B",
      minWidth: 80,
      align: "left",
      format: (value) => formatter.format(value),
    },
  ];

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const rowsInPage =
    rowsPerPage > 0
      ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : rows;

  return (
    <div className="table-container section">
      <Paper sx={{ width: "100%", overflow: "hidden" }} className="table">
        <TableContainer>
          <Table
            sx={{ width: "100%", height: "100%" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      fontWeight: "bold",
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                    }}
                    align={column.align}
                    minwidth={column.minWidth}
                    maxwidth={column.maxWidth}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsInPage.map((row) => (
                <TableRow key={row.name}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${row.name}_${column.id}`}
                      component="th"
                      scope="row"
                      align={column.align}
                      sx={{
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                      }}
                    >
                      {column.format(row[column.id])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={10} />
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  labelRowsPerPage="Linhas por página"
                  colSpan={12}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default TableTarifas;
