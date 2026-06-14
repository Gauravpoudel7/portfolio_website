# AI Engineer Portfolio

A modern, responsive portfolio website for AI/ML engineers built with FastAPI and Bootstrap.

## Features

- Clean, modern UI with dark theme
- Fully responsive design
- Pages: Home, About, Projects, Contact
- Contact form with submission handling
- Easy to deploy and customize

## Tech Stack

- **Backend**: Python, FastAPI
- **Frontend**: HTML, CSS, Bootstrap 5 (via CDN)
- **Templating**: Jinja2
- **Icons**: Font Awesome

## Project Structure

```
portfolio/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── about.html
│   │   ├── projects.html
│   │   └── contact.html
│   └── static/
│       ├── css/
│       │   └── style.css
│       ├── js/
│       │   └── main.js
│       └── img/
│           └── .gitkeep
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Installation

1. Clone the repository (or copy the files)
2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Locally (without Docker)

1. Start the FastAPI server:
   ```bash
   python app/main.py
   ```
2. Open your browser and navigate to `http://localhost:8000`

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t ai-portfolio .
   ```
2. Run the container:
   ```bash
   docker run -p 8000:8000 ai-portfolio
   ```
3. Open your browser and navigate to `http://localhost:8000`

### Using Docker Compose (recommended for development)

1. Start the services:
   ```bash
   docker-compose up --build
   ```
2. Open your browser and navigate to `http://localhost:8000`
3. To stop and remove containers:
   ```bash
   docker-compose down
   ```

## Customization

- **Content**: Edit the HTML templates in `app/templates/` to change text, add your own projects, etc.
- **Styles**: Modify `app/static/css/style.css` for custom styling.
- **Images**: Add your own images to `app/static/img/` and update the `src` attributes in the templates.
- **Contact Form**: The form currently prints submissions to the console. For production, integrate with an email service or database.

## Deployment

This application can be deployed to any platform that supports Python or Docker (Heroku, AWS, Azure, Google Cloud, etc.).

### Example Deployment Steps (AWS Elastic Beanstalk with Docker)

1. Initialize EB CLI (if not already installed)
2. Configure your AWS credentials
3. Initialize the application:
   ```bash
   eb init -p docker ai-portfolio
   ```
4. Create an environment:
   ```bash
   eb create ai-portfolio-env
   ```
5. Deploy:
   ```bash
   eb deploy
   ```

### Example Deployment Steps (Heroku with Docker)

1. Create a Heroku account and install the Heroku CLI
2. Log in to Heroku:
   ```bash
   heroku login
   ```
3. Create a new Heroku app:
   ```bash
   heroku create ai-portfolio
   ```
4. Set the stack to container:
   ```bash
   heroku stack:set container
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

## Notes

- The contact form stores submissions in memory (for demo purposes). In a production environment, you would want to store them in a database or send them via email.
- Replace the placeholder images and links with your own content.
- Feel free to extend the project with additional features like blog section, resume download, etc.

## License

This project is open source and available under the MIT License.