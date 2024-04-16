const draggableItems = document.querySelectorAll(".draggable");
const listBoxes = document.querySelectorAll(".list-box");

// draggables를 전체를 루프하면서 dragstart, dragend를 이벤트를 발생
// dragstart, dragend 이벤트를 발생할때 .dragging라는 클래스를 토글
draggableItems.forEach((draggableItem) => {
  draggableItem.addEventListener("dragstart", () => {
    draggableItem.classList.add("dragging");
  });

  draggableItem.addEventListener("dragend", () => {
    draggableItem.classList.remove("dragging");
  });
});

// * drag된 요소가 들어갈 위치를 가져오는 함수
function getDragElement(listBox, y) {
  const draggableItemElements = [
    ...listBox.querySelectorAll(".draggable:not(.dragging)"),
  ];
  return draggableItemElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect(); // 해당 element의 좌표값 등이 담겨져 있는 요소 할당
      const offset = y - box.top - box.height / 2; // 수직좌표 - 요소의 top값 - 높이값 / 2 => 요소의 중간값

      // drag 중인 요소가 들어갈 위치 결정
      if (offset < 0 && offset > closest.offset) {
        // 예외처리
        return { offset: offset, element: child };
      } else {
        // 현재 요소가 드래그 포인터 바로 위에 있으면서, 이전에 검토된 요소들 중에서 가장 포인터에 근접해 있는 요소를 찾는다는 것
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY } // reduce의 초기값(어떤 실제 숫자보다도 작은 값)
  ).element;
}

// drop 가능한 영역 지정 및 drag된 요소가 영역에 들어왔을 때 반응 정의
listBoxes.forEach((listBox) => {
  listBox.addEventListener("dragover", (event) => {
    event.preventDefault();
    const afterElement = getDragElement(listBox, event.clientY); // list를 넣을 요소 계산 후 반환
    const draggable = document.querySelector(".dragging"); // 현재 dragging 중인 요소
    listBox.insertBefore(draggable, afterElement); // 현재 dragging 요소를 계산된 afterElement에 넣기
  });
});
