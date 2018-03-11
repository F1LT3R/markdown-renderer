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
	}

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
	}
}

parser.checkSyntax = line => {
	let type = null

	Reflect.ownKeys(parser.syntaxChecks).some(name => {
		const checker = parser.syntaxChecks[name]
		const foundType = checker(line)

		if (foundType) {
			type = name
			return true
		}

		return false
	})

	return type
}

parser.evaluate = lines => {
	if (!Array.isArray(lines)) {
		throw new TypeError('No lines: string passed to evaluate()')
	}

	const evaluated = []

	lines.forEach(line => {
		const type = parser.checkSyntax(line)
		evaluated.push(type)
	})

	return evaluated
}

parser.render = (evaluated, lines) => {
	const renderedLines = []

	evaluated.forEach((type, index) => {
		// Remove leading whitespace
		const line = lines[index]

		if (!Reflect.has(parser.syntaxRenderers, type)) {
			renderedLines.push(line)
			return
		}

		const renderer = parser.syntaxRenderers[type]

		if (typeof renderer === 'function') {
			const renderedLine = renderer(line)
			renderedLines.push(renderedLine)
		}
	})

	const renderedContent = renderedLines.join('\n')

	return renderedContent
}

parser.splitLines = content => content.split('\n')
	.map(line => line.trim())

parser.loadFile = uri => new Promise((resolve, reject) => {
	fs.readFile(uri, 'utf8', (err, data) => {
		if (err) {
			return reject(err)
		}

		resolve(data)
	})
})

parser.parse = content => {
	const lines = parser.splitLines(content)
	const types = parser.evaluate(lines)
	const rendered = parser.render(types, lines)
	return rendered
}

module.exports = parser
