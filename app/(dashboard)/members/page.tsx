import { RoleGate } from "@/components/auth/role-gate";
import { columns } from "@/components/members/columns";
import { DataTable } from "@/components/members/data-table";
import { Header } from "@/components/music/header";
import { faked } from "@/data/members/fakeData";
import { UserRole } from "@prisma/client";

const MembersPage = () => {
  const fakeData = faked.map((item) => ({
    ...item,
    joined_since: new Date(item.joined_since),
    email: item.email !== null ? item.email : undefined,
  }));

  return (
    <RoleGate allowedRole={[UserRole.SUPERUSER, UserRole.ADMIN]} onPage>
      <div className="h-full">
        <Header label="Members" action="Add" />

        <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back!
              </h2>
              <p className="text-gray-300">
                Here&apos;s a list of all members in the group!
              </p>
            </div>
          </div>
          <DataTable data={fakeData} columns={columns} />
        </div>
      </div>
    </RoleGate>
  );
};

export default MembersPage;
