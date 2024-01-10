from flask import redirect, session, flash, get_flashed_messages
from functools import wraps


def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/1.1.x/patterns/viewdecorators/
    """
    # HMK,
    # Wrapping the decorated function in a new function,
    # with a place holder for its arguments,
    # in oreder to return it after checking for the login.
    # HMK.
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function


def flash_checker(flash_messages):
    """
    Take the return of 'get_flash_message()' function.
    Return 'True' and side effect that it flash the messages again,
    Otherwise, returns 'False'.
    """
    flash_msgs = flash_messages
    len_flash_msgs = len(flash_msgs)
    if len_flash_msgs > 0:
        i = 0
        while i < len_flash_msgs:
            msg = flash_msgs[i]
            flash(msg[1], msg[0])
            i += 1
        return True
    return False


