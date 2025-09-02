import {api} from "./utils/api.js";
import {validate} from "./utils/validateLoggedInUser.js";
import {saveUser} from "./utils/storeUser.js";

await validate();

const formEl = document.querySelector('form');
const nameEl = document.getElementById('username');
const emailEl = document.getElementById('email');
const passwordEl = document.getElementById("password");
const passwordConfirmEl = document.getElementById('passwordConfirm');
const btnEl = document.querySelector('.login-btn');
const btnInitText = btnEl.textContent;

/**
 * I know here is a lot of code but i just wanted to play with
 * different ways of validating things
 * */

const initVal = {
    val: "",
    valid: false
}
const data = {
    email: {...initVal},
    password: {...initVal}
}

if (nameEl && passwordConfirmEl) {
    data.username = {...initVal};
    data.passwordConfirm = {...initVal};
}

const setUpSubmitBtn = () => {
    btnEl.disabled = !Object.values(data).every(field => field.valid === true);
}
setUpSubmitBtn();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validators = {
    username: name => !name ? "Name is Required"
        : name.length >= 5 ? false : "Name must contain at least 5 characters",
    email: email => !email ? "Email is Required"
        : emailRegex.test(email) ? false : "Invalid Email",
    password: password => !password ? "Password is Required"
        : password.length >= 12 ? false : "Password must be at least 12 characters long",
    passwordConfirm: (password, passwordConfirm) => !passwordConfirm ? "Password confirm is required"
        : passwordConfirm === password ? false : "Passwords don't match",
}

const validateField = (name, value) => {
    if (name === 'passwordConfirm') {
        return validators.passwordConfirm(data.password.val || "", value);
    }
    const fn = validators[name];
    return typeof fn === "function" ? fn(value || "") : false;
}

const showError = (inputEl, message) => {
    if (!inputEl) return;
    let pError = inputEl.nextElementSibling;
    if (!pError || !pError.classList.contains('error-message')) {
        pError = document.createElement('p');
        pError.classList.add('error-message');
        inputEl.parentNode.insertAdjacentElement("beforeend", pError);
    }
    pError.textContent = message;
}

const clearError = (inputEl) => {
    if (!inputEl) return;
    const pError = inputEl.nextElementSibling;
    if (pError && pError.classList.contains('error-message')) pError.remove();
}

const changeData = (e) => {

    const node = e.target;
    const {name, value} = node;

    if (typeof validators[name] !== "function") {
        data[name].val = value;
        data[name].valid = true;
        return;
    }

    let result = validateField(name, value);
    if (!result) {
        clearError(node);
    } else {
        showError(node, result);
    }
    data[name].val = value;
    data[name].valid = Boolean(!result);
    setUpSubmitBtn();
}

const validateFieldAsync = (name, value) => {
    return Promise.resolve(validateField(name, value));
}

const validateAll = async (entries) => {
    const tasks = entries.map(([name, value]) => validateFieldAsync(name, value.val));
    const results = await Promise.all(tasks);
    return results.every(r => r === false);
}

const handleSend = async () => {
    const result = await validateAll(Object.entries(data));
    if (!result) return;

    const payload = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v.val])
    );

    const location = window.location.pathname.slice(1);
    let res;
    try {
        btnEl.textContent = "Loading...";
        res = await api(`/auth/${location}`, {
            method: "POST",
            body: payload,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'same-origin',
        });
    } catch (error) {
        alert("Network error. Try again.");
    } finally {
        btnEl.textContent = btnInitText;
        btnEl.disabled = false;
    }

    if (res.ok) {
        const resData = await res.json();
        saveUser(resData.data);
        window.location.assign('/todo-list');
    }
}

formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleSend();
});

emailEl.addEventListener('input', changeData);
passwordEl.addEventListener('input', changeData);
if (nameEl && passwordConfirmEl) {
    nameEl.addEventListener('input', changeData);
    passwordConfirmEl.addEventListener('input', changeData);
}
