import { EllipsisVertical } from "lucide-react";

interface LaunchDateCardProps {
  date: string;
}

export function LaunchDateCard({ date }: LaunchDateCardProps) {
  return (
    <div className="bg-background rounded flex flex-col gap-2 px-3 py-4 justify-between border">
      <div className="flex justify-between">
        <h2 className="text-md font-medium text-muted-foreground">
          Estimated Launch Date
        </h2>
        <EllipsisVertical className="h-4 w-4 cursor-pointer" />
      </div>

      <p className="text-3xl font-bold text-foreground">{date}</p>
    </div>
  );
}
