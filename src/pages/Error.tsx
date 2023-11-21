import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError()
  
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center gap-y-4">

    {error.status==401 && <div className="text-xl font-semibold">You aren't authorized to see this</div>}
    {error.status==403 && <div className="text-xl font-semibold">Forbidden</div>}
    {error.status==404 && <div className="text-xl font-semibold">404 Page Not Found</div>}

      <Link to="/" className="text-blue-700">Go back</Link>
    </div>
  );
};

export default Error;

