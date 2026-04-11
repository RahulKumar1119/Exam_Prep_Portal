"""
Question Bank Module

Handles question bank management, versioning, and CRUD operations.
"""

from .version_manager import (
    create_version,
    get_version_history,
    get_version_details,
    get_latest_version,
    generate_version_number
)

__all__ = [
    'create_version',
    'get_version_history',
    'get_version_details',
    'get_latest_version',
    'generate_version_number'
]
