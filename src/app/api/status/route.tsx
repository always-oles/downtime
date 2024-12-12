export async function GET() {
  const isDowntime = Math.random() < 0.85;

  if (isDowntime) {
    return new Response('Downtime', {
      status: 502
    })
  } else {
    return new Response('Server is up', {
      status: 200
    })
  }

}
