const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound?: 'default';
  badge?: number;
}

export async function sendPushNotification(message: PushMessage) {
  if (!message.to?.startsWith('ExponentPushToken')) return;

  await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Accept':        'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
    body: JSON.stringify({ sound: 'default', ...message }),
  });
}

export async function sendPushToMany(messages: PushMessage[]) {
  const valid = messages.filter((m) => m.to?.startsWith('ExponentPushToken'));
  if (!valid.length) return;

  await fetch(EXPO_PUSH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(valid),
  });
}
