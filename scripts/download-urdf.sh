#!/usr/bin/env bash
# download-urdf.sh — fetch UR5 URDF + STL meshes from ros-industrial
# Requires: python3, pip install xacro
# Usage: ./scripts/download-urdf.sh

set -e

DEST="frontend/public/urdf/ur5"
REPO="https://raw.githubusercontent.com/ros-industrial/universal_robot/kinetic-devel"

echo "→ Creating $DEST ..."
mkdir -p "$DEST/meshes/visual" "$DEST/meshes/collision"

echo "→ Downloading UR5 URDF (xacro) ..."
curl -sL "$REPO/ur_description/urdf/ur5.urdf.xacro" -o "$DEST/ur5.urdf.xacro"
curl -sL "$REPO/ur_description/urdf/ur.urdf.xacro"  -o "$DEST/ur.urdf.xacro"
curl -sL "$REPO/ur_description/urdf/common.gazebo.xacro" -o "$DEST/common.gazebo.xacro" || true

echo "→ Expanding xacro → ur5.urdf ..."
if command -v xacro &>/dev/null; then
  xacro "$DEST/ur5.urdf.xacro" > "$DEST/ur5.urdf"
elif python3 -c "import xacro" 2>/dev/null; then
  python3 -m xacro "$DEST/ur5.urdf.xacro" > "$DEST/ur5.urdf"
else
  echo "  xacro not found — installing via pip ..."
  pip3 install xacro --quiet
  python3 -m xacro "$DEST/ur5.urdf.xacro" > "$DEST/ur5.urdf"
fi

echo "→ Downloading STL meshes ..."
MESHES=(
  "base.stl" "shoulder.stl" "upperarm.stl"
  "forearm.stl" "wrist1.stl" "wrist2.stl" "wrist3.stl"
)
for mesh in "${MESHES[@]}"; do
  curl -sL "$REPO/ur_description/meshes/ur5/visual/$mesh" \
    -o "$DEST/meshes/visual/$mesh" && echo "  ✓ $mesh"
done

echo ""
echo "✓ Done. URDF at: $DEST/ur5.urdf"
echo "  Restart the dev server to pick up the new files."
