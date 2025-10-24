interface ProjectProgressCardProps {
  progress: number;
}

export function ProjectProgressCard({ progress }: ProjectProgressCardProps) {
  return (
    <div className="bg-background rounded flex flex-col gap-2 px-3 py-4 justify-between border">
      <h2 className="text-md font-medium text-muted-foreground">
        Project progress
      </h2>
      <p className="text-3xl font-bold text-foreground">{progress}%</p>
    </div>
  );
}
