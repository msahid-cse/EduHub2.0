

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", password: "", role: "user" });

//   const handleLogin = async () => {
//     try {
//       if (!form.username || !form.password || !form.role) {
//         toast.error("Please fill all fields!");
//         return;
//       }

//       // TODO: Connect with real backend later
//       console.log("Logging in", form);

//       // Simulate Login
//       localStorage.setItem("token", "dummy_token");
//       localStorage.setItem("role", form.role);
//       toast.success("Login Successful!");

//       navigate("/userdashboard");
//     } catch (error) {
//       toast.error("Login Failed!");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Login to EduHub</h2>

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

//         {/* Role Selection */}
//         <select
//           className="w-full p-3 mb-6 border rounded"
//           value={form.role}
//           onChange={(e) => setForm({ ...form, role: e.target.value })}
//         >
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>

//         <button
//           onClick={handleLogin}
//           className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded hover:from-blue-600 hover:to-blue-800 transition"
//         >
//           Login ➡️
//         </button>

//         <p className="text-center mt-4 text-gray-600">
//           Don't have an account? <a href="/register" className="text-blue-600 font-semibold">Register</a>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;








//22222222222222222




//3333333333

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function App() {
  return (
    <div className="bg-slate-900 text-slate-200 flex items-center justify-center min-h-screen font-['Inter',_sans-serif]">
      <LoginPage />
    </div>
  );
}

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    role: 'user' // Default role
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Login form submitted with:', formData);
    // Add actual login logic here (e.g., API call with role)
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-400 mb-6">
        Edu Hub Login
      </h1>
      <p className="text-center text-slate-400 mb-8 text-sm">
        Welcome back! Please enter your details.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Email Input Field */}
        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-300">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
          />
        </div>

        {/* Password Input Field */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <a href="#" className="text-xs text-teal-400 hover:text-teal-300 transition duration-200">
              Forgot Password?
            </a>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
          />
        </div>

        {/* Role Selection Field */}
        <div className="mb-5">
          <label htmlFor="role" className="block mb-2 text-sm font-medium text-slate-300">
            Login As
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 appearance-none"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center mb-6">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-500 text-teal-500 focus:ring-teal-500 bg-slate-700 focus:ring-offset-slate-800"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
            Remember me
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition duration-200 shadow-md hover:shadow-lg"
        >
          Sign In
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-slate-400 mt-8">
          Don't have an account?{' '}
          <NavLink to="/register" className="font-medium text-teal-400 hover:text-teal-300 transition duration-200">
            Sign Up
          </NavLink>
        </p>
      </form>
    </div>
  );
}