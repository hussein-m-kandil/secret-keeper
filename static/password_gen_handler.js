import {
    errMessageGen,
    errMessageAnimy,
    handleEmptyInputs,
    showAlertAboveTagName,
    usernameRegex,
    passwordRegex,
    sanitizerRegex,
    isEmptyInput,
    handleValidationErr,
    secretNameRegex
} from "./helpers.js";

// Validate the name of the secret and save it if valid.
function saveSecretByValidName(form, e) {
    // Check for empty secret name.
    let secretName = isEmptyInput(form, "pass-gen-name", e, "DESCRIPTIVE NAME IS MISSING!");
    // Check username validation.
    let isValidSecretName = false;
    if (secretName) {
        if (!secretNameRegex.test(secretName)) {
            handleValidationErr(
                "pass-gen-name",
                "pass-gen-name",
                "4-128 Characters has Lowercase/Uppercase Letters, Numbers and Spaces/Underscores."
            );
            isValidSecretName = false;
        } else {
            isValidSecretName = true;
            // Remove any validation error messages if exists.
            let valErr = document.getElementById("pass-gen-name-val-err");
            if (valErr) {
                valErr.style.display = "none";
            }
        }
    }
    // Submit the request.
    if (secretName && isValidSecretName) {
        e.preventDefault();
        const formData = new FormData();
        // Sanitize the username input's data and append it with password.
        formData.append("secret-name", secretName);
        formData.append("secret", form["gen-pass"].value);
        fetch(URL["saveSecret"].replace(sanitizerRegex, ''), {
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
                    if (obj.invalidData) {
                        showAlertAboveTagName(
                            "Oops, Somthing Wrong, check your inputs and try again.",
                            "invalid-inputs-error",
                            "main"
                        );
                        // Scroll to top.
                        // For Safari.
                        document.body.scrollTop = 0;
                        // For Chrome, Firefox, IE and Opera.
                        document.documentElement.scrollTop = 0;
                    } else if (obj.sameNameExist) {
                        showAlertAboveTagName(
                            "Sorry! you can't use same secret name twice.",
                            "same-name-error",
                            "main"
                        );
                        // Scroll to top.
                        // For Safari.
                        document.body.scrollTop = 0;
                        // For Chrome, Firefox, IE and Opera.
                        document.documentElement.scrollTop = 0;
                    } else if (obj.databaseErr) {
                        showAlertAboveTagName(
                            "Oops, Somthing Wrong, Cant save the secret.",
                            "databas-error",
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
        isValidSecretName = false;
    }
};

// Get the new Generated password from Flask.
function getGenPass(form, e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append("upper", form.upper.checked);
    formData.append("lower", form.lower.checked);
    formData.append("nums", form.nums.checked);
    formData.append("puncs", form.puncs.checked);
    formData.append("pass-len", form["pass-len-val"].value);
    // Fetch a new generated password from Flask.
    fetch(URL["secretGen"].replace(sanitizerRegex, ''), {
        "method": "POST",
        "body": formData,
        "credentials": "same-origin",
    }).then(function(response) {
        response.json().then(function (respObj) {
            if (respObj.genPass.length != 0) {
                let passPlace = document.getElementById("gen-pass");
                passPlace.value = respObj.genPass;
            } else if (respObj.invalidData) {
                showAlertAboveTagName(
                    "Oops, Somthing Wrong, check your inputs and try again.",
                    "invalid-inputs-error",
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
};

// Handle interactivity of the password generator form.
function passGenHandler() {
    // Password generator range handler.
    // Get the range element and the its value input.
    let passLenRange = document.getElementById("pass-len");
    let passLenValue = document.getElementById("pass-len-val")
    // Sync the value with the range slider.
    passLenRange.addEventListener("input", function() {
        passLenValue.value = passLenRange.value;
    });
    passLenRange.addEventListener("change", function() {
        passLenValue.value = passLenRange.value;
    });
    // Sync the range slider with the value.
    passLenValue.addEventListener("input", function() {
        passLenRange.value = passLenValue.value;
    });
    passLenValue.addEventListener("change", function() {
        passLenRange.value = passLenValue.value;
    });


    // Password generator characters types.
    // If user didn't check on any thing other than number the max Password length should be 12. Otherwise, 23.
    // Get types check boxes elements & generator button & name input & save button.
    let upperBox = document.getElementById("upper");
    let lowerBox = document.getElementById("lower");
    let numsBox = document.getElementById("nums");
    let puncsBox = document.getElementById("puncs");
    let passGenBtn = document.getElementById("pass-gen-btn");
    let passNameInp = document.getElementById("pass-gen-name");
    let passSaveBtn = document.getElementById("pass-save-btn");
    let passGenForm = document.getElementById("pass-gen-form");
    let passSaveForm = document.getElementById("pass-save-form");
    // Function to make all forms elements disabled.
    function disableFormElements(form, disabledVal) {
        let formElements = form.elements;
        let elementsLen = formElements.length;
        let i = 0;
        while (i < elementsLen) {
            formElements[i].disabled = disabledVal;
            i++;
        };
        return true;
    };
    // When the window is loaded.
    window.addEventListener("DOMContentLoaded", function(e) {
        passSaveBtn.disabled = true;
    });
    // Listen to any input event.
    addEventListener("input", function() {
        if (passSaveForm["pass-gen-name"].value != "") {
            passSaveBtn.disabled = false;
        } else { passSaveBtn.disabled = true; }
    });
    // Listen for changing on Check Boxes.
    addEventListener("change", function(e) {
        if (e.target.type == "checkbox") {
            if (!upperBox.checked && !lowerBox.checked && !puncsBox.checked) {
                if (!numsBox.checked) {
                    // In this case no password would be generated because of emptiness of characters types.
                    disableFormElements(passGenForm, true);
                    disableFormElements(passSaveForm, true);
                    upperBox.disabled = false;
                    lowerBox.disabled = false;
                    numsBox.disabled = false;
                    puncsBox.disabled = false;
                } else {
                    disableFormElements(passGenForm, false);
                    disableFormElements(passSaveForm, false);
                    if (passLenValue.value > 12) {
                        passLenValue.value = 12;
                        passLenRange.value = 12;
                    }
                    passLenRange.max = 12;
                };
            } else {
                disableFormElements(passGenForm, false);
                disableFormElements(passSaveForm, false);
                passLenRange.max = 32;
            };
        }
    });

    return true;
};


export { passGenHandler,
    getGenPass,
    saveSecretByValidName
};


