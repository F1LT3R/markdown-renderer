import path from 'path'
import test from 'ava'

import parser from './parser'

test('loadFile: throws non-existent file', async t => {
	await t.throws(parser.loadFile('non-existent.md'))
})

test('loadFile: loads file contents', async t => {
	const filepath = path.join(__dirname, 'mock', 'heading-1.md')
	const contents = await parser.loadFile(filepath)
	t.is(contents, '# Heading 1')
})

test('parse: trims leading whitespace', t => {
	const html = parser.parse('   # heading 1\n   ## heading 2')
	t.is(html, '<h1>heading 1</h1>\n<h2>heading 2</h2>')
})

test('parse: should render mixed markdown and html', t => {
	const html = parser.parse('# Heading 1\n<div>This is not markdown.</div>\n## Heading 2')
	t.is(html, '<h1>Heading 1</h1>\n<div>This is not markdown.</div>\n<h2>Heading 2</h2>')
})

test('parse: lines w/o leading html or md chars are <p>\'s', t => {
	const html = parser.parse('# Heading 1\nThis is a paragraph.\n## Heading 2')
	t.is(html, '<h1>Heading 1</h1>\n<p>This is a paragraph.</p>\n<h2>Heading 2</h2>')
})
