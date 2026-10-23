package com.nikita.portfolio;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class PortfolioController {

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "nikita-portfolio");
    }

    @GetMapping("/api/portfolio")
    public Map<String, Object> portfolio() {
        return Map.of(
            "name", "NIKITA SUDHAKAR BHOSALE",
            "role", "Full Stack Developer",
            "headline", "Engineering ideas into digital experiences.",
            "description", "I build thoughtful web experiences with Java, Spring Boot and modern frontend technologies.",
            "technologies", List.of("HTML", "CSS", "JavaScript", "Java", "Spring Boot", "SQL", "Maven", "Docker", "GitHub"),
            "statusLabel", "FULL STACK DEVELOPER · BUILDING WITH PURPOSE"
        );
    }
}
