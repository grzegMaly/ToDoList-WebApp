package com.todolist.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "username", nullable = false, length = 20)
    private String username;

    @Column(name = "email", nullable = false, length = 50)
    private String email;

    @Column(name = "password", nullable = false, length = 120)
    private String password;

    @Column(name = "accoutn_non_expired", nullable = false)
    private boolean accountNonExpired = true;

    @Column(name = "account_non_locked", nullable = false)
    private boolean accountNonLocked = true;

    @Column(name = "credentials_non_expired", nullable = false)
    private boolean credentialsNonExpired = true;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "credentials_expiry_date", nullable = false)
    private LocalDate credentialsExpiryDate;

    @Column(name = "account_expiry_date")
    private LocalDate accountExpiryDate;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JoinColumn(name = "role_id", referencedColumnName = "role_id", nullable = false)
    @JsonManagedReference
    @ToString.Exclude
    private Role role;

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    private Set<ToDoNote> todoNotes = new HashSet<>();

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    @PrePersist
    public void prePersist() {
        if (this.credentialsExpiryDate == null) {
            this.credentialsExpiryDate = LocalDate.now().plusYears(1);
        }

        if (this.accountExpiryDate == null) {
            this.accountExpiryDate = LocalDate.now().plusYears(1);
        }
    }
}
