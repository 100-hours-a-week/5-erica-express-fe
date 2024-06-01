import { changeDate } from './date.js'

const wrapper = document.querySelector('.wrapperTitle')

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
    <div class="boardWriter">
        <img
          alt="profile imge"
          src=${post.profileImage}
          style="width: 30px; height: 30px; object-fit: cover"
          class="writerImage"
        />
        <p class="writerName">📣 ${post.nickname}</p>님의 스피치
      </div>
    <div class="board">
      <div class="boardTitle">${postTitle}</div>
      <div class="boardInnerContent">${post.content.slice(0, 300)} ...</div>
      <div class="boardContent">
        <div class="action">
          <div class="comment">댓글 ${post.comment_count}</div>
          <div class="view">조회수 ${postView}</div>
        </div>
        <div class="date">${date}</div>
      </div>
    </div>
    `

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
			wrapper.innerHTML = '전체'
			responseData.data.forEach(post => {
				createPosts(post)
			})
			return
		case 401:
		case 403:
			alert('로그인 하십시오.')
			location.href = '/'
			return
		default:
			alert('게시물이 없습니다')
	}
})()
;(async () => {
	const userImage = document.querySelector('.userImage')

	const response = await fetch(`${backHost}/api/users/user`, {
		headers,
		credentials: 'include'
	})
	const responseData = await response.json()

	switch (responseData.status) {
		case 200:
			userImage.src = responseData.data.profileImage
			return
		case 401:
		case 403:
			alert('로그인 하십시오.')
			location.href = '/'
			return
		default:
			alert('게시물이 없습니다')
	}
})()

const topWriteButton = document.querySelector('.writeButton')
topWriteButton.addEventListener('click', () => {
	location.href = '/board/write'
})

document.querySelector('.coding').addEventListener('click', async () => {
	document.querySelector('.wrapper').innerHTML = ''

	const response = await fetch(`${backHost}/api/posts/coding`, {
		headers,
		credentials: 'include'
	})
	const responseData = await response.json()

	switch (responseData.status) {
		case 200:
			wrapper.innerHTML = '개발'
			responseData.data.forEach(post => {
				createPosts(post)
			})
			return
		case 401:
		case 403:
			alert('로그인 하십시오.')
			location.href = '/'
			return
		default:
			alert('게시물이 없습니다')
	}
})

document.querySelector('.other').addEventListener('click', async () => {
	document.querySelector('.wrapper').innerHTML = ''

	const response = await fetch(`${backHost}/api/posts/other`, {
		headers,
		credentials: 'include'
	})
	const responseData = await response.json()

	switch (responseData.status) {
		case 200:
			wrapper.innerHTML = '고민'
			responseData.data.forEach(post => {
				createPosts(post)
			})
			return
		case 401:
		case 403:
			alert('로그인 하십시오.')
			location.href = '/'
			return
		default:
			alert('게시물이 없습니다')
	}
})

document.querySelector('.all').addEventListener('click', async () => {
	const response = await fetch(`${backHost}/api/posts`, {
		headers,
		credentials: 'include'
	})
	const responseData = await response.json()

	switch (responseData.status) {
		case 200:
			wrapper.innerHTML = '전체'
			responseData.data.forEach(post => {
				createPosts(post)
			})
			return
		case 401:
		case 403:
			alert('로그인 하십시오.')
			location.href = '/'
			return
		default:
			alert('게시물이 없습니다')
	}
})
;(async () => {
	const response = await fetch(`${backHost}/api/posts/top10`, {
		headers,
		credentials: 'include'
	})
	const responseData = await response.json()
	createTopPosts(responseData.data)
})()

const createTopPosts = data => {
	data.forEach((post, index) => {
		const topPostContainer = document.createElement('a')
		topPostContainer.className = 'topPost'
		topPostContainer.href = `/public/board/post.html?postId=${post.postId}`
		topPostContainer.innerHTML = `
          <div class="topPostTitle">
        ${index === 0 ? '1️⃣' : index === 1 ? '2️⃣' : index === 2 ? '3️⃣' : '🌱'} ${post.title}
      </div>
    `
		document.querySelector('.top10wrapper').appendChild(topPostContainer)
	})
}
