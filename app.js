const content = document.querySelector(".content");
const itemInput = document.querySelector(".item-input");
const submitBtn = document.querySelector(".submit-btn");
const inputSubmit = document.querySelector(".input-submit");

const listContainer = document.createElement("div");
const list = document.createElement("div");
list.className = "list";
listContainer.className = "list-container";

let editingItem, itemID, editFlag;
renderFromLocal();

submitBtn.addEventListener("click", handleUserEditing);

function handleUserEditing(e) {
  e.preventDefault();
  const value = itemInput.value;
  if (!value) {
    alertMessage("reject", "Please enter an item");
    return;
  }
  if (value && !editFlag) {
    setItem(Math.random().toString(36).substr(2, 9), value);
    alertMessage("success", "Added Successfully");
    addToLocalStorage(itemID, value);
  } else if (value && editFlag) {
    editItem(value);
    updateItemLocalStorage(itemID, value);
  }
  if (!list.children.length) {
    document.querySelector(".cancel-btn").remove();
  }
  setBackToDefault();
}
function setItem(id, value) {
  let html = `
      <div class="item-name">${value}</div>
      <div class="modifying-btn">
          <button type="submit" id="edit-btn">Edit</button>
          <button type="submit" id="del-btn">Del</button>
      </div>
    `;
  let item = document.createElement("div");
  item.className = "item";
  item.setAttribute("data-id", id);
  item.innerHTML = html;

  itemID = item.dataset.id;
  if (!list.children.length) {
    list.append(item);
    listContainer.style.visibility = "visible";
    listContainer.append(list);
    content.append(listContainer);
    createClearBtn();
  }
  list.append(item);
  const modifyingBtns = item.lastElementChild;
  modifyingBtns.onclick = modifyItem;
}
function setBackToDefault() {
  itemInput.value = "";
  editFlag = false;
  itemID = "";
}
function alertMessage(status, mes) {
  content.insertAdjacentHTML(
    "beforeend",
    `<div class="alert ${status}">${mes}</div>`
  );
  let alertMes = document.querySelectorAll(`.alert`);
  setTimeout(function () {
    alertMes.forEach((mes) => mes.remove());
  }, 1200);
}
function modifyItem(e) {
  if (e.target.tagName !== "BUTTON") return;
  let id = e.target.id; // specify button
  editingItem = this.previousElementSibling; // specify editing item
  itemID = editingItem.parentNode.dataset.id; // get editing item's id

  if (id == "edit-btn") {
    itemInput.focus();

    let oldItemVal = this.previousElementSibling.textContent;
    itemInput.value = oldItemVal;
    editFlag = true; // status: editing

    createCancelBtn();

    window.addEventListener("click", cancelEditing);
  }
  if (id == "del-btn") deleteItem.call(this, this.previousElementSibling);
}
function editItem(value) {
  editingItem.textContent = value;
  alertMessage("edited", "Edited !!");
  document.querySelector(".cancel-btn").remove();
}
function cancelEditing(e) {
  // when user clicks on outside of the screen (except "cancel" button, and "input" field), the editing mode is cancelled.
  if (e.target.id == "edit-btn" || e.target == itemInput) return;
  if (editFlag) {
    setBackToDefault();
    document.querySelector(".cancel-btn").remove();
  }
}
function deleteItem(item) {
  if (!confirm("Are you sure want to delete " + item.textContent + " ?"))
    return;
  item.parentNode.remove(); // remove item container
  removeFromLocalStorage(itemID);
  alertMessage("deleted", `Deleted item ${item.parentNode.dataset.id} !!`);
  if (!list.children.length) {
    listContainer.remove(); // remove list container
  }
}
function createClearBtn() {
  let clearBtn = document.createElement("button");
  clearBtn.className = "clear-btn";
  clearBtn.textContent = "Clear All";
  clearBtn.onclick = clearAll;
  listContainer.append(clearBtn);
}
function clearAll() {
  if (!confirm("Are you for sure want to clear all that?")) return;
  for (let item of list.children) {
    item.remove();
  }
  setBackToDefault();
  list.remove(); // clear list content
  listContainer.remove(); // clear list container
  localStorage.removeItem("list"); // clear local storage
  alertMessage("clear", "Cleared all items :((");
}
function createCancelBtn() {
  let cancelBtn = document.createElement("button");
  cancelBtn.className = "cancel-btn";
  cancelBtn.textContent = "Cancel";
  cancelBtn.onclick = function (e) {
    // cancel editing mode when user click on "Cancel" button
    e.preventDefault();
    document.querySelector(".cancel-btn").remove();
    setBackToDefault();
  };
  inputSubmit.append(cancelBtn);
}
function addToLocalStorage(id, value) {
  let storedList = JSON.parse(localStorage.getItem("list")) || [];

  let pushedItem = { id, value };
  storedList.push(pushedItem);
  localStorage.setItem("list", JSON.stringify(storedList));
}
function updateItemLocalStorage(id, value) {
  let list = JSON.parse(localStorage.getItem("list"));
  list = list.map((item) => {
    if (item.id == id) item.value = value;
    return item;
  });
  localStorage.setItem("list", JSON.stringify(list));
}
function removeFromLocalStorage(id) {
  let list = JSON.parse(localStorage.getItem("list"));

  list = list.filter((item) => item.id != id);
  if (list.length) localStorage.setItem("list", JSON.stringify(list));
  // list still has items
  else localStorage.removeItem("list"); // if not, remove list item
}
function renderFromLocal() {
  let storedList = JSON.parse(localStorage.getItem("list"));
  if (!storedList) return;

  storedList.forEach((item) => setItem(item.id, item.value));
}
// localStorage.removeItem("list");
