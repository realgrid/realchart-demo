#!/bin/bash
if [[ $(git status --porcelain) ]]; then
    git add .
    git commit -m "Copied folder for fiddle demo"
    git push
else
    echo "No changes to commit."
fi
