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

let action = (t) => {
  console.log(t);
};
const rows = [
  {
    id: "a",
    name: "Load Balancer 3",
    protocol: "HTTP",
    port: 3000,
    rule: "Round robin",
    attached_groups: "Kevin’s VM Groups",
    status: "Disabled",
    enabled: true,
  },
  {
    id: "b",
    name: "Load Balancer 1",
    protocol: "HTTP",
    port: 443,
    rule: "Round robin",
    attached_groups: "Maureen’s VM Groups",
    status: "Starting",
    enabled: true,
  },
  {
    id: "c",
    name: "Load Balancer 2",
    protocol: "HTTP",
    port: 80,
    rule: "DNS delegation",
    attached_groups: "Andrew’s VM Groups",
    status: "Active",
    enabled: false,
  },
];

const headers = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "protocol",
    header: "Protocol",
  },
  {
    key: "port",
    header: "Port",
  },
  {
    key: "rule",
    header: "Rule",
  },
  {
    key: "attached_groups",
    header: "Attached Groups",
  },
  {
    key: "status",
    header: "Status",
  },
  {
    key: "enabled",
    header: "Enabled",
  },
];

const Page = (props) => (
  <div id="page">
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
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

    <DataTable rows={rows} headers={headers}>
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
          title="Watchers"
          description="With toolbar"
          {...getTableContainerProps()}
        >
          <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
            <TableToolbarContent>
              <TableToolbarSearch onChange={onInputChange} />
              <Button onClick={action("Button click")}>Add Watcher</Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  </div>
);

export default Page;
