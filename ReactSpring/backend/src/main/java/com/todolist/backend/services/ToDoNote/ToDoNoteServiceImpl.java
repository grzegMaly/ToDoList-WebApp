package com.todolist.backend.services.ToDoNote;

import com.todolist.backend.dto.ToDoNoteDto;
import com.todolist.backend.mappers.ToDoMapper;
import com.todolist.backend.model.ToDoNote;
import com.todolist.backend.model.User;
import com.todolist.backend.repositories.ToDoNoteRepository;
import com.todolist.backend.repositories.UserRepository;
import com.todolist.backend.security.jwt.JwtPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToDoNoteServiceImpl implements ToDoNoteService {

    private final ToDoNoteRepository toDoNoteRepository;
    private final ToDoMapper toDoMapper;
    private final UserRepository userRepository;

    @Override
    public List<ToDoNoteDto> getUserToDoLists(JwtPrincipal principal) {
        Set<ToDoNote> notes = toDoNoteRepository.findAllByUser_UserId(principal.userId());
        return notes.stream()
                .map(toDoMapper::toDoNoteToToDoNoteDto)
                .collect(Collectors.toList());
    }

    @Override
    public ToDoNoteDto createToDoElement(ToDoNoteDto toToDoNote, JwtPrincipal principal) {
        ToDoNote toDoNote = toDoMapper.toDoNoteDtoToToDoNote(toToDoNote);
        User user = userRepository.findUserByUserId(principal.userId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        toDoNote.setUser(user);
        return toDoMapper.toDoNoteToToDoNoteDto(toDoNoteRepository.save(toDoNote));
    }

    @Override
    public ToDoNoteDto updateToDoElementStatus(ToDoNoteDto toDoRequest, JwtPrincipal principal, UUID noteId) {
        ToDoNote note = toDoNoteRepository.findToDoNoteByToDoIdAndUser_UserId(noteId, principal.userId())
                        .orElseThrow(() -> new RuntimeException("ToDo Note not found"));
        note.setDone(toDoRequest.isDone());
        return toDoMapper.toDoNoteToToDoNoteDto(toDoNoteRepository.save(note));
    }

    @Override
    public void deleteToDoElement(JwtPrincipal principal, UUID noteId) {
        ToDoNote note = toDoNoteRepository.findToDoNoteByToDoIdAndUser_UserId(noteId, principal.userId())
                        .orElseThrow(() -> new RuntimeException("ToDo Note not found"));
        toDoNoteRepository.delete(note);
    }
}
