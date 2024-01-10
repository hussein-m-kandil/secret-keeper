import {sanitizerRegex } from "./helpers.js";
import { loginValidation } from "./login_validation.js";
import { registerValidation } from "./register_validation.js";
import { changePassValidation } from "./change_pass_validation.js";
import {passGenHandler,
    getGenPass,
    saveSecretByValidName
} from "./password_gen_handler.js";
import { showSecretVal,
    renameSecretHandler,
    renSecret,
    deleteSecretHandler,
    delSecret
} from "./secrets_handler.js";

// Clear any flask flashes after window is loaded.
window.addEventListener("load", function(e) {
    // Call route for clearing flashes.
    this.fetch(URL["clearFlashes"].replace(sanitizerRegex, ''), {
        "body": "",
        "method": "post",
        "credentials": "same-origin",
    }).then(function(resp) {
        resp.json().then(function(respObj) {
        }).catch(function(err) {
            // console.log(err);
            console.error(err);
        });
    }).catch(function(err) {
        // console.log(err);
        console.error(err);
    });

});

// Handle all checks for empty inputs with all submissions.
addEventListener("submit", function(e) {

    e.preventDefault();

    // Check for forms.
    if (e.target.nodeName == "FORM") {
        // Get the form.
        let form = e.target;
        // Catch login form.
        if (form.name == "login"){
            loginValidation(form, e);
        }
        // Catch registeration form.
        else if (form.name == "registeration") {
            registerValidation(form, e);
        }
        // Catch change password form.
        else if (form.name == "change-password") {
            changePassValidation(form, e);
        }
        // Catch password generator form.
        else if (form.name == "pass-gen-form") {
            getGenPass(form, e);
        }
        // Catch save generated password form.
        else if (form.name == "pass-save-form") {
            saveSecretByValidName(form, e);
        }
        // Catch secrets form.
        else if (form.name == "secrets") {
            // Check Wheather the submit button is the delete or rename button.
            if (e.submitter.value == "delete") {
                deleteSecretHandler(form, e);
            } else if (e.submitter.value == "rename") {
                renameSecretHandler(form, e);
            }
        }
        // Catch rename secret form.
        else if (form.name == "ren-secret-form") {
            renSecret(form, e);
        }
        // Catch delete secret form.
        else if (form.name == "del-secret-form") {
            delSecret(form, e);
        }
    }

    // Wait a bit before searching for any alert.
    this.setTimeout(function() {
        // Changing the focus after any bootstrap alert.
        let anyAlert = this.document.querySelectorAll(".alert");
        if (anyAlert) {
            const anyAlertLen = anyAlert.length;
            let i = 0;
            while (i < anyAlertLen) {
                anyAlert[i].addEventListener("closed.bs.alert", function() {
                    // Get any form obj (assuming that all pages contains forms).
                    let anyFormObj = document.querySelector("form");
                    if (anyFormObj) {
                        anyFormObj[0].focus();
                    }
                });
                i++;
            }
        }
    }, 1000);
});

// Catch any Eye Icon.
addEventListener("click", function(e) {
    let eyeIcon;
    // Try to get the Eye Icon Elenemt.
    if (e.target.nodeName && e.target.nodeName == "SPAN") {
        // if BUTTON try to get the Eye Icon child.
        let eyeGetTest = e.target.firstElementChild;
        if (eyeGetTest && eyeGetTest.nodeName == "I") {
            // if I mostly it will by the Eye Icon.
            eyeIcon = eyeGetTest;
        }
    } else if (e.target.nodeName && e.target.nodeName == "I"){
        // if I mostly it will by the Eye Icon.
        eyeIcon = e.target;
    }
    // Toggle the Eye Icon on/off & Toggle the corresponding input's type text/password.
    if (eyeIcon) {
        if (eyeIcon.className == "bi bi-eye-fill") {
            eyeIcon.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
            eyeIcon.parentNode.previousElementSibling.type = "text";
        } else if (eyeIcon.className == "bi bi-eye-slash-fill"){
            eyeIcon.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
            eyeIcon.parentNode.previousElementSibling.type = "password";
        }
    }
});

// Get Current Page Title.
let pageTitle = document.querySelector("title");

// Secrets Generator.
if (pageTitle.innerText == "Secret Keeper: Secrets Generator") {
    passGenHandler();
}

// Secrets Generator.
if (pageTitle.innerText == "Secret Keeper: Secrets") {
    showSecretVal();
    // Enable the buttons when the user choose any valid option from the select menu.
    let delBtn = document.getElementById("del-btn");
    let renBtn = document.getElementById("ren-btn");
    addEventListener("change", function(e) {
        if (e.target.value != "") {
            delBtn.disabled = false;
            renBtn.disabled = false;
        }
    });
}

// Login & Registeration.
if (pageTitle.innerText == "Secret Keeper: Log In"
    ||
    pageTitle.innerText == "Secret Keeper: Registeration"
    ||
    pageTitle.innerText == "Secret Keeper: Password") {
    // Disable the submit button when the page is loaded.
    let submitList = document.querySelectorAll("button[type='submit']");
    const submitListLen = submitList.length;
    window.addEventListener("DOMContentLoaded", function(e) {
        let i = 0;
        while (i < submitListLen) {
            submitList[i].disabled = true;
            i++;
        }
    });
    // Enable the submit button when all inputs are fulfilled.
    addEventListener("input", function(e) {
        const form = e.target.form;
        const formLen = form.length;
        let isEmpty = false;
        let i = 0;
        while (i < formLen) {
            if (form[i].type != "submit" && form[i].type != "button") {
                if (form[i].value == "") { isEmpty = true; }
            }
            i++;
        }
        i = 0;
        while (i < submitListLen) {
            submitList[i].disabled = (isEmpty) ? true : false;
            i++;
        }
    });
}


