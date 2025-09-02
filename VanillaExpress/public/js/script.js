import {validate} from "./utils/validateLoggedInUser.js";
import {getDocs, updateDocStatus, deleteDoc, createDoc} from "./utils/docOperations.js";

await validate();

const formEl = document.querySelector(".form");
const inputEl = document.querySelector(".input");
const listEl = document.querySelector("ul");

const init = async () => {
    try {
        const res = await getDocs();
        if (!res.ok) throw new Error("Failed to fetch list");

        const data = await res.json();
        const tasks = data.data;

        localStorage.setItem("LIST", JSON.stringify(tasks));
    } catch (e) {
        console.error(e);
    }
};
await init();

const makeLi = ({_id, content, done = false}) => {
    const liEl = document.createElement("li");
    if (done) liEl.classList.add("checked");
    liEl.dataset.id = _id;

    const textEl = document.createElement("span");
    textEl.className = "todo-text";
    textEl.textContent = content;

    const checkBtnEl = document.createElement("div");
    const trashBtnEl = document.createElement("div");
    checkBtnEl.innerHTML = `<i class="fa-solid fa-square-check"></i>`;
    trashBtnEl.innerHTML = `<i class="fa-solid fa-trash"></i>`;

    checkBtnEl.addEventListener("click", async () => {
        const id = liEl.dataset.id;
        const done = !liEl.classList.contains("checked");
        const res = await updateDocStatus(id, done);
        if (res.ok) {
            liEl.classList.toggle("checked");
            updateLocalStorage();
        }
    });
    trashBtnEl.addEventListener("click", async () => {

        const id = liEl.dataset.id;
        const res = await deleteDoc(id);
        if (res.ok) {
            liEl.remove();
            updateLocalStorage();
        }
    });

    liEl.append(textEl, checkBtnEl, trashBtnEl);
    return liEl;
};

const todoList = async (task) => {
    let newTask = task ? task.content : inputEl.value;

    if (!newTask || !newTask.trim()) {
        inputEl.value = "";
        return;
    }

    if (task?._id) {
        const liEl = makeLi(task);
        listEl.insertAdjacentElement("afterbegin", liEl);
    } else {
        const res = await createDoc(newTask);

        if (!res.ok) {
            return;
        }

        const data = await res.json();
        const task = data.data;
        const liEl = makeLi(task);
        listEl.insertAdjacentElement('afterbegin', liEl);
    }

    inputEl.value = "";
    updateLocalStorage();
};

const updateLocalStorage = () => {
    const liEls = listEl.querySelectorAll("li");
    const list = [];
    liEls.forEach(liEl => {
        const id = liEl.dataset.id;
        const content = liEl.querySelector(".todo-text")?.textContent ?? "";
        const done = liEl.classList.contains("checked");
        if (content.trim()) {
            list.push({
                _id: id,
                content: content.trim(),
                done
            });
        }
    });
    localStorage.setItem("LIST", JSON.stringify(list));
};

formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    todoList().then(null);
});

let list = JSON.parse(localStorage.getItem("LIST")) || [];
for (let i = list.length - 1; i >= 0; i--) {
    const el = list[i];
    if (el && el._id && el.content.trim()) {
        todoList(el).then(() => null);
    }
}
