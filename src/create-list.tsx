import {
  Action,
  ActionPanel,
  Form,
  Toast,
  showToast,
  useNavigation,
} from "@raycast/api";
import { createList } from "./api/tasks";

export default function CreateList() {
  const { pop } = useNavigation();

  async function submit(values: { title: string }) {
    try {
      await createList(values.title);

      await showToast({
        style: Toast.Style.Success,
        title: "Task list created",
      });

      pop(); // return to previous screen
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to create list",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create List" onSubmit={submit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        title="List Name"
        placeholder="Personal, Work, Errands..."
      />
    </Form>
  );
}
