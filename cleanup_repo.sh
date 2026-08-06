#!/bin/bash
set -e

# 1. Untrack junk and build artifacts (keeps them on disk if you want,
#    but removes them from git history going forward)
git rm -r --cached .DS_Store
git rm -r --cached posts/.DS_Store
git rm -r --cached .Rhistory
git rm -r --cached tutorials/.Rhistory
git rm -r --cached tutorials/pgls/.Rhistory
git rm -r --cached .ipynb_checkpoints
git rm -r --cached tutorials/.ipynb_checkpoints
git rm -r --cached .quarto

# 2. Remove stale build output and dead content entirely
#    (these aren't referenced anywhere, so -f deletes them from disk too)
git rm -rf _site
git rm -rf about_files
git rm -rf index_files
git rm -rf posts
git rm -rf files

# 3. Commit
git add .gitignore
git commit -m "Clean up repo: remove stale build artifacts, dead content, and local junk files"
git push
