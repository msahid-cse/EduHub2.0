// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// function Register() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });

//   const handleRegister = async () => {
//     try {
//       if (!form.username || !form.email || !form.password) {
//         toast.error("Please fill in all fields!");
//         return;
//       }

//       // TODO: Connect to backend POST /api/register/
//       console.log("Register clicked", form);

//       // Fake simulate success
//       toast.success("Registration successful! Please login.");
//       navigate("/");
//     } catch (error) {
//       toast.error("Registration failed");
//     }
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
//           className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white p-3 rounded hover:from-green-600 hover:to-green-800"
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    university: "",
    department: "",
    age: "",
    gender: "",
    presentAddress: "",
    permanentAddress: "",
    username: "",
    password: "",
    cv: null,
  });

  const handleRegister = async () => {
    try {
      // Basic Validation
      if (!form.name || !form.email || !form.country || !form.username || !form.password) {
        toast.error("Please fill all required (*) fields!");
        return;
      }

      // TODO: Connect with real backend later
      console.log("Registering", form);

      toast.success("Registration Successful! Please Login.");
      navigate("/login");
    } catch (error) {
      toast.error("Registration Failed!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700">Register for EduHub</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name *"
            className="p-3 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email *"
            className="p-3 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Country *"
            className="p-3 border rounded"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
          <input
            type="text"
            placeholder="University"
            className="p-3 border rounded"
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
          />
          <input
            type="text"
            placeholder="Department"
            className="p-3 border rounded"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            className="p-3 border rounded"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />
          <select
            className="p-3 border rounded"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Present Address"
            className="p-3 border rounded"
            value={form.presentAddress}
            onChange={(e) => setForm({ ...form, presentAddress: e.target.value })}
          />
          <input
            type="text"
            placeholder="Permanent Address"
            className="p-3 border rounded"
            value={form.permanentAddress}
            onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })}
          />
          <input
            type="text"
            placeholder="Username *"
            className="p-3 border rounded"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password *"
            className="p-3 border rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <input
            type="file"
            accept=".pdf"
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, cv: e.target.files[0] })}
          />
        </div>

        <button
          onClick={handleRegister}
          className="mt-6 w-full bg-gradient-to-r from-green-400 to-green-600 text-white p-3 rounded hover:from-green-500 hover:to-green-700 text-lg font-bold transition-all"
        >
          Register ➡️
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 font-semibold">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
