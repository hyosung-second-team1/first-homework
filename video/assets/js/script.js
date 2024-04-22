// 이름 매개변수 처리
const urlParams = new URLSearchParams(window.location.search);
const target = urlParams.get('name'); // 'name' 매개변수 추출

// // 비디오 태그 추가
// const videoTag = document.createElement('video');
// videoTag.classList.add('video');
// const srcTag = document.createElement('source');
// srcTag.setAttribute('src', `./assets/videos/${target}.mp4`);
// srcTag.setAttribute('type', 'video/mp4');

// 이미지 경로 설정
const videoTag = document.querySelector('.video');
videoTag.setAttribute('src', `./assets/videos/${target}.mp4`)
videoTag.setAttribute('type', 'video/mp4');