import { columns } from "@/components/members/columns";
import { DataTable } from "@/components/members/data-table";
import { Header } from "@/components/music/header";
import { fakeData } from "@/data/members/data";

const MembersPage = () => {
  return (
    <div className="h-full">
      <Header label="Members" />

      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-gray-300">
              Here&apos;s a list of all members in the group!
            </p>
          </div>
        </div>
        <DataTable data={fakeData} columns={columns} />
      </div>
    </div>
  );
};

export default MembersPage;
