# Adding Demo Admin Accounts to EduHub 2.0

This document provides instructions for adding 5 demo admin accounts to the EduHub 2.0 application.

## Demo Admin Accounts

All accounts have the same password: `admin123`

| Name | Email | Permissions |
|------|-------|-------------|
| Admin 1 | admin1@eduhub.com | All permissions |
| Admin 2 | admin2@eduhub.com | All except manageJobs |
| Admin 3 | admin3@eduhub.com | All except manageCourses and manageNotices |
| Admin 4 | admin4@eduhub.com | All except manageUsers |
| Admin 5 | admin5@eduhub.com | All except manageContent |

## Option 1: Use the Application's Initialization Process

The easiest way to add these accounts is to let the application create them during startup:

1. Make sure you have MongoDB running
2. Start the application with: `npm start` or `npm run dev`
3. The application will automatically create these admin accounts if no admin accounts exist yet

## Option 2: Run a Dedicated Script (MongoDB Server Required)

If you want to add the accounts separately:

1. Make sure MongoDB is running
2. Navigate to the backend directory: `cd eduhub-backend`
3. Run: `npm run insert-admins`

## Option 3: Manual Database Insertion

If you prefer to add them directly to the database:

1. Connect to the MongoDB admin database:
   ```
   mongosh "mongodb://localhost:27017/eduhub-admin"
   ```

2. Insert the admin documents (the passwords need to be properly hashed)

## Option 4: Using the Admin Management UI

You can also add admin accounts through the application's admin management UI:

1. Log in as the default admin (admin@eduhub.com / admin123)
2. Navigate to Admin Management
3. Use the "Add New Admin" button to create each account

## Troubleshooting

If you encounter any issues:

1. Make sure MongoDB is running and accessible
2. Check that you're in the correct directory
3. Verify that your .env file has the correct database connection details
4. Look for errors in the application logs

## Notes

- All admin accounts use the password `admin123` which should be changed after the first login
- Each account has different permission sets to demonstrate the granular permission system 