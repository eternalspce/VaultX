import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "./ui/sonner";
import { Label } from "./ui/label";

const AddModal = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedPlatform = platform.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedPlatform || !trimmedUsername || !trimmedPassword) {
      toast.error("All fields are required");
      return;
    }

    if (
      trimmedPlatform.length > 100 ||
      trimmedUsername.length > 100 ||
      trimmedPassword.length > 200
    ) {
      toast.error("Input exceeds maximum length");
      return;
    }

    onAdd({
      platform: trimmedPlatform,
      username: trimmedUsername,
      password: trimmedPassword,
    });

    setPlatform("");
    setUsername("");
    setPassword("");
    setOpen(false);

    toast.success("Password entry added");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-heading font-semibold">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </DialogTrigger>

      <DialogContent className="border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Add New Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-muted-foreground">
              Platform
            </Label>
            <Input
              id="platform"
              placeholder="e.g. GitHub, Netflix"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              maxLength={100}
              className="bg-muted border-border font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-muted-foreground">
              Username / Email
            </Label>
            <Input
              id="username"
              placeholder="e.g. john@example.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={100}
              className="bg-muted border-border font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={200}
              className="bg-muted border-border font-mono"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-heading font-semibold"
          >
            Save Entry
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModal;