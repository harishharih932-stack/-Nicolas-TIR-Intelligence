
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { toast } from "sonner";
export function SettingsPanel() {
  const [key, setKey] = useState(localStorage.getItem("nicolas_gemini_key") || "");
  const [token, setToken] = useState(localStorage.getItem("nicolas_tg_token") || "");
  const [chat, setChat] = useState(localStorage.getItem("nicolas_tg_chat") || "");
  const save = () => {
    localStorage.setItem("nicolas_gemini_key", key);
    localStorage.setItem("nicolas_tg_token", token);
    localStorage.setItem("nicolas_tg_chat", chat);
    toast.success("Settings saved");
  };
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-bold">API Settings</h3>
      <div><Label>Gemini API Key</Label><Input type="password" value={key} onChange={(e:any) => setKey(e.target.value)} /></div>
      <div><Label>Telegram Bot Token</Label><Input type="password" value={token} onChange={(e:any) => setToken(e.target.value)} /></div>
      <div><Label>Telegram Chat ID</Label><Input value={chat} onChange={(e:any) => setChat(e.target.value)} /></div>
      <Button onClick={save} className="w-full">Save Configuration</Button>
    </Card>
  );
}