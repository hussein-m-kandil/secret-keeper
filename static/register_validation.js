import {
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
        }
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
        }
    }
    // if (isValidPassConfirm && isValidPassword){
    if (password !== confirmPass) {
        handleValidationErr(
            "confirmation",
            "confirmation",
            "Password confirmation does not match."
        );
        passConfirmIsMatch = false;
    } else {
        passConfirmIsMatch = true;
        // Remove any validation error messages if exists.
        let valErr = document.getElementById("confirmation-val-err");
        if (valErr) {
            valErr.style.display = "none";
        }
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
            "credentials": "same-origin",
        }).then(function(response) {
            if (response.redirected) {
                // If redirected follow the new location.
                window.location.href = response.url;
            } else if (!response.redirected) {
                // If NOT redirected parse the response and looke for 'userExist' key.
                response.json().then(function(obj) {
                    if (obj.nameExist) {
                        showAlertAboveTagName(
                            "Sorry, you can't use this name!",
                            "invalid-username",
                            "main"
                        );
                        // Scroll to top.
                        // For Safari.
                        document.body.scrollTop = 0;
                        // For Chrome, Firefox, IE and Opera.
                        document.documentElement.scrollTop = 0;
                    } else if (obj.databaseErr) {
                        showAlertAboveTagName(
                            "Oops, Somthing Wrong, Can't insert to DataBase.",
                            "databas-error",
                            "main"
                        );
                        // Scroll to top.
                        // For Safari.
                        document.body.scrollTop = 0;
                        // For Chrome, Firefox, IE and Opera.
                        document.documentElement.scrollTop = 0;
                    }
                }).catch(function(err) {
                    console.log(err);
                    showAlertAboveTagName(
                        "Oops, Somthing Wrong!",
                        "server-error",
                        "main"
                    );
                    // Scroll to top.
                    // For Safari.
                    document.body.scrollTop = 0;
                    // For Chrome, Firefox, IE and Opera.
                    document.documentElement.scrollTop = 0;
                });
            }
        }).catch(function(err) {
            console.log(err);
            showAlertAboveTagName(
                "Oops, Somthing Wrong!",
                "server-error",
                "main"
            );
            // Scroll to top.
            // For Safari.
            document.body.scrollTop = 0;
            // For Chrome, Firefox, IE and Opera.
            document.documentElement.scrollTop = 0;
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
