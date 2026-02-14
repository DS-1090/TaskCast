import { List, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { listTaskLists } from "./api/tasks";
import ListTasks from "./components/list-tasks";

export default function Lists() {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await listTaskLists();
        setLists(data.items || []);
      } catch (err: any) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to load lists",
          message: err.message,
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <List isLoading={loading}>
      {lists.map((list) => (
        <List.Item
          key={list.id}
          title={list.title}
          actions={
            <ActionPanel>
              <Action.Push
                title="View Tasks"
                target={<ListTasks listId={list.id} listTitle={list.title} />}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
