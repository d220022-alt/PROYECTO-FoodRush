const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../models');

fs.readdir(modelsDir, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach((file, index) => {
        if (!file.endsWith('.js') || file === 'index.js') return;

        const filePath = path.join(modelsDir, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            // Regex to match the references block:
            // references: {
            //   model: '...',
            //   key: '...'
            // }
            // Handling variations in whitespace.

            // This regex looks for "references: {" followed by anything non-greedy until "}" 
            // It's a bit naive but should work for the generated models structure.
            const regex = /,\s*references:\s*\{\s*model:\s*['"][^'"]+['"],\s*key:\s*['"][^'"]+['"]\s*\}/g;

            // Also handle the case where it might be the last item without a comma before, but usually sequelize-auto puts commas.
            // Let's try to capture the comma before optionally.

            let newData = data.replace(regex, '');

            // Fallback for no leading comma
            const regex2 = /\s*references:\s*\{\s*model:\s*['"][^'"]+['"],\s*key:\s*['"][^'"]+['"]\s*\}/g;
            newData = newData.replace(regex2, '');


            if (newData !== data) {
                fs.writeFile(filePath, newData, 'utf8', (err) => {
                    if (err) console.error(err);
                    else console.log(`Fixed ${file}`);
                });
            }
        });
    });
});
