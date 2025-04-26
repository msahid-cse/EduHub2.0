// // import { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";

// // function Login() {
// //   const navigate = useNavigate();
// //   const [form, setForm] = useState({ username: "", password: "" });
// //   const [error, setError] = useState("");

// //   const handleLogin = async () => {
// //     try {
// //       const res = await axios.post("http://127.0.0.1:8000/api/login/", form);
// //       localStorage.setItem("token", res.data.token);
// //       navigate("/dashboard"); // after login, move to dashboard
// //     } catch {
// //       setError("Invalid credentials");
// //     }
// //   };

// //   return (
// //     <div className="flex min-h-screen items-center justify-center bg-gray-100">
// //       <div className="bg-white p-8 rounded-lg shadow-md w-96">
// //         <h2 className="text-2xl font-bold mb-6 text-center">EduHub Login</h2>
// //         {error && <p className="text-red-500 mb-4">{error}</p>}
// //         <input
// //           type="text"
// //           placeholder="Username"
// //           className="w-full p-3 mb-4 border rounded"
// //           value={form.username}
// //           onChange={(e) => setForm({ ...form, username: e.target.value })}
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="w-full p-3 mb-4 border rounded"
// //           value={form.password}
// //           onChange={(e) => setForm({ ...form, password: e.target.value })}
// //         />
// //         <button
// //           onClick={handleLogin}
// //           className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
// //         >
// //           Login
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Login;





// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", password: "" });

//   const handleLogin = async () => {
//     // TODO: Connect with Backend POST /api/login/
//     console.log("Login clicked", form);
//     // After successful login:
//     // Save token in localStorage
//     // localStorage.setItem('token', 'your_token_here');
//     navigate("/dashboard");
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
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    try {
      if (!form.username || !form.password) {
        toast.error("Please fill in all fields!");
        return;
      }

      // TODO: Connect to backend POST /api/login/
      console.log("Login clicked", form);

      // Fake simulate success
      toast.success("Login successful!");
      localStorage.setItem('token', 'dummy_token_123'); // TEMPORARY token
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">EduHub Login</h2>

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
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded hover:from-blue-600 hover:to-blue-800"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
