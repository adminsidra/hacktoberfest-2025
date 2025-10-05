# Quick Test Script for MoodMate
# Run this to verify everything is working before starting the main app

import os
import sys

def check_project_structure():
    """Check if all required files exist"""
    print("🔍 Checking project structure...")

    required_files = [
        'app.py',
        'requirements.txt',
        'templates/index.html',
        'static/style.css',
        'static/script.js'
    ]

    missing_files = []

    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING!")
            missing_files.append(file_path)

    if missing_files:
        print(f"\n⚠️  Missing {len(missing_files)} file(s). Please create them.")
        return False
    else:
        print("\n🎉 All files present!")
        return True

def check_python_version():
    """Check Python version"""
    print("\n🐍 Checking Python version...")
    version = sys.version_info

    if version.major >= 3 and version.minor >= 7:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - Good!")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Need 3.7+")
        return False

def check_dependencies():
    """Check if required packages can be imported"""
    print("\n📦 Checking dependencies...")

    required_packages = ['flask', 'nltk']
    missing_packages = []

    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - Not installed!")
            missing_packages.append(package)

    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        print("Run: pip install -r requirements.txt")
        return False
    else:
        print("\n🎉 All dependencies available!")
        return True

def main():
    print("🤖 MoodMate Project Verification")
    print("="*40)

    structure_ok = check_project_structure()
    python_ok = check_python_version()
    deps_ok = check_dependencies()

    print("\n" + "="*40)

    if structure_ok and python_ok and deps_ok:
        print("🎉 Everything looks good! Ready to run MoodMate!")
        print("\nTo start the app, run:")
        print("python app.py")
        print("\nThen open: http://127.0.0.1:5000")
    else:
        print("⚠️  Please fix the issues above before running the app.")

if __name__ == "__main__":
    main()
