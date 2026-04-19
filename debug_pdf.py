#!/usr/bin/env python3
"""Debug: print first 100 lines from IE.pdf to inspect actual format."""
import sys
try:
    import fitz
except ImportError:
    print("Run: pip3 install pymupdf"); sys.exit(1)

path = '/home/rahul/Downloads/IE.pdf'
doc = fitz.open(path)
lines = []
for page in doc:
    for line in page.get_text().splitlines():
        line = line.strip()
        if line:
            lines.append(line)

print(f"Total raw lines: {len(lines)}\n")
print("=== Last 100 lines ===")
for i, line in enumerate(lines[-100:]):
    print(f"{len(lines)-100+i:4d}: {repr(line)}")
