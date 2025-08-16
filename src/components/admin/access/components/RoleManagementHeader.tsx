
interface RoleManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredUsersCount: number;
}

export const RoleManagementHeader = ({ 
  searchTerm, 
  onSearchChange, 
  filteredUsersCount 
}: RoleManagementHeaderProps) => {
  return (
    <div className="space-y-1">
      <h2 className="text-2xl font-bold text-slate-900">Role Management</h2>
      <p className="text-sm text-slate-600">Manage user roles and custom permissions</p>
    </div>
  );
};
