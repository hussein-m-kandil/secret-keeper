// Empty Fields Handler.
function handleEmptyInputs(submissionEvent, inputName, inputObj, errMessage) {
    // Error Messages Generator.
    function errMessageGen(message, elementId){
        /*
            Str 'message' -> Element.
            Str 'elementId' -> Element's id attribute.
            Takes string message and returns a 'p' element,
            for Document use (e.g. input for 'element.after()').
        */
        let warning = document.createElement("p");
        warning.textContent = message;
        warning.setAttribute("class", "text-danger fw-lighter")
        warning.setAttribute("id", elementId)
        warning.style.fontSize = "1rem";
        return warning;
    }

    // Error Messages Animator.
    function errMessageAnimy(errMessageObj) {
        /*
            ElementObj -> (exists) true : flase;
            will make the element bigger the turn it back after 750 msec.
        */
        if (errMessageObj) {
            errMessageObj.style.fontSize = "1.5rem";
            setTimeout(function() {
                errMessageObj.style.fontSize = "1rem";
            }, 750);
            return true;
        }
        return false;
    }

    // Flag for empty input.
    let emptyInputFlag = false;
    // Get the error message if exists.
    const errObj = document.getElementById(`${inputName}-err`);
    if (inputObj.value == "") {
        // Prevent the submission prosess.
        submissionEvent.preventDefault();
        // Check for username field.
        if (inputObj.name == inputName) {
            // Animate the error message if exists.
            if (errObj) {
                errObj.style.display = "block";
                errMessageAnimy(errObj);
            } else {
                // Print error message for each empty input.
                inputObj.after(
                    errMessageGen(errMessage, `${inputName}-err`)
                );
            }
        }
        // Set empty field flag to true.
        emptyInputFlag = true;
    } else {
        // Prevent the submission prosess.
        submissionEvent.preventDefault();
        if (inputObj.name == inputName && errObj) {
            errObj.style.display = "none";
        }
        // Set empty field flag to false.
        emptyInputFlag = false;
    }
    return emptyInputFlag;
}

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
            // Catching empty fields
            for (let i = 0; i < formLen; i++) {
                // Submission element exception.
                if (form[i].type != "submit") {
                    // Handle empty username/password.
                    if (form[i].name == "username") {
                        usernameIsEmpty = handleEmptyInputs(
                            e, "username", form[i], "ENTER USERNAME!"
                        );
                    } else if (form[i].name == "password") {
                        passwordIsEmpty = handleEmptyInputs(
                            e, "password", form[i], "ENTER PASSWORD!"
                        );
                    }
                }
            }
            if (!usernameIsEmpty && !passwordIsEmpty) {
                e.preventDefault();
                let routes = this.document.getElementById("routes");
                console.log("routes => ", routes.dataset["login"].replace(/['"]+/g, ''));
                console.log("url => ", url.replace(/['"]+/g, ''));
                const formData = new FormData(form);
                this.fetch(url.replace(/['"]+/g, ''), {
                    "method": "POST",
                    "body": formData,
                }).then(function(response) {
                    if (response.redirected) {
                        window.location = response.url;
                    } else {
                        console.log(response);
                        console.log("Check your inputs (username/password) and try again!");
                    }
                });
                usernameIsEmpty = false;
                passwordIsEmpty = false;
            }
        }
    }

});
