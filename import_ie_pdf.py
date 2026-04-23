#!/usr/bin/env python3
"""Parse IE.pdf and upload MCQs to DynamoDB."""
from pdf_parser import run

if __name__ == '__main__':
    run('/home/rahul/Downloads/IE.pdf',
        paper='IE & IFS',
        topic='Indian Economy & Financial System',
        mode='plain')
