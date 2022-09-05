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


// Create placholders for bootstrap modals object.
let RENSECRETWARNING;
let DELSECRETWARNING;

// Handling Renaming Secrets.
function renameSecretHandler(form, e) {
    e.preventDefault();
    // Get the name of the secret which is about to be renamed.
    const secretName = form.menu.selectedOptions[0].innerText;
    // Get the header of the rename secret warning.
    let renSecretHeader = document.getElementById("ren-secret-header");
    // Set the text for the header of the rename secret warning.
    renSecretHeader.textContent = "Renaming '" + secretName + "'";
    // Get the body of the rename secret warning.
    let renSecretBody = document.getElementById("ren-label");
    renSecretBody.textContent = "Enter a new name for '" + secretName + "'";
    // Give the rename form the value of the secret that user want to rename it.
    let renForm = document.getElementById("ren-secret-form");
    renForm["ren-secret-name"].value = form.menu.selectedOptions[0].innerText;
    renForm["ren-secret-val"].value = form.menu.selectedOptions[0].value;
    // Forget any entered value.
    renForm["new-secret-name"].value = "";
    // Get same secret name error element and remove it if there is one.
    let sameSecretNameErr = document.getElementById("same-name-exist-err");
    if (sameSecretNameErr) { sameSecretNameErr.remove(); }
    // Get secret name validation error element and remove it if there is one.
    let secretNameValidErr = document.getElementById("new-secret-name-val-err");
    if (secretNameValidErr) { secretNameValidErr.remove(); }
    // Get empty secret name error element and remove it if there is one.
    let emptySecretNameErr = document.getElementById("new-secret-name-err");
    if (emptySecretNameErr) { emptySecretNameErr.remove(); }
    // Get the bootstrap modal object.
    RENSECRETWARNING = new bootstrap.Modal('#ren-secret-modal');
    // Show warning message modal to the user.
    RENSECRETWARNING.show();
};

// rename secret for the user.
function renSecret(form, e) {
    e.preventDefault();
    // Check for empty secret name.
    let secretName = isEmptyInput(form, "new-secret-name", e, "NEW NAME IS MISSING!");
    // Check username validation.
    let isValidSecretName = false;
    if (secretName) {
        if (!secretNameRegex.test(secretName)) {
            handleValidationErr(
                "new-secret-name",
                "new-secret-name",
                "4-128 Characters has Lowercase/Uppercase Letters, Numbers and Spaces/Underscores."
            );
            isValidSecretName = false;
        } else {
            isValidSecretName = true;
            // Remove any validation error messages if exists.
            let valErr = document.getElementById("new-secret-name-val-err");
            if (valErr) {
                valErr.style.display = "none";
            }
        }
    }
    if(isValidSecretName) {
        // Create FormData data object and append the data for the secret that will be deleted.
        let formData = new FormData();
        formData.append("ren-secret-name", form["ren-secret-name"].value);
        formData.append("ren-secret-val", form["ren-secret-val"].value);
        formData.append("new-secret-name", form["new-secret-name"].value);
        // Submit the FormData object.
        fetch(URL["renSecret"].replace(sanitizerRegex, ''), {
            "method": "POST",
            "body": formData,
            "credentials": "same-origin",
        }).then(function(response) {
            if (response.redirected) {
                // Hide the warning message modal.
                RENSECRETWARNING.hide()
                // Follow the new location.
                window.location.href = response.url;
            } else if (!response.redirected) {
                // If NOT redirected parse the response.
                response.json().then(function(obj) {
                    if (obj.invalidData) {
                        showAlertAboveTagName(
                            "Oops, Somthing Wrong, try again later.",
                            "invalid-inputs-error",
                            "main"
                        );
                        // Scroll to top.
                        // For Safari.
                        document.body.scrollTop = 0;
                        // For Chrome, Firefox, IE and Opera.
                        document.documentElement.scrollTop = 0;
                    } else if (obj.sameNameExist) {
                        // Give the user error message and if it exists animate it.
                        let errMsg = document.getElementById("same-name-exist-err");
                        if (!errMsg) {
                            errMsg = document.createElement("p");
                            errMsg.setAttribute("class", "text-start text-danger text-lighter");
                            errMsg.textContent = "Sorry! you can't use same secret name twice.";
                            errMsg.style.fontSize = "0.75rem";
                            errMsg.setAttribute("id", "same-name-exist-err");
                            let inputObj = document.getElementById("new-secret-name");
                            inputObj.after(errMsg);
                        } else { errMessageAnimy(errMsg); }
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
    }
};

// Handling Deleting Secrets.
function deleteSecretHandler(form, e) {
    e.preventDefault();
    // Get the name of the secret which is about to be deleted.
    const secretName = form.menu.selectedOptions[0].innerText;
    // Get the header of the delete secret warning.
    let delSecretHeader = document.getElementById("del-secret-header");
    // Set the text for the header of the delete secret warning.
    delSecretHeader.textContent = "Deleting '" + secretName + "'";
    // Get the body of the delete secret warning.
    let delSecretBody = document.getElementById("del-warn-msg");
    // Set the text for the body of the delete secret warning.
    const brObj = document.createElement("BR");
    let spanObj = document.createElement("SPAN");
    spanObj.setAttribute("class", "fs-5 fw-bold text-start text-danger")
    spanObj.textContent = "WARNING!";
    delSecretBody.innerHTML = "";
    delSecretBody.appendChild(spanObj);
    delSecretBody.appendChild(brObj);
    delSecretBody.innerHTML += "Are you sure you want to delete '" + secretName  + "'?";
    // Give the delete form the value of the secret that user want to delete it.
    let delForm = document.getElementById("del-secret-form");
    delForm["del-secret-name"].value = form.menu.selectedOptions[0].innerText;
    delForm["del-secret-val"].value = form.menu.selectedOptions[0].value;
    // Get the bootstrap modal object.
    DELSECRETWARNING = new bootstrap.Modal('#del-secret-modal');
    // Show warning message modal to the user.
    DELSECRETWARNING.show();
};

// Delete secret for the user.
function delSecret(form, e) {
    e.preventDefault();
    // Create FormData data object and append the data for the secret that will be deleted.
    let formData = new FormData();
    formData.append("del-secret-name", form["del-secret-name"].value);
    formData.append("del-secret-val", form["del-secret-val"].value);
    // Submit the FormData object.
    fetch(URL["delSecret"].replace(sanitizerRegex, ''), {
        "method": "POST",
        "body": formData,
        "credentials": "same-origin",
    }).then(function(response) {
        if (response.redirected) {
            // Hide the warning message modal.
            DELSECRETWARNING.hide()
            // Follow the new location.
            window.location.href = response.url;
        } else if (!response.redirected) {
            // If NOT redirected parse the response.
            response.json().then(function(obj) {
                if (obj.invalidData) {
                    showAlertAboveTagName(
                        "Oops, Somthing Wrong, try again later.",
                        "invalid-inputs-error",
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
};

// Handling the value of the choosen secret.
function showSecretVal(){
    // Change the value of secret placholder with the choosen value from the select menu.
    let secretPlace = document.getElementById("secret");
    let secretsForm = document.getElementById("secrets");
    secretsForm.addEventListener("change", function(e) {
        secretPlace.value = e.target.value;
    });
};


export { showSecretVal,
    renameSecretHandler,
    renSecret,
    deleteSecretHandler,
    delSecret
};
