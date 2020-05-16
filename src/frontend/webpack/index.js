import {
  MDCDataTable
} from "@material/data-table";
import {
  MDCTabBar
} from "@material/tab-bar";
import {
  MDCRipple
} from "@material/ripple";
import {
  MDCTextField
} from "@material/textfield";
import {
  MDCLinearProgress
} from '@material/linear-progress';
import {
  MDCMenu
} from "@material/menu";

const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));

// Init Material components
const dataTable = new MDCDataTable(document.querySelector(".mdc-data-table"));
const tabBar = new MDCTabBar(document.querySelector(".mdc-tab-bar"));
const selector = ".mdc-button, .mdc-icon-button, .mdc-card__primary-action";
const ripples = [].map.call(document.querySelectorAll(selector), function (el) {
  return new MDCRipple(el);
});


function initTextFields() {
  const fields = document.getElementsByClassName("mdc-text-field");

  Array.from(fields).forEach(function (field) {
    new MDCTextField(field);
  });
}

function initTabs() {
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
        closeForms();
      } catch {}
    });
  });

  tabs[0].click();
}


function initMenu(id) {
  const menu = new MDCMenu(document.getElementById(id));
  const button = document.getElementById("Anchor" + id);
  menu.setAnchorElement(button);
  menu.setIsHoisted(true);

  button.addEventListener("click", function () {
    menu.open = true;
  });

  const deleteButton = document.getElementById(id).childNodes[1].childNodes[1];
  deleteButton.addEventListener("click", function () {

    const userDelete = deleteButton.classList.contains("deleteUser");

    const request = new XMLHttpRequest();
    if (userDelete) {
      request.open('DELETE', configure_address + '/users/' + id, false)
    } else {
      request.open('DELETE', configure_address + '/watchers/' + id, false)
    }

    request.send();
    if (request.status === 200) {
      location.reload();
    }

  })

}

function initAllMenus() {
  const elements = document.getElementsByClassName("mdc-menu");

  Array.from(elements).forEach(function (element) {
    initMenu(element.id);
  });
}

function initAddForms() {
  const tabs = ["User", "Watcher"];
  Array.from(tabs).forEach(function (tab) {
    const button = document.getElementById(tab + "FormButton");
    const buttonIcon = button.childNodes[3];
    const form = document.getElementById(tab + "Form");
    const formCloseButton = document.getElementById(tab + "FormCloseButton");
    const main = document.getElementById("main");

    button.addEventListener("click", function () {
      const isOpen = form.offsetWidth > 0;
      if (isOpen) {
        form.style.width = "0";
        main.style.marginRight = "0";
        buttonIcon.innerHTML = "chevron_left";
      } else {
        form.style.width = "320px";
        main.style.marginRight = "320px";
        buttonIcon.innerHTML = "chevron_right";
      }
    });

    // Two other close form options
    formCloseButton.addEventListener("click", function () {
      closeForms();
    });
    main.addEventListener("click", function () {
      const isOpen = form.offsetWidth > 0;
      if (isOpen) {
        closeForms();
      }
    });
  });
}

function closeForms() {
  const forms = document.getElementsByClassName("form");
  const main = document.getElementById("main");
  const chevrons = document.getElementsByClassName("chevronIcon");

  Array.from(chevrons).forEach(function (chevron) {
    chevron.innerHTML = "chevron_left";
  });

  Array.from(forms).forEach(function (form) {
    form.style.width = "0";
    main.style.marginRight = "0";
  });
}

function initAddUser() {
  const button = document.getElementById("AddUserButton");

  button.addEventListener("click", function () {
    // Get form data
    const name = document.getElementById("AddUserName");
    const email = document.getElementById("AddUserEmail");
    const payload = {
      name: name.value,
      email: email.value,
    };

    const table = document.getElementById("UsersTable");

    // POST to configure service
    const http = new XMLHttpRequest();
    http.open('POST', configure_address + '/users', true)
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const response = JSON.parse(this.responseText);

        // Adding Row to table
        const row = table.insertRow();
        row.classList.add("mdc-data-table__row");

        const userCell = row.insertCell(0);
        userCell.classList.add("mdc-data-table__cell");
        const userIDCell = row.insertCell(1);
        userIDCell.classList.add("mdc-data-table__cell");
        const emailCell = row.insertCell(2);
        emailCell.classList.add("mdc-data-table__cell");
        const watcherCountCell = row.insertCell(3);
        watcherCountCell.classList.add("mdc-data-table__cell");
        watcherCountCell.classList.add("mdc-data-table__cell--numeric");
        const menuCell = row.insertCell(4);
        menuCell.classList.add("mdc-data-table__cell");

        userCell.innerHTML = name.value;
        userIDCell.innerHTML = response['user_id'];
        emailCell.innerHTML = email.value;
        watcherCountCell.innerHTML = "0";

        const menuIcon = document.createElement('span');
        menuIcon.id = 'Anchor' + response['user_id']
        menuIcon.innerHTML = "more_vert";
        menuIcon.classList.add("anchor");
        menuIcon.classList.add("material-icons");
        menuCell.appendChild(menuIcon);

        // Adding Menu
        const menus = document.getElementById("UserMenus");
        const menu = document.getElementsByClassName("UserMenu")[0].cloneNode(true);
        menu.id = response['user_id']
        menus.appendChild(menu)

        initMenu(response['user_id']);
        closeForms();
        name.value = "";
        email.value = "";
      }
    }
    http.send(JSON.stringify(payload));

    console.log(payload);
  });
}

function initAddWatcher() {
  const form = document.getElementById("WatcherForm");
  const button = document.getElementById("AddWatcherButton");
  const loading = document.getElementById("loading")

  button.addEventListener("click", function () {
    form.style.paddingTop = "56px";
    loading.style.display = "block";
    // Get form data
    const user_id = document.getElementById("AddWatcherUserID");
    const url = document.getElementById("AddWatcherUrl");
    const frequency = document.getElementById("AddWatcherFrequency");
    const payload = {
      user_id: user_id.value,
      url: url.value,
      frequency: frequency.value,
    };

    const table = document.getElementById("WatchersTable");

    // POST to configure service
    const http = new XMLHttpRequest();
    http.open('POST', configure_address + '/watchers', true)
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const response = JSON.parse(this.responseText);

        // Adding Row to table
        const row = table.insertRow();
        row.classList.add("mdc-data-table__row");

        const userCell = row.insertCell(0);
        userCell.classList.add("mdc-data-table__cell");

        const urlCell = row.insertCell(1);
        urlCell.classList.add("mdc-data-table__cell");

        const frequencyCell = row.insertCell(2);
        frequencyCell.classList.add("mdc-data-table__cell");
        frequencyCell.classList.add("mdc-data-table__cell--numeric");

        const lastRunCell = row.insertCell(3);
        lastRunCell.classList.add("mdc-data-table__cell");
        lastRunCell.classList.add("mdc-data-table__cell--numeric");

        const menuCell = row.insertCell(4);
        menuCell.classList.add("mdc-data-table__cell");

        userCell.innerHTML = getUserName(user_id.value);

        const a = document.createElement('a');
        a.href = url.value;
        a.innerHTML = url.value;
        urlCell.appendChild(a);

        frequencyCell.innerHTML = frequency.value;;
        lastRunCell.innerHTML = response['last_run'];

        const menuIcon = document.createElement('span');
        menuIcon.id = 'Anchor' + response['watcher_id']
        menuIcon.innerHTML = "more_vert";
        menuIcon.classList.add("anchor");
        menuIcon.classList.add("material-icons");
        menuCell.appendChild(menuIcon);

        // Adding Menu
        const menus = document.getElementById("WatcherMenus");
        const menu = document.getElementsByClassName("WatcherMenu")[0].cloneNode(true);
        menu.id = response['watcher_id']
        menus.appendChild(menu)

        initMenu(response['watcher_id']);
        closeForms();
        user_id.value = "";
        url.value = "";
        frequency.value = "";
        form.style.paddingTop = "60px";
        loading.style.display = "none";
      }
    }
    http.send(JSON.stringify(payload));
  });
}

function getUserName(user_id) {
  // POST to configure service
  const http = new XMLHttpRequest();
  http.open('GET', configure_address + '/users/' + user_id, false)
  http.send();
  if (http.status === 200) {
    const response = JSON.parse(http.responseText);
    return response['name']
  }
}

function main() {
  initTabs();
  initAllMenus();
  initAddForms();
  initTextFields();
  initAddUser();
  initAddWatcher();
}

function setConfigureAddress(address) {
  console.log(address)
}

main();

const configure_address = 'http://0.0.0.0:8004';