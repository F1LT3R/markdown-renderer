import path from 'path'
import test from 'ava'

import parser from './parser'

test('loadFile(): should fail to load non-existent file', async t => {
	await t.throws(parser.loadFile('non-existent.md'))
})

test('loadFile(): should load existent file and return contents', async t => {
	const filepath = path.join(__dirname, 'mock', 'heading-1.md')
	const contents = await parser.loadFile(filepath)
	t.is(contents, '# Heading 1')
})

test('splitLines(): should split multiple lines to array', t => {
	const ary = parser.splitLines('# heading 1\n## heading 2')
	t.true(Array.isArray(ary), true)
	t.is(ary.length, 2)
	t.is(ary[0], '# heading 1')
	t.is(ary[1], '## heading 2')
})

test('should trim leading whitespace from lines', t => {
	const ary = parser.splitLines('   # heading 1\n   ## heading 2')
	t.true(Array.isArray(ary))
	t.is(ary.length, 2)
	t.is(ary[0], '# heading 1')
	t.is(ary[1], '## heading 2')
})

test('evaluate(): should fail if evaluate recieves no lines', t => {
	const noLinesPassed = parser.evaluate
	t.throws(noLinesPassed, 'No lines: string passed to evaluate()')
})

test('evaluate(): should return evaluation object', t => {
	const lines = [
		'foo',
		'bar'
	]

	const evaluated = parser.evaluate(lines)
	t.true(Array.isArray(evaluated))
	t.is(evaluated.length, 2)
})

test('evaluate(): should return null evaluation object', t => {
	const lines = [
		'# heading 1',
		'this line has no markdown syntax'
	]

	const evaluated = parser.evaluate(lines)
	t.true(Array.isArray(evaluated))
	t.is(evaluated.length, 2)
	t.is(evaluated[0], 'h1')
	t.is(evaluated[1], null)
})

test('render(): should render # h1/2 to <h1/2>', t => {
	const lines = [
		'# Heading 1',
		'## Heading 2'
	]

	const types = [
		'h1',
		'h2'
	]

	const rendered = parser.render(types, lines)
	t.is(rendered, '<h1>Heading 1</h1>\n<h2>Heading 2</h2>')
})

test('render(): should not render html lines', t => {
	const lines = [
		'<div>this is not a markdown line</div>'
	]

	const types = [
		null
	]

	const rendered = parser.render(types, lines)
	t.is(rendered, '<div>this is not a markdown line</div>')
})

test('parse(): should render to html', t => {
	const html = parser.parse('# Heading 1\nthis line is not markdown\n## Heading 2')
	t.is(html, '<h1>Heading 1</h1>\nthis line is not markdown\n<h2>Heading 2</h2>')
})
