/** @type {import('tailwindcss').Config} */
tailwind.config = {
	content: ['./**/*.{html,js,css}'],
	theme: {
		fontSize: {
			sm: '24px',
			base: '28px',
			xl: '32px',
			'2xl': '62px',
			'3xl': '64px',
			'4xl': '86px',
		},
		padding: {
			'82px': '82px',
			'41px': '41px',
			'62px': '62px',
		},
		extend: {
			container: {
				padding: '20px',
				center: true,
				maxWidth: {
					1660: '1660px',
				},
			},
			colors: {
				white: '#FFFFFF',
				lightWite: '#94a3b8',
				darkBlue: '#1B2E4F',
				blue: '#4FB4E5',
				green: '#4AE981',
			},
			maxWidth: {
				905: '905px',
			},
			width: {
				488: '488px',
				1920: '1920',
			},
			margin: {
				'87px': '87px',
				'14px': '14px',
				'23px': '23px',
				'82px': '82px',
				'317px': '317px',
			},
			gap: {
				'80px': '80px',
			},
		},
	},
	plugins: [],
}
