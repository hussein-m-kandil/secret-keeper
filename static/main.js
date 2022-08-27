import { loginValidation } from "./login_validation.js";
import { registerValidation } from "./register_validation.js";


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
    }

});
