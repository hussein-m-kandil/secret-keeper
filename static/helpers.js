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


export { handleEmptyInputs, showAlertAboveTagName };
