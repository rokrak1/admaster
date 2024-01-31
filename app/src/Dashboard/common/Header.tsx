const Header: React.FC<{
  children: React.ReactNode;
  label: string;
  description?: string;
}> = ({ children, label }) => {
  return (
    <div className="flex justify-between p-3 pb-1 gap-x-2 border-b border-gray-100">
      <h3 className="">{label}</h3>
      {children}
    </div>
  );
};
export default Header;
