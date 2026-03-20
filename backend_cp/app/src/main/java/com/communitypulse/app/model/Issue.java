package com.communitypulse.app.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "issues")
@Data
@NoArgsConstructor
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)  // optional length for description
    private String description;

    @SuppressWarnings("unused")
	private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // Many issues can be created by one user
    @ManyToOne(optional = false)  // every issue must have a creator
    @JoinColumn(name = "user_id", nullable = false)
    private User createdBy;
}
