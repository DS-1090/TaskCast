import {
  Form,
  showToast,
  Toast,
  ActionPanel,
  Action,
  useNavigation,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { listTaskLists, createTask } from "./api/tasks";
import { applyPriority } from "./lib/priority";

export default function AddTask() {
  const { pop } = useNavigation();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("none");
  const [due, setDue] = useState<Date | null>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<string>("");

  useEffect(() => {
    async function loadLists() {
      const r = await listTaskLists();
      const items = r.items || [];
      setLists(items);
      if (items.length > 0) {
        setSelectedList(items[0].id);
      }
    }

    loadLists();
  }, []);

  async function handleSubmit() {
    try {
      if (!selectedList) {
        throw new Error("No task list selected.");
      }

      let finalTitle = title;

      if (priority !== "none") {
        const prefix =
          priority === "high" ? "🔴 " : priority === "medium" ? "🟡 " : "🔵 ";

        finalTitle = prefix + title.replace(/^[🔴🟡🔵]\s*/, "");
      } else {
        finalTitle = applyPriority(title);
      }

      await createTask(selectedList, finalTitle, due ?? undefined);

      await showToast({
        style: Toast.Style.Success,
        title: "Task Created",
      });

      pop(); // 🔥 go back after success
    } catch (err: any) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to create task",
        message: err.message,
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Task" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        title="Task Title"
        value={title}
        onChange={setTitle}
      />

      <Form.DatePicker
        id="due"
        title="Due (optional)"
        value={due}
        onChange={setDue}
      />

      <Form.Dropdown
        id="priority"
        title="Priority"
        value={priority}
        onChange={setPriority}
      >
        <Form.Dropdown.Item value="none" title="None" />
        <Form.Dropdown.Item value="high" title="High" />
        <Form.Dropdown.Item value="medium" title="Medium" />
        <Form.Dropdown.Item value="low" title="Low" />
      </Form.Dropdown>

      <Form.Dropdown
        id="list"
        title="List"
        value={selectedList}
        onChange={setSelectedList}
      >
        {lists.map((l) => (
          <Form.Dropdown.Item key={l.id} value={l.id} title={l.title} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
