"""
Simple API test script
"""
import requests
import json
import time

BASE_URL = "http://localhost:5000"


def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()


def test_create_project():
    """Test project creation"""
    print("Creating project...")
    response = requests.post(
        f"{BASE_URL}/api/projects",
        json={
            "creation_type": "idea",
            "idea_prompt": "生成一份关于人工智能发展的PPT"
        }
    )
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
    
    if data.get('success'):
        project_id = data['data']['project_id']
        print(f"Project ID: {project_id}")
        return project_id
    
    return None


def test_get_project(project_id):
    """Test get project"""
    print(f"\nGetting project {project_id}...")
    response = requests.get(f"{BASE_URL}/api/projects/{project_id}")
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
    print()


def test_generate_outline(project_id):
    """Test outline generation"""
    print(f"\nGenerating outline for project {project_id}...")
    response = requests.post(
        f"{BASE_URL}/api/projects/{project_id}/generate/outline",
        json={
            "idea_prompt": "生成一份关于人工智能发展的PPT"
        }
    )
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
    print()


def test_upload_template(project_id, image_path):
    """Test template upload"""
    print(f"\nUploading template for project {project_id}...")
    
    try:
        with open(image_path, 'rb') as f:
            files = {'template_image': f}
            response = requests.post(
                f"{BASE_URL}/api/projects/{project_id}/template",
                files=files
            )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
        print()
    except FileNotFoundError:
        print(f"Error: Template file not found: {image_path}")
        print()


def main():
    """Run tests"""
    print("╔════════════════════════════════╗")
    print("║  Banana Slides API Test Suite  ║")
    print("╚════════════════════════════════╝")
    print()
    
    # Test health
    test_health()
    
    # Test project creation
    project_id = test_create_project()
    
    if not project_id:
        print("Failed to create project. Exiting.")
        return
    
    # Test get project
    test_get_project(project_id)
    
    # Test template upload (optional)
    # Uncomment if you have a template image
    # test_upload_template(project_id, "../template_g.png")
    
    # Test outline generation
    # Note: This requires valid API keys configured
    # test_generate_outline(project_id)
    
    print("✅ Basic tests completed!")
    print(f"Project ID: {project_id}")
    print(f"You can access it at: {BASE_URL}/api/projects/{project_id}")


if __name__ == "__main__":
    main()

