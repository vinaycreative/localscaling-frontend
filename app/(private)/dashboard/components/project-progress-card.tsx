interface ProjectProgressCardProps {
  progress: number;
}

export function ProjectProgressCard({ progress }: ProjectProgressCardProps) {
  return (
    <div className="bg-background rounded flex flex-col gap-2 p-4 justify-between border shadow-sm hover:shadow-xl transition-all duration-300">
      <h2 className="text-md font-medium text-muted-foreground">
        Project progress
      </h2>
      <p className="text-3xl font-medium text-foreground">{progress}%</p>
    </div>
  );
}
