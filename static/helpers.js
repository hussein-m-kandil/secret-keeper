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
    warning.setAttribute("class", "text-danger fw-lighter mx-auto w-50")
    warning.setAttribute("id", elementId)
    warning.style.fontSize = "0.75rem";
    warning.style.margin = "auto";
    warning.style.textAlign = "left";

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

// Empty Fields Handler.
function handleEmptyInputs(submissionEvent, inputName, inputObj, errMessage) {
    /*
        - Usage: (Takes ? -> returns ?)
            submissionEvent,
            inputName,
            inputObj,
            errMessage -> True if there is no empty fields, Otherwise, False.

        - Interp:
            Handles the empty field by generating errors after every empty field.
            Then, after every submission removes the error message if the input not empty.
            And if the input still empty animating the error message.
    */
    // Flag for empty input.
    let emptyInputFlag = false;
    // Get the validation error message if exists.
    const valErrObj = document.getElementById(`${inputName}-val-err`);
    // Get the error message if exists.
    const errObj = document.getElementById(`${inputName}-err`);
    if (inputObj.value == "") {
        // Prevent the submission prosess.
        submissionEvent.preventDefault();
        // Check for username field.
        if (inputObj.name == inputName) {
            // Check for validation error.
            if (valErrObj) {
                valErrObj.style.display = "none";
            }
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

// Show alerts above HTML 'main' block.
function showAlertAboveTagName(message, alertId, tagNameToInsertAbove) {
    /*
        message, alertId, tagNameToInsertAbove
        -->> Creates div for alert with dismiss button.
        Then, show it to the user by putting it in the HTML page above the given tag name.
    */
    // Create div for alert.
    let alertDiv = document.createElement("div");
    alertDiv.setAttribute("id", alertId)
    alertDiv.setAttribute("class", "alert alert-danger alert-dismissible fade show text-center")
    alertDiv.textContent = message;
    // Create button via which user can dismiss the alert.
    let dismissBtn = document.createElement("button");
    dismissBtn.setAttribute("type", "button");
    dismissBtn.setAttribute("class", "btn-close");
    dismissBtn.setAttribute("data-bs-dismiss", "alert");
    dismissBtn.setAttribute("aria-label", "close");
    alertDiv.appendChild(dismissBtn);
    // Get main element to prepend the alert before it.
    let mainElement = document.querySelector(tagNameToInsertAbove);
    if (mainElement) {
        mainElement.before(alertDiv);
        return true;
    }
    return false;
}

// Function to check for empty inputs.
function isEmptyInput(form, inputName, e, message) {
    // Get the length of the form.
    const formLen = form.length;
    // Make index counter in order to loop for each element in the form.
    let i = formLen - 1;
    while (i >= 0) {
        // Check for input's name.
        if (form[i].name == inputName) {
            // Check weather is not empty input and if not return its value.
            if (!handleEmptyInputs(e, inputName, form[i], message)) {
                return form[i].value;
            } else {
                // Otherwise, return false.
                return false;
            };
        }
        // Decrement the form index.
        i--;
    };
};

// Validate the password input.
function handleValidationErr(validElementId, inputName, message) {
    /*
        - Usage:
            validElementId, inputName and message -> true;
        -Interp:
            Generates password validation error and if the error exists animates it.
            Always returns true.
    */
    // Get empty input error message if exists.
    const emptyErrObj = document.getElementById(`${inputName}-err`);
    // Get validation error message if exists.
    const errObj = document.getElementById(`${inputName}-val-err`);
    // Check for empty input error message.
    if (emptyErrObj) {
        emptyErrObj.style.display = "none";
    }
    // Create new validation error message if there is no one, Otherwise animate it.
    if (!errObj) {
        let valErr = errMessageGen(message, `${inputName}-val-err`);
        const passElement = document.getElementById(validElementId);
        passElement.after(valErr);

    } else {
        errObj.style.display = "block";
        errMessageAnimy(errObj);
    };
    return true;
};

// Regex pattern for password.
const passwordRegex = /(?=.*\d)(?=.*[a-z]).{8,}/i;
// Regex pattern for " ' and white spaces.
const sanitizerRegex = /[^\w-]/g;


export {
    errMessageGen,
    errMessageAnimy,
    handleEmptyInputs,
    showAlertAboveTagName,
    passwordRegex,
    sanitizerRegex,
    isEmptyInput,
    handleValidationErr
};
