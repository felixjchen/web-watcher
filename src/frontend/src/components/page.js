import React from "react";
import {
  Header,
  HeaderName,
  HeaderContainer,
  HeaderGlobalBar,
  HeaderGlobalAction,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  DataTable,
  Button,
  OverflowMenu,
  OverflowMenuItem,
} from "carbon-components-react";
import { Logout20 } from "@carbon/icons-react";
import "./page.css";

let action = () => {
  console.log("Add WATCHER");
};

const headers = [
  {
    key: "url",
    header: "URL",
  },
  {
    key: "frequency",
    header: "Frequency",
  },
  {
    key: "last_run",
    header: "Last Run",
  },
  {
    key: "options",
    header: "Options",
  },
];

const Page = (props) => {
  return (
    <div id="page">
      <HeaderContainer
        render={() => (
          <>
            <Header aria-label="IBM Platform Name">
              <HeaderName prefix="Web">Watcher</HeaderName>
              <HeaderGlobalBar>
                <HeaderGlobalAction
                  aria-label="Logout"
                  onClick={props.logoutHandler}
                >
                  <Logout20 />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
            </Header>
          </>
        )}
      />

      <DataTable rows={props.watchers} headers={headers}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getToolbarProps,
          onInputChange,
          getTableContainerProps,
        }) => (
          <TableContainer
            title={`Hello ${props.email}`}
            // description={`Welcome ${props.email}`}
            {...getTableContainerProps()}
          >
            <TableToolbar
              {...getToolbarProps()}
              aria-label="data table toolbar"
            >
              <TableToolbarContent>
                <TableToolbarSearch onChange={onInputChange} />
                <Button onClick={action}>Add Watcher</Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader
                      key={header.key}
                      {...getHeaderProps({ header })}
                    >
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  row.cells[3].value = "DROPDOWN";
                  return (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};

export default Page;
