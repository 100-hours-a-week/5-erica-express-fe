const logoutButton = document.querySelector('.logOut')
const backButton = document.querySelector('.beforeBtn')

logoutButton?.addEventListener('click', () => {
	sessionStorage.removeItem('userId')
})

backButton?.addEventListener('click', () => {
	history.back()
})

const profileImage = document.querySelector('.profileImage')(async () => {
	const currentUrl = location.pathname
	if (currentUrl === '/' || currentUrl === '/index.html' || currentUrl === '/signUp/') {
		return
	}

	const response = await fetch(`${backHost}/api/users/user`, {
		headers,
		credentials: 'include'
	})

	const responseData = await response.json()

	if (!responseData.data || responseData.data.length === 0) {
		location.replace = '/'
		return
	}

	const navbar = document.querySelector('.navbar')

	navbar.innerHTML = `
    <div class="navbarContainer">
      <button class="beforeBtn">
        <img
          src="/src/images/back.png"
          alt="backbutton image"
          class="backImage"
        />
      </button>
      <a class="navbarTitle" href="/board">아무 말 대잔치</a>
      <div class="userSetting">
        <img
          alt="profile image"
          class="profileImage"
          style="object-fit: cover"
          src="/src/images/profile_img.webp"
        />
        <div class="settingList">
          <a href="/user/update" class="profileUpdate setting">회원정보수정</a>
          <a href="/user/password" class="passwordUpdate setting">비밀번호수정</a>
          <a href="/" class="logOut setting">로그아웃</a>
        </div>
      </div>
    </div>
  `

	if (!profileImage) {
		return
	}

	profileImage.src = responseData?.data.profileImage
})()
