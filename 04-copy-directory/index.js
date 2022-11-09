const fs = require('fs');
const { readdir, mkdir, stat } = require('fs/promises');
const path = require('path');

const currentPath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

async function copyFiles() {
	const files = await readdir(currentPath, (err) => {
		if (err) throw err;
	});

	for (const file of files) {
		const filePath = path.join(currentPath, file);

		fs.copyFile(filePath, path.join(destinationPath, file), (err) => {
			if (err) throw err;
		});
	}
}

async function clearFolder() {
	const files = await readdir(destinationPath, (err) => {
		if (err) throw err;
	});

	for (const file of files) {
		const filePath = path.join(destinationPath, file);

		fs.unlink(filePath, (err) => {
			if (err) throw err;
		});
	}
}

stat(destinationPath)
	.then(() => {
		clearFolder();
	})
	.catch(() => {
		mkdir(destinationPath, { recursive: true });
	})
	.finally(() => {
		copyFiles();
	});
