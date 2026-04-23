#!/usr/bin/env python3
"""Parse RBWM.pdf and upload MCQs to DynamoDB."""
from pdf_parser import run

if __name__ == '__main__':
    run('/home/rahul/Downloads/RBWM.pdf',
        paper='RBWM',
        topic='Retail Banking & Wealth Management')
