import sys
import os
import uvicorn

# Add the project root directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Loaded environment variables from .env")
except ImportError:
    print("python-dotenv not installed, skipping .env loading")

print(f"Starting KaziFlow Backend from: {current_dir}")
print("Checking imports...")

try:
    import backend.main
    print("Backend module found.")
except ImportError as e:
    print(f"Error importing backend: {e}")
    sys.exit(1)

if __name__ == "__main__":
    # run uvicorn programmatically
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
