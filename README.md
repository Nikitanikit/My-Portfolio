# Nikita Sudhakar Bhosale — Portfolio

Personal portfolio built with Java 17, Spring Boot, HTML, CSS, JavaScript, Three.js, and GSAP.

## Run locally

Requirements: JDK 17+ and Maven 3.6.3+.

```bash
mvn spring-boot:run
```

Open `http://localhost:8080`. The backend exposes `/api/health` and `/api/portfolio`; the portfolio page is served by Spring Boot.

## Deploy on Render

The included `Dockerfile` and `render.yaml` configure the Spring Boot application as a Render web service. The service reads Render's `PORT` environment variable and uses `/api/health` for its health check.

1. Create a **public, empty** GitHub repository named `Nikitanikit/nikita-portfolio` (do not initialize it with a README or license).
2. From this project directory, initialize and push only this project:

   ```bash
   git init -b main
   git config user.email "YOUR_GITHUB_NOREPLY_EMAIL"
   git add .
   git commit -m "Publish portfolio"
   git remote add origin https://github.com/Nikitanikit/nikita-portfolio.git
   git push -u origin main
   ```

   Find your GitHub noreply address under **Settings → Emails** to avoid publishing your personal email in commit metadata.
3. In Render, choose **New → Blueprint**, connect the repository, and deploy the detected `render.yaml`.
4. After the first deploy succeeds, open the `onrender.com` URL Render assigns to the service. Later pushes to `main` trigger a redeploy.

Render's free web services may spin down when idle, so the first visit after a quiet period can take longer while the app starts.

## Project content

The featured work links to the [PawHome repository](https://github.com/Nikitanikit/PawHome). The Skills visuals are illustrative CSS artwork; they do not execute builds, API requests, Git commands, or Docker containers.
