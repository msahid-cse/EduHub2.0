

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", password: "" });

//   const handleLogin = async () => {
//     try {
//       if (!form.username || !form.password) {
//         toast.error("Please fill in all fields!");
//         return;
//       }

//       // TODO: Connect to backend POST /api/login/
//       console.log("Login clicked", form);

//       // Fake simulate success
//       toast.success("Login successful!");
//       localStorage.setItem('token', 'dummy_token_123'); // TEMPORARY token
//       navigate("/dashboard");
//     } catch (error) {
//       toast.error("Invalid credentials");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">EduHub Login</h2>

//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full p-3 mb-4 border rounded"
//           value={form.username}
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-3 mb-4 border rounded"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <button
//           onClick={handleLogin}
//           className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded hover:from-blue-600 hover:to-blue-800"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", role: "user" });

  const handleLogin = async () => {
    try {
      if (!form.username || !form.password || !form.role) {
        toast.error("Please fill all fields!");
        return;
      }

      // TODO: Connect with real backend later
      console.log("Logging in", form);

      // Simulate Login
      localStorage.setItem("token", "dummy_token");
      localStorage.setItem("role", form.role);
      toast.success("Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      toast.error("Login Failed!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Login to EduHub</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Role Selection */}
        <select
          className="w-full p-3 mb-6 border rounded"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded hover:from-blue-600 hover:to-blue-800 transition"
        >
          Login ➡️
        </button>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-600 font-semibold">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
