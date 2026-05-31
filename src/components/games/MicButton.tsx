import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  isRecording: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function MicButton({ isRecording, onToggle, disabled }: MicButtonProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative",
        isRecording 
          ? "bg-brand-orange scale-110 shadow-[0_0_20px_rgba(255,107,0,0.4)]" 
          : "bg-brand-black hover:scale-105",
        disabled && "opacity-50 cursor-not-allowed scale-100 shadow-none hover:scale-100"
      )}
    >
      {isRecording && (
        <div className="absolute inset-0 rounded-full border-4 border-brand-orange animate-ping opacity-20" />
      )}
      {isRecording ? (
        <Mic className="text-white" size={32} />
      ) : (
        <MicOff className="text-white" size={32} />
      )}
    </button>
  );
}
