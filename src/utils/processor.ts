
export interface ProcessResult {
  imageUrl: string;
  stats: {
    avgTemp: number;
    aqi: number;
    alerts: string[];
  };
}

export async function processTIRImage(file: File, settings: { geminiKey?: string }): Promise<ProcessResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let totalT = 0;
        let hotspotCount = 0;

        // Apply Math Pipeline
        for (let i = 0; i < data.length; i += 4) {
          const radiance = data[i]; // Simple 8-bit radiance for demo
          
          // T = K2 / ln(K1/L + 1) -> Simplified for 0-255 input
          const t = 200 + (radiance * 0.5); 
          totalT += t;

          // LUT Colorization (Water to Urban)
          if (t < 273) { // Water/Ice
            data[i] = 0; data[i+1] = 100; data[i+2] = 200;
          } else if (t < 290) { // Forest
            data[i] = 34; data[i+1] = 139; data[i+2] = 34;
          } else if (t < 305) { // Crops/Soil
            data[i] = 210; data[i+1] = 180; data[i+2] = 140;
          } else { // Urban/Hot
            data[i] = 200; data[i+1] = 50; data[i+2] = 50;
          }

          // Hotspot detection (Volcano/Fire)
          if (t > 313) hotspotCount++;
        }

        ctx.putImageData(imageData, 0, 0);
        
        const avgTemp = (totalT / (data.length / 4)) - 273.15; // To Celsius
        const alerts = [];
        if (avgTemp > 38) alerts.push("High Temperature Alert (>38°C)");
        if (hotspotCount > 100) alerts.push("Volcano/Fire Hotspot Detected");

        resolve({
          imageUrl: canvas.toDataURL(),
          stats: {
            avgTemp: Math.round(avgTemp * 10) / 10,
            aqi: Math.round(100 + Math.random() * 60),
            alerts
          }
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function sendTelegramAlert(token: string, chatId: string, message: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: `🛰️ NOVA-TIR ALERT: ${message}` })
  });
}
