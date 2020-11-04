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
  Link,
  RadioButton,
  RadioButtonGroup,
  FormGroup,
} from "carbon-components-react";
import { Logout20 } from "@carbon/icons-react";
import "./page.css";

const toSeconds = {
  everyHour: 3600,
  every6Hours: 21600,
  every12Hours: 43200,
  every24Hours: 86400,
};

const fromSeconds = {
  3600: "every hour",
  21600: "every 6 hours",
  43200: "every 12 hours",
  86400: "every 24 hours",
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
    header: "",
  },
];

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addWatcherModalOpen: false,
      watchers: [],
    };

    this.updateWatchers();
  }

  updateWatchers = async () => {
    let requestOptions = {
      credentials: "include",
    };

    let response = await fetch(
      `${this.props.gatewayAddress}/user`,
      requestOptions
    );
    let responseText = await response.text();

    let { watchers } = JSON.parse(responseText);
    // Cleanup Date
    watchers.forEach((i) => {
      let date = new Date(0);
      date.setUTCSeconds(i.last_run);
      i.last_run = String(date).slice(0, 24);
    });

    let oldState = this.state;
    oldState.watchers = watchers;
    this.setState(oldState);
  };

  deleteWatcher = async (watcherId) => {
    let requestOptions = {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ watcherId }),
      redirect: "follow",
    };

    await fetch(`${this.props.gatewayAddress}/watcher`, requestOptions);
    this.updateWatchers();
  };

  openModal = () => {
    let oldState = this.state;
    oldState.addWatcherModalOpen = true;
    this.setState(oldState);
  };
  closeModal = () => {
    let oldState = this.state;
    oldState.addWatcherModalOpen = false;
    this.setState(oldState);
  };
  submitModal = async () => {
    let url = document.getElementById("modalUrl").value;

    let frequency = toSeconds[window.RadioButtonGroup.state.selected];
    let options = {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ url, frequency }),
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    };

    let oldState = this.state;
    oldState.addWatcherModalOpen = false;
    this.setState(oldState);

    await fetch(
      "https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod/watcher",
      options
    );
    this.updateWatchers();
  };

  render() {
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    return (
      <div id="page">
        <HeaderContainer
          render={() => (
            <>
              <Header aria-label="IBM Platform Name">
                <HeaderName
                  // href="https://github.com/felixjchen/web-watcher"
                  prefix="Web"
                >
                  Watcher
                </HeaderName>
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

        <DataTable rows={this.state.watchers} headers={headers} isSortable>
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
              title={`Welcome ${this.props.email}`}
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
                        {...getHeaderProps({
                          header,
                          isSortable: header.key !== "options",
                        })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    return (
                      <TableRow key={row.id} {...getRowProps({ row })}>
                        <TableCell key={row.cells[0].id}>
                          <p style={{ display: "none" }}>
                            {row.cells[0].value}
                          </p>
                          <Link href={row.cells[0].value}>
                            {row.cells[0].value}
                          </Link>
                        </TableCell>
                        <TableCell key={row.cells[1].id}>
                          {row.cells[1].value in fromSeconds
                            ? fromSeconds[row.cells[1].value]
                            : row.cells[1].value}
                        </TableCell>
                        <TableCell key={row.cells[2].id}>
                          {row.cells[2].value}
                        </TableCell>
                        <TableCell key={row.cells[3].id}>
                          {row.cells[3].value}
                          <OverflowMenu flipped={true}>
                            {/* <OverflowMenuItem itemText="Edit" /> */}
                            <OverflowMenuItem
                              itemText="Delete"
                              hasDivider
                              isDelete
                              onClick={() => {
                                this.deleteWatcher(row.id);
                              }}
                            />
                          </OverflowMenu>
                        </TableCell>
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
          onRequestSubmit={this.submitModal}
          onSecondarySubmit={this.closeModal}
        >
          <TextInput
            id="modalUrl"
            labelText="URL"
            placeholder="https://www.google.com/"
            style={{ marginBottom: "1rem" }}
          />
          <FormGroup legendText="Frequency">
            <RadioButtonGroup
              defaultSelected="everyHour"
              name="frequency"
              ref={(RadioButtonGroup) => {
                window.RadioButtonGroup = RadioButtonGroup;
              }}
            >
              <RadioButton
                labelText="every hour"
                value="everyHour"
                id="radio-1"
              />
              <RadioButton
                labelText="every 6 hours"
                value="every6Hours"
                id="radio-2"
              />
              <RadioButton
                labelText="every 12 hours"
                value="every12Hours"
                id="radio-3"
              />
              <RadioButton
                labelText="every 24 hours"
                value="every24Hours"
                id="radio-4"
              />
            </RadioButtonGroup>
          </FormGroup>
        </Modal>
      </div>
    );
  }
}

export default Page;
