// 캔버스 DOM 셀렉트
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 캔버스 화질 조정
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

// 캔버스 드로잉 관련 변수
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
let penColor = 'black';
let isPenChoiced = false;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// 함수 - 셀렉터 지원
const select = (el, all = false) => {
  el = el.trim()
  if (all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

// 함수 - 이벤트 리스너 추가 지원
const on = (type, el, listener, all = false) => {
  let selectEl = select(el, all)
  if (selectEl) {
    if (all) {
      selectEl.forEach(e => e.addEventListener(type, listener))
    } else {
      selectEl.addEventListener(type, listener)
    }
  }
}

// 함수 - 캔버스 이미지 바꾸기
function bgChoice(id) {
  const imgTag = document.querySelector(`${id}>img`);
  ctx.drawImage(imgTag, 0, 0, imgTag.naturalWidth, imgTag.naturalHeight, 0, 0, canvas.width, canvas.height);
  select('#sidebar1').classList.remove('mobile-nav-active');
}

// 함수 - 캔버스 팬 다운
function handleMouseDown(event) {
  isDrawing = isPenChoiced && true;
  [lastX, lastY] = [event.offsetX, event.offsetY];
}

// 함수 - 캔버스 팬 업
function handleMouseUp() {
  isDrawing = false;
}

// 함수 - 캔버스 팬 드로우
function handleMouseMove(event) {
  if (!isDrawing) return;

  const currentX = event.offsetX;
  const currentY = event.offsetY;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();

  [lastX, lastY] = [currentX, currentY];
}

// 함수 - 캔버스 팬 활성화
function activePen(lineWidth) {
  isPenChoiced = true;
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = penColor;
  select('#sidebar2').classList.remove('mobile-nav-active');
}

// 이벤트 등록 - 사이드바 토글
on('click', '#toggle1', function(e) {
  select('#sidebar1').classList.toggle('mobile-nav-active');
  select('#sidebar2').classList.remove('mobile-nav-active');
})
on('click', '#toggle2', function(e) {
  select('#sidebar2').classList.toggle('mobile-nav-active');
  select('#sidebar1').classList.remove('mobile-nav-active');
})

// 이벤트 등록 - 캔버스 이미지 바꾸기
on('click', '#bg1', () => bgChoice('#bg1'));
on('click', '#bg2', () => bgChoice('#bg2'));
on('click', '#bg3', () => bgChoice('#bg3'));

// 이벤트 등록 - 배경 화면 제거
on('click', '#canvas-clear', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 이벤트 등록 - 펜 활성화
on('click', '#pen1', () => activePen(1.0))
on('click', '#pen2', () => activePen(4.0))
on('click', '#pen3', () => activePen(8.0))

// 이벤트 등록 - 지우개 활성화
on('click', '#eraser', () => {
  activePen(10);
  ctx.strokeStyle = 'white';
})

// 이벤트 등록 - 그림 그리기
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);

