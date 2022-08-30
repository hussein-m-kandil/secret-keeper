import {
    showAlertAboveTagName,
    sanitizerRegex,
    isEmptyInput
} from "./helpers.js";

// Login form validation.
function loginValidation(form, e) {

    // Placeholders for USERNAME & PASSWORD.
    let username = isEmptyInput(form, "username", e, "ENTER USERNAME!");
    let password = isEmptyInput(form, "password", e, "ENTER PASSWORD!");
    // Submit the request.
    if (username && password) {
        e.preventDefault();
        const formData = new FormData();
        // Sanitize the username input's data and append it with password.
        formData.append("username", username.replace(sanitizerRegex, ''));
        formData.append("password", password);
        fetch(URL["login"].replace(sanitizerRegex, ''), {
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
                    if (obj.invalidUserData) {
                        showAlertAboveTagName(
                        "Check your inputs (username/password) and try again.",
                        "invalid-user-data",
                        "main"
                        );
                    } else {
                        showAlertAboveTagName(
                            "Oops, Somthing Wrong!",
                            "server-error",
                            "main"
                        );
                    };
                });
            }
        }).catch(function(err) {
            showAlertAboveTagName(
                "Oops, Somthing Wrong!",
                "server-error",
                "main"
            );
        });
    }
    return true;
};


export { loginValidation };
