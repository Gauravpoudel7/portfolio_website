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

# (Removed import-time debug print — see /submit_contact for config diagnostics.)





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
    # Read sender/recipient from env. MAIL_FROM must be a verified
    # Single Sender or domain in SendGrid, otherwise SendGrid rejects it.
    mail_from = os.getenv('MAIL_FROM') or os.getenv('GMAIL_USER', '')
    mail_to = os.getenv('MAIL_TO', 'gauravpoudel1068@gmail.com')
    api_key = os.getenv('SENDGRID_API_KEY')

    if not api_key or not mail_from:
        print(
            "[contact] Missing SENDGRID_API_KEY or MAIL_FROM — "
            f"submission from {email} was NOT sent."
        )
        return RedirectResponse(url="/#contact?error=config", status_code=303)

    from_email = Email(mail_from)
    to_email = To(mail_to)
    subject = f"New Contact Form Submission from {name}"
    content = Content(
        "text/plain",
        f"New contact form submission:\n\nName: {name}\nEmail: {email}\nMessage: {message}"
    )
    mail = Mail(from_email, to_email, subject, content)
    # Let you hit "Reply" in Gmail and reach the visitor directly.
    mail.reply_to = Email(email, name=name)

    try:
        sg = sendgrid.SendGridAPIClient(api_key=api_key)
        response = sg.send(mail)

        if 200 <= response.status_code < 300:
            msg_id = response.headers.get("X-Message-Id", "<none>")
            print(
                f"[contact] Sent from {name} <{email}>. "
                f"Status: {response.status_code}, X-Message-Id: {msg_id}"
            )
        else:
            # Hard-fail: surface the SendGrid body so you can see why it bounced.
            # Decode defensively — body may be bytes, str, or None depending on
            # the sendgrid client version.
            raw_body = getattr(response, "body", b"")
            if isinstance(raw_body, bytes):
                body = raw_body.decode("utf-8", errors="replace")
            else:
                body = str(raw_body) if raw_body is not None else ""
            print(
                f"[contact] SendGrid rejected message from {name} <{email}>. "
                f"Status: {response.status_code}, Body: {body}"
            )
            return RedirectResponse(url="/#contact?error=sendgrid", status_code=303)
    except Exception as e:
        print(f"[contact] SendGrid exception for {email}: {e!r}")
        return RedirectResponse(url="/#contact?error=sendgrid", status_code=303)

    return RedirectResponse(url="/#contact?success=true", status_code=303)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)