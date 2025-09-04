import { IoMdArrowDropdown } from "react-icons/io";

export default function LargeNavbar() {
  return (
    <div className="w-full h-20 border-b border-background-500 px-30 flex justify-between text-text-50 bg-primary-600 select-none">
      <a className="flex items-center" href="/">
        <img src="/Logo.png" alt="" className="h-full" />
        <h1 className="text-lg font-medium">Self Storage Hosting</h1>
      </a>
      <div className="flex h-full items-center">
        <a
          className="cursor-pointer h-full px-3 hover:border-b-2 hover:border-secondary-500 items-center flex-col flex justify-center"
          href="/solutions/web-hosting"
        >
          Web Hosting
          <IoMdArrowDropdown className="text-accent-200" />
        </a>
        <a
          href="/solutions/access-control-hosting"
          className="cursor-pointer h-full px-3 hover:border-b-2 hover:border-secondary-500 items-center flex-col flex justify-center"
        >
          Access Control Hosting
          <IoMdArrowDropdown className="text-accent-200" />
        </a>
        <a
          href="/about-us"
          className="cursor-pointer h-full px-3 hover:border-b-2 hover:border-secondary-500 items-center flex-col flex justify-center"
        >
          About Us
          <IoMdArrowDropdown className="text-accent-200" />
        </a>
        <button className="cursor-pointer bg-accent-50 h-fit px-3 py-1 rounded-full mx-5 hover:bg-accent-400 text-text-950">
          Talk to Sales
        </button>
      </div>
    </div>
  );
}
