import sys
import os

print("--- DEBUG INFO ---")
print(f"Python Executable: {sys.executable}")
print(f"CWD: {os.getcwd()}")
print("Sys Path:")
for p in sys.path:
    print(p)

print("\n--- IMPORT CHECK ---")
try:
    import aiosqlite
    print(f"SUCCESS: aiosqlite found at {aiosqlite.__file__}")
except ImportError as e:
    print(f"FAILURE: Could not import aiosqlite: {e}")

try:
    import greenlet
    print(f"SUCCESS: greenlet found at {greenlet.__file__}")
except ImportError as e:
    print(f"FAILURE: Could not import greenlet: {e}")
