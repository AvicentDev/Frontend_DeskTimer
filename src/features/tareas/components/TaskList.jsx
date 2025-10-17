// TaskList.jsx
import TaskItem from "./TaskItem"

const TaskList = ({ tasks, onSelect, onArchiveTask, onRestoreTask, onDeleteTask }) => {
  if (!tasks || tasks.length === 0) {
    return null
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onSelect={onSelect} 
          onArchiveTask={onArchiveTask}
          onRestoreTask={onRestoreTask}
          onDeleteTask={onDeleteTask}  // <-- Pásalo aquí
        />
      ))}
    </ul>
  )
}

export default TaskList
