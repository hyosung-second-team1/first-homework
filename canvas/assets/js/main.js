// 이름 매개변수 처리
const urlParams = new URLSearchParams(window.location.search);
const target = urlParams.get('name'); // 'name' 매개변수 추출

// 이미지 경로 설정
const bgList = document.querySelectorAll('#bg-list>li>img');
bgList.forEach((e, i) => {
  const url = `assets/img/${target}/bg${i+1}.`
  var img = new Image();
  img.onload = function(){
    e.setAttribute('src',url + 'jpg');
  }
  img.onerror = function() {
    e.setAttribute('src', url + 'png')
  }
  img.src = url + 'jpg';
});
const stickerList = document.querySelectorAll('#sticker-list>li>img');
stickerList.forEach((e, i) => e.setAttribute('src', `assets/img/${target}/drag${i+1}.png`));

// 캔버스 DOM 셀렉트
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 캔버스 화질 조정
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);

// 캔버스 드로잉 관련 변수
let isPenChoiced = false;
let isDrawing = false;
let penColor = "black";
let lastX = 0;
let lastY = 0;
ctx.lineWidth = 5;
ctx.strokeStyle = 'black';
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// 배경화면 이미지 변수
let canvasBack = null;

// 스티커 드래그 앤 드랍 변수
let sticker = null;

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



// ============ 사이드바 토글 ============
// 이벤트 등록 - 사이드바 토글
on('click', '#toggle1', function(e) {
  select('#sidebar1').classList.toggle('mobile-nav-active');
  select('#sidebar2').classList.remove('mobile-nav-active');
  select('#sidebar3').classList.remove('mobile-nav-active');
})
on('click', '#toggle2', function(e) {
  select('#sidebar2').classList.toggle('mobile-nav-active');
  select('#sidebar1').classList.remove('mobile-nav-active');
  select('#sidebar3').classList.remove('mobile-nav-active');
})
on('click', '#toggle3', function(e) {
  select('#sidebar3').classList.toggle('mobile-nav-active');
  select('#sidebar1').classList.remove('mobile-nav-active');
  select('#sidebar2').classList.remove('mobile-nav-active');
})
// ============ 사이드바 토글 끝 ============



// ============ 메뉴바 토글 ============
// 함수 - 메뉴바 활성화
function menuBarActivate() {  
  select('.btn-bar').classList.add('active');
  select('#menu-icon').classList.remove('fixed-icon-active');
  select('#cancel-icon').classList.remove('fixed-icon-active');
}

// 함수 - 메뉴 아이콘 활성화
function menuIconActivate() {
  select('#menu-icon').classList.add('fixed-icon-active');
  select('.btn-bar').classList.remove('active');
  select('#sidebar1').classList.remove('mobile-nav-active');
  select('#sidebar2').classList.remove('mobile-nav-active');
  select('#sidebar3').classList.remove('mobile-nav-active');
}

// 함수 - 휴지통 아이콘 활성화
function cancelIconActivate() {
  select('#cancel-icon').classList.add('fixed-icon-active');
  select('.btn-bar').classList.remove('active');
  select('#sidebar1').classList.remove('mobile-nav-active');
  select('#sidebar2').classList.remove('mobile-nav-active');
  select('#sidebar3').classList.remove('mobile-nav-active');
}

// 이벤트 등록
on('click', '#menu-icon', menuBarActivate)
on('click', '#menu-toggle', menuIconActivate)
// ============ 메뉴바 토글 끝 ============



// ============ 캔버스 이미지 바꾸기 ============
// 함수 - 캔버스 이미지 선택
function bgChoice(e) {
  canvasBack = e.target;
  select('#sidebar1').classList.remove('mobile-nav-active');
}

// 이벤트 등록 - 모달 버튼 이미지 바꾸기
on('click', '#canvas-change', () => {
  ctx.drawImage(canvasBack, 0, 0, canvasBack.naturalWidth, canvasBack.naturalHeight, 0, 0, canvas.width, canvas.height);
});

// 이벤트 등록 - 캔버스 이미지 바꾸기
on('click', '#bg1', bgChoice);
on('click', '#bg2', bgChoice);
on('click', '#bg3', bgChoice);
// ================ 캔버스 이미지 바꾸기 끝 ============



// ============ 캔버스 펜 드로우 ============
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
function activePen() {
  ctx.strokeStyle = penColor;
  isPenChoiced = true;
  select('#sidebar2').classList.remove('mobile-nav-active');
}


// 이벤트 등록 - 펜 활성화
on('click', '#draw', activePen)

// 이벤트 등록 - 지우개 활성화
on('click', '#eraser', () => {
  ctx.strokeStyle = 'white';
  isPenChoiced = true;
  select('#sidebar2').classList.remove('mobile-nav-active');
})

// 이벤트 등록 - 펜 굵기 동기화
on('click', '#thickness', () => {
  select('#thickness-range').value = ctx.lineWidth;
  select("#current-thickness").innerText = ctx.lineWidth;
  select('#sidebar2').classList.remove('mobile-nav-active');
})

// 이벤트 등록 - 펜 굵기 설정
on('input', '#thickness-range', (e) => {
  const thickness = e.target.value;
  ctx.lineWidth = thickness;
  select("#current-thickness").innerText = thickness
})

// 이벤트 등록 - 펜 색깔 변경
on('input', '#color-icon', (e) => {
  penColor = e.target.value;
  ctx.strokeStyle = penColor;
})

// 이벤트 등록 - 펜 비활성화
on('click', '#draw-cancel', () => {
  isPenChoiced = false;
  select('#sidebar2').classList.remove('mobile-nav-active');
})

// 이벤트 등록 - 그림 그리기
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
// ============ 캔버스 펜 드로우 끝 ============



// ============ 캔버스 스티커 드랍 끝============
// 함수 - 스티커 드래그 시작
function dragStart(e) {
  e.preventDefault();
  sticker = e.target;
  select('#sidebar3').classList.remove('mobile-nav-active');
  cancelIconActivate();
}

// 함수 - 스티커 드래그 중 이벤트 방지
function dragOverPrevent(e) {
  e.preventDefault();
}

// 함수 - 스티커 드롭
function dragEnd(e) {
  if (!sticker) return;
  e.preventDefault();

  var rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top
  const width = sticker.width
  const height = sticker.height 

  ctx.drawImage(sticker, 0, 0, sticker.naturalWidth, sticker.naturalHeight, x-width/2, y-height/2, width, height);

  sticker = null;
  menuBarActivate();
}

function cancelEnter(e) {
  e.preventDefault();
  select('#cancel-icon').classList.add('fixed-icon-choice');
}

function cancelLeave(e) {
  e.preventDefault();
  select('#cancel-icon').classList.remove('fixed-icon-choice');
}

function cancelChoose(e) {
  e.preventDefault();
  sticker = null;
  select('#cancel-icon').classList.remove('fixed-icon-choice');
  menuBarActivate();
}

// 이벤트 등록 - 스티커 드래그
on('drag', '#drag1', dragStart);
on('drag', '#drag2', dragStart);
on('drag', '#drag3', dragStart);

// 이벤트 등록 - 캔버스 스티커 드래그
canvas.addEventListener('dragover', dragOverPrevent);
canvas.addEventListener('drop', dragEnd);

// 이벤트 등록 - 휴지통 드래그
on('dragover', '#cancel-icon', dragOverPrevent);
on('dragenter', '#cancel-icon', cancelEnter);
on('dragleave', '#cancel-icon', cancelLeave);
on('drop', '#cancel-icon', cancelChoose);
// ============ 캔버스 스티커 드랍 끝 ============


// 이벤트 등록 - 홈으로 이동
on('click', '#home', () => {
  location.href = '../asset/index.html';
});


// 이벤트 등록 - 캔버스 초기화
on('click', '#canvas-clear', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  isPenChoiced = false;
  select('#sidebar1').classList.remove('mobile-nav-active');
  select('#sidebar2').classList.remove('mobile-nav-active');
  select('#sidebar3').classList.remove('mobile-nav-active');
});

// 이벤트 등록 - 그림 저장
on('click', '#save', () => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL();
  link.download = "canvas"; 
  link.click();
})




