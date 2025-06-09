from fastapi import FastAPI, Form, BackgroundTasks, Request
from fastapi.responses import HTMLResponse
from pydantic import EmailStr
from dotenv import load_dotenv
import smtplib, os
from email.message import EmailMessage
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path

load_dotenv()

app = FastAPI()
templates = Jinja2Templates(directory="templates")

BASE_DIR = Path(__file__).resolve().parent
app.mount("/frontend", StaticFiles(directory=BASE_DIR.parent / "frontend"), name="frontend")
def send_email_background(user_email: str, user_name: str, user_message: str):
    try:
        # Email to company
        company_email = EmailMessage()
        company_email["From"] = os.getenv("SMTP_USERNAME")
        company_email["To"] = os.getenv("EMAIL_TO")
        company_email["Subject"] = f"New Contact Form Submission from {user_name}"
        company_email["Reply-To"] = user_email

        company_email.set_content(f"""
New contact form submission:

Name: {user_name}
Email: {user_email}
Message:
{user_message}
""")

        # Email to user (confirmation)
        user_confirmation = EmailMessage()
        user_confirmation["From"] = os.getenv("SMTP_USERNAME")
        user_confirmation["To"] = user_email
        user_confirmation["Subject"] = "Thank you for contacting KX Studios"
        
        user_confirmation.set_content(f"""
Dear {user_name},

Thank you for reaching out to KX Studios! We've received your message and our team will get back to you within 1-2 business days.

Here's a copy of your message for your reference:
----------------------------------------------
{user_message}
----------------------------------------------

In the meantime, feel free to explore more about our services:
- Web Design & Development
- Social Media Management
- Video Production
- Branding Solutions

For urgent inquiries, you can call us at +27 (0) 12 345 6789.

Best regards,
The KX Studios Team
info@kxstudios.co.za
www.kxstudios.co.za
""")

        with smtplib.SMTP(os.getenv("SMTP_SERVER"), int(os.getenv("SMTP_PORT"))) as smtp:
            smtp.starttls()
            smtp.login(os.getenv("SMTP_USERNAME"), os.getenv("SMTP_PASSWORD"))
            smtp.send_message(company_email)
            smtp.send_message(user_confirmation)
            print("✅ Emails sent successfully.")
    except Exception as e:
        print("❌ Email failed:", str(e))

@app.post("/contact")
def contact_user(
    background_tasks: BackgroundTasks,
    name: str = Form(...),
    email: EmailStr = Form(...),
    message: str = Form(...)
):
    background_tasks.add_task(send_email_background, email, name, message)
    
    return HTMLResponse(f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Thank You | KX Studios</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            body {{
                font-family: 'Poppins', sans-serif;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                padding: 20px;
                color: #ffffff;
            }}
            .thank-you-container {{
                background-color: #111111;
                border-radius: 20px;
                padding: 40px;
                max-width: 600px;
                width: 100%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(59, 130, 246, 0.3);
                position: relative;
                overflow: hidden;
            }}
            .thank-you-container::before {{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 5px;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            }}
            .thank-you-icon {{
                font-size: 4rem;
                color: #3b82f6;
                margin-bottom: 20px;
            }}
            h1 {{
                font-size: 2.5rem;
                margin-bottom: 15px;
                color: #ffffff;
            }}
            p {{
                font-size: 1.1rem;
                line-height: 1.6;
                color: #d1d5db;
                margin-bottom: 30px;
            }}
            .highlight {{
                color: #3b82f6;
                font-weight: 600;
            }}
            .quick-links {{
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
                margin-top: 30px;
            }}
            .quick-link {{
                background-color: rgba(59, 130, 246, 0.1);
                color: #3b82f6;
                padding: 12px 25px;
                border-radius: 30px;
                text-decoration: none;
                font-weight: 500;
                transition: all 0.3s ease;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }}
            .quick-link:hover {{
                background-color: #3b82f6;
                color: white;
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
            }}
            .home-btn {{
                display: inline-block;
                margin-top: 30px;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                padding: 15px 35px;
                border-radius: 30px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
            }}
            .home-btn:hover {{
                transform: translateY(-3px);
                box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
            }}
        </style>
    </head>
    <body>
        <div class="thank-you-container">
            <div class="thank-you-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h1>Thank You, <span class="highlight">{name}</span>!</h1>
            <p>Your message has been successfully sent to our team. We'll review your inquiry and get back to you within <span class="highlight">1-2 business days</span>.</p>
            <p>A confirmation email has been sent to <span class="highlight">{email}</span> with a copy of your message for your records.</p>
            
            <div class="quick-links">
                <a href="/frontend/services/services.html" class="quick-link">Our Services</a>
                <a href="/frontend/about/about.html" class="quick-link">About Us</a>
                <a href="/frontend/pricing/pricing.html" class="quick-link">Pricing</a>
                <a href="/frontend/contact/contact.html" class="quick-link">Contact Again</a>
            </div>
            
            <a href="/frontend/index.html" class="home-btn">
                <i class="fas fa-home"></i> Return to Homepage
            </a>
        </div>
    </body>
    </html>
    """)

@app.get("/contact")
async def get_contact(request: Request):
    return templates.TemplateResponse("contact.html", {"request": request})