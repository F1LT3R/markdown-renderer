const fs = require('fs')
const Promise = require('bluebird')

const parser = {}

parser.syntaxRenderers = {
	h1: line => {
		let start = 1

		if (line[1] === ' ') {
			start = 2
		}

		const content = line.substr(start)
		const rendered = `<h1>${content}</h1>`
		return rendered
	},

	h2: line => {
		let start = 1

		if (line[2] === ' ') {
			start = 3
		}

		const content = line.substr(start)
		const rendered = `<h2>${content}</h2>`
		return rendered
	},

	h3: line => {
		let start = 1

		if (line[2] === ' ') {
			start = 3
		}

		const content = line.substr(start)
		const rendered = `<h2>${content}</h2>`
		return rendered
	},

	html: line => line,

	p: line => `<p>${line}</p>`
}

parser.syntaxChecks = {
	h1: line => {
		return (line[0] === '#') &&
			(line[1] !== '#')
	},

	h2: line => {
		return (line.substr(0, 2) === '##') &&
			(line[2] !== '#')
	},

	h3: line => {
		return (line.substr(0, 3) === '###') &&
			(line[3] !== '#')
	},

	h4: line => {
		return (line.substr(0, 4) === '####') &&
			(line[4] !== '#')
	},

	h5: line => {
		return (line.substr(0, 5) === '#####') &&
			(line[5] !== '#')
	},

	h6: line => {
		return (line.substr(0, 6) === '######') &&
			(line[6] !== '#')
	},

	html: line => {
		return (line.substr(0, 1) === '<') &&
			(line[1] !== ' ')
	},

	p: line => {
		return (line.substr(0, 1) !== '<')
	}
}

parser.checkSyntax = line => {
	let type = null

	Reflect.ownKeys(parser.syntaxChecks).some(name => {
		const checker = parser.syntaxChecks[name]
		const foundType = checker(line)

		if (foundType) {
			type = name
			// Exit some-loop
			return true
		}

		// Continue some-loop
		return null
	})

	return type
}

parser.loadFile = uri => new Promise((resolve, reject) => {
	fs.readFile(uri, 'utf8', (err, data) => {
		if (err) {
			return reject(err)
		}

		resolve(data)
	})
})

parser.parse = content => {
	const lines = content.split('\n').map(line => {
		line = line.trim()
		const type = parser.checkSyntax(line)
		const renderer = parser.syntaxRenderers[type]
		const rendered = renderer(line)
		return rendered
	})

	const html = lines.join('\n')
	return html
}

module.exports = parser
