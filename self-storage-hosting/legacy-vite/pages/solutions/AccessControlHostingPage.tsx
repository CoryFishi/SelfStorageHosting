export default function AccessControlHostingPage() {
  return (
    <div className="h-full w-full py-20">
      <div className="h-full items-center flex flex-col justify-center w-full gap-5">
        <h1 className="font-bold text-6xl">Under Development</h1>
        <h2 className="font-bold">No Content Available</h2>
        <p className="flex flex-wrap w-sm text-center text-sm">
          This page is currently under development. Please check back later for
          updates.
        </p>
        <a
          className="mt-10 px-4 py-2 bg-accent-400 text-text-50 rounded-full shadow-2xl cursor-pointer transition duration-300 hover:scale-105"
          href="/"
        >
          GO TO HOMEPAGE
        </a>
      </div>
    </div>
  );
}
