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
  TextInput,
  Modal,
} from "carbon-components-react";
import { Logout20 } from "@carbon/icons-react";
import "./page.css";

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
    header: "",
  },
];

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addWatcherModalOpen: false,
    };
  }

  openModal = () => {
    this.setState({
      addWatcherModalOpen: true,
    });
  };
  closeModal = () => {
    this.setState({
      addWatcherModalOpen: false,
    });
  };

  render() {
    return (
      <div id="page">
        <HeaderContainer
          render={() => (
            <>
              <Header aria-label="IBM Platform Name">
                <HeaderName prefix="Web">Watcher</HeaderName>
                <HeaderGlobalBar>
                  <HeaderGlobalAction
                    id="logoutIcon"
                    aria-label="Logout"
                    onClick={this.props.logoutHandler}
                  >
                    <Logout20 />
                  </HeaderGlobalAction>
                </HeaderGlobalBar>
              </Header>
            </>
          )}
        />

        <DataTable rows={this.props.watchers} headers={headers}>
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
              // title={`Hello ${props.email}`}
              // description={`Welcome ${props.email}`}
              {...getTableContainerProps()}
            >
              <TableToolbar
                {...getToolbarProps()}
                aria-label="data table toolbar"
              >
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} />
                  <Button onClick={this.openModal}>Add Watcher</Button>
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
                    row.cells[3].value = (
                      <OverflowMenu flipped={true}>
                        <OverflowMenuItem itemText="Edit" />
                        <OverflowMenuItem
                          itemText="Delete"
                          hasDivider
                          isDelete
                        />
                      </OverflowMenu>
                    );
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
        <Modal
          hasForm
          size={"sm"}
          selectorPrimaryFocus="#text-input-2"
          open={this.state.addWatcherModalOpen}
          primaryButtonText={"Add"}
          secondaryButtonText={"Cancel"}
          shouldSubmitOnEnter={true}
          onRequestClose={this.closeModal}
          onSecondarySubmit={this.closeModal}
        >
          <TextInput
            id="text-input-1"
            labelText="URL"
            placeholder="https://www.google.com/"
            style={{ marginBottom: "1rem" }}
          />
          <TextInput
            id="text-input-2"
            labelText="Frequency (seconds)"
            placeholder="60"
          />
        </Modal>
      </div>
    );
  }
}

export default Page;
