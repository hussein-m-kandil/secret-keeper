# <p align="center">SECRET KEEPER</p>



### Video Demo:  ? ? ?

<hr/>


### Overview
A web app for generating random passwords (Secrets) and keeping them for the user. <br/>
Users can freely choose the types of character that the secret should have among Upper/Lowercase letters, Punctuations (Symbols) and Digits (Numbers). <br/>
Although the user can choose the types of characters freely, there are limitations on the size (length) of the secret, Though the maximum length with secrets that consists of Digits only is 10 characters, Otherwise, the size can reach 32 characters, and all types of secrets has a minimum size of 4 characters. <br/>

There are also some limitations on naming the Secrets which is Secret's name can't:<br/>
- be started with any type of character other than letters.
- contain any Punctuations or Symbols.
- be repeated, i.e. Two Secrets Can't have same name.
Users can freely see, rename and delete their Secrets as they want. <br/>
Log in session time is exactly 20 minutes and the user will be logged out automatically for security reasons. <br/>

<hr/>


### Usage
Once the registration process finished correctly and while the user is logged in, at that time the most important pages are: <br/>
1. Generate Secret page: <br/>
   - Choose the types of characters that you want to include in the secret.
   - Move the slider to decide the length of the secret.
   - Click on Generate Secret Button and see the new secret appear right below it.
   - Give your secret descriptive name so that you find it easily whenever you want it (Symbols not allowed and the name can't be repeated).
   - Click save secret and make sure that you can find your new secret in the secrets page.
2. Secrets page (home page): <br/>
   - Here you can select your secret from the select menu and see the secret in the box right below it.
   - Click the Delete button to delete the selected any time you want.
   - Click the Rename button to change the selected secret's name under the same naming rules.
3. Log-in Password page: <br/>
   - This is an optional page for changing the log-in password for current logged in user.

<hr/>


### Files
This is a Python3-Flask based project, and the project's files under the root directory are:
1. "secret_keeper.db": <br/>
   - This is the database file for the project which is based on 'sqlite3' database.
   - Has one schema with two tables: users and secrets.
   - users have the user IDs (primary key), usernames (which is unique) and the hash for every user's password.
   - secrets has all the secrets, each secret stored with its name and its corresponding user id (foreign key).
2. "password_generator.py": <br/>
   - The main Python program which i have written to generate random passwords from a set of character types.
   - Based on two built-in Python libraries: Random and String.
   - Has a function to generate the password "generate_password()" returns random password by taking 1-5 arguments:
     - Integer: the password's length.
     - Boolean: True, if Uppercase letter included, Otherwise, False (default is true).
     - Boolean: True, if Lowercase letter included, Otherwise, False (default is true).
     - Boolean: True, if Digits Numbers included, Otherwise, False (default is true).
     - Boolean: True, if Punctuations Symbols included, Otherwise, False (default is true).
3. "requirments.txt":<br/>
   - Has the requirements for the project which are:
     - python3.
     - flask.
     - flask-session.
     - cs50.
4. "app.py":<br/>
   - This is the main file for all server-side functionalities.
   - The interactions with the database done in this file using the SQL class and its methods from CS50 library.
   - It has all the routes for the project functionalities and pages which are:
     - "/register": For the registration page and its main role is to check that username doesn't exist and save user's information in the database.
     - "/login": Its main role is to check the validation of the data that the user has entered and starting a new session for the user to see if the input data is correct and valid.
     - "/logout": Logged the user out by ending the current session time.
     - "/": For the home page which is the secrets page and the main role here is to render the user's secrets from the database into the select menu.
     - "/delSecret": Post only route for deleting secret for the user from the database.
     - "/renSecret": Post only route for renaming secret for the user by updating the database.
     - "/secretGenerator": For the Generate Secret page and its main role is to generate new secret (password) for the user under the types and length that the user chooses.
     - "/saveSecret": Post only route for save the new secret for the user in the database after making sure that new secrets name does not exist with the current user ID.
     - "/password": this route for the login-password page and its main role is to change the current hashed password for the current user and logged the user out eventually in order to let the user use the new password.
     - "/clearFlashes": for clearing the flash messages after they have been rendered for the user.
5. "helpers.py": Has just two functions:<br/>
   - "login_required": For checking that the user is already logged in before executing any view function that required logged in user.
   - "flash_checker": For checking if there are flash messages with the current route, in order to render them for the user.
<br/>

The project's files under the assets directory are: <br/>
- This directory is for the resources of any multimedia material but currently it has only the source files for 'favicon.ico'.
<br/>

The project's files under the templates directory are: <br/>
1. "layout.html": This file has all the building blocks of all pages that should be the same across all pages (e.g. navigation bar).
2. "index.html": The main page and the secrets page at the same time, the place where the user can see all saved secrets and modify them by deleting the secret or renaming it.
3. "gen_password.html": HTML page for the secret (password) generation functionalities and saving the generated secrets.
4. "password.html": This file for login password page, where users can change their current passwords.
5. "register.html": The registration form page, where users can register for new accounts.
6. "login.html": This page files for the log in form, where users can log into their accounts.
<br/>

The project files under the static directory are:
1. "favicon.ico": This is the icon that appears in the top bar of browser's window.
2. "styles.css": Although all pages are styled with 'Bootstrap', this file has some specific CSS styling customizations for some elements in the pages.
3. "main.js": This is the main JavaScript file the control all of the front-end interaction functionalities for all pages of the application, but each page has separated JS file that where i write the functions that control the functionalities of the page and these functions are imported in this 'main.js' file. And there are some functionalities that have been controlled directly for this main file which are:
    - Calling the flask route that clears the flash messages.
    - Setting the focus back to the first element in the page after closing any alert message.
    - Calling specific functions for specific page's forms submissions.
    - Toggling the password's eye icon on/off in order to reveal/hide the password for the user.
    - Fetching the generated password by calling the function that is responsible for this role.
    - Disabling all submit buttons until all inputs to be fulfilled.
4. "register_validation.js": The file that contains one function called 'registerValidation' that has all the procedures for validating all of the data that users entered for registration like: username & password, and generates error messages and alerts if there is something wrong in the inputted data, and submit the registration form for the user in case that everything is Ok.
5. "login_validation.js": This file is written in a similar way as 'register_validation.js' but this file validates the user input's data for log in process, and has only one function i.e. 'loginValidation'.
6. "change_pass_validation.js": This file is working in a similar way as login/registration validation files, but this time for changing the user's password, and has also one function 'changePassValidation' that validates the password under the same rules as 'register_validation.js' and also submit the new password for the user in case that everything is Ok.
7. "password_gen_handler.js": This file contains three functions i.e. 'passGenHandler', 'getGenPass' and 'saveSecretByValidName', These functions serve the functionalities for:
    - Disabling the generate form if the user unchecked all character's types and change the maximum length for the secret if the user chosen only Numbers digits secrets to max of 10 characters and back it to 32 otherwise.
    - Generating new secrets (passwords) for the user under the demanded characters types.
    - Saving the new secret for the user under after validating the name of the secret.
8. "secrets_handler.js": This file has 'showSecretVal', 'renameSecretHandler', 'renSecret', 'deleteSecretHandler' and 'delSecret', These functions working under the Secrets page and serve the functionalities for:
    - Toggling between show/hide the value of the chosen saved secret from the select menu.
    - Renaming the secret for the user by submitting the rename secret form after validating the new name.
    - Deleting secret after informing the user that this step can't be reversed and the deleted secret will never be back again.
    - Displaying and removing any warning messages that may be generated with the deleting/renaming process.
9. "helpers.js": This file has 'errMessageGen', 'errMessageAnimy', 'handleEmptyInputs', 'showAlertAboveTagName', 'usernameRegex', 'passwordRegex', 'sanitizerRegex', 'isEmptyInput', 'handleValidationErr' and 'secretNameRegex', These functions working with all the JavaScript files and its functions and serves the functionalities for:
    - Generating error messages and alerts for the other validation functions.
    - Animating any message under call from the other functions to inform the user that the user's error still exists.
    - Handling and figuring out if there are any submitted empty functions in case there is one.
    - Show alerts for the user above specific element in the page and under specific call from the other functions.
    - Regular Expressions Objects with patterns for validating names, password and sanitizing strings. <br/>

<sub>***I wrote those files with their functions in order to avoid redundancy in JavaScript code as much as i can.***</sub>
<br/>

<hr/>
<br/>

#### <p align="center">**This was Secret keeper, my final project for CS50: Introduction to Computer Science 2022.** </p><br/>
<br/>

<p align="center">Copyright &copy; 2022 | Hussein Kandil</p>

