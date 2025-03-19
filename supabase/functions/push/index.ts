interface Notification {
  id: string
  player1_token: string
  player2_token: string
  gameroom_id: number
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: Notification
  schema: 'public'
  old_record: null | Notification
}

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json()
  const messages = [];
  let res;

if (payload.record.player1_token) {
  messages.push({
    to: payload.record.player1_token,
    sound: 'default',
    body: "Game finished! Click here to see the results.",
    data: {
      screen: "GameResults",
      gameroomId: payload.record.gameroom_id, // Pass game ID or any other data
    },
  });
}

if (payload.record.player2_token) {
  messages.push({
    to: payload.record.player2_token,
    sound: 'default',
    body: "Game finished! Click here to see the results.",
    data: {
      screen: "GameResults",
      gameroomId: payload.record.gameroom_id, // Pass game ID or any other data
    },
  });
}

// Only send the request if there are valid tokens
if (messages.length > 0) {
  res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('EXPO_ACCESS_TOKEN')}`,
    },
    body: JSON.stringify(messages),
  }).then((res) => res.json());

  console.log("Push notification response:", res);
}

  return new Response(JSON.stringify(res), {
    headers: { 'Content-Type': 'application/json' },
  })
})