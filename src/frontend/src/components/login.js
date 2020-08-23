import React from "react";
import {
  Header,
  HeaderName,
  Grid,
  Row,
  Column,
  Button,
  TextInput,
} from "carbon-components-react";
import "./login.css";
import fractel from "./threetree_90.png";

const Login = (props) => (
  <div id="login">
    <Header aria-label="header">
      <HeaderName href="#" prefix="FC">
        Watcher
      </HeaderName>
    </Header>
    <Grid>
      <Row>
        <Column
          id="leftBox"
          sm={{ span: 4, offset: 0 }}
          md={{ span: 4, offset: 1 }}
          lg={{ span: 4, offset: 2 }}
        >
          <h1 className="bx--type-semibold">Sign in to your account</h1>
          <TextInput id="email" labelText="Email" />
          <TextInput.PasswordInput id="password" labelText="Password" />
          <Button size="small" onClick={props.handler}>
            Log in
          </Button>
        </Column>
        <Column
          id="rightBox"
          sm={{ span: 0 }}
          md={{ span: 2 }}
          lg={{ span: 4 }}
        >
          <img src={fractel} alt="fractel"></img>
        </Column>
      </Row>
    </Grid>
  </div>
);

export default Login;
