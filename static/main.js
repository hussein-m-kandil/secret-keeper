// Error Messages Generator.
function errMessageGen(message){
    /*
        Str 'message' -> Element.
        Takes string message and returns a 'p' element,
        for Document use (e.g. input for 'element.after()').
    */
    let warning = document.createElement("p");
    warning.textContent = message;
    warning.setAttribute("class", "text-danger fs-6 fw-lighter")
    return warning;
}

// Handle all checks for empty inputs with all submissions.
addEventListener("submit", function(e) {

    // e.preventDefault();

    // Check for forms
    if (e.target.nodeName == "FORM") {
        // Get the form
        let form = e.target;

        // Catch login form
        if (form.name == "login"){
            const formLen = form.length
            for (let i = 0; i < formLen; i++) {
                // Catch empty values except for the submission element.
                if (form[i].type != "submit") {
                    if (form[i].value == ""){
                        // Prevent the submission prosess.
                        e.preventDefault();
                        // Print error message for each empty input.
                        if (form[i].name == "username") {
                            form[i].after(errMessageGen("ENTER USERNAME!"));
                        } else if (form[i].name == "password") {
                            form[i].after(errMessageGen("ENTER PASSWORD!"));
                        }
                    }
                }
            }
        }
    }

});
