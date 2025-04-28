import React, { useState } from 'react';

// Assuming Tailwind CSS is set up in your React project.
// No explicit CSS import needed here if using Tailwind utility classes.

// Placeholder data for demonstration
const countryData = [
  { name: 'Bangladesh', code: 'BD', phoneCode: '+880' },
  { name: 'United States', code: 'US', phoneCode: '+1' },
  { name: 'United Kingdom', code: 'GB', phoneCode: '+44' },
  // Add more countries as needed
];

const universityData = {
  BD: [
    { name: 'University of Dhaka', id: 'du' },
    { name: 'Bangladesh University of Engineering and Technology (BUET)', id: 'buet' },
    // Add more universities for Bangladesh
  ],
  US: [
    { name: 'Stanford University', id: 'stanford' },
    { name: 'Massachusetts Institute of Technology (MIT)', id: 'mit' },
    // Add more universities for US
  ],
  GB: [
    { name: 'University of Oxford', id: 'oxford' },
    { name: 'University of Cambridge', id: 'cambridge' },
    // Add more universities for UK
  ],
  // Add universities for other countries
};

const departmentData = {
  du: [
    { name: 'Computer Science and Engineering', id: 'cse_du' },
    { name: 'Electrical and Electronic Engineering', id: 'eee_du' },
    // Add more departments for DU
  ],
  buet: [
    { name: 'Computer Science and Engineering', id: 'cse_buet' },
    { name: 'Mechanical Engineering', id: 'mech_buet' },
    // Add more departments for BUET
  ],
  stanford: [
    { name: 'Computer Science', id: 'cs_stanford' },
    { name: 'Electrical Engineering', id: 'ee_stanford' },
    // Add more departments for Stanford
  ],
  // Add departments for other universities
};


const Register = () => {
  // State management for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState(''); // State for selected country code
  const [phoneNumber, setPhoneNumber] = useState('');
  const [presentAddress, setPresentAddress] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(''); // State for selected country
  const [selectedUniversity, setSelectedUniversity] = useState(''); // State for selected university
  const [selectedDepartment, setSelectedDepartment] = useState(''); // State for selected department

  // Filter universities based on selected country
  const universities = selectedCountry ? universityData[selectedCountry] || [] : [];

  // Filter departments based on selected university
  const departments = selectedUniversity ? departmentData[selectedUniversity] || [] : [];


  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send data to backend)
    console.log('Sign Up form submitted', {
      name,
      email,
      password,
      age,
      gender,
      phoneNumber: `${selectedCountryCode}${phoneNumber}`, // Combine country code and phone number
      presentAddress,
      permanentAddress,
      country: selectedCountry,
      university: selectedUniversity,
      department: selectedDepartment,
    });
    // Reset form fields or show success message
  };

  // Handle country change to reset university and department
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedUniversity(''); // Reset university when country changes
    setSelectedDepartment(''); // Reset department when country changes
  };

  // Handle university change to reset department
  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
    setSelectedDepartment(''); // Reset department when university changes
  };


  return (
    <div className="bg-slate-900 text-slate-200 flex items-center justify-center min-h-screen font-['Inter',_sans-serif]">
      <div className="bg-slate-800 p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-400 mb-6">Join Edu Hub</h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirm-password" className="block text-gray-300 text-sm font-semibold mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label htmlFor="age" className="block text-gray-300 text-sm font-semibold mb-2">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-300 text-sm font-semibold mb-2">Gender</label>
            <select
              id="gender"
              name="gender"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Phone Number with Country Code */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-300 text-sm font-semibold mb-2">Phone Number</label>
            <div className="flex items-center gap-x-2"> {/* Use flexbox to align inputs */}
                {/* Country Code Dropdown */}
                <select
                    id="country-code"
                    name="country-code"
                    className="w-1/4 px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                     value={selectedCountryCode}
                     onChange={(e) => setSelectedCountryCode(e.target.value)}
                >
                    <option value="">Code</option>
                    {countryData.map(country => (
                        <option key={country.code} value={country.phoneCode}>{country.phoneCode}</option>
                    ))}
                </select>
                {/* Phone Number Input */}
                <input
                    type="tel" // Use type="tel" for phone numbers
                    id="phone"
                    name="phone"
                    className="w-3/4 px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="555 123 4567" // Example placeholder
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>
          </div>

          {/* Present Address */}
          <div className="mb-4">
            <label htmlFor="present-address" className="block text-gray-300 text-sm font-semibold mb-2">Present Address</label>
            <textarea
              id="present-address"
              name="present-address"
              rows="3"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your present address"
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
            ></textarea>
          </div>

          {/* Permanent Address */}
          <div className="mb-4">
            <label htmlFor="permanent-address" className="block text-gray-300 text-sm font-semibold mb-2">Permanent Address</label>
            <textarea
              id="permanent-address"
              name="permanent-address"
              rows="3"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your permanent address"
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
            ></textarea>
          </div>

          {/* Country */}
          <div className="mb-4">
            <label htmlFor="country" className="block text-gray-300 text-sm font-semibold mb-2">Country</label>
            <select
              id="country"
              name="country"
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              value={selectedCountry}
              onChange={handleCountryChange} // Use the handler
            >
              <option value="">Select Country</option>
              {countryData.map(country => (
                <option key={country.code} value={country.code}>{country.name}</option>
              ))}
            </select>
          </div>

          {/* University Name (Conditional) */}
          {selectedCountry && ( // Only show if a country is selected
            <div className="mb-4">
              <label htmlFor="university" className="block text-gray-300 text-sm font-semibold mb-2">University Name</label>
              <select
                id="university"
                name="university"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={selectedUniversity}
                onChange={handleUniversityChange} // Use the handler
                disabled={universities.length === 0} // Disable if no universities available
              >
                <option value="">Select University</option>
                {universities.map(university => (
                  <option key={university.id} value={university.id}>{university.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Department (Conditional) */}
          {selectedUniversity && ( // Only show if a university is selected
            <div className="mb-6">
              <label htmlFor="department" className="block text-gray-300 text-sm font-semibold mb-2">Department</label>
              <select
                id="department"
                name="department"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={departments.length === 0} // Disable if no departments available
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department.id} value={department.id}>{department.name}</option>
                ))}
              </select>
            </div>
          )}


          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 transition duration-200 shadow-md hover:shadow-lg"
            >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">Already have an account? <a href="/login" className="text-cyan-400 hover:underline">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
