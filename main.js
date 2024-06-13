const swiper = new Swiper('.mySwiper', {
	loop: true,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	autoplay: {
		delay: 5000,
		disableOnInteraction: false,
	},
})

const swiper2 = new Swiper('.mySecondSwiper', {
	slidesPerView: 3,
	direction: getDirection(),
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		1200: {
			slidesPerView: 2,
			direction: 'horizontal',
		},
	},
	on: {
		resize: function () {
			swiper2.changeDirection(getDirection())
		},
	},
})

function getDirection() {
	const windowWidth = window.innerWidth
	return windowWidth <= 480 ? 'vertical' : 'horizontal'
}

document.addEventListener('DOMContentLoaded', function () {
	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.1,
	}

	const observerCallback = (entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible')
			} else {
				entry.target.classList.remove('visible')
			}
		})
	}

	const observer = new IntersectionObserver(observerCallback, observerOptions)

	const historyItems = document.querySelectorAll('.history__inner')
	historyItems.forEach(item => observer.observe(item))
})

document.addEventListener('DOMContentLoaded', function () {
	const rangeSlider = document.getElementById('year-range-slider')
	const sliderSpan = document.getElementById('slider-span')

	rangeSlider.addEventListener('input', function () {
		const value = this.value
		sliderSpan.textContent = value
		sliderSpan.style.left = `${((value - 1943) / (2023 - 1943)) * 100}%`
		sliderSpan.classList.add('show')
	})

	rangeSlider.addEventListener('blur', function () {
		sliderSpan.classList.remove('show')
	})
})
