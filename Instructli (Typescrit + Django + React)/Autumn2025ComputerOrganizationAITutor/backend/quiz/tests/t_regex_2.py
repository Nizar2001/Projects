import re

FUNC_CALL_RE = re.compile(r"#([a-zA-Z_][a-zA-Z0-9_]*)\(")