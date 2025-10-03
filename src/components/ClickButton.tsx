import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClickButtonProps {
  onClick: () => void;
  isClicking: boolean;
}

export const ClickButton = ({ onClick, isClicking }: ClickButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "relative h-64 w-64 rounded-full text-2xl font-bold shadow-lg transition-all duration-300",
        "bg-gradient-to-br from-primary to-secondary",
        "hover:shadow-[var(--shadow-button)] hover:scale-105",
        "active:scale-95",
        isClicking && "animate-click-bounce"
      )}
      style={{
        background: "var(--gradient-primary)",
      }}
    >
      <span className="relative z-10">CLICK ME!</span>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl animate-pulse-scale" />
    </Button>
  );
};
