with open('/app/backend/server.py', 'r') as f:
    lines = f.readlines()

dotenv_idx = 0
for i, line in enumerate(lines):
    if line.startswith("load_dotenv"):
        dotenv_idx = i
        break

dotenv_line = lines[dotenv_idx]
del lines[dotenv_idx]

lines.insert(16, dotenv_line)

with open('/app/backend/server.py', 'w') as f:
    f.writelines(lines)
print("Patched load_dotenv.")
