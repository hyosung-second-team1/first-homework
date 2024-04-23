const video = document.querySelector('.video-modal');
const videoContainer = document.querySelector('.video-container');
const playBtns = document.querySelectorAll(".video-play");
const closeBtn = document.querySelector('.close-btn');

// ===== 비디오 플레이 =====
playBtns.forEach((v,i) => {
  v.addEventListener('click',() => {
    videoContainer.classList.remove('no-show');
    video.setAttribute('src', `videos/${v.getAttribute('data-video')}.mp4`);
    video.setAttribute('type', `video/mp4`);
  })
})
// ===== 비디오 플레이 End =====


// ===== 비디오 플레이 종료 =====
closeBtn.addEventListener('click', () => {
  console.log('awrghaerhae')
  videoContainer.classList.add('no-show');
})
// ===== 비디오 플레이 종료 End =====


// ===== 비디오 플레이 마우스로 옮기기 =====
let isDragging = false;
let offset = { x: 0, y: 0 };

// 마우스가 video 요소 위에서 눌렸을 때
videoContainer.addEventListener('mousedown', (event) => {
  isDragging = true;
  // 현재 마우스 위치와 video 요소의 위치 간의 차이를 계산하여 offset에 저장
  offset = {
    x: event.clientX - (rect.left + rect.width / 2),
    y: event.clientY - (rect.top + rect.height / 2)
  };
});

// 마우스가 document 위에서 이동 중일 때
document.addEventListener('mousemove', (event) => {
  if (!isDragging) return;
  // video 요소의 위치를 마우스의 위치로 이동
  videoContainer.style.left = `${event.clientX - offset.x}px`;
  videoContainer.style.top = `${event.clientY - offset.y}px`;
  console.log(video.style);
});

// 마우스 버튼을 뗄 때
document.addEventListener('mouseup', () => {
  console.log("awrgawerh")
  isDragging = false;
});
// ===== 비디오 플레이 마우스로 옮기기 End =====
