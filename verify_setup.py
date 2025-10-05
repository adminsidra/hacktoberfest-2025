import os
import sys

def main():
    print("🤖 MOODMATE FINAL SETUP VERIFICATION")
    print("=" * 45)

    print("\n1️⃣ CHECKING PYTHON VERSION:")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 7:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro} - Perfect!")
    else:
        print(f"   ❌ Python {version.major}.{version.minor}.{version.micro} - Need 3.7+")
        print("   Please upgrade Python before continuing.")
        return False

    print("\n2️⃣ CHECKING FILE STRUCTURE:")
    required_files = {
        'app.py': 'Main Flask application',
        'requirements.txt': 'Dependencies list',
        'templates/index.html': 'Main webpage template',
        'static/style.css': 'CSS styling',
        'static/script.js': 'JavaScript functionality'
    }

    missing_files = []
    for file_path, description in required_files.items():
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"   ✅ {file_path:<20} ({size:,} bytes) - {description}")
        else:
            print(f"   ❌ {file_path:<20} MISSING! - {description}")
            missing_files.append(file_path)

    print("\n3️⃣ CHECKING DEPENDENCIES:")
    try:
        import flask
        print("   ✅ Flask is installed")
    except ImportError:
        print("   ❌ Flask not installed - Run: pip install -r requirements.txt")

    try:
        import nltk
        print("   ✅ NLTK is installed")
    except ImportError:
        print("   ❌ NLTK not installed - Run: pip install -r requirements.txt")

    print("\n4️⃣ SUMMARY:")
    if not missing_files:
        print("   🎉 Everything looks perfect!")
        print("   🚀 Ready to run: python app.py")
        print("   🌐 Then open: http://127.0.0.1:5000")

        print("\n🔥 QUICK COMMANDS:")
        print("   pip install -r requirements.txt")
        print("   python app.py")

        return True
    else:
        print(f"   ⚠️ Missing {len(missing_files)} files:")
        for file in missing_files:
            print(f"     - {file}")
        print("   Please recreate the missing files.")
        return False

if __name__ == "__main__":
    main()
    print("\n" + "=" * 45)
    print("Happy coding! Your AI mood detector awaits! 🤖✨")
