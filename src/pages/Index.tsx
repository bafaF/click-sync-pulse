import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClickButton } from "@/components/ClickButton";
import { ClickCounter } from "@/components/ClickCounter";
import { toast } from "sonner";

const Index = () => {
  const [clickCount, setClickCount] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [clickId, setClickId] = useState<string | null>(null);

  // Fetch initial count
  useEffect(() => {
    const fetchCount = async () => {
      const { data, error } = await supabase
        .from("global_clicks")
        .select("id, count")
        .single();

      if (error) {
        console.error("Error fetching count:", error);
        toast.error("Failed to load click count");
        return;
      }

      if (data) {
        setClickCount(data.count);
        setClickId(data.id);
      }
    };

    fetchCount();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("global_clicks_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "global_clicks",
        },
        (payload) => {
          console.log("Realtime update:", payload);
          setClickCount(payload.new.count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleClick = async () => {
    if (!clickId) return;

    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 400);

    // Optimistically update UI
    setClickCount((prev) => prev + 1);

    // Update database
    const { error } = await supabase
      .from("global_clicks")
      .update({ count: clickCount + 1 })
      .eq("id", clickId);

    if (error) {
      console.error("Error updating count:", error);
      toast.error("Failed to register click");
      // Revert optimistic update
      setClickCount((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-16 p-8 bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Global Click Counter
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Every click you make is instantly synchronized with all users around the world
        </p>
      </div>

      <ClickCounter count={clickCount} />

      <ClickButton onClick={handleClick} isClicking={isClicking} />
    </div>
  );
};

export default Index;
