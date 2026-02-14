import { List, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { listTaskLists, listTasks, GoogleTask } from "./api/tasks";

export default function Today() {
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const lists = await listTaskLists();
        const today = new Date().toISOString().slice(0, 10);

        const results = await Promise.all(
          (lists.items || []).map((l) => listTasks(l.id)),
        );

        const allTasks = results
          .flatMap((r) => r.items || [])
          .filter(
            (t) =>
              t.due && t.due.slice(0, 10) === today && t.status !== "completed",
          );

        if (!cancelled) {
          setTasks(allTasks);
        }
      } catch (err: any) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to load tasks",
          message: err.message,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <List isLoading={loading}>
      {tasks.map((t) => (
        <List.Item
          key={t.id}
          title={t.title}
          subtitle={t.due ? new Date(t.due).toDateString() : undefined}
        />
      ))}
    </List>
  );
}
