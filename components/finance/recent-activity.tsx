import { RecentActivityProps } from "@/app/(dashboard)/finance/page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatted } from "../members/columns";
import { Badge } from "../ui/badge";

type RecentActivityComponentProps = {
  data: RecentActivityProps[];
};

const RecentActivity = ({ data }: RecentActivityComponentProps) => {
  const sortedData = data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-8">
      {sortedData &&
        sortedData.slice(0, 7).map((activity, index) => (
          <div className="w-full flex justify-between gap-2 mr-2" key={index}>
            <div className="flex-[60%] flex items-center">
              <Avatar className="size-9 dark:border dark:bg-white dark:rounded-full">
                <AvatarImage
                  src={
                    activity.type === "expense"
                      ? "/credit-card.svg"
                      : "/hand-coins.svg"
                  }
                  alt="Avatar"
                  className="object-contain p-1"
                />
                <AvatarFallback>
                  {activity.type === "expense" ? "E" : "P"}
                </AvatarFallback>
              </Avatar>

              <div className="ml-2 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {activity.title}
                </p>
                <p className="text-[10px] leading-4 md:text-xs text-muted-foreground line-clamp-1">
                  {activity.description}
                </p>
              </div>
            </div>

            <div className="flex-[30%] font-normal flex justify-end">
              <Badge
                variant={
                  activity.type === "expense" ? "destructive" : "success"
                }
                className="text-sm"
              >
                {activity.type === "expense" ? "-" : "+"}
                {formatted.format(activity.amount)}
              </Badge>
            </div>
          </div>
        ))}
    </div>
  );
};

export default RecentActivity;
