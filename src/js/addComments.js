const commentRegisterButton = document.querySelector('.writeButton')
const commentInput = document.getElementById('commentInput')
const userId = sessionStorage.getItem('userId')
const urlPostId = Number(window.location.search.split('=')[1])

commentInput.addEventListener('input', () => {
	const comment = commentInput.value.trim()

	if (comment) {
		commentRegisterButton.style.backgroundColor = '#70a7f9'
		commentRegisterButton.style.color = '#ffffff'
	} else {
		commentRegisterButton.style.backgroundColor = ''
		commentRegisterButton.style.color = ''
	}
})

commentRegisterButton.addEventListener('click', onClickAddFunction)

async function onClickAddFunction() {
	if (!commentInput.value) {
		return
	}

	commentRegisterButton.disabled = true

	const response = await fetch(`${backHost}/api/posts/${urlPostId}/comments`, {
		headers,
		credentials: 'include',
		method: 'POST',
		body: JSON.stringify({
			postId: urlPostId,
			userId,
			comment: commentInput.value
		})
	})

	const responseData = await response.json()

	switch (responseData?.status) {
		case 201:
			location.reload()
			alert('댓글이 등록됐습니다.')
			commentRegisterButton.disabled = false
			return
		default:
			alert('댓글 작성 실패')
			commentRegisterButton.disabled = false
			return
	}
}
