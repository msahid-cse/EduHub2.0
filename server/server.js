// Import the partner routes and platform routes
const partnerRoutes = require('./routes/partnerRoutes');
const platformRoutes = require('./routes/platformRoutes');

// Use the routes
app.use('/api/partners', partnerRoutes);
app.use('/api/platform', platformRoutes);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 