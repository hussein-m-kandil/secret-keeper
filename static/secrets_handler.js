// Get the bootstrap modal object and show it to the user.
const delSecretWarning = new bootstrap.Modal('#del-secret-modal');

// Handling Secrets Form.
function secretsFormHandler(form, e) {
    e.preventDefault();
    // Get the name of the secret which is about to be deleted.
    const secretName = form.menu.selectedOptions[0].innerText;
    // Get the header of the delete secret warning.
    let delSecretHeader = document.getElementById("del-secret-header");
    // Set the text for the header of the delete secret warning.
    delSecretHeader.textContent = "Deleting '" + secretName + "'...";
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
    // Show warning message modal to the user.
    delSecretWarning.show();
};

// Delete secret for the user.
function delSecret(form, e) {
    e.preventDefault();
    // Hide the warning message modal.
    delSecretWarning.hide()
    // Create FormData data object and append the data for the secret that will be deleted.
    let formData = new FormData();
    formData.append("del-secret-name", form["del-secret-name"].value);
    formData.append("del-secret-val", form["del-secret-val"].value);
    // TODO: creat route for delete in app.py and put it in the global var in layout then submit the FormData object.

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
    secretsFormHandler,
    delSecret
};
