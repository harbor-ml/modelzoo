import sys
from glob import glob
import subprocess

test_files = glob("*_test.go")
for test_file in test_files:
    print("\n"*2)
    print("Testing", test_file)
    subprocess.call(["go", "test", "-v", test_file], stderr=sys.stdout, stdout=sys.stdout)