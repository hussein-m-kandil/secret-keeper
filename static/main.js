import { loginValidation } from "./login_validation.js";
import { registerValidation } from "./register_validation.js";
import {
    passGenHandler,
    getGenPass,
    saveSecretByValidName
} from "./password_gen_handler.js";


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
        // Catch password generator form.
        else if (form.name == "pass-gen-form") {
            getGenPass(form, e);
        }
        else if (form.name == "pass-save-form") {
            saveSecretByValidName(form, e);
        }
    }

});

// Secrets Generator.
let pageTitle = document.querySelector("title");
if (pageTitle.innerText == "Secret Keeper: Secrets Generator") {
    passGenHandler();
}


