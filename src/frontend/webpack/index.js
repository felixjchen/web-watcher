import { MDCDataTable } from "@material/data-table";
const dataTable = new MDCDataTable(document.querySelector(".mdc-data-table"));

import { MDCTabBar } from "@material/tab-bar";
const tabBar = new MDCTabBar(document.querySelector(".mdc-tab-bar"));

import { MDCRipple } from "@material/ripple";
const selector = ".mdc-button, .mdc-icon-button, .mdc-card__primary-action";
const ripples = [].map.call(document.querySelectorAll(selector), function (el) {
  return new MDCRipple(el);
});

function initTab() {
  const tabs = document.getElementsByClassName("mdc-tab");

  Array.from(tabs).forEach(function (element) {
    element.addEventListener("click", function () {
      const tabcontentid = element.id + "Content";

      const tabcontents = document.getElementsByClassName("tabcontent");
      Array.from(tabcontents).filter(function (element) {
        element.style.display = "none";
      });

      document.getElementById(tabcontentid).style.display = "block";
    });
  });

  tabs[0].click();
}

import { MDCMenu } from "@material/menu";

function initMenu(id){
  const menu = new MDCMenu(document.getElementById(id));
  const button = document.getElementById(id + "Anchor");

  menu.setAnchorElement(button);
  menu.setIsHoisted(true);

  button.addEventListener("click", function () {
    menu.open = true;
  });
}

function initAllMenus() {
  const elements = document.getElementsByClassName("mdc-menu");

  Array.from(elements).forEach(function (element) {
    initMenu(element.id)
  });
}

function main() {
  initTab();
  initAllMenus();
}

main();
