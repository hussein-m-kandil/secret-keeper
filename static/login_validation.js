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
                if (URL["login"].replace(sanitizerRegex, '') == route) {
                    showAlertAboveTagName(
                        "Check your inputs (username/password) and try again.",
                        "invalid-input",
                        "main"
                    );
                } else {
                    window.location = response.url;
                };
            } else {
                showAlertAboveTagName(
                    "Somthing Wrong!",
                    "somthing-wrong",
                    "main"
                );
            }
        });
    }
    return true;
};


export { loginValidation };
