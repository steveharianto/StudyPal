const DashboardStudentHome = () => {
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome Back, [Student Name]!
          </h2>
          <p className="text-lg text-gray-600">
            Your learning journey continues. Here's a quick overview:
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-5">
            Current Lessons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200 ease-in-out">
              <h4 className="font-semibold text-lg mb-2">Lesson Name</h4>
              <p className="text-gray-600">Short description...</p>
            </div>
            {/* Repeat for other lessons */}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-5">
            Recent Messages
          </h3>
          <div className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200 ease-in-out">
            <p className="text-gray-600">No new messages.</p>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-5">
            Quick Links
          </h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="#"
              className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 transition-colors duration-200 ease-in-out"
            >
              Link 1
            </a>
            <a
              href="#"
              className="bg-blue-600 text-white px-5 py-3 rounded hover:bg-blue-700 transition-colors duration-200 ease-in-out"
            >
              Link 2
            </a>
            {/* Add more links as needed */}
          </div>
        </section>
      </main>
    </>
  );
};

export default DashboardStudentHome;
