import random, string

# Create functions the takes 5 args for each type of characters and final password length.
def generate_password(pass_len=16, upper=True, lower=True, nums=True, punc=True):

    # Function to hundle the redundancy of building a randomized password.
    def get_random_sample(char_type, all_types, percentage, password_len, final_pass):
        """
            Modifying the final password list by iserting into it random sample
            from the provided percentages of characters types.
            Returns list to complete the password,
            in case after last call the length of generated password didn't reach the provided length number,
            Otherwise, Returns None.
        """
        # Add to generated password random somple from current character type.
        final_pass.extend(random.sample(char_type, percentage))
        # Check wheather their is any remaining in the length of the password.
        current_pass_need = password_len - len(final_pass)
        if current_pass_need  > 0:
            temp_pass_list = random.sample(all_types, current_pass_need)
            return temp_pass_list
        return None

    # Create individual lists for each type of characters.
    upper_chars = string.ascii_uppercase
    lower_chars = string.ascii_lowercase
    nums_chars = string.digits
    punc_chars = string.punctuation

    # Create a placeholder for all choosen characters types.
    all_chars = []

    # Create list to hold the final password
    password = []

    # Calculate 20% & 30% of the provided password length.
    twenty_percent = round(pass_len * 0.20)
    thirty_percent = round(pass_len * 0.30)

    # Place holder will take its value from the 'get_random_sample' function.
    # In case that the generated password length didn't reach the provided length.
    # This will take from the function a list of char to complete the length of the password.
    is_missed_pass_len = None

    # Check for choosen characters types.
    if upper:
        all_chars.extend(upper_chars)
        is_missed_pass_len = get_random_sample(upper_chars, all_chars, thirty_percent, pass_len, password)

    if lower:
        all_chars.extend(lower_chars)
        is_missed_pass_len = get_random_sample(lower_chars, all_chars, thirty_percent, pass_len, password)

    if nums:
        all_chars.extend(nums_chars)
        is_missed_pass_len = get_random_sample(nums_chars, all_chars, twenty_percent, pass_len, password)

    if punc:
        all_chars.extend(punc_chars)
        is_missed_pass_len = get_random_sample(punc_chars, all_chars, twenty_percent, pass_len, password)

    # Check the length of the generated password.
    if len(password) < pass_len and is_missed_pass_len:
        password.extend(is_missed_pass_len)

    # Shuffle the password list and convert it to str.
    random.shuffle(password)
    password = "".join(password)

    return password

# TEST:
print(generate_password(16, True, True, True, True))

