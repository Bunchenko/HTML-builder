const fs = require('fs');
const { readdir, mkdir } = require('fs/promises');
const path = require('path');

const currentPath = path.join(__dirname, 'files');

async function copyFiles() {
	const files = await readdir(currentPath, (err) => {
		if (err) throw err;
	});

	for (const file of files) {
		const filePath = path.join(currentPath, file);

		fs.copyFile(filePath, path.join(__dirname, 'files-copy', file), (err) => {
			if (err) throw err;
		});
	}
}

mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

copyFiles();
