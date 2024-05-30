const logoutButton = document.querySelector(".logOut");
const backButton = document.querySelector(".beforeBtn");

logoutButton?.addEventListener("click", () => {
  sessionStorage.removeItem("userId");
});

backButton?.addEventListener("click", () => {
  history.back();
});

const profileImage = document.querySelector(".profileImage");

(async () => {
  const userId = sessionStorage.getItem("userId");
  const currentUrl = location.pathname;
  console.log(currentUrl);

  if (
    currentUrl === "/" ||
    currentUrl === "/index.html" ||
    currentUrl === "/signUp/"
  ) {
    return;
  }

  const response = await fetch(`${backHost}/api/users/${userId}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "ngrok-skip-browser-warning": "69420",
    },
  });

  const responseData = await response.json();

  if (!responseData.data || responseData.data.length === 0) {
    location.replace = "/";
    return;
  }

  if (!profileImage) {
    return;
  }

  profileImage.src = responseData?.data.profile_image;
})();
