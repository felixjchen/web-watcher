import {
  MDCDataTable
} from "@material/data-table";
const dataTable = new MDCDataTable(document.querySelector(".mdc-data-table"));

import {
  MDCTabBar
} from "@material/tab-bar";
const tabBar = new MDCTabBar(document.querySelector(".mdc-tab-bar"));


import {
  MDCRipple
} from "@material/ripple";
const selector = ".mdc-button, .mdc-icon-button, .mdc-card__primary-action";
const ripples = [].map.call(document.querySelectorAll(selector), function (el) {
  return new MDCRipple(el);
});

import {
  MDCTextField
} from '@material/textfield';

function initTextFields() {
  const fields = document.getElementsByClassName("mdc-text-field");

  Array.from(fields).forEach(function (field) {
    new MDCTextField(field);
  })
}
// const textField = new MDCTextField(document.querySelector('.mdc-text-field'));


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
      try {
        closeForms()
      } catch {}
    });
  });

  tabs[0].click();
}

import {
  MDCMenu
} from "@material/menu";

function initMenu(id) {
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

function initForm() {

  const tabs = ['User', 'Watcher']

  Array.from(tabs).forEach(function (tab) {
    const button = document.getElementById(tab + "FormButton");
    const buttonIcon = button.childNodes[3];
    const form = document.getElementById(tab + "Form");
    const formCloseButton = document.getElementById(tab + "FormCloseButton");
    const main = document.getElementById("main");

    button.addEventListener('click', function () {
      const isOpen = (form.offsetWidth > 0);
      if (isOpen) {
        form.style.width = "0";
        main.style.marginRight = "0";
        buttonIcon.innerHTML = 'chevron_left'
      } else {
        form.style.width = "320px";
        main.style.marginRight = "320px";
        buttonIcon.innerHTML = 'chevron_right'
      }
    });

    formCloseButton.addEventListener('click', function () {
      closeForms();
    });

    main.addEventListener('click', function () {

      const isOpen = (form.offsetWidth > 0);
      console.log(12)
      if (isOpen) {
        closeForms();
      }
    });
  });
}

function closeForms() {
  const forms = document.getElementsByClassName("form")
  const main = document.getElementById("main");
  const chevrons = document.getElementsByClassName("chevronIcon")

  Array.from(chevrons).forEach(function (chevron) {
    chevron.innerHTML = 'chevron_left';
  })

  Array.from(forms).forEach(function (form) {
    form.style.width = "0";
    main.style.marginRight = "0";
  });
};


function main() {
  initTab();
  initAllMenus();
  initForm();
  initTextFields();
}

main();