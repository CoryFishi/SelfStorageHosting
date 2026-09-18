function NotFoundPage() {
  return (
    <div className="h-full w-full py-20">
      <div className="h-full items-center flex flex-col justify-center w-full gap-5">
        <h1 className="font-bold text-9xl">Oops!</h1>
        <h2 className="font-bold">404 - PAGE NOT FOUND</h2>
        <p className="flex flex-wrap w-sm text-center text-sm">
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
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

export default NotFoundPage;
