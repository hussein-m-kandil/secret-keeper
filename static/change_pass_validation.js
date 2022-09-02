import {
    handleEmptyInputs,
    showAlertAboveTagName,
    passwordRegex,
    sanitizerRegex,
    isEmptyInput,
    handleValidationErr
} from "./helpers.js";

// Registeration form validation.
function changePassValidation(form, e) {

    // Placeholders for current password, new password and new password confirmation.
    let password = isEmptyInput(form, "password", e, "ENTER PASSWORD!");
    let newPassword = isEmptyInput(form, "new-password", e, "ENTER NEW PASSWORD!");
    let confirmNewPass = isEmptyInput(form, "confirm-new-pass", e, "CONFIRM YOUR NEW PASSWORD!");
    let isValidPassword = false;
    let isValidNewPassword = false;
    let isValidNewPassConfirm = false;
    let newPassConfirmIsMatch = false;
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
    // Check new password validation.
    if (newPassword) {
        if (!passwordRegex.test(newPassword)) {
            handleValidationErr(
                "new-password",
                "new-password",
                "At least 8 Characters containing 1 Number and 1 Letter."
            );
            isValidNewPassword = false;
        } else {
            isValidNewPassword = true;
            // Remove any validation error messages if exists.
            let valErr = document.getElementById("new-password-val-err");
            if (valErr) {
                valErr.style.display = "none";
            }
        };
    }
    // Check new password confirmation validation.
    if (confirmNewPass) {
        if (!passwordRegex.test(confirmNewPass)) {
            handleValidationErr(
                "confirm-new-pass",
                "confirm-new-pass",
                "At least 8 Characters containing 1 Number and 1 Letter."
            );
            isValidNewPassConfirm = false;
        } else {
            isValidNewPassConfirm = true;
            // Remove any validation error messages if exists.
            let valErr = document.getElementById("confirm-new-pass-val-err");
            if (valErr) {
                valErr.style.display = "none";
            }
        };
    }
    // Check for new password and new password confirmation matching.
    if (isValidNewPassConfirm && isValidNewPassword){
        if (newPassword == confirmNewPass) {
            newPassConfirmIsMatch = true;
        } else {
            handleValidationErr(
                "confirm-new-pass",
                "confirm-new-pass",
                "New password confirmation does not match."
            );
        };
    }
    // Submit the request.
    if (newPassword && isValidNewPassword && password && confirmNewPass && newPassConfirmIsMatch) {
        e.preventDefault();
        // Make form data.
        const formData = new FormData();
        formData.append("password", password);
        formData.append("new-password", newPassword);
        formData.append("confirm-new-pass", confirmNewPass);
        fetch(URL["password"].replace(sanitizerRegex, ''), {
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
                    if (obj.invalidPassword) {
                        showAlertAboveTagName(
                            "Invalid Password! Check your current password and try again.",
                            "invalid-password",
                            "main"
                        );
                        // Scroll to top.
                        // For Safari.
                        document.body.scrollTop = 0;
                        // For Chrome, Firefox, IE and Opera.
                        document.documentElement.scrollTop = 0;
                    } else {
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
                    };
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
        isValidPassword = false;
        isValidNewPassword = false;
        isValidNewPassConfirm = false;
        newPassConfirmIsMatch = false;
    }
    return true;
}

export { changePassValidation };
