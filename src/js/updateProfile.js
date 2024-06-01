import { enableScroll, disableScroll, getScrollPosition } from './scroll.js'

const userId = sessionStorage.getItem('userId')
const emailInput = document.getElementById('emailInput')
const nicknameInput = document.getElementById('nicknameInput')
const profileImageInput = document.getElementById('imageInput')
const profileImageShow = document.querySelector('.imageShow')
const updateButton = document.querySelector('.updateButton')
const nicknameText = document.querySelector('.helperText')

const reader = new FileReader()

;(async () => {
	const response = await fetch(`${backHost}/api/users/user`, {
		headers,
		credentials: 'include'
	})
	const userData = await response.json()
	switch (userData.status) {
		case 200:
			emailInput.innerHTML = userData.data.email
			nicknameInput.value = userData.data.nickname
			profileImageShow.src = userData.data.profileImage
			//TODO: 실제 이미지 데이터 값 넣어야함
			profileImageShow.files = userData.data.profileImage
			break
		default:
			alert('등록되지 않는 유저입니다.')
			location.replace = '/boards'
			break
	}

	updateButton.addEventListener('click', async () => {
		const isEmpty = !nicknameInput.value
		if (isEmpty) {
			nicknameText.innerHTML = '* 수정할 닉네임을 입력해주세요.'
			return
		}

		if (nicknameInput.value.trim().length >= 11) {
			nicknameText.innerHTML = '* 닉네임은 최대 10자 까지 작성 가능합니다.'
			return
		}

		//닉네임 중복 검사 in 서버
		const response = await fetch(`${backHost}/api/users/nickname/${nicknameInput.value}`, {
			headers,
			credentials: 'include',
			method: 'POST',
			body: JSON.stringify({
				userId
			})
		})

		const responseData = await response.json()

		switch (responseData.status) {
			case 400:
				nicknameText.innerHTML = '* 중복된 닉네임입니다.'
				return
			case 200:
				break
		}

		const updateResponse = await fetch(`${backHost}/api/users/user/profile`, {
			headers,
			credentials: 'include',
			method: 'PATCH',
			//TODO: postimage url 다시 생성
			body: JSON.stringify({
				nickname: nicknameInput.value,
				profile_image: profileImageShow.src
			})
		})

		const updateData = await updateResponse.json()

		switch (updateData.status) {
			case 201:
				alert('수정 완료')
				location.href = '/board'
				return
			default:
				alert('수정 실패')
				return
		}
	})
})()

const deleteButton = document.querySelector('.deleteButton')
const deleteModal = document.querySelector('.modalContainer')

deleteButton.addEventListener('click', () => {
	const modalPositionTop = getScrollPosition().scrollPosition
	deleteModal.style.display = 'flex'
	deleteModal.style.top = `${modalPositionTop}px`
	disableScroll()
})

profileImageInput.addEventListener('change', event => {
	reader.onload = data => {
		profileImageShow.src = data.target.result
	}
	reader.readAsDataURL(event.target.files[0])
})

document.querySelector('.memberDelete .cancelButton').addEventListener('click', () => {
	deleteModal.style.display = 'none'
	enableScroll()
})

document.querySelector('.memberDelete .submitButton').addEventListener('click', async () => {
	deleteModal.style.display = 'none'
	enableScroll()
	const deleteResponse = await fetch(`${backHost}/api/users/user`, {
		headers,
		credentials: 'include',
		method: 'DELETE'
	})
	const deleteData = await deleteResponse.json()
	switch (deleteData.status) {
		case 200:
			alert('계정이 삭제되었습니다.')
			location.replace = '/'
			return
		default:
			alert('계정삭제 실패')
	}
})
