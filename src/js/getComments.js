import { enableScroll, disableScroll, getScrollPosition } from './scroll.js'
import { changeDate } from './date.js'

const commentModalContainer = document.querySelector('.commentModalContainer')
const writeButton = document.querySelector('.writeButton')
const updateButton = document.querySelector('.updateButton')
const urlPostId = Number(window.location.search.split('=')[1])
const userId = Number(sessionStorage.getItem('userId'))
const commentInput = document.getElementById('commentInput')

let targetCommentId = null

const readComments = comment => {
	const commentContainer = document.createElement('div')

	const date = changeDate(comment.created_at)

	commentContainer.className = 'comment'
	commentContainer.innerHTML = `
    <div class="commentHeader">
      <div class="commentWriter">
        <input type="hidden" id="commentId" value=${comment.commentId} />
        <img src="${comment.profileImage}" alt="profile image" class="commentWriterImage"></img>
        <div class="commentWriterName">${comment.nickname}</div>
        <div class="commentWriterDate">${date}</div>
      </div>
      <div class="commentButton">
        <button class="commentUpdate">✏️</button>
        <button class="commentDelete">🗑️</button>
      </div>
    </div>
    <div class="commentBody">${comment.comment}</div>
  `

	document.querySelector('.commentList').appendChild(commentContainer)
}

;(async () => {
	const response = await fetch(`${backHost}/api/posts/${urlPostId}/comments`, {
		credentials: 'include',
		headers
	})

	const responseData = await response.json()

	switch (responseData?.status) {
		case 200:
			responseData.data.forEach(comment => {
				readComments(comment)
			})
			break
		default:
			return
	}

	const commentList = document.querySelectorAll('.comment')

	//각각 이벤트리스너 붙여두기
	commentList.forEach(comment => {
		const commentDelete = comment.querySelector('.commentDelete')
		const commentUpdate = comment.querySelector('.commentUpdate')

		//삭제 버튼 클릭 이벤트리스너
		commentDelete.addEventListener('click', async event => {
			targetCommentId = Number(event.target.parentElement.parentElement.querySelector("input[type='hidden']").value)

			const checkData = await fetch(`${backHost}/api/posts/${urlPostId}/comments/checkOwner`, {
				headers,
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify({ userId, commentId: targetCommentId })
			})

			const checkResponseData = await checkData.json()

			if (checkResponseData.status === 403) {
				alert('본인이 작성한 댓글이 아닙니다.')
				return
			}

			const modalPositionTop = getScrollPosition().scrollPosition
			commentModalContainer.style.display = 'flex'
			commentModalContainer.style.top = `${modalPositionTop}px`
			disableScroll()
		})

		//수정 버튼 클릭 이벤트 리스너
		commentUpdate.addEventListener('click', async event => {
			//수정할 댓글 노드
			const commentWrapper = event.target.parentElement.parentElement.parentElement

			//수정할 댓글 id
			targetCommentId = Number(commentWrapper.querySelector("input[type='hidden']").value)

			const checkData = await fetch(`${backHost}/api/posts/${urlPostId}/comments/checkOwner`, {
				headers,
				credentials: 'include',
				method: 'POST',
				body: JSON.stringify({ userId, commentId: targetCommentId })
			})

			const checkResponseData = await checkData.json()

			if (checkResponseData.status === 403) {
				alert('본인이 작성한 댓글이 아닙니다.')
				return
			}

			//댓글 등록 버튼 숨기기 및 댓글 수정 버튼 보이기
			writeButton.style.display = 'none'
			updateButton.style.display = 'block'

			//댓글 작성란을 댓글 수정란으로 변경
			document.getElementById('commentInput').value = commentWrapper.querySelector('.commentBody').innerHTML
		})

		commentInput.addEventListener('input', () => {
			const comment = commentInput.value.trim()

			if (comment) {
				updateButton.style.backgroundColor = '#5197FF'
				updateButton.style.color = '#ffffff'
			} else {
				updateButton.style.backgroundColor = ''
				updateButton.style.color = ''
			}
		})
	})
})()

//수정 확인 버튼 클릭 이벤트 리스너
updateButton.addEventListener('click', async () => {
	const updateText = document.getElementById('commentInput').value
	const response = await fetch(`${backHost}/api/posts/${urlPostId}/comments/${targetCommentId}`, {
		credentials: 'include',
		headers,
		method: 'PATCH',
		body: JSON.stringify({ comment: updateText })
	})

	const responseData = await response.json()

	switch (responseData?.status) {
		case 200:
			alert('댓글 수정 성공')
			break
		default:
			alert('댓글 수정 실패')
			break
	}

	location.reload()
	targetCommentId = null
})

//댓글 삭제 버튼 확인
document.querySelector('.commentDeleteModal .submitButton').addEventListener('click', async () => {
	const response = await fetch(`${backHost}/api/posts/${urlPostId}/comments/${targetCommentId}`, {
		headers,
		credentials: 'include',
		method: 'DELETE'
	})
	const responseData = await response.json()

	switch (responseData?.status) {
		case 200:
			alert('댓글이 삭제되었습니다.')
			location.reload()
			break
		default:
			alert('삭제 실패')
			break
	}

	enableScroll()
	commentModalContainer.style.display = 'none'
})

//댓글 수정 -> 취소
document.querySelector('.commentDeleteModal .cancelButton').addEventListener('click', () => {
	targetCommentId = null
	commentModalContainer.style.display = 'none'
	enableScroll()
})
