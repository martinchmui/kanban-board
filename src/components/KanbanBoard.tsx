import React from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import './App.css';
import { StrictModeDroppable } from './StrictModeDroppable';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  updateBoard,
  Column,
  Task,
  deleteTask,
  editTask,
  addTask,
} from '../redux/slices/boardSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { v4 as uuidv4 } from 'uuid';

const KanbanBoard = () => {
  const columns = useAppSelector((state) => state.board.columns);
  const dispatch = useAppDispatch();

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    // same column and same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColumn = columns.find(
      (column: Column) => column.id === source.droppableId
    );
    const destinationColumn = columns.find(
      (column: Column) => column.id === destination.droppableId
    );

    // same column
    if (source.droppableId === destination.droppableId && sourceColumn) {
      const tasks = [...sourceColumn.tasks];
      const [removed] = tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, removed);
      dispatch(
        updateBoard(
          columns.map((column: Column) =>
            column.id === sourceColumn.id ? { ...column, tasks } : column
          )
        )
      );
    } else if (sourceColumn && destinationColumn) {
      // different column
      const sourceTasks = [...sourceColumn.tasks];
      const [removed] = sourceTasks.splice(source.index, 1);
      const destinationTasks = [...destinationColumn.tasks];
      destinationTasks.splice(destination.index, 0, removed);
      dispatch(
        updateBoard(
          columns.map((column: Column) =>
            column.id === sourceColumn.id
              ? { ...column, tasks: sourceTasks }
              : column.id === destinationColumn.id
              ? { ...column, tasks: destinationTasks }
              : column
          )
        )
      );
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {columns.map((column: Column) => (
          <div className="kanban-column" key={column.id}>
            <h3>{column.title}</h3>
            <StrictModeDroppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`kanban-column-tasks ${
                    snapshot.isDraggingOver ? 'dragging-over' : ''
                  }`}
                >
                  {column.tasks.map((task: Task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`kanban-task ${
                            snapshot.isDragging ? 'dragging' : ''
                          }`}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <TextareaAutosize
                            aria-label="task"
                            placeholder="Enter text"
                            style={{ width: 200 }}
                            value={task.title}
                            onChange={(e) =>
                              dispatch(
                                editTask({
                                  taskId: task.id,
                                  columnId: column.id,
                                  newTitle: e.target.value,
                                })
                              )
                            }
                          />
                          <IconButton
                            aria-label="Delete"
                            onClick={() =>
                              dispatch(
                                deleteTask({
                                  taskId: task.id,
                                  columnId: column.id,
                                })
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </StrictModeDroppable>
            <IconButton
              aria-label="Add"
              onClick={() => {
                const newTask: Task = { id: uuidv4(), title: '' };
                dispatch(addTask({ columnId: column.id, task: newTask }));
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
