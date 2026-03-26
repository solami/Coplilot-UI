import { Thread, DiffFile, Project, ActivityLogEntry } from "@/types";

export const mockProjects: Project[] = [
  { id: "p1", name: "copilot-ui", path: "~/projects/copilot-ui" },
  { id: "p2", name: "api-server", path: "~/projects/api-server" },
  { id: "p3", name: "mobile-app", path: "~/projects/mobile-app" },
];

export const mockThreads: Thread[] = [
  {
    id: "t1",
    title: "Add authentication flow",
    status: "running",
    model: "gpt-5",
    project: "copilot-ui",
    createdAt: new Date(Date.now() - 300000).toISOString(),
    updatedAt: new Date(Date.now() - 60000).toISOString(),
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Add a GitHub OAuth authentication flow to the app. Include login/logout buttons and session management.",
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: "m2",
        role: "assistant",
        content: "I'll implement a GitHub OAuth authentication flow for your app. Let me start by examining the current project structure and then set up the necessary components.\n\nHere's my plan:\n1. Set up NextAuth.js with GitHub provider\n2. Create authentication API routes\n3. Add login/logout UI components\n4. Implement session management",
        timestamp: new Date(Date.now() - 295000).toISOString(),
        toolCalls: [
          {
            id: "tc1",
            name: "read_file",
            status: "completed",
            input: "package.json",
            output: "Read 42 lines from package.json",
            duration: 120,
          },
          {
            id: "tc2",
            name: "read_file",
            status: "completed",
            input: "src/app/layout.tsx",
            output: "Read 28 lines from src/app/layout.tsx",
            duration: 85,
          },
          {
            id: "tc3",
            name: "execute_command",
            status: "completed",
            input: "npm install next-auth",
            output: "added 12 packages in 3.2s",
            duration: 3200,
          },
          {
            id: "tc4",
            name: "write_file",
            status: "completed",
            input: "src/app/api/auth/[...nextauth]/route.ts",
            output: "Created authentication API route with GitHub provider",
            duration: 150,
          },
        ],
      },
      {
        id: "m3",
        role: "assistant",
        content: "I've set up the authentication infrastructure. Now let me create the UI components:\n\n```typescript\n// src/components/auth/login-button.tsx\n'use client';\n\nimport { signIn, signOut, useSession } from 'next-auth/react';\n\nexport function LoginButton() {\n  const { data: session } = useSession();\n\n  if (session) {\n    return (\n      <div className=\"flex items-center gap-3\">\n        <img\n          src={session.user?.image ?? ''}\n          alt=\"Avatar\"\n          className=\"w-8 h-8 rounded-full\"\n        />\n        <span>{session.user?.name}</span>\n        <button onClick={() => signOut()}\n          className=\"px-3 py-1 rounded-md bg-red-500/10\n                     text-red-400 hover:bg-red-500/20\">\n          Sign out\n        </button>\n      </div>\n    );\n  }\n\n  return (\n    <button onClick={() => signIn('github')}\n      className=\"px-4 py-2 rounded-md bg-white/10\n                 hover:bg-white/20 flex items-center gap-2\">\n      <GitHubIcon />\n      Sign in with GitHub\n    </button>\n  );\n}\n```\n\nThe authentication flow is now complete. You'll need to set your `GITHUB_ID` and `GITHUB_SECRET` environment variables.",
        timestamp: new Date(Date.now() - 180000).toISOString(),
        toolCalls: [
          {
            id: "tc5",
            name: "write_file",
            status: "completed",
            input: "src/components/auth/login-button.tsx",
            output: "Created LoginButton component",
            duration: 200,
          },
          {
            id: "tc6",
            name: "write_file",
            status: "completed",
            input: "src/components/auth/auth-provider.tsx",
            output: "Created SessionProvider wrapper",
            duration: 150,
          },
          {
            id: "tc7",
            name: "execute_command",
            status: "running",
            input: "npm run build",
          },
        ],
      },
    ],
  },
  {
    id: "t2",
    title: "Fix responsive layout bug",
    status: "completed",
    model: "claude-sonnet-4.5",
    project: "copilot-ui",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3000000).toISOString(),
    messages: [
      {
        id: "m4",
        role: "user",
        content: "The sidebar overlaps the main content on tablet-sized screens. Fix the responsive layout.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "m5",
        role: "assistant",
        content: "I found the issue. The sidebar is using a fixed width without proper responsive breakpoints. I've updated the layout to use a collapsible sidebar on tablet screens and adjusted the z-index stacking.\n\nChanges made:\n- Added `lg:` breakpoint for sidebar visibility\n- Implemented overlay mode for tablet screens\n- Added a hamburger menu toggle button\n- Fixed z-index conflicts between sidebar and content",
        timestamp: new Date(Date.now() - 3550000).toISOString(),
        toolCalls: [
          {
            id: "tc8",
            name: "read_file",
            status: "completed",
            input: "src/components/app-shell.tsx",
            output: "Read 85 lines",
            duration: 90,
          },
          {
            id: "tc9",
            name: "edit_file",
            status: "completed",
            input: "src/components/app-shell.tsx",
            output: "Modified responsive breakpoints and z-index",
            duration: 250,
          },
        ],
      },
    ],
  },
  {
    id: "t3",
    title: "Optimize database queries",
    status: "reviewing",
    model: "gpt-5",
    project: "api-server",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 6000000).toISOString(),
    messages: [
      {
        id: "m6",
        role: "user",
        content: "The /api/users endpoint is slow. Optimize the database queries.",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: "m7",
        role: "assistant",
        content: "I've analyzed the database queries and found several optimization opportunities:\n\n1. **N+1 query problem**: The user list was loading relationships one by one\n2. **Missing index**: No index on `users.email` column used in WHERE clause\n3. **Overfetching**: Selecting all columns when only 5 were needed\n\nI've applied the following fixes and the query time dropped from ~800ms to ~45ms.",
        timestamp: new Date(Date.now() - 7100000).toISOString(),
        toolCalls: [
          {
            id: "tc10",
            name: "execute_command",
            status: "completed",
            input: "EXPLAIN ANALYZE SELECT * FROM users WHERE email LIKE '%@github.com'",
            output: "Seq Scan on users (cost=0.00..1250.00 rows=50000)",
            duration: 800,
          },
          {
            id: "tc11",
            name: "edit_file",
            status: "completed",
            input: "src/db/queries/users.ts",
            output: "Optimized queries with eager loading and column selection",
            duration: 300,
          },
        ],
      },
    ],
  },
  {
    id: "t4",
    title: "Set up CI/CD pipeline",
    status: "idle",
    model: "claude-opus-4.6",
    project: "mobile-app",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [],
  },
];

export const mockDiffFiles: DiffFile[] = [
  {
    filename: "src/db/queries/users.ts",
    status: "modified",
    additions: 15,
    deletions: 8,
    hunks: [
      {
        header: "@@ -12,20 +12,27 @@ import { db } from '../connection';",
        lines: [
          { type: "context", content: "import { db } from '../connection';", oldLineNumber: 12, newLineNumber: 12 },
          { type: "context", content: "import { users, profiles } from '../schema';", oldLineNumber: 13, newLineNumber: 13 },
          { type: "context", content: "", oldLineNumber: 14, newLineNumber: 14 },
          { type: "removed", content: "export async function getUsers() {", oldLineNumber: 15 },
          { type: "removed", content: "  const allUsers = await db.select().from(users);", oldLineNumber: 16 },
          { type: "removed", content: "  for (const user of allUsers) {", oldLineNumber: 17 },
          { type: "removed", content: "    user.profile = await db.select().from(profiles)", oldLineNumber: 18 },
          { type: "removed", content: "      .where(eq(profiles.userId, user.id));", oldLineNumber: 19 },
          { type: "removed", content: "  }", oldLineNumber: 20 },
          { type: "removed", content: "  return allUsers;", oldLineNumber: 21 },
          { type: "removed", content: "}", oldLineNumber: 22 },
          { type: "added", content: "export async function getUsers() {", newLineNumber: 15 },
          { type: "added", content: "  return db", newLineNumber: 16 },
          { type: "added", content: "    .select({", newLineNumber: 17 },
          { type: "added", content: "      id: users.id,", newLineNumber: 18 },
          { type: "added", content: "      name: users.name,", newLineNumber: 19 },
          { type: "added", content: "      email: users.email,", newLineNumber: 20 },
          { type: "added", content: "      avatar: users.avatar,", newLineNumber: 21 },
          { type: "added", content: "      createdAt: users.createdAt,", newLineNumber: 22 },
          { type: "added", content: "    })", newLineNumber: 23 },
          { type: "added", content: "    .from(users)", newLineNumber: 24 },
          { type: "added", content: "    .leftJoin(profiles, eq(users.id, profiles.userId))", newLineNumber: 25 },
          { type: "added", content: "    .orderBy(desc(users.createdAt))", newLineNumber: 26 },
          { type: "added", content: "    .limit(100);", newLineNumber: 27 },
          { type: "added", content: "}", newLineNumber: 28 },
        ],
      },
    ],
  },
  {
    filename: "src/db/migrations/003_add_email_index.sql",
    status: "added",
    additions: 5,
    deletions: 0,
    hunks: [
      {
        header: "@@ -0,0 +1,5 @@",
        lines: [
          { type: "added", content: "-- Add index on users.email for faster lookups", newLineNumber: 1 },
          { type: "added", content: "CREATE INDEX CONCURRENTLY IF NOT EXISTS", newLineNumber: 2 },
          { type: "added", content: "  idx_users_email ON users (email);", newLineNumber: 3 },
          { type: "added", content: "", newLineNumber: 4 },
          { type: "added", content: "-- Expected improvement: Seq Scan -> Index Scan (~17x faster)", newLineNumber: 5 },
        ],
      },
    ],
  },
];

export const mockActivityLog: ActivityLogEntry[] = [
  { id: "a1", timestamp: new Date(Date.now() - 5000).toISOString(), action: "Reading file", detail: "src/app/layout.tsx", type: "info" },
  { id: "a2", timestamp: new Date(Date.now() - 4000).toISOString(), action: "Analyzing", detail: "Project structure and dependencies", type: "info" },
  { id: "a3", timestamp: new Date(Date.now() - 3000).toISOString(), action: "Installing", detail: "next-auth@5.0.0", type: "info" },
  { id: "a4", timestamp: new Date(Date.now() - 2000).toISOString(), action: "Created", detail: "src/app/api/auth/[...nextauth]/route.ts", type: "success" },
  { id: "a5", timestamp: new Date(Date.now() - 1000).toISOString(), action: "Created", detail: "src/components/auth/login-button.tsx", type: "success" },
  { id: "a6", timestamp: new Date().toISOString(), action: "Running", detail: "npm run build", type: "info" },
];

export const models = [
  { id: "gpt-5", name: "GPT-5", provider: "OpenAI" },
  { id: "gpt-5.2-codex", name: "GPT-5.2 Codex", provider: "OpenAI" },
  { id: "claude-opus-4.6", name: "Claude Opus 4.6", provider: "Anthropic" },
  { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6", provider: "Anthropic" },
  { id: "gemini-3-pro", name: "Gemini 3 Pro", provider: "Google" },
];
