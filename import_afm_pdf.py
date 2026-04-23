#!/usr/bin/env python3
"""Parse AFM.pdf and upload MCQs to DynamoDB."""
from pdf_parser import run

if __name__ == '__main__':
    run('/home/rahul/Downloads/AFM.pdf',
        paper='AFM',
        topic='Accounting & Financial Management')
