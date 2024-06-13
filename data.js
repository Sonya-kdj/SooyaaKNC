document.addEventListener('DOMContentLoaded', () => {
	loadDepartments()
	setupYearRange()
	fetchEvents()
})

let selectedDepartment = null
let selectedYearRange = { startYear: null, endYear: null }

function loadDepartments() {
	fetch('event.json', { method: 'GET' })
		.then(response => response.json())
		.then(data => {
			console.log(data)
			const departmentsSet = new Set()
			if (data.event && Array.isArray(data.event)) {
				data.event.forEach(event => {
					if (Array.isArray(event.sci_theme)) {
						event.sci_theme.forEach(theme => {
							departmentsSet.add(theme.Name)
						})
					}
				})

				const departmentsContainer = document.querySelector(
					'.event__departments-inner'
				)
				departmentsContainer.innerHTML = ''

				departmentsSet.forEach(department => {
					const button = document.createElement('button')
					button.className = 'department-btn hover:text-blue'
					button.textContent = department
					button.setAttribute('data-department', department)
					button.addEventListener('click', () => {
						document
							.querySelectorAll('.department-btn')
							.forEach(btn => btn.classList.remove('active'))
						button.classList.add('active')
						selectedDepartment = department
						resetYearRange()
						fetchEvents()
					})
					departmentsContainer.appendChild(button)
				})
			}
		})
}

function setupYearRange() {
	fetch('event.json', { method: 'GET' })
		.then(response => response.json())
		.then(data => {
			if (data.event && Array.isArray(data.event)) {
				const years = data.event.map(event =>
					parseInt(event.Date.split('.')[0], 10)
				)
				console.log(years)
				const minYear = Math.min(...years)
				const maxYear = Math.max(...years)

				const slider = document.getElementById('year-range-slider')
				const sliderSpan = document.getElementById('slider-span')
				const minYearElem = document.getElementById('min-year')
				const maxYearElem = document.getElementById('max-year')

				slider.min = minYear
				slider.max = maxYear
				slider.value = minYear
				sliderSpan.textContent = `${slider.value} - ${
					parseInt(slider.value) + 5
				}`
				minYearElem.textContent = minYear
				maxYearElem.textContent = maxYear

				slider.addEventListener('input', () => {
					const startYear = parseInt(slider.value)
					const endYear = startYear + 5
					sliderSpan.textContent = `${startYear} - ${endYear}`

					selectedYearRange.startYear = startYear
					selectedYearRange.endYear = endYear
					fetchEvents()
				})
			}
		})
}

function resetYearRange() {
	const slider = document.getElementById('year-range-slider')
	const sliderSpan = document.getElementById('slider-span')
	const minYearElem = document.getElementById('min-year')
	const maxYearElem = document.getElementById('max-year')

	fetch('event.json', { method: 'GET' })
		.then(response => response.json())
		.then(data => {
			if (data.event && Array.isArray(data.event)) {
				const years = data.event.map(event =>
					parseInt(event.Date.split('.')[0], 10)
				)

				const minYear = Math.min(...years)
				const maxYear = Math.max(...years)

				selectedYearRange.startYear = null
				selectedYearRange.endYear = null

				slider.min = minYear
				slider.max = maxYear
				slider.value = minYear
				sliderSpan.textContent = `${slider.value} - ${
					parseInt(slider.value) + 5
				}`
				minYearElem.textContent = minYear
				maxYearElem.textContent = maxYear
			}
		})
}

function fetchEvents() {
	fetch('event.json', { method: 'GET' })
		.then(response => response.json())
		.then(data => {
			const eventsContainer = document.getElementById('eventsContainer')
			eventsContainer.innerHTML = ''

			if (data.event && Array.isArray(data.event)) {
				const filteredEvents = data.event.filter(event => {
					const eventYear = parseInt(event.Date.split('.')[0], 10)
					const eventThemes = event.sci_theme.map(theme => theme.Name)

					return (
						(!selectedYearRange.startYear ||
							(eventYear >= selectedYearRange.startYear &&
								eventYear <= selectedYearRange.endYear)) &&
						(!selectedDepartment || eventThemes.includes(selectedDepartment))
					)
				})

				filteredEvents.forEach(event => {
					const eventElement = document.createElement('div')
					eventElement.className =
						'events__inner flex flex-col p-[80px] rounded-xl max-w-[800px] max-h-[700px] shadow-md mr-[16px]'
					eventElement.dataset.id = event.id

					const titleElement = document.createElement('a')
					titleElement.className =
						'events__title font-bold text-base pb-[29px] cursor-pointer hover:text-blue'
					titleElement.textContent = event.Name
					titleElement.href = `event.html?id=${event.id}`

					const dateElement = document.createElement('div')
					dateElement.className = 'events__date font-medium text-base pb-[21px]'

					try {
						let dateText
						if (event.Date.length === 4) {
							dateText = event.Date + ' г.'
						} else if (/^\d{4}\.\d{2}$/.test(event.Date)) {
							const [year, month] = event.Date.split('.')
							const monthNames = [
								'январь',
								'февраль',
								'март',
								'апрель',
								'май',
								'июнь',
								'июль',
								'август',
								'сентябрь',
								'октябрь',
								'ноябрь',
								'декабрь',
							]
							dateText = `${monthNames[parseInt(month, 10) - 1]} ${year} г.`
						} else {
							const date = new Date(event.Date)
							const options = { year: 'numeric', month: 'long', day: 'numeric' }
							dateText = date.toLocaleDateString('ru-RU', options)
						}
						dateElement.textContent = dateText
					} catch (error) {
						console.error(event.Date)
					}

					eventElement.appendChild(titleElement)
					if (dateElement.textContent) {
						eventElement.appendChild(dateElement)
					}

					eventElement.addEventListener('click', () => {
						window.location.href = `event.html?id=${event.id}`
					})

					eventsContainer.appendChild(eventElement)
				})
			}
		})
}
