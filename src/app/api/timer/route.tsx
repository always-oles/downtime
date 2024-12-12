export async function GET() {
  const now = new Date();
  const downtimeExpiration = new Date(now.getTime() + 2 * 64 * 1000);

  return Response.json({ downtimeExpiration })
}