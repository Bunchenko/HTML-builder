const { readdir, stat } = require('fs/promises');
const path = require('path');

async function getFilesInfo() {
	const folderPath = path.join(__dirname, 'secret-folder');
	const files = await readdir(folderPath, { withFileTypes: true });
	const pathsToCheck = files.map((element) => path.join(folderPath, element.name));

	for (let i = 0; i < files.length; i++) {
		if (!files[i].isDirectory()) {
			const extension = path.extname(files[i].name);
			const fileStats = await stat(pathsToCheck[i], (err, stats) => {
				if (err) console.log(err);
			});

			console.log(
				`${path.basename(pathsToCheck[i], extension)} - ${extension.slice(1)} - ${fileStats.size} b`
			);
		}
	}
}

getFilesInfo();
