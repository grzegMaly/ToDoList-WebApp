package com.todolist.backend.repositories;

import com.todolist.backend.model.ToDoNote;
import com.todolist.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ToDoNoteRepository extends JpaRepository<ToDoNote, UUID> {

    Set<ToDoNote> findAllByUser_UserId(UUID userUserId);

    Optional<ToDoNote> findToDoNoteByToDoIdAndUser_UserId(UUID toDoId, UUID userUserId);
}
