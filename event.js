function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
	const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
	const results = regex.exec(location.search)
	return results === null
		? ''
		: decodeURIComponent(results[1].replace(/\+/g, ' '))
}

const eventId = getUrlParameter('id')
const baseUrl = 'https://ib.komisc.ru'

async function loadEventDetails(eventId) {
	try {
		const response = await fetch(`${baseUrl}/vm/get.php?event=${eventId}`, {
			method: 'GET',
		})
		const data = await response.json()

		if (data.event && data.event.length > 0) {
			const eventDetailsContainer = document.getElementById(
				'eventDetailsContainer'
			)
			const event = data.event[0]

			eventDetailsContainer.innerHTML = `
                <div class="event__inner flex justify-between items-center p-[24px] gap-6 text-darkBlue">
                    <div class="event__img w-1/3">
                        <img id="eventPhoto" class="hidden" alt="event Photo">
                    </div>
                    <div class="event__content w-2/3">
                        <div id="event" class="event__name font-bold pb-[14px] text-[34px]">${event.Name}</div>
                        <div id="eventPerson" class="event__person font-medium pb-[14px] text-[24px] max-w-[1200px]"></div>
                        <div id="event-sci-theme" class="event__theme font-medium pb-[14px] text-[24px]"></div>
                        <div id="event-sci-department" class="event__department font-medium pb-[14px] text-[24px]"></div>
                        <div id="eventDescription" class="event__description font-medium text-[21px]  pb-[14px] "><strong class="text-[24px]">Описание:</strong> ${event.Desc}</div>
                        <div id="event-tag" class="event-tag font-medium text-[21px]"></div>
                    </div>
                </div>
            `

			if (event.person && event.person.length > 0) {
				document.getElementById('eventPerson').innerHTML = `
                    <strong>Личность:</strong> ${event.person
											.map(
												person => `
                        <a href=""{
													event.id
												}" class="text-darkBlue hover:text-blue" data-name="${person.Name.trim()}">
                            ${person.Name.trim()}
                        </a>`
											)
											.join(', ')}`

				document.querySelectorAll('#eventPerson a').forEach(link => {
					link.addEventListener('click', e => {
						e.preventDefault()
						const personName = link.getAttribute('data-name')
						localStorage.setItem('selectedPerson', personName)
						window.location.href = 'person.html'
					})
				})
			}

			if (event.sci_theme && event.sci_theme.length > 0) {
				document.getElementById('event-sci-theme').innerHTML = `
                    <strong>Научная тема:</strong> ${event.sci_theme
											.map(theme => theme.Name)
											.join(', ')}`
			}

			if (event.sci_department && event.sci_department.length > 0) {
				document.getElementById('event-sci-department').innerHTML = `
                    <strong>Научный отдел:</strong> ${event.sci_department
											.map(department => department.Name)
											.join(', ')}`
			}

			if (event.tag && event.tag.length > 0) {
				document.getElementById('event-tag').innerHTML = `
                    <strong class='text-[24px]'>Тэги:</strong> ${event.tag
											.map(tag => tag.Name)
											.join(', ')}`
			}

			if (event.file && event.file.length > 0) {
				const eventPhoto = document.getElementById('eventPhoto')
				const pathWeb = event.file[0].pathWeb
				eventPhoto.src = baseUrl + pathWeb
				eventPhoto.classList.remove('hidden')
			}
		} else {
			document.getElementById('eventDetailsContainer').innerHTML =
				'<p>Событие не найдено</p>'
		}
	} catch (error) {
		console.error('Ошибка загрузки данных о событии:', error)
	}
}

// Загрузка данных о событии
loadEventDetails(eventId)
