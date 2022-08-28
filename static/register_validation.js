import {
    errMessageGen,
    errMessageAnimy,
    handleEmptyInputs,
    showAlertAboveTagName,
    usernameRegex,
    passwordRegex,
    sanitizerRegex,
    isEmptyInput,
    handleValidationErr
} from "./helpers.js";

// Registeration form validation.
function registerValidation(form, e) {

    // Placeholders for USERNAME & PASSWORD.
    let username = isEmptyInput(form, "username", e, "ENTER USERNAME!");
    let password = isEmptyInput(form, "password", e, "ENTER PASSWORD!");
    let confirmPass = isEmptyInput(form, "confirmation", e, "CONFIRM YOUR PASSWORD!");
    let isValidUserName = false;
    let isValidPassword = false;
    let isValidPassConfirm = false;
    let passConfirmIsMatch = false;
    // Check username validation.
    if (username) {
        if (!usernameRegex.test(username)) {
            handleValidationErr(
                "username",
                "username",
                "4-28 Characters has Lowercase Letters, Numbers and Hyphens/Underscores only (NO SPACES)."
            );
            isValidUserName = false;
        } else {
            isValidUserName = true;
            // Remove any validation error messages if exists.
            let valErr = document.getElementById("username-val-err");
            if (valErr) {
                valErr.style.display = "none";
            }
        };
    }
    // Check password validation.
    if (password) {
        if (!passwordRegex.test(password)) {
            handleValidationErr(
                "password",
                "password",
                "At least 8 Characters containing 1 Number and 1 Letter."
            );
            isValidPassword = false;
        } else {
            isValidPassword = true;
            // Remove any validation error messages if exists.
            let valErr = document.getElementById("password-val-err");
            if (valErr) {
                valErr.style.display = "none";
            }
        };
    }
    // Check password confirmation validation.
    if (confirmPass) {
        if (!passwordRegex.test(confirmPass)) {
            handleValidationErr(
                "confirmation",
                "confirmation",
                "At least 8 Characters containing 1 Number and 1 Letter."
            );
            isValidPassConfirm = false;
        } else {
            isValidPassConfirm = true;
            // Remove any validation error messages if exists.
            let valErr = document.getElementById("confirmation-val-err");
            if (valErr) {
                valErr.style.display = "none";
            }
        };
    }
    // Check for password and password confirmation matching.
    if (isValidPassConfirm && isValidPassword){
        if (password == confirmPass) {
            passConfirmIsMatch = true;
        } else {
            handleValidationErr(
                "confirmation",
                "confirmation",
                "Password confirmation does not match."
            );
        };
    }
    // Submit the request.
    if (username && isValidUserName && password && confirmPass && passConfirmIsMatch) {
        e.preventDefault();
        const formData = new FormData();
        // Sanitize the username input's data and append it with password.
        formData.append("username", username);
        formData.append("password", password);
        formData.append("confirmation", confirmPass);
        fetch(URL["register"].replace(sanitizerRegex, ''), {
            "method": "POST",
            "body": formData,
        }).then(function(response) {
            if (response.redirected) {
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
                if (URL["register"].replace(sanitizerRegex, '') == route) {
                    showAlertAboveTagName(
                        "Sorry, you can't use this name!",
                        "invalid-username",
                        "main"
                    );
                } else {
                    // window.location.href = response.url;
                };
            } else {
                showAlertAboveTagName(
                    "Oops, Somthing Wrong!",
                    "somthing-wrong",
                    "main"
                );
            }
        }).catch(function(err) {
            showAlertAboveTagName(
                "Oops, Somthing Wrong!",
                "somthing-wrong",
                "main"
            );
        });
        // Reset all flags.
        isValidUserName = false;
        isValidPassword = false;
        isValidPassConfirm = false;
        passConfirmIsMatch = false;
    }
    return true;
}

export { registerValidation };
