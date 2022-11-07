const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function createBundle() {
	const folderPath = path.join(__dirname, 'styles');
	const files = await readdir(folderPath, { withFileTypes: true });

	const cssFilesPaths = files
		.filter((dirent) => !dirent.isDirectory())
		.map((dirent) => dirent.name)
		.filter((fileName) => path.extname(fileName) === '.css')
		.map((element) => path.join(folderPath, element));

	mergeFiles(cssFilesPaths);
}

function mergeFiles(filePathsArr) {
	const destinationPath = path.join(__dirname, 'project-dist', 'bundle.css');
	const writeStream = fs.createWriteStream(destinationPath, 'utf-8');

	for (const filePath of filePathsArr) {
		const readStream = fs.createReadStream(filePath, 'utf-8');

		readStream.on('data', (chunk) => {
			writeStream.write(chunk, (err) => {
				if (err) throw err;
			});
		});

		readStream.off('data', (chunk) => {
			writeStream.write(chunk, (err) => {
				if (err) throw err;
			});
		});
	}
}

createBundle();
