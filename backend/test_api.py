#!/usr/bin/env python3
"""
Simple test script to verify FastAPI conversion
"""
import requests
import json

def test_api():
    """Test the FastAPI endpoints"""
    base_url = "http://localhost:8000"
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint status: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("❌ API server is not running. Please start it with: uvicorn app:app --reload")
        return False
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"Health endpoint status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    print("✅ Basic API endpoints are working!")
    return True

if __name__ == "__main__":
    test_api()
