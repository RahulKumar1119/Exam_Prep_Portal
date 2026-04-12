#!/usr/bin/env python3
"""
Clean package auth Lambda function
"""

import os
import subprocess
import shutil
import zipfile
from pathlib import Path

module_name = "auth"
module_path = f"backend/{module_name}"

print(f"Clean packaging {module_name}...")

# Create build directory
build_dir = f"/tmp/{module_name}_clean_build"
if os.path.exists(build_dir):
    shutil.rmtree(build_dir)
os.makedirs(build_dir)

print(f"  Installing dependencies...")
# Install dependencies
result = subprocess.run(
    ["pip", "install", 
     "passlib==1.7.4",
     "boto3==1.17.53",
     "botocore==1.20.53",
     "PyJWT==2.9.0",
     "-t", build_dir, "--quiet"],
    capture_output=True,
    text=True
)

if result.returncode != 0:
    print(f"  Error installing dependencies: {result.stderr}")
else:
    print(f"  Dependencies installed")

# Copy Lambda function code
lambda_file = f"{module_path}/lambda_function.py"
if os.path.exists(lambda_file):
    shutil.copy(lambda_file, build_dir)
    print(f"  Copied lambda_function.py")

# Remove old zip file
zip_path = f"{module_path}/{module_name}_lambda.zip"
if os.path.exists(zip_path):
    os.remove(zip_path)

# Create zip file
print(f"  Creating zip file...")
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(build_dir):
        for file in files:
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, build_dir)
            zf.write(file_path, arcname)

# Cleanup
shutil.rmtree(build_dir)

# Verify
if os.path.exists(zip_path):
    size = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"  ✓ {module_name} packaged ({size:.1f} MB)")
    
    # List contents
    print(f"  Zip contents (first 20 files):")
    with zipfile.ZipFile(zip_path, 'r') as zf:
        for i, name in enumerate(zf.namelist()[:20]):
            print(f"    {name}")
else:
    print(f"  ✗ Failed to create zip file")
