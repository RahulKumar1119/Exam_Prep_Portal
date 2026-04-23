#!/usr/bin/env python3
"""Parse PPB.pdf and upload MCQs to DynamoDB."""
from pdf_parser import run

if __name__ == '__main__':
    run('/home/rahul/Downloads/PPB.pdf',
        paper='PPB',
        topic='Principles & Practices of Banking')
