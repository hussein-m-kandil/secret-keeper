import { loginValidation } from "./login_validation.js";
import { registerValidation } from "./register_validation.js";
import { changePassValidation } from "./change_pass_validation.js";
import {passGenHandler,
    getGenPass,
    saveSecretByValidName
} from "./password_gen_handler.js";
import { showSecretVal,
    secretsFormHandler,
    delSecret
} from "./secrets_handler.js";

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
            secretsFormHandler(form, e);
        }
        // Catch delete secret form.
        else if (form.name == "del-secret-form") {
            delSecret(form, e);
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
}
