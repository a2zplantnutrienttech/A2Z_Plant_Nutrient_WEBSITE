const fs = require('fs');
const files = fs.readdirSync('/app/frontend/public/logos');
console.log(files.filter(f => f.endsWith('.png') || f.endsWith('.jpg')).join(', '));
