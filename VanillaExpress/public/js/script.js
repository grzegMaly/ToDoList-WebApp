// import {api} from "./utils/api.js";
import {validate} from "./utils/validateLoggedInUser.js";

if (!validate()) {
    window.location.assign('/login');
}

const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".input");
const listEl = document.querySelector("ul");

const makeLi = (name, checked = false) => {
    const liEl = document.createElement("li");
    if (checked) liEl.classList.add("checked");

    const textEl = document.createElement("span");
    textEl.className = "todo-text";
    textEl.textContent = name;

    const checkBtnEl = document.createElement("div");
    const trashBtnEl = document.createElement("div");
    checkBtnEl.innerHTML = `<i class="fa-solid fa-square-check"></i>`;
    trashBtnEl.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    checkBtnEl.addEventListener("click", () => {
        liEl.classList.toggle("checked");
        updateLocalStorage();
    });
    trashBtnEl.addEventListener("click", () => {
        liEl.remove();
        updateLocalStorage();
    });

    liEl.append(textEl, checkBtnEl, trashBtnEl);
    return liEl;
};

const todoList = (task) => {
    let newTask = task ? task.name : inputEl.value;

    if (!newTask || !newTask.trim()) {
        inputEl.value = "";
        return;
    }

    const liEl = makeLi(newTask.trim(), task && task.checked);
    listEl.insertAdjacentElement("afterbegin", liEl);
    inputEl.value = "";
    updateLocalStorage();
};

const updateLocalStorage = () => {
    const liEls = listEl.querySelectorAll("li");
    const list = [];
    liEls.forEach(liEl => {
        const name = liEl.querySelector(".todo-text")?.textContent ?? "";
        if (name.trim()) {
            list.push({
                name: name.trim(),
                checked: liEl.classList.contains("checked"),
            });
        }
    });
    localStorage.setItem("list", JSON.stringify(list));
};

formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    todoList();
});

let list = JSON.parse(localStorage.getItem("list")) || [];
for (let i = list.length - 1; i >= 0; i--) {
    const el = list[i];
    if (el && el.name && el.name.trim()) {
        todoList(el);
    }
}
