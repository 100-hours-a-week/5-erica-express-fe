const updateButton = document.querySelector(".updateButton");
const form = document.querySelector(".wrapper");
const userId = sessionStorage.getItem("userId");
const passwordInput = document.getElementById("passwordInput");
const passwordCheckInput = document.getElementById("passwordCheckInput");
const passwordText = document.querySelector(".passwordText");
const passwordCheckText = document.querySelector(".passwordCheckText");

const passwordRegExp =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}$/;

let passwordValid = false;
let passwordCheckValid = false;

updateButton.addEventListener("click", async () => {
  if (!passwordValid && !passwordCheckValid) {
    return;
  }

  const password = passwordInput.value;

  const updateResponse = await fetch(
    `${backHost}/api/users/${userId}/password`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "PATCH",
      //TODO: postimage url 다시 생성
      body: JSON.stringify({
        password,
      }),
    }
  );

  switch (updateResponse.status) {
    case 201:
      document.querySelector(".helperText").style.display = "none";
      updateButton.style.backgroundColor = "#7f6aee";
      setTimeout(() => {
        alert("비밀번호가 수정되었습니다.");
        updateButton.style.backgroundColor = "";
        location.href = "/";
      }, 3000);
      return;
    default:
      alert("비밀번호 수정실패");
      return;
  }
});

passwordInput.addEventListener("input", () => {
  if (!passwordInput.value) {
    passwordText.innerHTML = "* 비밀반호를 입력해주세요. (8자 이상 20자 이하)";
  } else {
    passwordText.innerHTML = "";
  }

  if (!passwordRegExp.test(passwordInput?.value)) {
    passwordText.innerHTML =
      "* 비밀번호는 대문자, 소문자, 숫자, 특수문자가 들어가야 합니다 (8자 이상 20자 이하)";
  } else {
    passwordText.innerHTML = "";
    passwordValid = true;
  }
});

// 비밀번호 확인 유효성 검사
passwordCheckInput.addEventListener("input", () => {
  if (!passwordCheckInput.value) {
    passwordCheckText.innerHTML = "* 비밀번호를 한번 더 입력해주세요.";
  }

  if (passwordInput.value !== passwordCheckInput.value) {
    passwordText.innerHTML = "* 비밀번호 확인과 다릅니다.";
    passwordCheckText.innerHTML = "* 비밀번호와 다릅니다.";
  } else {
    passwordText.innerHTML = "";
    passwordCheckText.innerHTML = "";
    passwordCheckValid = true;
  }
});
