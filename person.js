document.addEventListener('DOMContentLoaded', async () => {
	await fetchPersonData()
	const selectedPersonName = localStorage.getItem('selectedPerson')
	if (selectedPersonName) {
		const selectedPerson = personData.find(
			p =>
				`${p.F.trim()} ${p.I.trim()} ${p.O.trim()}` ===
				selectedPersonName.trim()
		)
		if (selectedPerson) {
			displayPersonInfo(selectedPerson)
		}
		localStorage.removeItem('selectedPerson')
	}
})

let persons = []
let personData = []

const api = 'https://ib.komisc.ru/vm/get.php?personAll'
const baseUrl = 'https://ib.komisc.ru'

async function fetchPersonData() {
	try {
		const response = await fetch(api, { method: 'POST' })
		const data = await response.json()
		personData = data.person.map(person => ({
			...person,
			F: person.F.trim(),
			I: person.I.trim(),
			O: person.O.trim(),
		}))
		persons = personData.map(person => `${person.F} ${person.I} ${person.O}`)
		console.log(data)
	} catch (error) {
		console.error(error)
	}
}

fetchPersonData()

const searchInput = document.getElementById('searchInput')
const suggestions = document.getElementById('suggestions')
const personFIO = document.getElementById('personFIO')
const personBday = document.getElementById('personBday')
const personDday = document.getElementById('personDday')
const personPosition = document.getElementById('personPosition')
const personDescription = document.getElementById('personDescription')
const publicationsList = document.getElementById('publicationsList')
const awardsList = document.getElementById('awardsList')
const personInner = document.querySelector('.person__inner')
const personInfoSection = document.querySelector('.person-info')

searchInput.addEventListener('input', () => {
	const query = searchInput.value.toLowerCase().trim()
	suggestions.innerHTML = ''

	if (query) {
		const regex = new RegExp(`(${query})`, 'gi')
		const filteredPersons = persons.filter(person => regex.test(person))

		const fragment = document.createDocumentFragment()
		filteredPersons.forEach(person => {
			const suggestionItem = document.createElement('li')
			suggestionItem.innerHTML = person.replace(regex, '<mark>$1</mark>')
			suggestionItem.classList.add('suggestion-item')
			suggestionItem.addEventListener('click', () => {
				searchInput.value = person
				suggestions.innerHTML = ''
				suggestions.classList.add('hidden')
				const selectedPerson = personData.find(
					p => `${p.F.trim()} ${p.I.trim()} ${p.O.trim()}` === person
				)
				if (selectedPerson) {
					displayPersonInfo(selectedPerson)
				} else {
					personInner.classList.add('hidden')
					personInfoSection.classList.add('hidden')
				}
			})
			fragment.appendChild(suggestionItem)
		})
		suggestions.appendChild(fragment)
		suggestions.classList.remove('hidden')
	} else {
		suggestions.classList.add('hidden')
		personInner.classList.add('hidden')
		personInfoSection.classList.add('hidden')
	}
})

function displayPersonInfo(person) {
	personFIO.textContent =
		person.F && person.I && person.O
			? `${person.F} ${person.I} ${person.O}`
			: ''

	if (person.dayN) {
		const formattedBday = formatDate(new Date(person.dayN))
		personBday.textContent = `Дата рождения: ${formattedBday}`
	} else {
		personBday.textContent = ''
	}

	if (person.dayD && person.dayD !== '0000-00-00') {
		const formattedDday = formatDate(new Date(person.dayD))
		personDday.textContent = `Дата смерти: ${formattedDday}`
	} else {
		personDday.textContent = ''
	}

	if (person.dol) {
		personPosition.textContent = person.dol
	} else {
		personPosition.textContent = ''
	}

	personDescription.textContent = person.comment ? person.comment : ''

	publicationsList.innerHTML = ''
	if (person.publications) {
		const fragment = document.createDocumentFragment()
		const publications = person.publications
			.split('\r\n')
			.filter(pub => pub.trim() !== '')
		publications.forEach(pub => {
			const li = document.createElement('li')
			li.textContent = pub
			li.classList.add('publications__list', 'pb-[32px]', 'list-disc')
			fragment.appendChild(li)
		})
		publicationsList.appendChild(fragment)
	}

	awardsList.innerHTML = ''
	if (person.awards) {
		const fragment = document.createDocumentFragment()
		const awards = person.awards
			.split('\r\n')
			.filter(award => award.trim() !== '')
		awards.forEach(award => {
			const li = document.createElement('li')
			li.textContent = award
			li.classList.add('awards__list', 'pb-[32px]', 'list-disc')
			fragment.appendChild(li)
		})
		awardsList.appendChild(fragment)
	}

	if (
		personFIO.textContent ||
		personBday.textContent ||
		personDday.textContent ||
		personPosition.textContent ||
		personDescription.textContent ||
		publicationsList.children.length > 0 ||
		awardsList.children.length > 0
	) {
		personInner.classList.remove('hidden')
		personInfoSection.classList.remove('hidden')
	} else {
		personInner.classList.add('hidden')
		personInfoSection.classList.add('hidden')
	}
}

function formatDate(date) {
	if (isNaN(date)) return ''
	const months = [
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря',
	]
	const day = date.getDate()
	const monthIndex = date.getMonth()
	const year = date.getFullYear()
	return `${day} ${months[monthIndex]} ${year} г.`
}
