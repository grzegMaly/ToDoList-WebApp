package com.todolist.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ToDoNoteDto {

    private UUID toDoId;
    private String content;

    @NotNull
    private boolean done;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
