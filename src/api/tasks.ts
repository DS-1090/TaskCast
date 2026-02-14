import fetch from "node-fetch";
import { getAccessToken } from "./auth";

const BASE_URL = "https://tasks.googleapis.com/tasks/v1";

export type GoogleTaskList = {
  id: string;
  title: string;
};

export type GoogleTask = {
  id: string;
  title: string;
  status?: string;
  due?: string;
};

export type TaskListsResponse = {
  items?: GoogleTaskList[];
};

export type TasksResponse = {
  items?: GoogleTask[];
};

export async function googleFetch<T>(
  endpoint: string,
  options: any = {},
): Promise<T> {
  const token = await getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google API Error: ${res.status} - ${text}`);
  }

  return (await res.json()) as T;
}

export async function listTaskLists(): Promise<TaskListsResponse> {
  return googleFetch<TaskListsResponse>("/users/@me/lists");
}

export async function listTasks(listId: string): Promise<TasksResponse> {
  return googleFetch<TasksResponse>(`/lists/${listId}/tasks`);
}

export async function createTask(
  listId: string,
  title: string,
  due?: Date,
): Promise<GoogleTask> {
  const body: any = { title };

  if (due) {
    body.due = due.toISOString(); // Google expects RFC3339
  }

  return googleFetch<GoogleTask>(`/lists/${listId}/tasks`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function createList(title: string): Promise<GoogleTaskList> {
  return googleFetch<GoogleTaskList>("/users/@me/lists", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function completeTask(
  listId: string,
  taskId: string,
): Promise<GoogleTask> {
  return googleFetch<GoogleTask>(`/lists/${listId}/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "completed" }),
  });
}
