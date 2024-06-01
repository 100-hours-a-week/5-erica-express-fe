import { changeDate } from './date.js'

const createPosts = post => {
	let postTitle = post.title
	if (post.title.length > 26) {
		postTitle = `${post.title.slice(0, 26)} ...`
	}

	let postView = ''
	if (post.view >= 1000000) {
		postView = '100K'
	} else if (post.view >= 10000) {
		postView = '10K'
	} else if (post.view >= 1000) {
		postView = '1K'
	} else {
		postView = post.view
	}

	let postComment = ''
	if (post.comment_count >= 1000) {
		postComment = '1K'
	} else if (post.comment_count >= 10000) {
		postComment = '10K'
	} else if (post.comment_count >= 1000000) {
		postComment = '100K'
	} else {
		postComment = post.comment_count
	}

	const date = changeDate(post.created_at)

	const boardContainer = document.createElement('a')
	boardContainer.className = 'boardContainer'
	boardContainer.href = `/public/board/post.html?postId=${post.postId}`
	boardContainer.innerHTML = `
    <div class="board">
      <h2 class="boardTitle">${postTitle}</h2>
      <div class="boardContent">
        <div class="action">
          <div class="comment">댓글 ${post.comment_count}</div>
          <div class="view">조회수 ${postView}</div>
        </div>
        <div class="date">${date}</div>
      </div>
    </div>
    <hr />
    <div class="boardWriter">
      <img
        alt="profile imge"
        src=${post.profileImage}
        style="width: 30px; height: 30px; object-fit: cover"
        class="writerImage"
      />
      <p class="writerName">${post.nickname}</p>
    </div>`

	document.querySelector('.wrapper').appendChild(boardContainer)
}

;(async () => {
	const response = await fetch(`${backHost}/api/posts`, {
		headers,
		credentials: 'include'
	})
	const responseData = await response.json()

	switch (responseData.status) {
		case 200:
			responseData.data.forEach(post => {
				createPosts(post)
			})
			return
		default:
			alert('게시물이 없습니다')
		// location.replace("/board/write");
	}
})()
