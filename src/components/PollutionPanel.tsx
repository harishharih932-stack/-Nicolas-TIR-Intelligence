
import { Card } from "@/components/ui/card";
export function PollutionPanel({ imageUrl }: any) {
  return <Card className="p-6">Pollution Analysis for {imageUrl ? "Current Image" : "None"}</Card>;
}
