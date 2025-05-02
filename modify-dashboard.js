const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'eduhub-frontend', 'src', 'pages', 'UserDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// First modification: Remove the Link to applications around line 4038-4042
const linkPattern = /<Link\s+to="\/applications"[\s\S]*?<\/Link>/;
content = content.replace(linkPattern, '');

// Second modification: Remove the button that navigates to applications around line 4290-4298
const buttonPattern = /<li>\s*<button\s+onClick={\(\) => navigate\('\/applications'\)}[\s\S]*?<\/li>/;
content = content.replace(buttonPattern, '');

fs.writeFileSync(filePath, content);
console.log('Successfully removed My Applications links from UserDashboard.jsx'); 