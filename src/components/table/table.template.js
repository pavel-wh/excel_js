// Helper
const CHARS = {
	A: 65,
	Z: 90,
}
const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 24

// Pure functions
function createRow(content, index = '', state) {
	const resizer = index ? '<div class="excel__row-resize" data-resize="row"></div>' : ''
	const height = getHeight(state, index - 1)
	return `
    <div class="excel__row" data-type="resizable" ${
			index ? 'data-row="' + (index - 1) + '"' : ''
		} style="height: ${height}">
      <div class="excel__info">
        ${index}
        ${resizer}
      </div>
      <div class="excel__data">${content}</div>
    </div>
  `
}

function createColumn(col, index, width) {
	return `
    <div class="excel__column" data-type="resizable" data-col="${index}" style="width: ${width}">
      ${col}
      <div class="excel__column-resize" data-resize="col"></div>
    </div>`
}

function createCell(state, row) {
	return function (_, col) {
		const width = getWidth(state, col)
		return `<div class="excel__cell" contenteditable data-id="${row}:${col}" data-col="${col}" style="width: ${width}"></div>`
	}
}

function toChar(index) {
	return String.fromCharCode(CHARS.A + index)
}

function getWidth(state, index) {
	return (state[index] || DEFAULT_WIDTH) + 'px'
}

function getHeight(state, index) {
	return (state[index] || DEFAULT_HEIGHT) + 'px'
}

export function createTable(rowsCount = 26, state = {}) {
	const colsCount = CHARS.Z - CHARS.A + 1
	const rows = []

	const cols = new Array(colsCount)
		.fill('')
		.map((el, index) => {
			const width = getWidth(state.colState, index)
			return createColumn(toChar(index), index, width)
		})
		.join('')
	rows.push(createRow(cols, '', {}))

	for (let row = 0; row < rowsCount; row++) {
		const cells = new Array(colsCount).fill('').map(createCell(state.colState, row)).join('')
		rows.push(createRow(cells, row + 1, state.rowState))
	}

	return rows.join('')
}
