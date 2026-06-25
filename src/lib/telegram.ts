
export async function sendTelegram(text: string): Promise<boolean> {
  const token = localStorage.getItem("nicolas_tg_token");
  const chatId = localStorage.getItem("nicolas_tg_chat");
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  return res.ok;
}
