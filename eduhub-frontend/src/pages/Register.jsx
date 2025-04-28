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

// Country, University and Department Mapping
const universities = {
  Bangladesh: {
    "Dhaka University": ["CSE", "EEE", "BBA", "Economics"],
    "BUET": ["CSE", "EEE", "Civil", "Mechanical"],
    "NSU": ["CSE", "BBA", "Economics"],
    "BRAC University": ["CSE", "BBA", "Architecture"],
  },
  India: {
    "IIT Bombay": ["CSE", "Mechanical", "Civil"],
    "IIT Delhi": ["CSE", "Electrical", "Mathematics"],
    "IIM Ahmedabad": ["MBA", "Economics"],
  },
  USA: {
    "Harvard University": ["Law", "Business", "Medicine"],
    "MIT": ["CSE", "Mechanical", "Physics"],
    "Stanford University": ["CSE", "Medicine", "Business"],
  },
  UK: {
    "University of Oxford": ["Law", "Mathematics", "Medicine"],
    "University of Cambridge": ["CSE", "Physics", "Mathematics"],
    "Imperial College London": ["Medicine", "CSE"],
  },
};

// Country code mapping
const countryCodes = {
  Bangladesh: "+880",
  India: "+91",
  USA: "+1",
  UK: "+44",
  Canada: "+1",
  Australia: "+61",
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobileCode: "+880",
    mobile: "",
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
      if (!form.name || !form.email || !form.country || !form.username || !form.password) {
        toast.error("Please fill all required (*) fields!");
        return;
      }

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
          {/* Name */}
          <input
            type="text"
            placeholder="Name *"
            className="p-3 border rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {/* Email */}
          <input
            type="email"
            placeholder="Email *"
            className="p-3 border rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Mobile Code + Mobile */}
          <div className="flex gap-2">
            <select
              className="p-3 border rounded w-35"
              value={form.mobileCode}
              onChange={(e) => setForm({ ...form, mobileCode: e.target.value })}
            >
              {Object.entries(countryCodes).map(([country, code]) => (
                <option key={country} value={code}>
                  {country} ({code})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Mobile Number"
              className="p-3 border rounded flex-1 w-13"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            />
          </div>

          {/* Country Dropdown */}
          <select
            className="p-3 border rounded"
            value={form.country}
            onChange={(e) => {
              setForm({ ...form, country: e.target.value, university: "", department: "" });
            }}
          >
            <option value="">Select Country *</option>
            {Object.keys(universities).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          {/* University Dropdown */}
          <select
            className="p-3 border rounded"
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value, department: "" })}
            disabled={!form.country}
          >
            <option value="">
              {form.country ? "Select University" : "Select Country First"}
            </option>
            {form.country &&
              Object.keys(universities[form.country]).map((uni) => (
                <option key={uni} value={uni}>
                  {uni}
                </option>
              ))}
          </select>

          {/* Department Dropdown */}
          <select
            className="p-3 border rounded"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            disabled={!form.university}
          >
            <option value="">
              {form.university ? "Select Department" : "Select University First"}
            </option>
            {form.country && form.university &&
              universities[form.country][form.university].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
          </select>

          {/* Age */}
          <input
            type="number"
            placeholder="Age"
            className="p-3 border rounded"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          {/* Gender */}
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

          {/* Present Address */}
          <input
            type="text"
            placeholder="Present Address"
            className="p-3 border rounded"
            value={form.presentAddress}
            onChange={(e) => setForm({ ...form, presentAddress: e.target.value })}
          />

          {/* Permanent Address */}
          <input
            type="text"
            placeholder="Permanent Address"
            className="p-3 border rounded"
            value={form.permanentAddress}
            onChange={(e) => setForm({ ...form, permanentAddress: e.target.value })}
          />

          {/* Username */}
          <input
            type="text"
            placeholder="Username *"
            className="p-3 border rounded"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password *"
            className="p-3 border rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* CV Upload */}
        <div className="mt-6">
          <label className="block mb-2 font-semibold text-gray-700">Upload Your CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            className="w-full p-3 border rounded"
            onChange={(e) => setForm({ ...form, cv: e.target.files[0] })}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleRegister}
          className="mt-6 w-full bg-gradient-to-r from-green-400 to-green-600 text-white p-3 rounded hover:from-green-500 hover:to-green-700 text-lg font-bold transition-all"
        >
          Register ➡️
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
