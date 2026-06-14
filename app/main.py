import os
import sys
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn





app = FastAPI(title="AI Engineer Portfolio")
@app.get("/")
def home():
    return {"message": "Portfolio is Live 🚀"}


# Get the base directory of the current file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Get the project root directory (parent of app)
PROJECT_ROOT = os.path.dirname(BASE_DIR)
# Add project root to sys.path so that 'app' module can be found
sys.path.insert(0, PROJECT_ROOT)

# Mount static files
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# Templates
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# In-memory storage for form submissions (for demo; in production use a database)
form_submissions = []

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "Home"})

@app.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    return RedirectResponse(url="/#about", status_code=302)

@app.get("/projects", response_class=HTMLResponse)
async def projects(request: Request):
    return RedirectResponse(url="/#projects", status_code=302)

@app.get("/contact", response_class=HTMLResponse)
async def contact(request: Request):
    return RedirectResponse(url="/#contact", status_code=302)

@app.post("/submit_contact")
async def submit_contact(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    message: str = Form(...)
):
    # Store the submission (in production, save to database or send email)
    submission = {"name": name, "email": email, "message": message}
    form_submissions.append(submission)
    print(f"New contact form submission: {submission}")
    # Redirect to contact section with success message
    return RedirectResponse(url="/#contact?success=true", status_code=303)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)