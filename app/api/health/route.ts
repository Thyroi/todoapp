export async function GET() {
  return Response.json({
    name: "pomodoro-task-manager",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
