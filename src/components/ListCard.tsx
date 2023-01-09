import { api } from "@/utils/api";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  id: string;
  lists: { name: string; id: string; board_id: string }[];
  refreshLists: (toList: string) => void;
  updateListId: string;
};

type Task = {
  name: string;
  list_id: string;
  id: string;
  description: string | null;
};

type AddTaskModalProps = {
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: (value: boolean) => void;
  id: string;
  tasks: Task[];
  setTasks: (value: Task[]) => void;
};

type EditTaskModalProps = {
  isEditTaskModalOpen: boolean;
  setIsEditTaskModalOpen: (value: boolean) => void;
  setCurrentTask: (value: Task | null) => void;
  task: Task | null;
  list_id: string;
  lists: { name: string; id: string; board_id: string }[];
  refreshLists: (toList: string) => void;
  getTasks: { data: Task[] | undefined };
  setTasks: (value: Task[]) => void;
};

const ListCard = ({ name, id, lists, refreshLists, updateListId }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [listName, setListName] = useState(name);
  const updateList = api.list.updateList.useMutation();

  const getTasks = api.task.getTasks.useQuery(
    { list_id: id },
    {
      onSuccess: (data: Task[]) => {
        setTasks(data);
      },
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      if (updateListId === id) {
        const updatedTasks = await getTasks.refetch();
        setTasks(updatedTasks.data as Task[]);
      }
    };
    fetchData();
  }, [updateListId]);

  return (
    <>
      <div
        key={id}
        className="mr-8 flex h-min min-w-[20rem] flex-col gap-4 rounded bg-white/20 p-4"
      >
        <input
          className="text-ellipsis whitespace-nowrap bg-transparent p-2 text-2xl text-white hover:bg-white/30"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={(e) => {
            if (e.code !== "Enter") return;
            (e.target as HTMLInputElement).blur();
            updateList.mutate({
              id: id as string,
              name: listName,
            });
          }}
        />
        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto px-2">
          {tasks.map((item, id) => {
            return (
              <div
                key={id}
                className="w-full rounded bg-white/30 p-4 text-white hover:bg-white/40"
                onClick={() => {
                  setCurrentTask(item);
                  setIsEditTaskModalOpen(true);
                }}
              >
                <h1 className="text-xl">{item.name}</h1>
                {item.description ? <p>{item.description}</p> : ""}
              </div>
            );
          })}
        </div>
        <button
          className="w-full rounded bg-white/30 p-4 text-white hover:bg-white/40"
          onClick={() => {
            setIsAddTaskModalOpen(true);
          }}
        >
          + Add New Item
        </button>
      </div>
      <AddTaskModal
        isAddTaskModalOpen={isAddTaskModalOpen}
        setIsAddTaskModalOpen={setIsAddTaskModalOpen}
        id={id}
        tasks={tasks}
        setTasks={setTasks}
      />
      {currentTask ? (
        <EditTaskModal
          isEditTaskModalOpen={isEditTaskModalOpen}
          setIsEditTaskModalOpen={setIsEditTaskModalOpen}
          setCurrentTask={setCurrentTask}
          task={currentTask}
          list_id={id}
          lists={lists}
          refreshLists={refreshLists}
          getTasks={getTasks}
          setTasks={setTasks}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default ListCard;

const AddTaskModal = ({
  isAddTaskModalOpen,
  setIsAddTaskModalOpen,
  id,
  tasks,
  setTasks,
}: AddTaskModalProps) => {
  const addTask = api.task.addTask.useMutation();
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  return (
    <div
      className={`absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white/0 ${
        isAddTaskModalOpen ? "" : "hidden"
      }`}
    >
      <div className="flex w-72 flex-col gap-2 rounded bg-white px-8 py-4">
        <h1 className="text-center text-2xl">Add Task</h1>
        <div>
          <p>Name:</p>
          <input
            type="text"
            name="taskName"
            placeholder="Task name"
            className="w-full rounded border border-slate-400 p-2"
            value={newTaskName}
            onChange={(e) => {
              setNewTaskName(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Description (Optional):</p>
          <textarea
            className="w-full rounded border border-slate-400 p-2"
            onChange={(e) => setNewTaskDescription(e.target.value)}
            value={newTaskDescription}
          />
        </div>
        <button
          className="rounded bg-pink-300 py-2 text-white"
          onClick={() => {
            addTask.mutate(
              {
                name: newTaskName,
                description: newTaskDescription,
                list_id: id,
              },
              {
                onSuccess: (data: Task) => {
                  setTasks([...tasks, data]);
                  setIsAddTaskModalOpen(false);
                  setNewTaskName("");
                  setNewTaskDescription("");
                },
              }
            );
          }}
        >
          Add Task
        </button>
        <button
          className="rounded bg-pink-300 py-2 text-white"
          onClick={() => {
            setIsAddTaskModalOpen(false);
            setNewTaskName("");
            setNewTaskDescription("");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const EditTaskModal = ({
  isEditTaskModalOpen,
  setIsEditTaskModalOpen,
  setCurrentTask,
  task,
  list_id,
  lists,
  refreshLists,
  getTasks,
  setTasks,
}: EditTaskModalProps) => {
  const [currentListId, setCurrentListId] = useState(list_id);
  const [currentTaskId, setCurrentTaskId] = useState(task?.id);
  const [currentTaskName, setCurrentTaskName] = useState(task?.name);
  const [currentTaskDescription, setCurrentTaskDescription] = useState(
    task?.description
  );
  const updateTask = api.task.updateTask.useMutation();

  return (
    <div
      className={`absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white/0 ${
        isEditTaskModalOpen ? "" : "hidden"
      }`}
    >
      <div className="flex w-72 flex-col gap-2 rounded bg-white px-8 py-4">
        <h1 className="text-center text-2xl">Edit Task</h1>
        <div>
          <p>Name:</p>
          <input
            type="text"
            name="taskName"
            placeholder="Task name"
            className="w-full rounded border border-slate-400 p-2"
            value={currentTaskName}
            onChange={(e) => {
              setCurrentTaskName(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Description (Optional):</p>
          <textarea
            className="w-full rounded border border-slate-400 p-2"
            onChange={(e) => setCurrentTaskDescription(e.target.value)}
            value={currentTaskDescription as string}
          ></textarea>
        </div>
        <div>
          <p>Move To:</p>
          <select
            className="w-full rounded border border-slate-400 p-2"
            onChange={(e) => setCurrentListId(e.target.value)}
          >
            {lists.map((list: { id: string; name: string }) => {
              return (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              );
            })}
          </select>
        </div>
        <button
          className="rounded bg-pink-300 py-2 text-white"
          onClick={() => {
            updateTask.mutate(
              {
                id: currentTaskId as string,
                name: currentTaskName as string,
                description: currentTaskDescription as string,
                list_id: currentListId,
              },
              {
                onSuccess: () => {
                  console.log("updated");
                  setTasks(getTasks.data as Task[]);
                  setIsEditTaskModalOpen(false);
                  setCurrentTask(null);
                  refreshLists(currentListId);
                },
              }
            );
          }}
        >
          Update Task
        </button>
        <button
          className="rounded bg-pink-300 py-2 text-white"
          onClick={() => {
            setIsEditTaskModalOpen(false);
            setCurrentTask(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
