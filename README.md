# SECRET KEEPER

#### Video Demo: ? ? ?

#### Description:
##### Overview
A web app for generating random passwords (Secrets) and keeping them for the user.
Users can freely choose the types of character that the secret should have among Upper/Lowercase letters, Punctuations (Symbols) and Digits (Numbers).
Although the user can choose the types of characters freely, there are limitaions on the size (length) of the secret, Though the maximum length with secrets that consists of Digits only is 10 characters, Otherwise, the size can reach 32 characters, and all types of secrets has a minimum size of 4 characters.
There is also some limitations on naming the Secrets which is Secret's name can't:
    - be started with any type of character other than letters.
    - contain any Punctuations or Symbols.
    - be repeated, i.e. Two Secrets Can't have same name.
Users can freely see, rename and delete their Secrets as they want.
Log in session time is exactly 20 minutes and the user will be logged out automatically for security reasons.

##### Usage
Once the registeration process finished correctly and while the user is logged in, at that time the most important pages are:
    1. Generate Secret page:
       - Choose the types of characters that you wan't to include them in the secret.
       - Move the slider to decide the length of the secret.
       - Click on Generate Secret Button and see the new secret apear right below it.
       - Give your secret descriptive name so that you find it easily whenever you want it (Symbols not allowed and the name can't be repeated).
       - Click save secret and make sure that you can find your new secret in the secrets page.
    2. Secrets page (home page):
       - Here you can select your secret from the select menu and see the secret in the box right below it.
       - Click the Delete button to delete the selected any time you want.
       - Click the Rename button to change the selected secret's name under the same naming rules.
    3. Log-in Password page:
       - This is optional page for changin the log-in password for current logged in user.

##### Files
This is a Python3-Flask based project, and the project's files under the root directory are:
    1. "secret_keeper.db":
       - This is the database file for the project which based on 'sqlite3' database.
       - Has one sechema with two tables: users and secrets.
       - users has the users IDs (primary key) , usernames (which is unique) and the hash for every user's password.
       - secrets has all the secrets, each secrets stored with its name and its corresponding user id (foreign key).
    2. "password_generator.py":
       - The main Python program which i have written it to generate random passwords from set of character types.
       - Based on two built-in Python libraries: Random and String.
       - Has a function to generate the password "generate_password()" returns random password by taking 1-5 arguments:
         - Integer: the password's length.
         - Boolean: True, if Uppercase letter included, Otherwise, False (default is true).
         - Boolean: True, if Lowercase letter included, Otherwise, False (default is true).
         - Boolean: True, if Digits Numbers included, Otherwise, False (default is true).
         - Boolean: True, if Puncituations Symbols included, Otherwise, False (default is true).
    3. "requirments.txt":
       - Has the requirments for the project which is:
         - python3.
         - flask.
         - flask-session.
         - cs50.
    4. "app.py":
       - This is the main file for all of server-side functionalities.
       - The interactions with the database done in this file using the SQL class and its methods from CS50 library.
       - It has all the routes for the project functionalities and pages which are:
         - "/register": For the registeration page and its main role is to check that username doesn't exist and saving user's information in the database.
         - "/login": It's main role is to check the validation of the data that the user have entered and starting new session for the user if the inputed data is correct and valid.
         - "/logout": Logged the user out by ending the current session time.
         - "/": For the home page which is the secrets page and the main role here is to render the user's secrets from the database into the select menu.
         - "/delSecret": Post only route for deleting secret for the user from the database.
         - "/renSecret": Post only route for renaming secret for the user by updating the database.
         - "/secretGenerator": For the Generate Secret page and its main role is to generate new secret (password) for the user under the types and length that the user choose.
         - "/saveSecret": Post only route for save the new secret for the user in the database after making sure that new secrets name are not exist with the current user ID.
         - "/password": this route for the login-password page and its main role is to change the current hashed password for the current user and logged the user out eventually in order to let the user use the new password.
         - "/clearFlashes": for clearing the flashe messages after they has been rendered for the user.
    5. "helpers.py": Has just two functions:
       - "login_required": For checking that the user is already logged in before executing any view function that required logged in user.
       - "flash_checker": For checking if there is flash messages with the current route, in order to render them for the user.

The project's files under the assets directory are:
    - This dir is for the resources of any multimedia material but currently it has only the source files for the favicon.ico.

The project's files under the templates directory are:
    1. "layout.html": This file has all the building blocks of all pages that should be the same across all pages (e.g. navigation bar).
    2. "index.html": The main page and the secrets page at the same time, The place where the user can see all saved secrets and modify them by deleting the secret or rename it.
    3. "gen_password.html": HTML page for the secret (password) generation functionalities and saving the generated secrets.
    4. "password.html": This file for login password page, where users can change their current passwords.
    5. "register.html": The registeration form page, where users can register for new accounts.
    6. "login.html": This page file for the log in form, where users can log into their accounts.

The project file's under the static directory are:
    1. "favicon.ico": This is the icon that appears in the top bar of browser's window.
    2. "styles.css": Although all pages are styled with 'Bootstrap', this file has some specific CSS styling customizations for some elments in the pages.
    3. "main.js": This is the main JavaScript file the control all of the front-end interaction functionalities for all pages of the application, but each page has separated JS file that where i write the functions that control the functionalities of the page and these functions are imported in this 'main.js' file. And there is some functionalities that has been controlled directly for this main file which are:
        - Calling the flask route that clears the flash messages.
        - Setting the focus back to first element in the page after closing any alert message.
        - Calling specific functions for specific page's forms submissions.
        - Toggling the password's eye icon On/Off in order to reveal/hide the password for the user.
        - Fetching the generated password by calling the function that is responsible for this role.
        - Disabling all submit buttons until all inputs to be fulfilled.
    4. "register_validation.js": The file that contains one function called 'registerValidation' that has all the procedures for validating all of the data that users entered for registeration like: username & password, And generates error messages and alerts if there is something wrong in the inputed data, And submit the registeration form for the user in case that everything is Ok.
    5. "login_validation.js": This file written in a similar way as 'register_validation.js' but this file validating the inputed user's data for log in process, And has only one funciton i.e. 'loginValidation'.
    6. "change_pass_validation.js": Also this file is working in a similar way as login/registeration validation files, but this time for changing the user's password, And has also one function 'changePassValidation' that validates the password under the same rules as 'register_validation.js' and also submit the new password for the user in case that everything is Ok.
    7. "password_gen_handler.js": This file contains three functions i.e. 'passGenHandler', 'getGenPass' and 'saveSecretByValidName', These functions serves the functionalities for:
        - Disabling the generate form if the user unchecked all characters types and change the maximum length for the secret if the user choosen only Numbers digits secrets to max of 10 characters and back it to 32 otherwise.
        - Generating new secrets (passwords) for the user under the demanded characters types.
        - Saving the new secret for the user under after validating the name of the secret.
    8. "secrets_handler.js": This file has 'showSecretVal', 'renameSecretHandler', 'renSecret', 'deleteSecretHandler' and 'delSecret', These functions working under the Secrets page and serves the functionalities for:
        - Toggling between show/hide the value of the choosen saved secret from the select menu.
        - Renaming the secret for the user by submitting the rename secret form after validating the new name.
        - Deleting secret after informing the user that this step can't be reversed and the deleted secret will never back again.
        - Displaying and removeing any warning messages that may generated with the deleting/renaming process.
    9. "helpers.js": This file has 'errMessageGen', 'errMessageAnimy', 'handleEmptyInputs', 'showAlertAboveTagName', 'usernameRegex', 'passwordRegex', 'sanitizerRegex', 'isEmptyInput', 'handleValidationErr' and 'secretNameRegex', These functions working with all the JavaScript files and its functions and serves the functionalities for:
        - Generating error messages and alerts for the other validation functions.
        - Animating any message under call from the other functions to inform the user that the user's error still exist.
        - Handling and figuring out if there is any submitted empty function in case there is one.
        - Show alerts for the user above specific element in the page and under specific call from the other functions.
        - Reqular Expressions Objects with patterns for validating names, password and sanitizing strings.

    I wrote this files with their functions in order to avoid redundency as much as i can in JavaScript code.

This was Secret keeper, my final project for CS50: Introduction to Computer Science 2022.




