#!/usr/bin/env bash
# Generate Protobuf bindings for both frontend (TypeScript) and backend (Python).
#
# Requirements (installed via npm/uv — no system protoc needed):
#   Frontend:  protobufjs-cli  (pbjs + pbts)
#   Backend:   grpcio-tools    (bundles protoc)
#
# Usage (from repo root):
#   ./scripts/gen-proto.sh
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROTO_FILE="$REPO_ROOT/proto/robot.proto"
FRONTEND_PROTO_DIR="$REPO_ROOT/frontend/src/proto"
BACKEND_PROTO_DIR="$REPO_ROOT/backend/proto"

mkdir -p "$FRONTEND_PROTO_DIR" "$BACKEND_PROTO_DIR"

# ── Frontend: protobufjs static ES6 module ────────────────────────────────────
echo "Generating TypeScript proto (protobufjs)..."
cd "$REPO_ROOT/frontend"

npx pbjs \
  --target static-module \
  --wrap es6 \
  --out "$FRONTEND_PROTO_DIR/robot.js" \
  "$PROTO_FILE"

npx pbts \
  --out "$FRONTEND_PROTO_DIR/robot.d.ts" \
  "$FRONTEND_PROTO_DIR/robot.js"

cd "$REPO_ROOT"

# ── Backend: Python via grpcio-tools (bundled protoc) ─────────────────────────
echo "Generating Python proto (grpcio-tools)..."
cd "$REPO_ROOT/backend"

uv run python -m grpc_tools.protoc \
  -I "$REPO_ROOT/proto" \
  --python_out="$BACKEND_PROTO_DIR" \
  --pyi_out="$BACKEND_PROTO_DIR" \
  "$PROTO_FILE"

# Ensure the directory is importable as a Python package.
touch "$BACKEND_PROTO_DIR/__init__.py"

cd "$REPO_ROOT"

echo "Done. Generated files:"
echo "  $FRONTEND_PROTO_DIR/robot.js"
echo "  $FRONTEND_PROTO_DIR/robot.d.ts"
echo "  $BACKEND_PROTO_DIR/robot_pb2.py"
echo "  $BACKEND_PROTO_DIR/robot_pb2.pyi"
