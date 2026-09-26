#!/usr/bin/env bash
set -euo pipefail

git fetch origin
git checkout -b int origin/main
git push -u origin int
