const logInButton = document.querySelector(".logInButton");
const helperText = document.querySelector(".helperText");
const loginForm = document.querySelector(".logInContent");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");

//이메일 유효성 검사
const checkEmailValidation = (email) => {
  //이메일이 없을 시
  //이메일 형식이 너무 짧은 경우
  //이메일 형식 안맞을 시
  const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isNotCorrectEmail =
    !email || !emailForm.test(email) || email.length < 5 ? true : false;

  if (isNotCorrectEmail) {
    if (!email) {
      console.log("이메일 없음");
    } else if (!emailForm.test(email)) {
      console.log("이메일 형식 x");
    } else {
      console.log("너무 짧음");
    }
    helperText.innerHTML =
      "* 올바른 이메일 주소 형식을 입력해주세요. \n (예: example@example.com)";
    return false;
  }
  helperText.innerHTML = "";
  return true;
};

loginEmail.addEventListener("change", () => {
  checkEmailValidation(loginEmail.value);
});

logInButton.addEventListener("click", async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const isEmailValid = checkEmailValidation(email);

  if (!isEmailValid) {
    return;
  }

  logInButton.disabled = true;

  const response = await fetch(`${backHost}/api/users/login`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const responseData = await response.json();

  //응답 상태에 따른 분기
  switch (responseData.status) {
    case 200:
      logInButton.style.backgroundColor = "#7f6aee";
      sessionStorage.setItem("userId", responseData.data.userId);
      helperText.innerHTML = "";
      setTimeout(() => {
        location.href = "/board";
      }, 3000);
      return;
    default:
      alert("로그인 실패");
      logInButton.disabled = false;
      return;
  }
});
