from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from clerk_sdk_python import Clerk

load_dotenv()

app = FastAPI(title="Auther - Facebook Posting API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Clerk
clerk = Clerk(secret_key=os.getenv("CLERK_SECRET_KEY"))

class PostRequest(BaseModel):
    message: str

def get_user_from_token(authorization: str = Depends(lambda x: x.headers.get("Authorization"))):
    """Extract user from Clerk token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split(" ")[1]
    try:
        # Verify token with Clerk
        claims = clerk.verify_token(token)
        return claims
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def read_root():
    return {"message": "Auther Facebook Posting API"}

@app.post("/api/post")
async def post_to_facebook(post_data: PostRequest, user=Depends(get_user_from_token)):
    """Post message to user's Facebook feed"""
    try:
        # Get user's Facebook access token from Clerk
        user_id = user.get("sub")
        
        # Get OAuth accounts for the user
        oauth_accounts = clerk.users.get_oauth_access_token(
            user_id=user_id,
            provider="oauth_facebook"
        )
        
        if not oauth_accounts:
            raise HTTPException(status_code=400, detail="No Facebook account connected")
        
        facebook_token = oauth_accounts[0].token
        
        # Post to Facebook using Graph API
        facebook_url = "https://graph.facebook.com/v18.0/me/feed"
        payload = {
            "message": post_data.message,
            "access_token": facebook_token
        }
        
        response = requests.post(facebook_url, data=payload)
        
        if response.status_code == 200:
            result = response.json()
            return {
                "success": True,
                "post_id": result.get("id"),
                "message": "Post published successfully!"
            }
        else:
            raise HTTPException(
                status_code=400, 
                detail=f"Facebook API error: {response.text}"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

