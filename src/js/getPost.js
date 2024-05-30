import { enableScroll, disableScroll, getScrollPosition } from "./scroll.js";

const postList = document.querySelector(".board");
const userId = Number(sessionStorage.getItem("userId"));
const boardModalContainer = document.querySelector(".boardModalContainer");

const urlPostId = Number(window.location.search.split("=")[1]);

const readPost = (post) => {
  //조회수 댓글
  let postView = "";
  if (post.view >= 1000000) {
    postView = "100K";
  } else if (post.view >= 10000) {
    postView = "10K";
  } else if (post.view >= 1000) {
    postView = "1K";
  } else {
    postView = post.view;
  }

  let postComment = "";
  if (post.comment_count >= 1000) {
    postComment = "1K";
  } else if (post.comment_count >= 10000) {
    postComment = "10K";
  } else if (post.comment_count >= 1000000) {
    postComment = "100K";
  } else {
    postComment = post.comment_count;
  }

  postList.innerHTML = `
    <div class="boardHeader">
      <p class="boardTitle">${post.title}</p>
      <div class="boardHeaderBottom">
        <div class="writer">
          <img class="writerImage" 
          alt="profile image" 
          src=${post.userImage}
          style="width: 30px; height: 30px" />
          <p class="postWriterName">${post.nickname}</p>
          <div class="postWriteDate">${post.created_at}</div>
        </div>
        <div class="boardButton">
          <button class="updateBoard">수정</button>
          <button class="deleteBoard">삭제</button>
        </div>
      </div>
    </div>
    <div class="boardBody">
      <div class="boardImageContainer"></div>
      <div class="boardContent">${post.content}</div>
    </div>
    <div class="boardAction">
      <div class="readCount">
        <strong class="readNumber">${postView}</strong>
        <div>조회수</div>
      </div> 
      <div class="commentCount">
        <strong class="commentNumber">${postComment}</strong>
        <div>댓글수</div>
      </div> 
    </div>
  `;

  if (post.postImage) {
    document.body.querySelector(".boardImageContainer").innerHTML = `
      <img class="boardImage" src=${post.postImage} alt="board image" />
    `;
  }
  const deletePostButton = document.querySelector(".deleteBoard");
  const updatePostButton = document.querySelector(".updateBoard");

  updatePostButton.addEventListener("click", async () => {
    const checkData = await fetch(`${backHost}/api/posts/checkOwner`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({ userId, postId: post.postId }),
    });

    const checkResponseData = await checkData.json();

    if (checkResponseData.status === 403) {
      alert("본인이 작성한 게시물이 아닙니다.");
      return;
    }

    location.href = `/public/board/updatePost.html?postId=${post.postId}`;
  });

  deletePostButton.addEventListener("click", async () => {
    const checkData = await fetch(`${backHost}/api/posts/checkOwner`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      body: JSON.stringify({ userId, postId: post.postId }),
    });

    const checkResponseData = await checkData.json();

    if (checkResponseData.status === 403) {
      alert("본인이 작성한 게시물이 아닙니다.");
      return;
    }

    const modalPositionTop = getScrollPosition().scrollPosition;
    boardModalContainer.style.display = "flex";
    boardModalContainer.style.top = `${modalPositionTop}px`;
    disableScroll();
  });

  document
    .querySelector(".boardDeleteModal .submitButton")
    .addEventListener("click", async () => {
      const deleteResponse = await fetch(`${backHost}/api/posts/${urlPostId}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "ngrok-skip-browser-warning": "69420",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        method: "DELETE",
      });

      const responseData = await deleteResponse.json();

      switch (responseData.status) {
        case 200:
          alert("게시물이 삭제되었습니다.");
          boardModalContainer.style.display = "none";
          enableScroll();
          location.replace("/board");
          return;
        default:
          alert("게시물 삭제 실패");
          boardModalContainer.style.display = "none";
          enableScroll();
          return;
      }
    });

  //게시글 수정 - 취소
  document
    .querySelector(".boardDeleteModal .cancelButton")
    .addEventListener("click", () => {
      boardModalContainer.style.display = "none";
      enableScroll();
    });
};

(async () => {
  const response = await fetch(`${backHost}/api/posts/${urlPostId}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "ngrok-skip-browser-warning": "69420",
    },
  });
  const responseData = await response.json();

  switch (responseData.status) {
    case 200:
      readPost(responseData.data);
      return;
    default:
      alert("게시물이 없습니다");
      location.replace("/board");
      return;
  }
})();
