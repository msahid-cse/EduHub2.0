import Department from '../models/Department.js';

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Server error while fetching departments' });
  }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ message: 'Server error while fetching department' });
  }
};

// Create a new department
export const createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: 'Department with this name already exists' });
    }
    
    // Create new department
    const department = new Department({
      name,
      code: code || name.substring(0, 3).toUpperCase(),
      description: description || '',
      createdBy: req.user.userId
    });
    
    await department.save();
    res.status(201).json({ message: 'Department created successfully', department });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Server error while creating department' });
  }
};

// Update a department
export const updateDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    // Find department
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    // Check if name is being changed and already exists
    if (name && name !== department.name) {
      const existingDepartment = await Department.findOne({ name });
      if (existingDepartment) {
        return res.status(400).json({ message: 'Department with this name already exists' });
      }
    }
    
    // Update fields
    department.name = name || department.name;
    department.code = code || department.code;
    department.description = description !== undefined ? description : department.description;
    
    await department.save();
    res.status(200).json({ message: 'Department updated successfully', department });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Server error while updating department' });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    await department.deleteOne();
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Server error while deleting department' });
  }
};

// Seed common departments 
export const seedDepartments = async (req, res) => {
  try {
    // Check if already has departments
    const departmentCount = await Department.countDocuments();
    if (departmentCount > 0) {
      return res.status(400).json({ 
        message: 'Departments already exist in the database',
        count: departmentCount 
      });
    }
    
    // Common academic departments
    const commonDepartments = [
      { name: 'Computer Science and Engineering', code: 'CSE' },
      { name: 'Electrical and Electronic Engineering', code: 'EEE' },
      { name: 'Mechanical Engineering', code: 'ME' },
      { name: 'Civil Engineering', code: 'CE' },
      { name: 'Mathematics', code: 'MATH' },
      { name: 'Physics', code: 'PHY' },
      { name: 'Chemistry', code: 'CHEM' },
      { name: 'Biology', code: 'BIO' },
      { name: 'Business Administration', code: 'BBA' },
      { name: 'Economics', code: 'ECON' },
      { name: 'English', code: 'ENG' },
      { name: 'History', code: 'HIST' },
      { name: 'Philosophy', code: 'PHIL' },
      { name: 'Psychology', code: 'PSYCH' },
      { name: 'Sociology', code: 'SOC' },
      { name: 'Political Science', code: 'POLS' },
      { name: 'Architecture', code: 'ARCH' },
      { name: 'Medical Sciences', code: 'MED' }
    ];
    
    const departmentsToInsert = commonDepartments.map(dept => ({
      ...dept,
      createdBy: req.user.userId
    }));
    
    await Department.insertMany(departmentsToInsert);
    
    res.status(201).json({ 
      message: 'Departments seeded successfully',
      count: departmentsToInsert.length
    });
  } catch (error) {
    console.error('Error seeding departments:', error);
    res.status(500).json({ message: 'Server error while seeding departments' });
  }
}; 