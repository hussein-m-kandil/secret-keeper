import {
    handleEmptyInputs,
    showAlertAboveTagName,
    passwordRegex,
    sanitizerRegex
} from "./helpers.js";

// Login form validation.
function loginValidation(form, e) {

    const formLen = form.length
    // Flags for USERNAME/PASSWORD existness.
    let usernameIsEmpty = false;
    let passwordIsEmpty = false;
    // Placeholders for USERNAME & PASSWORD.
    let username = "";
    let password = "";
    // Catching empty fields
    for (let i = 0; i < formLen; i++) {
        // Submission element exception.
        if (form[i].type != "submit") {
            // Handle empty username/password.
            if (form[i].name == "username") {
                usernameIsEmpty = handleEmptyInputs(
                    e, "username", form[i], "ENTER USERNAME!"
                );
                // Get username.
                username = (!usernameIsEmpty) ? form[i].value : "";
            } else if (form[i].name == "password") {
                passwordIsEmpty = handleEmptyInputs(
                    e, "password", form[i], "ENTER PASSWORD!"
                );
                // Get password.
                password = (!passwordIsEmpty) ? form[i].value : "";
            }
        }
    }
    if (!usernameIsEmpty && !passwordIsEmpty) {
        e.preventDefault();
        const formData = new FormData();
        // Sanitize the username input's data and append it with password.
        formData.append("username", username.replace(sanitizerRegex, ''));
        formData.append("password", password);
        fetch(URL["login"].replace(sanitizerRegex, ''), {
            "method": "POST",
            "body": formData,
        }).then(function(response) {
            if (response.redirected) {
                // window.location = response.url;
                // Get the URL for the redirection.
                const direction = response.url;
                const directionLen = direction.length;
                let route = "";
                let i = directionLen - 1;
                // Extract the final route from URL.
                while (i >= 0) {
                    if (direction[i] == '/') {
                        route = direction.slice(
                            i, directionLen
                        ).replace(sanitizerRegex, '');
                        break;
                    }
                    i--;
                }
                // If redirection to same route show alert to user.
                if (URL["login"].replace(sanitizerRegex, '') == route) {
                    showAlertAboveTagName(
                        "Check your inputs (username/password) and try again.",
                        "invalid-input",
                        "main"
                    );
                }
            } else {
                showAlertAboveTagName(
                    "Somthing Wrong!",
                    "somthing-wrong",
                    "main"
                );
            }
        });
        usernameIsEmpty = false;
        passwordIsEmpty = false;
    }
    return true;
};


export { loginValidation };
