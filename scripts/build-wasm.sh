#!/usr/bin/env bash
# Compile the wasm-fk Rust crate to WebAssembly and copy output to frontend/public/wasm/.
#
# Requirements: rustup, wasm-pack (cargo install wasm-pack)
# Usage (from repo root): ./scripts/build-wasm.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRATE_DIR="$REPO_ROOT/wasm-fk"
OUT_DIR="$REPO_ROOT/frontend/src/wasm"

mkdir -p "$OUT_DIR"

echo "Building wasm-fk (--release, --target web)..."
cd "$CRATE_DIR"

# Source cargo env if installed but not in PATH
if ! command -v wasm-pack &>/dev/null; then
  source "$HOME/.cargo/env"
fi

wasm-pack build \
  --target bundler \
  --release \
  --out-dir "$OUT_DIR" \
  --out-name wasm_fk

# Remove files that don't need to be served
rm -f "$OUT_DIR/package.json" "$OUT_DIR/.gitignore" "$OUT_DIR/README.md"

echo "Done. Output:"
ls -lh "$OUT_DIR"
