"use client";

import { activeMembers } from "@/actions/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";

const ActiveMembers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["active"],
    queryFn: () => activeMembers(),
  });

  return (
    <Card className="bg-sky-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Members</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <div className="text-2xl font-bold">+{data}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveMembers;
