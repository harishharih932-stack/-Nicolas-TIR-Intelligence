
export async function sendTelegram(text: string): Promise<boolean> {
  const token = localStorage.getItem("nicolas_tg_token");
  const chat = localStorage.getItem("nicolas_tg_chat");
  if (!token || !chat) return false;
  return true;
}
