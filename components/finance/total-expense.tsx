import { allExpense, allPayments } from "@/actions/finance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Info, Loader2 } from "lucide-react";
import { formatted } from "@/components/members/columns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TotalExpense = () => {
  let balance: number = 0;

  const { data, isLoading } = useQuery({
    queryKey: ["allExpense"],
    queryFn: () => allExpense(),
  });

  const { data: payment } = useQuery({
    queryKey: ["allPayment"],
    queryFn: () => allPayments(),
  });

  if (payment && data) {
    balance = payment - data;
  }

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
          <div className="text-2xl font-bold text-rose-700">
            {formatted.format(data ? data : 0)}
          </div>
        )}

        <div className="flex gap-2 items-center">
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-xs text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="bg-sky-100">
                <Card className="p-0 w-auto bg-transparent border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Account Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-emerald-700">
                      {formatted.format(balance ? balance : 0)}
                    </div>
                  </CardContent>
                </Card>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalExpense;
