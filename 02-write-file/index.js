const { stdin } = process;
const rl = require('readline');
const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), 'utf-8');

const readLine = rl.createInterface(stdin, writeStream);

readLine.on('line', (data) => {
	if (data === 'exit') {
		process.exit();
	}

	writeStream.write(data);
	writeStream.write('\n');
});

readLine.on('SIGINT', () => {
	process.exit();
});

process.on('exit', () => {
	console.log('Goodbye!');
});

process.on('SIGINT', () => {
	process.exit();
});

console.log('Greetings! Please, type something.');
