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

1. This project is intended to replace the current site files in the public [`Nikitanikit/My-Portfolio`](https://github.com/Nikitanikit/My-Portfolio) repository. Only the current root files are replaced; the repository's existing Git history is retained.
2. In Render, choose **New → Blueprint**, connect `Nikitanikit/My-Portfolio`, and deploy the detected `render.yaml`.
3. After the first deploy succeeds, open the `onrender.com` URL Render assigns to the service. Later pushes to `main` trigger a redeploy.

Render's free web services may spin down when idle, so the first visit after a quiet period can take longer while the app starts.

## Project content

The featured work links to the [PawHome repository](https://github.com/Nikitanikit/PawHome). The Skills visuals are illustrative CSS artwork; they do not execute builds, API requests, Git commands, or Docker containers.
