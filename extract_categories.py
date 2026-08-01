#!/usr/bin/env python3
"""
Extracts YAML frontmatter (title + categories) from all .qmd and .ipynb
files under a directory, so we can see the current category taxonomy
across every post before remapping it.

Usage:
    python3 extract_categories.py tutorials/
"""

import sys
import json
import re
from pathlib import Path

def extract_from_qmd(path: Path) -> str | None:
    text = path.read_text(encoding="utf-8", errors="ignore")
    m = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    return m.group(1) if m else None

def extract_from_ipynb(path: Path) -> str | None:
    data = json.loads(path.read_text(encoding="utf-8", errors="ignore"))
    for cell in data.get("cells", []):
        src = "".join(cell.get("source", []))
        if src.strip().startswith("---"):
            m = re.match(r"^---\n(.*?)\n---", src, re.DOTALL)
            if m:
                return m.group(1)
        # frontmatter is sometimes not the very first cell if there's
        # an empty raw cell before it -- keep scanning a few cells
    return None

def main(root: str):
    root_path = Path(root)
    files = sorted(list(root_path.rglob("*.qmd")) + list(root_path.rglob("*.ipynb")))

    if not files:
        print(f"No .qmd or .ipynb files found under {root}")
        return

    for f in files:
        try:
            fm = extract_from_qmd(f) if f.suffix == ".qmd" else extract_from_ipynb(f)
        except Exception as e:
            print(f"--- {f} ---\n  [ERROR reading file: {e}]\n")
            continue

        if fm is None:
            print(f"--- {f} ---\n  [no frontmatter found]\n")
            continue

        title_m = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', fm, re.MULTILINE)
        cats_m = re.search(r'^categories:\s*\n((?:\s*-\s*.+\n?)+)', fm, re.MULTILINE)
        cats_inline_m = re.search(r'^categories:\s*\[(.*?)\]', fm, re.MULTILINE)

        title = title_m.group(1) if title_m else "(no title found)"

        if cats_m:
            cats = [c.strip("- ").strip() for c in cats_m.group(1).splitlines() if c.strip()]
        elif cats_inline_m:
            cats = [c.strip().strip('"').strip("'") for c in cats_inline_m.group(1).split(",")]
        else:
            cats = []

        print(f"--- {f} ---")
        print(f"  title: {title}")
        print(f"  categories: {cats}")
        print()

if __name__ == "__main__":
    root = sys.argv[1] if len(sys.argv) > 1 else "tutorials/"
    main(root)
