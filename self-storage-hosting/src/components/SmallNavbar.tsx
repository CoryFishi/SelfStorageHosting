export default function SmallNavbar() {
  return (
    <div className="w-full h-7 border-b border-background-500 text-xs px-30 flex justify-end text-text-50 bg-primary-600 select-none">
      <a
        href="/demo"
        className="cursor-pointer h-full px-3 hover:border-b-2 hover:border-secondary-500 flex items-center"
      >
        Request a Demo
      </a>
      <a
        href="/support"
        className="cursor-pointer h-full px-3 hover:border-b-2 hover:border-secondary-500 flex items-center"
      >
        Support
      </a>
      <a
        href="/user/login"
        className="cursor-pointer h-full px-3 hover:border-b-2 hover:border-secondary-500 flex items-center"
      >
        Login
      </a>
    </div>
  );
}
