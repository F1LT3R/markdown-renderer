const fs = require('fs')
const path = require('path')
const markdown = require('markdown').markdown

const files = fs.readdirSync('./input')

files.forEach(file => {
	const ext = path.parse(file).ext

	if (ext === '.md') {
		fileContents = String(fs.readFileSync('./input/' + file))
		const html = markdown.toHTML(fileContents)
		const name = path.parse(file).name
		fs.writeFileSync('./output/' + name + '.html', html)
	}
})