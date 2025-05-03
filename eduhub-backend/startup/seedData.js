import Department from '../models/Department.js';
import User from '../models/User.js';
import { seedPartners } from '../seed/seedPartners.js';

// Seed initial data on startup
export const seedInitialData = async () => {
  try {
    // Check if there are any departments
    const departmentCount = await Department.countDocuments();
    
    if (departmentCount === 0) {
      console.log('No departments found. Seeding initial departments...');
      
      // Find admin user for reference (or create one if not found)
      let adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        console.log('No admin user found for seeding. Using system ID...');
        // Use a fixed ID for system operations
        adminUser = { _id: '000000000000000000000000' };
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
        { name: 'Computer Science', code: 'CS' }
      ];
      
      const departmentsToInsert = commonDepartments.map(dept => ({
        ...dept,
        createdBy: adminUser._id
      }));
      
      await Department.insertMany(departmentsToInsert);
      console.log(`Successfully seeded ${departmentsToInsert.length} departments`);
    }
    
    // Seed partners data
    await seedPartners();
    
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}; 