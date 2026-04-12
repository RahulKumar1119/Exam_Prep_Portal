#!/usr/bin/env python3
"""
Package Lambda functions with dependencies
"""

import os
import subprocess
import shutil
import zipfile
from pathlib import Path

def package_lambda(module_name):
    """Package a Lambda function with its dependencies"""
    module_path = f"backend/{module_name}"
    
    print(f"Packaging {module_name}...")
    
    # Create build directory
    build_dir = f"/tmp/{module_name}_build"
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir)
    
    # Install dependencies
    req_file = f"{module_path}/requirements.txt"
    if os.path.exists(req_file):
        subprocess.run(
            ["pip", "install", "-r", req_file, "-t", build_dir, "--quiet"],
            check=False
        )
    
    # Copy Lambda function code
    lambda_file = f"{module_path}/lambda_function.py"
    if os.path.exists(lambda_file):
        shutil.copy(lambda_file, build_dir)
    
    # Copy service modules
    for py_file in Path(module_path).glob("*_service.py"):
        shutil.copy(py_file, build_dir)
    
    # Copy other Python files
    for py_file in Path(module_path).glob("*.py"):
        if py_file.name != "lambda_function.py":
            shutil.copy(py_file, build_dir)
    
    # Create zip file
    zip_path = f"{module_path}/{module_name}_lambda.zip"
    if os.path.exists(zip_path):
        os.remove(zip_path)
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(build_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, build_dir)
                zf.write(file_path, arcname)
    
    # Cleanup
    shutil.rmtree(build_dir)
    
    print(f"  ✓ {module_name} packaged")

if __name__ == "__main__":
    modules = ["auth", "practice", "ai_tutor", "question_bank", "audit", "notifications"]
    
    print("Packaging Lambda functions...")
    print()
    
    for module in modules:
        package_lambda(module)
    
    print()
    print("✓ All Lambda functions packaged successfully!")
