import React from "react";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem,
  HeaderMenuButton,
  HeaderContainer,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SideNav,
  SideNavMenuItem,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  PropTypes,
} from "carbon-components-react";
import { Fade16, Logout20 } from "@carbon/icons-react";
import "./page.css";

const Page = (props) => (
  <div id="page">
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header aria-label="IBM Platform Name">
            <HeaderMenuButton
              aria-label="Open menu"
              isCollapsible
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName prefix="Web">Watcher</HeaderName>
            <HeaderNavigation aria-label="FC Watcher">
              <HeaderMenuItem>Link 1</HeaderMenuItem>
              <HeaderMenuItem>Link 2</HeaderMenuItem>

              <HeaderMenu aria-label="Link 3" menuLinkName="Link 3">
                <HeaderMenuItem>Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem>Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem>Sub-link 3</HeaderMenuItem>
              </HeaderMenu>
            </HeaderNavigation>

            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Logout"
                onClick={props.logoutHandler}
              >
                <Logout20 />
              </HeaderGlobalAction>
            </HeaderGlobalBar>

            <SideNav
              aria-label="Side navigation"
              isRail
              expanded={isSideNavExpanded}
            >
              <SideNavItems>
                <SideNavLink aria-current="page" renderIcon={Fade16}>
                  Link
                </SideNavLink>
                <SideNavLink renderIcon={Fade16}>Link</SideNavLink>
                <SideNavMenu renderIcon={Fade16} title="Category title">
                  <SideNavMenuItem aria-current="page">Link</SideNavMenuItem>
                  <SideNavMenuItem>Link</SideNavMenuItem>
                  <SideNavMenuItem>Link</SideNavMenuItem>
                </SideNavMenu>
              </SideNavItems>
            </SideNav>
          </Header>
        </>
      )}
    />
  </div>
);

export default Page;
