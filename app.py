
import os

from cs50 import SQL
from flask import Flask, flash, get_flashed_messages, jsonify, make_response, redirect, render_template, request, send_from_directory, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import login_required, flash_checker
from password_generator import generate_password

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = 1800
app.config["SESSION_TYPE"] = "filesystem"

# Give the browser an order to allow JavaScript access to cookies.
app.config["SESSION_COOKIE_HTTPONLY"] = False
app.config["SESSION_COOKIE_SECURE"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///secret_keeper.db")

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response



@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    # GET current user cash
    u_id = session["user_id"]
    # Get current username
    user_info = db.execute("SELECT * FROM users WHERE id = ?", u_id)
    username = user_info[0]["username"]
    # Get user secrets.
    secrets = db.execute("SELECT * FROM secrets WHERE user_id = ? ORDER BY datetime DESC", u_id)
    # Check for flash_messages and if there one flash it again.
    flash_msgs = get_flashed_messages(with_categories=True)
    flash_checker(flash_msgs)
    #return secrets page.
    return render_template("index.html", secrets=secrets)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        # Get inputed data
        username = request.form.get("username")
        user_pass = request.form.get("password")

        # Ensure that we have username and password to check.
        if username and user_pass:
            # Query database for username
            user = db.execute("SELECT * FROM users WHERE username = ?", username)

            # Ensure username exists and password is correct
            if len(user) != 1 or not check_password_hash(user[0]["hash"], user_pass):
                try:
                    return jsonify({"invalidUserData": True})
                except:
                    flash("Something Wrong!")
                    flash("Try again later.")
                    return redirect("/login")

            # Remember which user has logged in
            session["user_id"] = user[0]["id"]

            # Redirect user to home page
            return redirect("/")
        else:
            flash("Something Wrong!")
            flash("Check your inputs (username/password) and try again.")
            return redirect("/login")
    # Check for flash_messages and if there one flash it again.
    flash_msgs = get_flashed_messages(with_categories=True)
    flash_checker(flash_msgs)
    # User reached route via GET (as by clicking a link or via redirect)
    return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""
    # Forget any user_id
    session.clear()
    # Redirect user to login form
    return redirect("/login")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        # GET user inputs
        name = request.form.get("username")
        password = request.form.get("password")
        confirm = request.form.get("confirmation")
        # Check user inputs
        if name and password and confirm and password == confirm:
            # Check wheather the username already exists
            name_check = db.execute("SELECT * FROM users WHERE username = ?", name)
            if len(name_check) > 0:
                try:
                    # resp = jsonify({"nameExist": True})
                    # Just in case we can add some Access Controls.
                    # resp.headers.add("Access-Control-Allow-Origin", "*")
                    # resp.headers.add("Access-Control-Allow-Headers", "*")
                    # # And we can use header to represent the value.
                    # resp.headers.add("nameExist", "kokowawa")
                    return jsonify({"nameExist": True})
                except:
                    flash("Can't use this name")
                    return redirect("register")
            else:
                # Register the user
                hash_pass = generate_password_hash(password)
                # Forget any user_id
                session.clear()
                # Insert the new secret in the database.
                try:
                    session["user_id"] = db.execute("INSERT INTO users (username, hash) \
                                                     VALUES(?, ?)", name, hash_pass)
                # In case the insertion into the database failed.
                except:
                    return jsonify({"databaseErr": True})
                # Redirect the user to homepage
                flash(f"WELCOME  {name.upper()}!", "success")
                return redirect("/")
        else:
            flash("Something Wrong!")
            flash("Check your inputs (username/password) and try again.")
            return redirect("/register")
    # Give the user Registeration form.
    return render_template("register.html")


@app.route("/password", methods=["GET", "POST"])
@login_required
def change_password():
    """User change his password"""
    u_id = session["user_id"]
    if request.method == "POST":
        # GET user inputs
        password = request.form.get("password")
        new_password = request.form.get("new-password")
        confirm = request.form.get("confirm-new-pass")
        user_info = db.execute("SELECT * FROM users WHERE id = ?", u_id)
        current_hash = user_info[0]["hash"]
        # Check user inputs
        if password and new_password and confirm:
            # Check current password
            if not check_password_hash(current_hash, password):
                return jsonify({"invalidPassword": True})
            else:
                # Change user's password
                hash_new_pass = generate_password_hash(new_password)
                db.execute("UPDATE users \
                               SET hash = ? \
                             WHERE id = ?", hash_new_pass, u_id,)
                # Forget user's logging in
                session.clear()
                # Redirect user to login and tell him that his password is changed.
                flash(f"You have changed your password successfully.", "success")
                return redirect("/login")
    return render_template("password.html")


@app.route("/secretGenerator", methods=["GET", "POST"])
@login_required
def secret_generator():
    """\
            Python random password generator program\
            which user can use it to generate new password\
            in order to user it any where\
            and user should save it under a descriptive name\
            in order to get it back at any time.\
    """
    # If method is POST generate new password & return it.
    if request.method == "POST":
        # Get the values of uppercase, lowercase, number and punctuation characters
        upper = request.form.get("upper")
        upper = True if upper == "true" else False
        lower = request.form.get("lower")
        lower = True if lower == "true" else False
        nums = request.form.get("nums")
        nums = True if nums == "true" else False
        puncs = request.form.get("puncs")
        puncs = True if puncs == "true" else False
        # Get the required password's length.
        pass_len = request.form.get("pass-len")
        # Generate new password.
        if pass_len and (upper or lower or nums or puncs):
            try:
                # try to convert the number of password's length.
                pass_len = int(pass_len)
            except:
                # return error response
                return jsonify({"genPass": "", "invalidData": True})
            # Try to return the generated password.
            try:
                gen_pass = generate_password(pass_len, upper, lower, nums, puncs)
                return jsonify({"genPass": gen_pass, "invalidData": False})
            # Just in case.
            except:
                return jsonify({"genPass": "", "invalidData": True})

        else:
            return jsonify({"genPass": "", "invalidData": True})

    # Get the password generator page.
    return render_template("gen_password.html")


@app.route("/saveSecret", methods=["POST"])
@login_required
def save_secret():
    """Save the new generated password for the user."""
    # Get the user id, secret and secret name.
    u_id = session["user_id"]
    secret = request.form.get("secret")
    secret_name = request.form.get("secret-name")
    # Check for invalid data.
    if not secret or not secret_name:
        return jsonify({"invalidData": True})
    # Check Wheather the secret name is already exists.
    same_name_check = db.execute("SELECT * FROM secrets \
                                          WHERE user_id = ? \
                                            AND secret_name = ?", u_id, secret_name)
    if len(same_name_check) == 1:
        return jsonify({"sameNameExist": True})
    # Insert the new secret in the database.
    try:
        secret_id = db.execute("INSERT INTO secrets (secret, secret_name, datetime, user_id) \
                                VALUES(?, ?, (datetime('now', 'localtime')), ?)", \
                                secret, secret_name, u_id)
    # In case the insertion into the database failed.
    except:
        return jsonify({"databaseErr": True})
    # Redirect user to index through 'successSecret' route.
    flash(f"'{secret_name}' has been saved successfully.", "success")
    return redirect("/")


@app.route("/delSecret", methods=["POST"])
@login_required
def del_secret():
    # Get the user's id.
    u_id = session["user_id"]
    # Get secret data.
    secret_name = request.form.get("del-secret-name")
    secret_val = request.form.get("del-secret-val")
    # Check request's data
    if not secret_name or not secret_val:
        return jsonify({"invalidData": True})
    # Delete the secret.
    db.execute("DELETE FROM secrets \
                      WHERE secret_name = ? \
                        AND secret = ? \
                        AND user_id = ?", secret_name, secret_val, u_id)
    # Redirect the user to be informed that the deletion have done successfully.
    flash(f"'{secret_name}' has been deleted.", "success")
    return redirect("/")


@app.route("/renSecret", methods=["POST"])
@login_required
def ren_secret():
    # Get the user's id.
    u_id = session["user_id"]
    # Get secret data.
    secret_name = request.form.get("ren-secret-name")
    secret_val = request.form.get("ren-secret-val")
    new_secret_name = request.form.get("new-secret-name")
    # Check request's data
    if not secret_name or not secret_val:
        return jsonify({"invalidData": True})
    # Check Wheather the secret name is already exists.
    same_name_check = db.execute("SELECT * FROM secrets \
                                          WHERE user_id = ? \
                                            AND secret_name = ?", u_id, new_secret_name)
    if len(same_name_check) > 0:
        return jsonify({"sameNameExist": True})
    # rename the secret.
    db.execute("UPDATE secrets \
                   SET secret_name = ? \
                 WHERE secret_name = ? \
                   AND secret = ? \
                   AND user_id = ?", new_secret_name, secret_name, secret_val, u_id)
    # Redirect the user to be informed that the rename has done successfully.
    flash(f"'{secret_name}' has been renamed to '{new_secret_name}'.", \
            "success")
    return redirect("/")


