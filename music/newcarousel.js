// 이름 매개변수 처리
const urlParams = new URLSearchParams(window.location.search);
const target = urlParams.get('name'); // 'name' 매개변수 추출

const state = {};  // carousel 상태 저장
const carouselList = document.querySelector('.slider');  // carousel 목록
const carouselItems = document.querySelectorAll('.slide');  // 각각의 slide
const elems = Array.from(carouselItems);  // slide 요소 목록 -> 배열 -> 변수에 할당

carouselItems.forEach(slide => {
  slide.addEventListener('click', (event) => {
    const newActive = event.target;  // 클릭된 요소 변수에 할당
    const isItem = newActive.closest('.slide');  // 클릭된 요소가 slide 인지 확인하기 위해 최상위 slide 요소 찾기

    console.log(isItem)

    if (!isItem || newActive.classList.contains('slide_active')) {
      // 클릭된 요소가 slide 가 아니거나 이미 활성화된 slide 인 경우 함수 종료
      return;
    };
  
    update(isItem);  // 새로운 활성화된 슬라이드를 업데이트하는 함수를
  })
})


const getPos = function (current, active) {
  const diff = current - active;

  if (Math.abs(diff) > 1) {
    return -current
  }

  return diff;
}

const update = function(newActive) {
  // 새로운 활성화된 슬라이드의 위치를 가져오기
  const newActivePos = newActive.dataset.pos;
  // 현재 활성화된 슬라이드를 찾기
  const current = elems.find((elem) => elem.dataset.pos == 0);
  // 이전 슬라이드 찾기
  const prev = elems.find((elem) => elem.dataset.pos == -1);
  // 다음 슬라이드 찾기
  const next = elems.find((elem) => elem.dataset.pos == 1);
  // 현재 활성화된 슬라이드의 활성 클래스 제거
  current.classList.remove('slide_active');
  
  [current, prev, next].forEach(item => {
    // 각각 슬라이드 위치 가져오기
    var itemPos = item.dataset.pos;
    // 슬라이드 위치를 새로운 활성화 슬라이드를 기준으로 업데이트
    item.dataset.pos = getPos(itemPos, newActivePos)
  });
};

// 음악 재생

// `assets/${target}/`
// 각 슬라이드에 대한 음악 파일 경로 배열
const audioFiles = [
    `../music/assets/${target}/music/song01.mp3`,
    `../music/assets/${target}/music/song02.mp3`,
    `../music/assets/${target}/music/song03.mp3`
];


carouselItems.forEach((slide, index) => {
    // 각 슬라이드에 대한 음악 파일 경로
    const audioFile = audioFiles[index];

    // 각 슬라이드 내의 플레이어 컨트롤 요소
    const container = document.querySelector(".carousel");
    const playBtn = slide.querySelector('.controls #play');
    const progressBar = slide.querySelector('.bar');
    const progressDot = slide.querySelector('.dot');
    const currentTimeEl = slide.querySelector('.current-time');
    const durationEl = slide.querySelector('.duration');
    
    let playing = false;
    let audio = new Audio(audioFile);
    
    // 플레이어 컨트롤에 대한 이벤트 핸들러 추가
    playBtn.addEventListener('click', () => {
        if (!playing) {  
            playBtn.classList.replace("fa-play", "fa-pause");
            playing = true;
            audio.play();
            console.log(audioFile);  // assets/null/music/song02.mp3   =>   이름 받아오는 데에서 문제가 생긴건가?
        } else {  
            playBtn.classList.replace("fa-pause", "fa-play");
            playing = false;
            audio.pause();
        }
    });

    // 플레이어 상태 및 시간 업데이트 함수 추가
    function updateProgress() {
        let { duration, currentTime } = audio;
        durationEl.textContent = formatTime(duration);
        currentTimeEl.textContent = formatTime(currentTime);
        let progressPercentage = (currentTime / duration) * 100;
        progressDot.style.left = `${progressPercentage}%`;
    }

    audio.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener("click", (e) => {
        let width = progressBar.clientWidth;
        let clickX = e.offsetX;
        let duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    function formatTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutes}:${seconds}`;
    }
});
