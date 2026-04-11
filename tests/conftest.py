"""
Pytest configuration and fixtures for JAIIB-CAIIB Exam Prep Portal tests.
"""

import pytest
import os
from typing import Generator


@pytest.fixture(scope="session")
def aws_region() -> str:
    """Get AWS region from environment or use default."""
    return os.getenv('AWS_REGION', 'ap-south-1')


@pytest.fixture(scope="session")
def aws_credentials_available() -> bool:
    """Check if AWS credentials are available."""
    return (
        os.getenv('AWS_ACCESS_KEY_ID') is not None or
        os.path.exists(os.path.expanduser('~/.aws/credentials'))
    )


def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers", "infrastructure: Infrastructure initialization tests"
    )
    config.addinivalue_line(
        "markers", "property: Property-based tests"
    )
    config.addinivalue_line(
        "markers", "unit: Unit tests"
    )
    config.addinivalue_line(
        "markers", "integration: Integration tests"
    )
    config.addinivalue_line(
        "markers", "slow: Slow running tests"
    )
    config.addinivalue_line(
        "markers", "aws: Tests that require AWS credentials"
    )


def pytest_collection_modifyitems(config, items):
    """Modify test collection to add markers."""
    for item in items:
        # Add infrastructure marker to infrastructure tests
        if "infrastructure" in str(item.fspath):
            item.add_marker(pytest.mark.infrastructure)
            item.add_marker(pytest.mark.aws)
        
        # Add property marker to property-based tests
        if "property" in item.name.lower() or "hypothesis" in str(item.fspath):
            item.add_marker(pytest.mark.property)
        
        # Add slow marker to tests with many examples
        if "encryption_decryption" in item.name:
            item.add_marker(pytest.mark.slow)
