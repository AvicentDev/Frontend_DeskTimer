// TaskItem.jsx
import TaskHeader from "../utils/TaskHeader"

const TaskItem = ({ task, onSelect, onArchiveTask, onRestoreTask, onDeleteTask }) => {
  return (
    <div
      className="border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onSelect?.(task)}
    >
      <TaskHeader 
        task={task} 
        onArchiveTask={onArchiveTask} 
        onRestoreTask={onRestoreTask} 
        onDeleteTask={onDeleteTask} 
      />
    </div>
  )
}

export default TaskItem
