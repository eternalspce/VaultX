import { useState } from "react";
import { Shield, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddModal from "../components/AddModal";
import VaultCard from "../components/VaultCard";

const Dashboard = () => {
  const [entries, setEntries] = useState([
    { id: "1", platform: "GitHub", username: "john@dev.com", password: "s3cur3P@ss!" },
    { id: "2", platform: "Netflix", username: "john@example.com", password: "Str0ngN3tflix#" },
    { id: "3", platform: "Google", username: "john.doe@gmail.com", password: "G00gl3!Acc3ss" },
  ]);

  const [search, setSearch] = useState("");

  const addEntry = (entry) => {
    setEntries((prev) => [...prev, { ...entry, id: crypto.randomUUID() }]);
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = entries.filter(
    (e) =>
      e.platform.toLowerCase().includes(search.toLowerCase()) ||
      e.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground">VaultKey</h1>
          </div>
          <AddModal onAdd={addEntry} />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Total Entries", value: entries.length },
            { label: "Platforms", value: new Set(entries.map((e) => e.platform)).size },
            { label: "Unique Users", value: new Set(entries.map((e) => e.username)).size },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
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
            className="bg-card border-border pl-10 font-mono"
          />
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <VaultCard
                key={entry.id}
                platform={entry.platform}
                username={entry.username}
                password={entry.password}
                onDelete={() => deleteEntry(entry.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Shield className="mb-3 h-10 w-10 opacity-30" />
            <p className="font-heading">No entries found</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;