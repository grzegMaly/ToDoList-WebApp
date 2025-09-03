package com.todolist.backend.services.ToDoNote;

import com.todolist.backend.dto.ToDoNoteDto;
import com.todolist.backend.security.jwt.JwtPrincipal;

import java.util.List;
import java.util.UUID;


public interface ToDoNoteService {
    List<ToDoNoteDto> getUserToDoLists(JwtPrincipal principal);

    ToDoNoteDto createToDoElement(ToDoNoteDto toToDoNote, JwtPrincipal principal);

    ToDoNoteDto updateToDoElementStatus(ToDoNoteDto toDoRequest, JwtPrincipal principal, UUID noteId);

    void deleteToDoElement(JwtPrincipal principal, UUID noteId);
}
