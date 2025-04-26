function Navbar() {
    return (
      <div className="w-full bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">EduHub Admin Panel</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }
  
  export default Navbar;
  