#!/usr/bin/env python3
"""
Image Download Helper for Bravo Fumigation Website
This script helps download placeholder images from free stock photo websites
"""

import requests
import os
from urllib.parse import urlparse
import time

# Image URLs from free stock photo websites (these are examples - replace with actual URLs)
IMAGE_URLS = {
    # Pest Control Services
    'residential-fumigation.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'commercial-pest-control.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'emergency-service.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'preventive-maintenance.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    
    # Pest Control Gallery
    'termite-control.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'rodent-removal.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'bed-bug-treatment.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'cockroach-control.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'ant-control.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'mosquito-treatment.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    
    # Cleaning Services
    'deep-cleaning.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'carpet-cleaning.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'disinfection-service.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
    'commercial-cleaning.jpg': 'https://images.unsplash.com/photo-1603796826076-2b8e2b1b1b1b',
}

def download_image(url, filename):
    """Download an image from URL and save it locally"""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✅ Downloaded {filename}")
        return True
    except Exception as e:
        print(f"❌ Failed to download {filename}: {e}")
        return False

def main():
    """Main function to download all images"""
    print("📥 Downloading images for Bravo Fumigation website...")
    print("Note: This script uses placeholder URLs. Please replace with actual image URLs.")
    
    # Create images directory if it doesn't exist
    os.makedirs('images', exist_ok=True)
    
    success_count = 0
    total_count = len(IMAGE_URLS)
    
    for filename, url in IMAGE_URLS.items():
        if download_image(url, f'images/{filename}'):
            success_count += 1
        time.sleep(1)  # Be respectful to the servers
    
    print(f"\n📊 Download Summary: {success_count}/{total_count} images downloaded successfully")
    
    if success_count == 0:
        print("\n🔍 To get real images:")
        print("1. Visit unsplash.com, pexels.com, or pixabay.com")
        print("2. Search for relevant terms (pest control, cleaning, fumigation)")
        print("3. Download images and save them to the images/ folder")
        print("4. Keep the same filenames for compatibility")

if __name__ == "__main__":
    main()
