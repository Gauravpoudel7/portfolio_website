import os
import sys
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
from dotenv import load_dotenv
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

# Load environment variables from .env file in the app directory
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Debug: print whether email config is loaded (do not print key)
print(f"[DEBUG] SENDGRID_API_KEY loaded: {bool(os.getenv('SENDGRID_API_KEY'))}")





app = FastAPI(title="AI Engineer Portfolio")



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
# Disable Jinja's template cache to avoid a dict-unhashable bug in the
# installed Jinja2/Starlette combo (cache key contention).
templates.env.cache = None


def render(request: Request, name: str, context: dict | None = None) -> HTMLResponse:
    ctx = dict(context or {})
    ctx["request"] = request

    try:
        # New-style Starlette (request is an explicit kwarg)
        return templates.TemplateResponse(request=request, name=name, context=ctx)
    except TypeError:
        # Old-style Starlette: no `request` kwarg exists at all,
        # so the above raises TypeError, and we fall back here.
        # ctx already carries "request", satisfying the legacy requirement.
        return templates.TemplateResponse(name=name, context=ctx)

# In-memory storage for form submissions (for demo; in production use a database)
form_submissions = []

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return render(request, "index.html", {"title": "Home"})

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
    # Create email content
    from_email = Email(os.getenv('GMAIL_USER', 'your-email@gmail.com'))  # Sender email
    to_email = To('gauravpoudel1068@gmail.com')  # Recipient email
    subject = f"New Contact Form Submission from {name}"
    content = Content(
        "text/plain",
        f"New contact form submission:\n\nName: {name}\nEmail: {email}\nMessage: {message}"
    )
    mail = Mail(from_email, to_email, subject, content)

    try:
        # Send via SendGrid
        sg = sendgrid.SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY'))
        response = sg.send(mail)
        if 200 <= response.status_code < 300:
            print(f"Contact form submission from {name} sent via SendGrid. Status code: {response.status_code}")
        else:
            # Log the error details from SendGrid
            error_msg = f"SendGrid returned status code {response.status_code}"
            if hasattr(response, 'body'):
                error_msg += f": {response.body}"
            print(error_msg)
            # Raise an exception to trigger the fallback
            raise Exception(error_msg)
    except Exception as e:
        print(f"Error sending email via SendGrid: {e}")
        # Fallback: store in memory as before
        submission = {"name": name, "email": email, "message": message}
        form_submissions.append(submission)
        print(f"Stored submission in memory as fallback: {submission}")

    # Redirect to contact section with success message
    return RedirectResponse(url="/#contact?success=true", status_code=303)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)