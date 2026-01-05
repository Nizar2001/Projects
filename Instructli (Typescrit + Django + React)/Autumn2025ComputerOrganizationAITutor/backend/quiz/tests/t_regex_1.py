import re

# Your regex
GEN_PLACEHOLDER_RE = re.compile(r"\$([0-9]+)(?:#([^#]+)#)?")

# Test strings
test_strings = [
    "Convert $1#random_hex_len(4)# into binary number.",
    "Assume $1#random_between(180, 200)# and $2#random_between(120, 137)# are signed 8-bit decimal integers stored in sign-magnitude format. Calculate $1 + $2 in decimal.",
    "Present the hexadecimal representation of the following assembly instruction: lb x$1#random_between(20, 30)#, $3#random_between(0, 100)#(x$2#random_between(20, 30)#). Answer in hexadecimal.",
    "no match here",
]

# Using findall to get all matches
for s in test_strings:
    matches = GEN_PLACEHOLDER_RE.findall(s)
    print(f"String: {s}")
    print(f"Matches: {matches}\n")

# Using finditer to see match objects and capture groups
for s in test_strings:
    print(f"String: {s}")
    for m in GEN_PLACEHOLDER_RE.finditer(s):
        print(f"Full match: {m.group(0)}, Group 1: {m.group(1)}, Group 2: {m.group(2)}")
    print()
