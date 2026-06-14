import os
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()





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
    # Create message
    msg = MIMEMultipart()
    msg['From'] = os.getenv('GMAIL_USER', 'your-email@gmail.com')  # Sender email (configure via GMAIL_USER env var)
    msg['To'] = 'gauravpoudel1068@gmail.com'   # Recipient email - fixed to user's Gmail as requested
    msg['Subject'] = f"New Contact Form Submission from {name}"

    # Email body
    body = f"""
    New contact form submission:

    Name: {name}
    Email: {email}
    Message: {message}
    """
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to Gmail SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Enable security

        # Login using environment variables for security
        gmail_user = os.getenv('GMAIL_USER')
        gmail_password = os.getenv('GMAIL_APP_PASSWORD')  # Use App Password for Gmail

        if gmail_user and gmail_password:
            server.login(gmail_user, gmail_password)
            text = msg.as_string()
            server.sendmail(gmail_user, gmail_user, text)
            server.quit()
            print(f"Contact form submission from {name} sent to {gmail_user}")
        else:
            # Fallback: print to console if credentials not set
            print(f"Gmail credentials not configured. Submission from {name}:")
            print(body)

    except Exception as e:
        print(f"Error sending email: {e}")
        # Fallback: store in memory as before
        submission = {"name": name, "email": email, "message": message}
        form_submissions.append(submission)
        print(f"Stored submission in memory as fallback: {submission}")

    # Redirect to contact section with success message
    return RedirectResponse(url="/#contact?success=true", status_code=303)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)