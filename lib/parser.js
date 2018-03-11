const fs = require('fs')
const Promise = require('bluebird')

const parser = {}

parser.syntaxRenderers = {
	h1: line => {
		const content = line.substr(1).trim()
		return `<h1>${content}</h1>`
	},

	h2: line => {
		const content = line.substr(2).trim()
		return `<h2>${content}</h2>`
	},

	h3: line => {
		const content = line.substr(3).trim()
		return `<h3>${content}</h3>`
	},

	h4: line => {
			const content = line.substr(4).trim()
		return `<h4>${content}</h4>`
	},

	h5: line => {
		const content = line.substr(5).trim()
		return `<h5>${content}</h5>`
	},

	h6: line => {
		const content = line.substr(6).trim()
		return `<h6>${content}</h6>`
	},

	html: line => line,

	p: line => `<p>${line}</p>`
}

parser.syntaxChecks = {
	h1: line => {
		return line.substr(0, 2) === '# '
	},

	h2: line => {
		return line.substr(0, 3) === '## '
	},

	h3: line => {
		return line.substr(0, 4) === '### '
	},

	h4: line => {
		return line.substr(0, 5) === '#### '
	},

	h5: line => {
		return line.substr(0, 6) === '##### '
	},

	h6: line => {
		return line.substr(0, 7) === '###### '
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
