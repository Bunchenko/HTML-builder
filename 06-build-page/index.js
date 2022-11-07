const { readdir, mkdir, readFile } = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function createProject() {
	const cssFilesPaths = await getPaths('.css', 'styles');
	const htmlFilesPaths = await getPaths('.html', 'components');

	await createNestedFolder('project-dist');
	mergeFiles(cssFilesPaths, 'style.css');
	createHTML(htmlFilesPaths);
	copyFilesRecursively('project-dist', 'assets');
}

async function getComponentsContent(htmlFilesPaths) {
	const components = {};

	for (const filePath of htmlFilesPaths) {
		const componentName = filePath.slice(filePath.lastIndexOf('\\') + 1, filePath.lastIndexOf('.'));
		components[componentName] = await readFile(filePath, 'utf-8');
	}

	return components;
}

async function createHTML(htmlFilesPaths) {
	const writeStream = createWritableStream('index.html');
	const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
	const components = await getComponentsContent(htmlFilesPaths);

	readStream.on('data', (chunk) => {
		for (const component in components) {
			chunk = chunk.replace(`{{${component}}}`, components[component]);
		}
		writeStream.write(chunk);
	});
}

async function copyFilesRecursively(...destinationFolders) {
	const folders = destinationFolders.slice(1);
	const assetsPath = path.join(__dirname, ...folders);
	const destinationPath = path.join(__dirname, ...destinationFolders);

	const files = await readdir(assetsPath, { withFileTypes: true });

	for (const file of files) {
		if (file.isDirectory()) {
			await createNestedFolder(...destinationFolders, file.name);
			copyFilesRecursively(...destinationFolders, file.name);
			continue;
		}

		const filePath = path.join(assetsPath, file.name);
		fs.copyFile(filePath, path.join(destinationPath, file.name), (err) => {
			if (err) throw err;
		});
	}
}

async function getPaths(extension, ...folders) {
	const filesPath = path.join(__dirname, ...folders);
	const files = await readdir(filesPath, { withFileTypes: true });
	const filesPaths = getFilesPaths(files, extension, filesPath);

	return filesPaths;
}

function getFilesPaths(files, extension, folderPath) {
	const filesPaths = files
		.filter((dirent) => !dirent.isDirectory())
		.map((dirent) => dirent.name)
		.filter((fileName) => path.extname(fileName) === extension)
		.map((element) => path.join(folderPath, element));

	return filesPaths;
}

async function createNestedFolder(...folderPath) {
	await mkdir(path.join(__dirname, ...folderPath), { recursive: true });
}

function createWritableStream(fileName, ...folders) {
	const destinationPath = path.join(__dirname, 'project-dist', ...folders, fileName);
	return fs.createWriteStream(destinationPath, 'utf-8');
}

function mergeFiles(filePathsArr, destinationFile) {
	const writeStream = createWritableStream(destinationFile);

	for (const filePath of filePathsArr) {
		const readStream = fs.createReadStream(filePath, 'utf-8');

		readStream.on('data', (chunk) => {
			writeStream.write(chunk, (err) => {
				if (err) throw err;
			});
			writeStream.write('\n');
		});
	}
}

createProject();
