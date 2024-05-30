const signUpButton = document.querySelector(".signUpButton");
const profileImageInput = document.getElementById("imageInput");
const profileImageShow = document.querySelector(".imageShow");

const emailText = document.querySelector(".emailText");
const passwordText = document.querySelector(".passwordText");
const passwordCheckText = document.querySelector(".passwordCheckText");
const nicknameText = document.querySelector(".nicknameText");
const profileImageText = document.querySelector(".profileImageText");

const email = document.getElementById("emailInput");
const password = document.getElementById("passwordInput");
const passwordCheck = document.getElementById("passwordCheckInput");
const nickname = document.getElementById("nicknameInput");

const signUpForm = document.querySelector(".signUpContainer");
const reader = new FileReader();

//프로필 이미지 유효성 검사
const checkImageValidation = (image) => {
  const isImageNotNull = image ? true : false;

  if (!isImageNotNull) {
    profileImageText.innerHTML = "* 프로필 사진을 추가해주세요.";
    return false;
  }

  profileImageText.innerHTML = "";
  return true;
};

//이메일 유효성 검사
const checkEmailValidation = async (email) => {
  //이메일이 없을 시
  if (!email) {
    emailText.innerHTML = "* 이메일을 입력해주세요.";
    return false;
  }

  //이메일 형식 안맞을 시
  const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isNotCorrectEmail =
    email && (!emailForm.test(email) || email.length < 5) ? true : false;

  if (isNotCorrectEmail) {
    emailText.innerHTML =
      "* 올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
    return false;
  }

  const isEmailDuplicate = await fetch(`${backHost}/api/users/email/${email}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "ngrok-skip-browser-warning": "69420",
    },
    method: "POST",
  }).then(async (response) => {
    const data = await response.json();
    if (data.status === 400) {
      return true;
    }
    return false;
  });

  if (isEmailDuplicate) {
    emailText.innerHTML = "*중복된 이메일 입니다.";
    return false;
  }

  emailText.innerHTML = "";
  return true;
};

//비밀번호 유효성 검사
const checkPasswordValidation = (password, passwordCheck) => {
  if (!password && !passwordCheck) {
    passwordText.innerHTML = "* 비밀번호를 입력해주세요.";
    passwordCheckText.innerHTML = "* 비밀번호를 한번 더 입력해주세요.";
  }

  //password 없을 시
  if (!password) {
    passwordText.innerHTML = "* 비밀번호를 입력해주세요.";
    return false;
  }

  if (!passwordCheck) {
    passwordCheckText.innerHTML = "* 비밀번호를 한번 더 입력해주세요.";
    return false;
  }

  //password 와 passwordCheck가 같지 않을 시
  const isPasswordNotSame = password !== passwordCheck ? true : false;

  if (isPasswordNotSame) {
    passwordText.innerHTML = "* 비밀번호가 다릅니다.";
    passwordCheckText.innerHTML = "* 비밀번호가 다릅니다.";
    return false;
  }

  //비밀번호 형식 안맞음
  const passwordRegExp =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/;
  const isNotPasswordRule = !passwordRegExp.test(password);
  if (isNotPasswordRule) {
    passwordText.innerHTML =
      "* 비밀번호는 대문자, 소문자, 숫자, 특수문자가 들어가야 합니다 (8자 이상 20자 이하)";
    return false;
  }

  passwordText.innerHTML = "";
  passwordCheckText.innerHTML = "";
  return true;
};

//닉네임 유효성 검사
const checkNicknameValidation = async (nickname) => {
  const hasNicknameSpace = nickname?.indexOf(" ") !== -1 ? true : false;

  if (!nickname) {
    nicknameText.innerHTML = "* 닉네임을 입력해주세요.";
    return false;
  }

  //닉네임에 공백이 있을 시
  if (hasNicknameSpace) {
    nicknameText.innerHTML = "* 띄어쓰기를 없애주세요";
    return false;
  }

  //닉네임이 중복일시
  const isNicknameDuplicate = await fetch(
    `${backHost}/api/users/nickname/${nickname}`,
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
      },
      method: "POST",
    }
  ).then(async (response) => {
    const data = await response.json();
    console.log(data.status);
    if (data.status === 400) {
      return true;
    }
    return false;
  });

  if (isNicknameDuplicate) {
    nicknameText.innerHTML = "* 중복된 닉네임입니다.";
    return false;
  }

  nicknameText.innerHTML = "";
  return true;
};

//회원가입 버튼 클릭 시
signUpButton.addEventListener("click", async () => {
  //유효성 검사
  const emailValue = email.value;
  const passwordValue = password.value;
  const passwordCheckValue = passwordCheck.value;
  const nicknameValue = nickname.value;
  //TODO: 이미지 실제 데이터값으로 변경
  const profileImageValue = profileImageShow.src;

  const data = JSON.stringify({
    email: emailValue,
    password: passwordValue,
    nickname: nicknameValue,
    profile_image: profileImageValue,
  });

  const isImageValid = checkImageValidation(profileImageShow.src);
  const isEmailValid = await checkEmailValidation(emailValue);
  const isPasswordValid = checkPasswordValidation(
    passwordValue,
    passwordCheckValue
  );
  const isNicknameValid = await checkNicknameValidation(nicknameValue);

  console.log(`isImageValid ${isImageValid}`);
  console.log(`isEmailValid ${isEmailValid}`);
  console.log(`isPasswordValid ${isPasswordValid}`);
  console.log(`isNicknameValid ${isNicknameValid}`);

  if (
    !isImageValid ||
    !isEmailValid ||
    !isNicknameValid ||
    !profileImageValue
  ) {
    signUpButton.style.backgroundColor = "lightgray";
    return;
  }

  signUpButton.style.backgroundColor = "#7f6aee";

  const response = await fetch(`${backHost}/api/users/signup`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "ngrok-skip-browser-warning": "69420",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: data,
  });

  const responseData = await response.json();

  //응답 상태에 따른 분기
  switch (responseData.status) {
    case 201:
      alert("회원가입 성공");
      location.href = "/";
      return;
    case 400:
      signUpButton.style.backgroundColor = "lightgray";
      helperText.style.display = "block";
      helperText.innerHTML = "이메일을 입력해주세요.";
      setTimeout(() => {
        signUpButton.style.backgroundColor = "";
      }, 1000);
      return;
    default:
      signUpButton.style.backgroundColor = "lightgray";
      alert("회원가입 실패");
      setTimeout(() => {
        signUpButton.style.backgroundColor = "";
      }, 1000);
      return;
  }
  signUpButton.style.backgroundColor = "";
});

//이미지 변경 시
profileImageInput.addEventListener("change", (event) => {
  reader.onload = (data) => {
    profileImageShow.src = data.target.result;
    profileImageShow.style.display = "block";
  };
  reader.readAsDataURL(event.target.files[0]);
});

//인풋값을 입력하다가 포커스 아웃될 때
email.addEventListener("focusout", async () => {
  const emailValue = email.value;
  await checkEmailValidation(emailValue);
});

password.addEventListener("focusout", () => {
  const passwordValue = password.value;
  const passwordCheckValue = passwordCheck.value;
  checkPasswordValidation(passwordValue, passwordCheckValue);
});

passwordCheck.addEventListener("focusout", () => {
  const passwordValue = password.value;
  const passwordCheckValue = passwordCheck.value;
  checkPasswordValidation(passwordValue, passwordCheckValue);
});

nickname.addEventListener("focusout", async () => {
  const nicknameValue = nickname.value;
  await checkNicknameValidation(nicknameValue);
});
