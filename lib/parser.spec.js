const chai = require('chai')
const parser = require('./parser')

const expect = chai.expect
chai.should()
chai.use(require('chai-as-promised'))

describe('loadFile', () => {
	it('should fail to load non-existent file', () => {
		return parser.loadFile('non-existent.md')
			.should.be.rejected
	})

	it('should load existent file and return contents', () => {
		return parser.loadFile('heading-1.md').then(contents => {
			expect(contents).to.equal('# heading 1')
		})
	})
})

describe('splitLines', () => {
	it('should split multiple lines to array', () => {
		const ary = parser.splitLines('# heading 1\n## heading 2')
		expect(ary).to.be.an('array')
		expect(ary.length).to.equal(2)
		expect(ary[0]).to.equal('# heading 1')
		expect(ary[1]).to.equal('## heading 2')
	})
})

describe('evaluate', () => {
	it('should fail if evaluate recieves no lines', () => {
		const noLinesPassed = parser.evaluate
		expect(noLinesPassed).to.throw('No lines: string passed to evaluate()')
	})

	it('should return evaluation object', () => {
		const lines = [
			'foo',
			'bar'
		]

		const evaluated = parser.evaluate(lines)
		expect(evaluated).to.be.an('array')
		expect(evaluated.length).to.equal(2)
	})

	it('should return evaluation object', () => {
		const lines = [
			'# heading 1',
			'this line has no markdown syntax'
		]

		const evaluated = parser.evaluate(lines)
		expect(evaluated).to.be.an('array')
		expect(evaluated.length).to.equal(2)
		expect(evaluated[0]).to.equal('h1')
		expect(evaluated[1]).to.equal(null)
	})
})

describe('render', () => {
	it('should render # h1/2 to <h1/2>', () => {
		const lines = [
			'# Heading 1',
			'## Heading 2'
		]

		const types = [
			'h1',
			'h2'
		]

		const rendered = parser.render(types, lines)
		expect(rendered).to.equal('<h1>Heading 1</h1>\n<h2>Heading 2</h2>')
	})

	it('should render # h1/2 to <h1/2>', () => {
		const lines = [
			'<div>this is not a markdown line</div>'
		]

		const types = [
			null
		]

		const rendered = parser.render(types, lines)
		expect(rendered).to.equal('<div>this is not a markdown line</div>')
	})
})

describe('parse', () => {
	it('should render to html', () => {
		const html = parser.parse('# Heading 1\nthis line is not markdown\n## Heading 2')
		expect(html).to.equal('<h1>Heading 1</h1>\nthis line is not markdown\n<h2>Heading 2</h2>')
	})

	it('should convert #heading to <h1> where space is omitted', () => {
		const content = '#Heading 1'
		const html = parser.parse(content)
		expect(html).to.equal('<h1>Heading 1</h1>')
	})

	it('should convert ##heading to <h2> where space is omitted', () => {
		const content = '##Heading 2'
		const html = parser.parse(content)
		expect(html).to.equal('<h2>Heading 2</h2>')
	})
})

