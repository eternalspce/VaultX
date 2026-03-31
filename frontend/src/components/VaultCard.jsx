import { useState } from "react";
import { Eye, EyeOff, Copy, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "./ui/sonner";

const VaultCard = ({ platform, username, password, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const maskedPassword = "•".repeat(password.length);

  return (
    <div className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-[0_0_20px_-8px_hsl(var(--primary)/0.2)] animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 font-heading text-lg font-bold text-primary">
            {platform.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-card-foreground">
              {platform}
            </h3>
            <p className="text-sm text-muted-foreground">{username}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-md bg-muted px-3 py-2">
        <span className="flex-1 font-mono text-sm text-secondary-foreground">
          {showPassword ? password : maskedPassword}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => copyToClipboard(password, "Password")}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default VaultCard;