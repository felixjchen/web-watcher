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
} from "carbon-components-react";
import { Fade16, Logout20 } from "@carbon/icons-react";
import "./page.css";

const Page = () => (
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
            <HeaderName href="#" prefix="Web">
              Watcher
            </HeaderName>
            <HeaderNavigation aria-label="FC Watcher">
              <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
              <HeaderMenuItem href="#">Link 2</HeaderMenuItem>

              <HeaderMenu aria-label="Link 3" menuLinkName="Link 3">
                <HeaderMenuItem href="#one">Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem href="#two">Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem href="#three">Sub-link 3</HeaderMenuItem>
              </HeaderMenu>
            </HeaderNavigation>

            <HeaderGlobalBar>
              <HeaderGlobalAction aria-label="Logout" onClick={alert("logout")}>
                <Logout20 />
              </HeaderGlobalAction>
            </HeaderGlobalBar>

            <SideNav
              aria-label="Side navigation"
              isRail
              expanded={isSideNavExpanded}
            >
              <SideNavItems>
                <SideNavLink
                  aria-current="page"
                  renderIcon={Fade16}
                  href="javascript:void(0)"
                >
                  Link
                </SideNavLink>
                <SideNavLink renderIcon={Fade16} href="javascript:void(0)">
                  Link
                </SideNavLink>
                <SideNavMenu renderIcon={Fade16} title="Category title">
                  <SideNavMenuItem
                    aria-current="page"
                    href="javascript:void(0)"
                  >
                    Link
                  </SideNavMenuItem>
                  <SideNavMenuItem href="javascript:void(0)">
                    Link
                  </SideNavMenuItem>
                  <SideNavMenuItem href="javascript:void(0)">
                    Link
                  </SideNavMenuItem>
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
