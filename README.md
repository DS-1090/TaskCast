# TaskCast (Raycast Extension)

TaskCast is a Raycast extension for Google Tasks. It supports:
- Signing in with Google OAuth
- Viewing task lists
- Viewing today's tasks
- Creating lists
- Creating tasks (including optional due date)
- Quick task creation from clipboard
- Marking tasks complete

## Requirements

- Raycast
- Node.js 18+
- A Google Cloud OAuth 2.0 client

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start local development:

```bash
npm run dev
```

## Google OAuth Setup

Create credentials in Google Cloud Console:

1. Create a new project in **Google Cloud Console**.
2. Navigate to **APIs & Services**.
3. Click **Enable APIs and Services**, search for **Google Tasks API**, and enable it.
   [https://console.cloud.google.com/apis/library/tasks.googleapis.com](https://console.cloud.google.com/apis/library/tasks.googleapis.com)

4. Ensure the OAuth scope includes:
   `https://www.googleapis.com/auth/tasks`
5. Go to **Credentials**.
6. Click **Create Credentials → OAuth client ID**.
7. Choose **Web application** as the application type.
8. Add the following redirect URI:
   ```
   https://raycast.com/redirect?packageName=Extension
   ```
9. Save the configuration and copy the generated **Client ID** and **Client Secret**.
10. In Raycast, open this extension’s **Preferences** and paste:
* Google OAuth Client ID
* Google OAuth Client Secret


Note:
- Google settings can take a few minutes to propagate.
- A mismatch in redirect URI will cause `Error 400: redirect_uri_mismatch`.

## Commands

- `New Task`
- `Quick Task (Clipboard)`
- `Today's Tasks`
- `To Do Lists`
- `Create List`
- `Sign in to Google Tasks`

## Manual Smoke Test Checklist

1. Run `Sign in to Google Tasks` and verify OAuth completes.
2. Open `To Do Lists` and confirm lists load.
3. Run `Create List` and verify the new list appears.
4. Run `New Task` and create a task in a selected list.
5. Open `Today's Tasks` and verify due-today filtering.
6. Open list tasks and mark one task complete.

## Build and Lint

```bash
npm run lint
npx tsc --noEmit
```
