import * as Alerts from "./helpers.js";

// Regex pattert for " ' and white spaces.
// const sanitizerRegex = /[''""\s]/g;
const sanitizerRegex = /[^\w-]/g;

// Handle all checks for empty inputs with all submissions.
addEventListener("submit", function(e) {

    // e.preventDefault();

    // Check for forms
    if (e.target.nodeName == "FORM") {
        // Get the form
        let form = e.target;
        // Flags for USERNAME/PASSWORD existness.
        let usernameIsEmpty = false;
        let passwordIsEmpty = false;
        // Catch login form
        if (form.name == "login"){
            const formLen = form.length
            let username = "";
            let password = "";
            // Catching empty fields
            for (let i = 0; i < formLen; i++) {
                // Submission element exception.
                if (form[i].type != "submit") {
                    // Handle empty username/password.
                    if (form[i].name == "username") {
                        usernameIsEmpty = Alerts.handleEmptyInputs(
                            e, "username", form[i], "ENTER USERNAME!"
                        );
                        // Get username.
                        username = (!usernameIsEmpty) ? form[i].value : "";
                    } else if (form[i].name == "password") {
                        passwordIsEmpty = Alerts.handleEmptyInputs(
                            e, "password", form[i], "ENTER PASSWORD!"
                        );
                        // Get password.
                        password = (!passwordIsEmpty) ? form[i].value : "";
                    }
                }
            }
            if (!usernameIsEmpty && !passwordIsEmpty) {
                e.preventDefault();
                // let routes = this.document.getElementById("routes");
                const formData = new FormData();
                // Sanitize the username input's data and append it with password.
                formData.append("username", username.replace(sanitizerRegex, ''));
                formData.append("password", password);
                this.fetch(URL["login"].replace(sanitizerRegex, ''), {
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
                            Alerts.showAlertAboveTagName(
                                "Check your inputs (username/password) and try again.",
                                "invalid-input",
                                "main"
                            );
                        }
                    } else {
                        Alerts.showAlertAboveTagName(
                            "Somthing Wrong!",
                            "somthing-wrong",
                            "main"
                        );
                    }
                });
                usernameIsEmpty = false;
                passwordIsEmpty = false;
            }
        }
    }

});
