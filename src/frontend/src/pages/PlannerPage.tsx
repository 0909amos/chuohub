import { AlertCircle, Calendar, Check, Loader2, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddTask, useTasks, useUpdateTask } from "../hooks/useQueries";

function isOverdue(dueDate: string) {
  return (
    new Date(dueDate) < new Date() && !Number.isNaN(new Date(dueDate).getTime())
  );
}

export default function PlannerPage() {
  const { data: tasks, isLoading } = useTasks();
  const addTask = useAddTask();
  const updateTask = useUpdateTask();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const sorted = [...(tasks || [])].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
  const pending = sorted.filter((t) => !t.isDone);
  const done = sorted.filter((t) => t.isDone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await addTask.mutateAsync({ title, description, dueDate });
      setTitle("");
      setDescription("");
      setDueDate("");
      setShowForm(false);
      toast.success("Task added!");
    } catch {
      toast.error("Failed to add task.");
    }
  };

  const toggleDone = async (task: (typeof sorted)[0]) => {
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        isDone: !task.isDone,
      });
    } catch {
      toast.error("Failed to update task.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary px-4 pt-10 pb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary-foreground mb-1">
            Study Planner
          </h1>
          <p className="text-primary-foreground/70 text-xs">
            Organize your study schedule
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="w-10 h-10 rounded-full bg-accent flex items-center justify-center"
          data-ocid="planner.add_task.open_modal_button"
        >
          <Plus size={22} className="text-accent-foreground" />
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-4 bg-white rounded-2xl border border-border p-4"
            data-ocid="planner.add_task.panel"
          >
            <div className="text-sm font-bold text-foreground mb-3">
              New Task
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="task-title"
                  className="text-xs font-medium text-muted-foreground block mb-1"
                >
                  Title *
                </label>
                <input
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Study Chapter 5"
                  className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20"
                  required
                  data-ocid="planner.title.input"
                />
              </div>
              <div>
                <label
                  htmlFor="task-desc"
                  className="text-xs font-medium text-muted-foreground block mb-1"
                >
                  Description
                </label>
                <textarea
                  id="task-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details..."
                  rows={2}
                  className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20 resize-none"
                  data-ocid="planner.description.textarea"
                />
              </div>
              <div>
                <label
                  htmlFor="task-due"
                  className="text-xs font-medium text-muted-foreground block mb-1"
                >
                  Due Date
                </label>
                <input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-muted rounded-xl px-3 py-2.5 text-sm border border-border outline-none focus:ring-2 ring-primary/20"
                  data-ocid="planner.due_date.input"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={addTask.isPending}
                  className="flex-1 bg-primary text-primary-foreground font-semibold py-2.5 rounded-full flex items-center justify-center gap-2 text-sm"
                  data-ocid="planner.add_task.submit_button"
                >
                  {addTask.isPending && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 bg-muted text-muted-foreground font-semibold py-2.5 rounded-full text-sm"
                  data-ocid="planner.cancel.cancel_button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 mt-4 pb-4">
        {isLoading && (
          <div className="text-center py-8" data-ocid="planner.loading_state">
            <Loader2 className="animate-spin h-6 w-6 text-primary mx-auto" />
          </div>
        )}

        {!isLoading && pending.length === 0 && done.length === 0 && (
          <div className="text-center py-16" data-ocid="planner.empty_state">
            <Calendar
              size={40}
              className="text-muted-foreground mx-auto mb-3"
            />
            <div className="text-sm font-medium text-foreground mb-1">
              No tasks yet
            </div>
            <div className="text-xs text-muted-foreground">
              Tap + to add your first study task
            </div>
          </div>
        )}

        {pending.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">
              Pending ({pending.length})
            </div>
            <div className="space-y-2" data-ocid="planner.tasks.list">
              {pending.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`bg-white rounded-xl border p-3 flex items-start gap-3 ${
                    isOverdue(task.dueDate)
                      ? "border-red-200 bg-red-50/40"
                      : "border-border"
                  }`}
                  data-ocid={`planner.task.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleDone(task)}
                    className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0 mt-0.5 hover:bg-primary/10 transition"
                    data-ocid={`planner.task.checkbox.${i + 1}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground">
                        {task.description}
                      </div>
                    )}
                    {task.dueDate && (
                      <div
                        className={`flex items-center gap-1 text-xs mt-1 ${
                          isOverdue(task.dueDate)
                            ? "text-red-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        {isOverdue(task.dueDate) && <AlertCircle size={11} />}
                        <Calendar size={11} />
                        {new Date(task.dueDate).toLocaleDateString("en-TZ", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {done.length > 0 && (
          <div>
            <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
              Completed ({done.length})
            </div>
            <div className="space-y-2">
              {done.map((task, i) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl border border-border p-3 flex items-start gap-3 opacity-60"
                  data-ocid={`planner.done.item.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleDone(task)}
                    className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5"
                    data-ocid={`planner.done.checkbox.${i + 1}`}
                  >
                    <Check size={13} className="text-primary-foreground" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground line-through">
                      {task.title}
                    </div>
                    {task.dueDate && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Calendar size={11} />
                        {new Date(task.dueDate).toLocaleDateString("en-TZ", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
