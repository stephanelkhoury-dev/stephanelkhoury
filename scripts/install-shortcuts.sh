#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ZSHRC="$HOME/.zshrc"
START_MARK="# >>> stephan-portfolio shortcuts >>>"
END_MARK="# <<< stephan-portfolio shortcuts <<<"
BIN_DIR="$HOME/.local/bin"

chmod +x "$ROOT_DIR/scripts/commands"/*.sh "$ROOT_DIR/scripts/install-shortcuts.sh"

mkdir -p "$BIN_DIR"

cat > "$BIN_DIR/start" <<EOF
#!/usr/bin/env bash
exec bash "$ROOT_DIR/scripts/commands/start.sh" "\$@"
EOF

cat > "$BIN_DIR/stop" <<EOF
#!/usr/bin/env bash
exec bash "$ROOT_DIR/scripts/commands/stop.sh" "\$@"
EOF

cat > "$BIN_DIR/build" <<EOF
#!/usr/bin/env bash
exec bash "$ROOT_DIR/scripts/commands/build.sh" "\$@"
EOF

cat > "$BIN_DIR/vercel" <<EOF
#!/usr/bin/env bash
exec bash "$ROOT_DIR/scripts/commands/vercel.sh" "\$@"
EOF

cat > "$BIN_DIR/cmd" <<EOF
#!/usr/bin/env bash
exec bash "$ROOT_DIR/scripts/commands/cmd.sh" "\$@"
EOF

chmod +x "$BIN_DIR/start" "$BIN_DIR/stop" "$BIN_DIR/build" "$BIN_DIR/vercel" "$BIN_DIR/cmd"

mkdir -p "$(dirname "$ZSHRC")"
touch "$ZSHRC"

TMP_FILE="$(mktemp)"
awk -v start="$START_MARK" -v end="$END_MARK" '
  $0 == start { skip = 1; next }
  $0 == end { skip = 0; next }
  skip != 1 { print }
' "$ZSHRC" > "$TMP_FILE"

cat >> "$TMP_FILE" <<EOF
$START_MARK
export PATH="$BIN_DIR:\$PATH"
alias start='bash "$ROOT_DIR/scripts/commands/start.sh"'
alias stop='bash "$ROOT_DIR/scripts/commands/stop.sh"'
alias build='bash "$ROOT_DIR/scripts/commands/build.sh"'
alias vercel='bash "$ROOT_DIR/scripts/commands/vercel.sh"'
alias cmd='bash "$ROOT_DIR/scripts/commands/cmd.sh"'
$END_MARK
EOF

mv "$TMP_FILE" "$ZSHRC"

echo "Shortcuts installed in $ZSHRC"
echo "Command shims installed in $BIN_DIR"
echo "Run: source ~/.zshrc"
