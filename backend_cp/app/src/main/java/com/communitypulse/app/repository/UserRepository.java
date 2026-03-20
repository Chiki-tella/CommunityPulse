package com.communitypulse.app.repository;

import com.communitypulse.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their email (unique)
    Optional<User> findByEmail(String email);

    // You can add more methods if needed, e.g.:
    // List<User> findByRole(Role role);
}
