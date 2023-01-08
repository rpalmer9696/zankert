import { api } from "@/utils/api";
import { useState } from "react";

type Props = {
  name: string;
  id: string;
};

type Task = {
  name: string;
  list_id: string;
  id: string;
  description: string | null;
};

const ListCard = ({ name, id }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskModelOpen, setIsAddTaskModelOpen] = useState(false);
  const [listName, setListName] = useState(name);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const addTask = api.task.addTask.useMutation();
  const updateList = api.list.updateList.useMutation();

  api.task.getTasks.useQuery(
    { list_id: id },
    {
      onSuccess: (data: Task[]) => {
        setTasks(data);
      },
    }
  );

  return (
    <>
      <div
        key={id}
        className="mr-8 flex min-h-min min-w-[20rem] flex-col gap-4 rounded bg-white/20 p-4"
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
              >
                <h1 className="text-2xl">{item.name}</h1>
                {item.description ? <p>{item.description}</p> : ""}
              </div>
            );
          })}
        </div>
        <button
          className="w-full rounded bg-white/30 p-4 text-white hover:bg-white/40"
          onClick={() => {
            setIsAddTaskModelOpen(true);
          }}
        >
          + Add New Item
        </button>
      </div>
      <div
        className={`absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-white/0 ${
          isAddTaskModelOpen ? "" : "hidden"
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
              className="w-full rounded border border-slate-400 px-4"
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
            ></textarea>
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
                    setIsAddTaskModelOpen(false);
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
              setIsAddTaskModelOpen(false);
              setNewTaskName("");
              setNewTaskDescription("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ListCard;
