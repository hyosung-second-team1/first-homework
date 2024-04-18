const addBtn = document.querySelector(".add-btn");
const todoForm = document.querySelector(".todo-form");
const todoContainer = document.querySelector(".todo-container");
const doneContainer = document.querySelector(".done-container");

/**
 * [updateLocalStorage]
 * 로컬스토리지 업데이트
 */
const updateLocalStorage = () => {
  const containers = document.querySelectorAll(".list-box");
  containers.forEach((container) => {
    const storedArr = [];
    const containerItems = container.querySelectorAll("li");
    console.log(containerItems);
    containerItems.forEach((item, idx) => {
      const storedObj = {
        id: idx,
        isChecked: item.querySelector("input[type='checkbox']").checked,
        content: item.querySelector("span").innerText,
      };
      storedArr.push(storedObj);
    });

    localStorage.setItem(container.classList[0], JSON.stringify(storedArr));
  });
};

/**
 * [getLocalStorage]
 * page load시, 로컬스토리지 불러와서 요소 넣어주기
 */
const getLocalStorage = () => {
  const containers = document.querySelectorAll(".list-box");
  containers.forEach((container) => {
    const getStoredArr = JSON.parse(
      localStorage.getItem(container.classList[0])
    );
    if (getStoredArr !== null) {
      getStoredArr.forEach((storedList) => {
        // TODO: 중복코드 수정
        const todoListElement = document.createElement("li");
        todoListElement.classList.add("draggable");
        todoListElement.draggable = "true";

        const todoCheckboxElement = document.createElement("input");
        todoCheckboxElement.type = "checkbox";
        todoCheckboxElement.checked = storedList.isChecked;
        storedList.isChecked
          ? todoCheckboxElement.classList.add("done")
          : todoCheckboxElement.classList.remove("done");

        const todoTextSpanElement = document.createElement("span");
        todoTextSpanElement.innerText = storedList.content; // 여기만 수정 고고

        const todoInputElement = document.createElement("input");
        todoInputElement.classList.add("hidden");

        const todoDeleteBtnElement = document.createElement("button");
        todoDeleteBtnElement.classList.add("hidden");
        todoDeleteBtnElement.innerText = "X";

        const todoUpdateBtnElement = document.createElement("button");
        todoUpdateBtnElement.classList.add("hidden");
        todoUpdateBtnElement.innerText = "수정";

        todoListElement.appendChild(todoCheckboxElement);
        todoListElement.appendChild(todoTextSpanElement);
        todoListElement.appendChild(todoInputElement);
        todoListElement.appendChild(todoDeleteBtnElement);
        todoListElement.appendChild(todoUpdateBtnElement);
        container.appendChild(todoListElement);

        checkboxChangeHandler(todoCheckboxElement, todoListElement);

        reloadDragDOM();

        // todo - 체크리스트 완료
        // todoCheckboxElement.addEventListener("change", () => {
        //   todoCheckboxElement.classList.toggle("done");
        // });

        // todo list - hover 시 삭제&수정 버튼 보여주기
        todoListElement.addEventListener("mouseenter", () => {
          todoDeleteBtnElement.classList.remove("hidden");
          todoUpdateBtnElement.classList.remove("hidden");
        });
        todoListElement.addEventListener("mouseleave", () => {
          todoDeleteBtnElement.classList.add("hidden");
          todoUpdateBtnElement.classList.add("hidden");
        });

        // 삭제
        todoDeleteBtnElement.addEventListener("click", (event) => {
          event.target.parentNode.remove();
          console.log("???");
          updateLocalStorage();
        });

        // 수정
        todoUpdateBtnElement.addEventListener("click", () => {
          todoTextSpanElement.classList.add("hidden");
          todoInputElement.classList.remove("hidden");
          todoInputElement.value = todoTextSpanElement.innerText;
          todoInputElement.focus();
        });
        todoInputElement.addEventListener("blur", () => {
          todoTextSpanElement.innerText = todoInputElement.value;
          todoInputElement.classList.add("hidden");
          todoTextSpanElement.classList.remove("hidden");
        });
      });
      // TODO: 중복코드 수정
    }
  });
};

/**
 * [dragEndHandler]
 * 드래그 종료 시 체크박스 상태 변경 함수
 */
const dragEndHandler = (event, draggableItem) => {
  if (draggableItem.parentNode === doneContainer) {
    const checkbox = draggableItem.querySelector("input[type='checkbox']");
    if (checkbox) {
      checkbox.checked = true; // done-container에 들어가면 체크박스를 체크
      checkbox.classList.add("done");
    }
  } else {
    const checkbox = draggableItem.querySelector("input[type='checkbox']");
    if (checkbox) {
      checkbox.checked = false; // 다른 container에 들어가면 체크박스 체크 해제
      checkbox.classList.remove("done");
    }
  }

  // drag End 될 때마다 localStorage 업데이트
  updateLocalStorage();
};

/**
 * [checkboxChangeHandler]
 * 체크박스 변경 이벤트 처리
 */
const checkboxChangeHandler = (checkbox, listItem) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      doneContainer.appendChild(listItem);
    } else {
      todoContainer.appendChild(listItem);
    }
    updateLocalStorage();
    checkbox.classList.toggle("done");
  });
};

/**
 * [dragoverHandler]
 * drop 가능한 영역 지정 및 drag된 요소가 영역에 들어왔을 때 반응 정의 함수
 */
const dragoverHandler = (event, listBox) => {
  event.preventDefault();
  const afterElement = getDragElement(listBox, event.clientY); // list를 넣을 요소 계산 후 반환
  const draggable = document.querySelector(".dragging"); // 현재 dragging 중인 요소
  listBox.insertBefore(draggable, afterElement); // 현재 dragging 요소를 계산된 afterElement에 넣기
};

/**
 * [dragStartEndHandler]
 * dragstart, dragend 이벤트를 발생 시, .dragging라는 클래스를 토글 함수
 */
const dragStartEndHandler = (draggableItem) => {
  draggableItem.addEventListener("dragstart", () => {
    draggableItem.classList.add("dragging");
  });

  draggableItem.addEventListener("dragend", (event) => {
    draggableItem.classList.remove("dragging");
    dragEndHandler(event, draggableItem);
  });
};

/**
 * [getDragElement]
 * drag된 요소가 들어갈 위치를 가져오는 함수
 */
const getDragElement = (listBox, y) => {
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
};

/**
 * [reloadDragDOM]
 * 새로운 list 요소 DRAG & DROP 처리를 위한 DOM 업데이트 함수
 */
const reloadDragDOM = () => {
  draggableItems = document.querySelectorAll(".draggable");
  draggableItems.forEach((draggableItem) => {
    dragStartEndHandler(draggableItem);
  });

  listBoxes = document.querySelectorAll(".list-box");
  listBoxes.forEach((listBox) => {
    listBox.addEventListener("dragover", (event) =>
      dragoverHandler(event, listBox)
    );
  });
};

/**
 * TODO: submit 내부 이벤트 리스너 콜백함수 따로 분리하기
 */

// addBtn 클릭 - TO-DO form toggle 처리
addBtn.addEventListener("click", () => {
  todoForm.classList.toggle("hidden");
});

// TO-DO 등록하기
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(event.target["todo-input"].value);
  const inputval = event.target["todo-input"].value;
  if (inputval.trim().length > 0) {
    // 요소 추가
    const todoListElement = document.createElement("li");
    todoListElement.classList.add("draggable");
    todoListElement.draggable = "true";

    const todoCheckboxElement = document.createElement("input");
    todoCheckboxElement.type = "checkbox";

    const todoTextSpanElement = document.createElement("span");
    todoTextSpanElement.innerText = inputval;

    const todoInputElement = document.createElement("input");
    todoInputElement.classList.add("hidden");

    const todoDeleteBtnElement = document.createElement("button");
    todoDeleteBtnElement.classList.add("hidden");
    todoDeleteBtnElement.innerText = "X";

    const todoUpdateBtnElement = document.createElement("button");
    todoUpdateBtnElement.classList.add("hidden");
    todoUpdateBtnElement.innerText = "수정";

    todoListElement.appendChild(todoCheckboxElement);
    todoListElement.appendChild(todoTextSpanElement);
    todoListElement.appendChild(todoInputElement);
    todoListElement.appendChild(todoDeleteBtnElement);
    todoListElement.appendChild(todoUpdateBtnElement);
    todoContainer.appendChild(todoListElement);

    checkboxChangeHandler(todoCheckboxElement, todoListElement);

    reloadDragDOM();

    event.target["todo-input"].value = "";

    // todo - 체크리스트 완료
    // todoCheckboxElement.addEventListener("change", () => {
    //   todoCheckboxElement.classList.toggle("done");
    // });

    // todo list - hover 시 삭제&수정 버튼 보여주기
    todoListElement.addEventListener("mouseenter", () => {
      todoDeleteBtnElement.classList.remove("hidden");
      todoUpdateBtnElement.classList.remove("hidden");
    });
    todoListElement.addEventListener("mouseleave", () => {
      todoDeleteBtnElement.classList.add("hidden");
      todoUpdateBtnElement.classList.add("hidden");
    });

    // 삭제
    todoDeleteBtnElement.addEventListener("click", (event) => {
      event.target.parentNode.remove();
      console.log("???");
      updateLocalStorage();
    });

    // 수정
    todoUpdateBtnElement.addEventListener("click", () => {
      todoTextSpanElement.classList.add("hidden");
      todoInputElement.classList.remove("hidden");
      todoInputElement.value = todoTextSpanElement.innerText;
      todoInputElement.focus();
    });
    todoInputElement.addEventListener("blur", () => {
      todoTextSpanElement.innerText = todoInputElement.value;
      todoInputElement.classList.add("hidden");
      todoTextSpanElement.classList.remove("hidden");
    });

    updateLocalStorage();
  } else {
    alert("할 일을 입력해주세요!");
    event.target["todo-input"].focus();
  }
});

reloadDragDOM();
window.addEventListener("load", getLocalStorage());
