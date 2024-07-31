import { allMembers } from "@/actions/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Users } from "lucide-react";

const TotalMembers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allMembers"],
    queryFn: () => allMembers(),
  });

  return (
    <Card className="bg-sky-200 dark:bg-background">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Members</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <div className="text-2xl font-bold">+{data}</div>
        )}
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
      </CardContent>
    </Card>
  );
};

export default TotalMembers;
