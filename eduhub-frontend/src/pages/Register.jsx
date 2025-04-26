// // 

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Register() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });

//   const handleRegister = async () => {
//     // TODO: Connect with Backend POST /api/register/
//     console.log("Register clicked", form);
//     // After successful registration:
//     navigate("/");
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">EduHub Register</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           className="w-full p-3 mb-4 border rounded"
//           value={form.username}
//           onChange={(e) => setForm({ ...form, username: e.target.value })}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-3 mb-4 border rounded"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-3 mb-4 border rounded"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <button
//           onClick={handleRegister}
//           className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Register;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });

  const handleRegister = async () => {
    try {
      if (!form.username || !form.email || !form.password) {
        toast.error("Please fill in all fields!");
        return;
      }

      // TODO: Connect to backend POST /api/register/
      console.log("Register clicked", form);

      // Fake simulate success
      toast.success("Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">EduHub Register</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 border rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white p-3 rounded hover:from-green-600 hover:to-green-800"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
