const profileImage = document.querySelector('.profileImage')

;(async () => {
	const currentUrl = location.pathname

	const showProfile = currentUrl !== '/' && currentUrl !== '/index.html' && currentUrl !== '/signUp'
	const showWriteButton = currentUrl !== '/board/write' && showProfile

	const response = await fetch(`${backHost}/api/users/user`, {
		headers,
		credentials: 'include'
	})

	const responseData = await response.json()

	if (showProfile && (!responseData.data || responseData.data.length === 0)) {
		location.replace = '/'
		return
	}

	const navbar = document.querySelector('.navbar')

	const profileHtml = showProfile
		? `
      <div class="userSetting">
        <img
          alt="profile image"
          class="profileImage"
          style="object-fit: cover"
          src="${responseData ? responseData.data.profileImage : '/src/images/profile_img.webp'}"
        />
        <div class="settingList">
          <a href="/user/update" class="profileUpdate setting">
            회원정보수정
          </a>
          <a href="/user/password" class="passwordUpdate setting">
            비밀번호수정
          </a>
          <div class="logOut setting">
            로그아웃
          </div>
        </div>
      </div>
    `
		: ''

	const writeButton = showWriteButton
		? `
    <div class="writeBtnNav">
      <img class="plus" src="/src/images/plus.png" />
      새 스피치
    </div>
  `
		: ''

	navbar.innerHTML = `
    <div class="navbarContainer">
      <img alt="logo" class="logo" src="/src/images/logo.png" />
      <div class="right">
      ${writeButton}
      ${profileHtml}
      </div>
    </div>
  `

	const logo = document.querySelector('.logo')
	logo?.addEventListener('click', () => {
		if (showProfile) location.href = '/board'
		else location.href = '/'
	})

	const writePost = document.querySelector('.writeBtnNav')
	writePost?.addEventListener('click', () => {
		console.log('클릭')
		location.href = '/board/write'
	})

	const logoutButton = document.querySelector('.logOut')

	logoutButton?.addEventListener('click', async () => {
		const response = await fetch(`${backHost}/api/users/logOut`, {
			headers,
			method: 'DELETE',
			credentials: 'include'
		})

		if (response?.status === 200) {
			alert('로그아웃 되었습니다')
			location.href = '/'
		}
	})
})()
