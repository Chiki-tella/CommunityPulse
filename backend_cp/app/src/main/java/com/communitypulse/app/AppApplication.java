package com.communitypulse.app;

import com.communitypulse.app.model.*;
import com.communitypulse.app.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;

@SpringBootApplication
public class AppApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }

    @Bean
    @Transactional
    public CommandLineRunner testDatabase(UserRepository userRepository, IssueRepository issueRepository) {
        return args -> {
            System.out.println("=== Testing Database ===");

            // Create a user
            User user = new User();
            user.setName("Test User");
            user.setEmail("test@example.com");
            user.setPassword("plainpassword");
            user.setRole(Role.CITIZEN);
            user = userRepository.save(user);
            System.out.println("Saved user: " + user);

            // Find user by email (correct method: findByEmail, not findById)
            User foundUser = userRepository.findByEmail("test@example.com")
                    .orElseThrow(() -> new RuntimeException("User not found"));
            System.out.println("Found by email: " + foundUser);

            // Create an issue linked to that user
            Issue issue = new Issue();
            issue.setTitle("Pothole on Main St");
            issue.setDescription("Large pothole near the traffic light");
            issue.setLocation("Main St & 1st Ave");
            issue.setStatus(Status.PENDING);
            issue.setCreatedBy(foundUser);
            issue = issueRepository.save(issue);
            System.out.println("Saved issue: " + issue);

            // Find issues by status
            System.out.println("Issues with status PENDING: " +
                    issueRepository.findByStatus(Status.PENDING));

            // Find issues by user ID
            System.out.println("Issues created by user " + foundUser.getId() + ": " +
                    issueRepository.findByCreatedById(foundUser.getId()));

            System.out.println("=== Test completed ===");
        };
    }
}