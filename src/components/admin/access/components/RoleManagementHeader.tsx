
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
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Role Management</h2>
      <p className="text-sm text-gray-600 font-normal">Manage user roles and custom permissions</p>
    </div>
  );
};
