package com.todolist.backend.mappers;

import com.todolist.backend.dto.ToDoNoteDto;
import com.todolist.backend.model.ToDoNote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ToDoMapper {

    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "toDoId", ignore = true)
    @Mapping(target = "user", ignore = true)
    ToDoNote toDoNoteDtoToToDoNote(ToDoNoteDto toDoNoteDto);

    ToDoNoteDto toDoNoteToToDoNoteDto(ToDoNote toDoNote);
}
