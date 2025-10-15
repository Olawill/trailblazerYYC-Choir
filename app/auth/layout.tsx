const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-radial from-sky-400 from-0% to-blue-800 to-100%">
      {children}
    </div>
  );
};

export default AuthLayout;
