import { useState, useEffect } from "react";
import { Shield, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddModal from "../components/AddModal";
import VaultCard from "../components/VaultCard";
import API from "../api/api";
import { toast } from "../components/ui/sonner";

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await API.get("/vault");
      setEntries(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry) => {
    try {
      const res = await API.post("/vault", entry);
      setEntries((prev) => [res.data, ...prev]);
      toast.success("Entry added successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add entry");
    }
  };

  const deleteEntry = async (id) => {
    try {
      await API.delete(`/vault/${id}`);
      setEntries((prev) => prev.filter((e) => e._id !== id));
      toast.success("Entry deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete entry");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    nav("/");
  };

  const filtered = entries.filter(
    (e) =>
      e.platform.toLowerCase().includes(search.toLowerCase()) ||
      e.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              VaultX
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <AddModal onAdd={addEntry} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-8xl px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Entries", value: entries.length },
            {
              label: "Platforms",
              value: new Set(entries.map((e) => e.platform)).size,
            },
            {
              label: "Unique Users",
              value: new Set(entries.map((e) => e.username)).size,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-heading text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by platform or username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-muted border-border pl-10 font-mono"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading entries...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((entry) => (
              <VaultCard
                key={entry._id}
                id={entry._id}
                platform={entry.platform}
                username={entry.username}
                password={entry.password}
                onDelete={() => deleteEntry(entry._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Shield className="mb-3 h-10 w-10 opacity-30" />
            <p className="font-heading">No entries found</p>
            <p className="text-sm">
              Create your first password entry to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
