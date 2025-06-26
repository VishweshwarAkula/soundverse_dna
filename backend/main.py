from fastapi import FastAPI, Request, UploadFile, File, Path, Body
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

# Load environment variables from .env file
load_dotenv()

# Get Supabase credentials from environment variables
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Create a Supabase client
supabase: Client = create_client(url, key)

# Create a FastAPI app instance
app = FastAPI()

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProfileData(BaseModel):
    creator_name: str
    description: str
    price: float
    license: str
    tracks: str
    become_partner: str
    dna_sensitivity: int
    tags: Optional[List[str]] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to the Soundverse DNA FastAPI server!"}

@app.post("/profiles")
def create_profile(profile: ProfileData):
    try:
        # Insert profile
        response = supabase.table('profiles').insert({
            "creator_name": profile.creator_name,
            "description": profile.description,
            "price": float(profile.price),
            "license": profile.license,
            "tracks": profile.tracks,
            "become_partner": profile.become_partner,
            "dna_sensitivity": profile.dna_sensitivity,
        }).execute()
        if not response.data or 'id' not in response.data[0]:
            return {"success": False, "error": "Profile insert failed or no id returned."}
        profile_id = response.data[0]['id']
        # Insert tags into profile_tags
        if profile.tags:
            for tag_name in profile.tags:
                # Find tag id
                tag_resp = supabase.table('tags').select('id').eq('name', tag_name).execute()
                if tag_resp.data:
                    tag_id = tag_resp.data[0]['id']
                else:
                    # Insert new tag if not exists
                    new_tag_resp = supabase.table('tags').insert({"name": tag_name}).execute()
                    tag_id = new_tag_resp.data[0]['id']
                # Insert into profile_tags
                supabase.table('profile_tags').insert({
                    "profile_id": profile_id,
                    "tag_id": tag_id
                }).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/tags")
def get_tags():
    try:
        response = supabase.table('tags').select('name').execute()
        tags = [tag['name'] for tag in response.data]
        return {"success": True, "tags": tags}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/upload/photo")
def upload_photo(file: UploadFile = File(...)):
    try:
        # Upload to Supabase Storage (bucket: 'photos')
        contents = file.file.read()
        file_path = f"photos/{file.filename}"
        supabase.storage.from_('photos').upload(file_path, contents, {'content-type': file.content_type})
        public_url = supabase.storage.from_('photos').get_public_url(file_path)
        return {"success": True, "url": public_url}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/upload/audio")
def upload_audio(file: UploadFile = File(...)):
    try:
        # Upload to Supabase Storage (bucket: 'audio')
        contents = file.file.read()
        file_path = f"audio/{file.filename}"
        supabase.storage.from_('audio').upload(file_path, contents, {'content-type': file.content_type})
        public_url = supabase.storage.from_('audio').get_public_url(file_path)
        return {"success": True, "url": public_url}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/upload/photo/{profile_id}")
def upload_photo_with_id(profile_id: str = Path(...), file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        file_path = f"photos/{profile_id}/{file.filename}"
        supabase.storage.from_('profilepics').upload(file_path, contents, {'content-type': file.content_type})
        public_url = supabase.storage.from_('profilepics').get_public_url(file_path)
        return {"success": True, "url": public_url}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/upload/audio/{profile_id}")
def upload_audio_with_id(profile_id: str = Path(...), file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        file_path = f"audio/{profile_id}/{file.filename}"
        supabase.storage.from_('audiofiles').upload(file_path, contents, {'content-type': file.content_type})
        public_url = supabase.storage.from_('audiofiles').get_public_url(file_path)
        return {"success": True, "url": public_url}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.patch("/profiles/{profile_id}")
def update_profile(profile_id: str, data: dict = Body(...)):
    try:
        update_data = {}
        if "photo_url" in data:
            update_data["photo_url"] = data["photo_url"]
        if "audio_urls" in data:
            update_data["audio_urls"] = data["audio_urls"]
        if not update_data:
            return {"success": False, "error": "No valid fields to update."}
        response = supabase.table('profiles').update(update_data).eq('id', profile_id).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        return {"success": False, "error": str(e)}