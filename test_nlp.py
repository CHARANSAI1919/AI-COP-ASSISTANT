import sys
import os

# Add the nlp_service directory to sys.path
sys.path.append(r'c:\Users\Charan Sai\OneDrive - SRM Institute of Science & Technology\Desktop\Minor project\TRIAL\nlp_service')

from main import extract_plate

test_cases = [
    ("Check vehicle KA 51 ML 1234", "KA51ML1234"),
    ("Issue challan to MH-12-AB-1234 for speeding", "MH12AB1234"),
    ("Details for DL01AB4455 please", "DL01AB4455"),
    ("Lookup KA-01-BB-9999", "KA01BB9999"),
]

print("Starting NLP extraction tests...")
all_passed = True
for command, expected in test_cases:
    result = extract_plate(command)
    if result == expected:
        print(f"✅ PASS: '{command}' -> {result}")
    else:
        print(f"❌ FAIL: '{command}' -> Expected {expected}, got {result}")
        all_passed = False

if all_passed:
    print("\nAll NLP tests passed!")
else:
    print("\nSome NLP tests failed.")
    sys.exit(1)
