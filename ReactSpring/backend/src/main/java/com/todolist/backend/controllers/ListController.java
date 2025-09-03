package com.todolist.backend.controllers;

import com.todolist.backend.dto.ToDoNoteDto;
import com.todolist.backend.security.jwt.JwtPrincipal;
import com.todolist.backend.services.ToDoNote.ToDoNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/lists")
@RequiredArgsConstructor
public class ListController {

    private final ToDoNoteService toDoNoteService;

    @GetMapping
    public ResponseEntity<List<ToDoNoteDto>> getUserLists(@AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(toDoNoteService.getUserToDoLists(principal));
    }

    @PostMapping
    public ResponseEntity<ToDoNoteDto> createList(@Valid @RequestBody ToDoNoteDto toDoNoteDto,
                                                  @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(toDoNoteService.createToDoElement(toDoNoteDto, principal));
    }

    @PatchMapping("{noteId}")
    public ResponseEntity<ToDoNoteDto> updateList(@RequestBody ToDoNoteDto toDoNoteDto,
                                                  @AuthenticationPrincipal JwtPrincipal principal,
                                                  @PathVariable UUID noteId) {
        return ResponseEntity.ok(toDoNoteService.updateToDoElementStatus(toDoNoteDto, principal, noteId));
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteList(@AuthenticationPrincipal JwtPrincipal principal,
                                           @PathVariable UUID noteId) {
        toDoNoteService.deleteToDoElement(principal, noteId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
