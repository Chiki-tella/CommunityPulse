package com.communitypulse.app.repository;

import com.communitypulse.app.model.Issue;
import com.communitypulse.app.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    // Find all issues with a given status
    List<Issue> findByStatus(Status status);

    // Find all issues created by a specific user (by user ID)
    List<Issue> findByCreatedById(Long userId);

    // Optional: find issues by title containing a keyword (case-insensitive)
    // List<Issue> findByTitleContainingIgnoreCase(String keyword);
}