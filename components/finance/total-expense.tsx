import { allExpense } from "@/actions/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Loader2 } from "lucide-react";
import { formatted } from "../members/columns";

const TotalExpense = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allExpense"],
    queryFn: () => allExpense(),
  });

  return (
    <Card className="bg-sky-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : (
          <div className="text-2xl font-bold">
            {formatted.format(data ? data : 0)}
          </div>
        )}

        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  );
};

export default TotalExpense;
