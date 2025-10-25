import { ArrowLeft } from "lucide-react";

const OnboardingHeader = () => (
  <div className="flex gap-2 text-primary text-sm items-center cursor-pointer group">
    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300" />
    Dashboard
  </div>
);

export default OnboardingHeader;
