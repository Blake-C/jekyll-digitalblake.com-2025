document.querySelectorAll('.entry-content table').forEach(table => {
	const wrapper = document.createElement('div')
	wrapper.className = 'table-wrapper'
	table.parentNode.insertBefore(wrapper, table)
	wrapper.appendChild(table)
})
