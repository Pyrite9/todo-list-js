<div align="center">

# todo-list-js

**A simple, lightweight web todo list built with Vanilla JavaScript**

순수 자바스크립트로 만든 가볍고 심플한 웹 투두 리스트

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

[**Live Demo**](https://pyrite9.github.io/todo-list-js)

</div>

---

## Preview

<div align="center">

![preview](https://raw.githubusercontent.com/Pyrite9/todo-list-js/main/readme-image/preview.png)

</div>

---

## Features | 기능

| Feature | Description (EN) | 설명 (KR) |
|---------|------------------|-----------|
| **Add** | Add tasks via input box | 입력창으로 task 추가 |
| **Complete** | Toggle completion with checkbox | 체크박스로 완료 처리 |
| **Edit** | Click text to edit inline | 텍스트 클릭으로 인라인 수정 |
| **Delete** | Hover to reveal delete button | 마우스 호버 시 삭제 버튼 표시 |
| **Persist** | Auto-saved to LocalStorage | LocalStorage 자동 저장 |

---

## How To Use | 사용 방법

### Add | 추가

Enter text in the input box and press **Enter** or click the **Add** button to add a task.

입력창에 텍스트를 입력하고 **Enter** 키를 누르거나 **Add** 버튼을 클릭하면 task 추가.

<div align="center">

![Add](https://raw.githubusercontent.com/Pyrite9/todo-list-js/main/readme-image/Add.gif)

</div>

---

### Complete | 완료

Click the checkbox to mark a task as complete. A strikethrough and gray style will be applied.

체크박스 클릭 시 task 완료 처리. 취소선과 회색 스타일 적용됨.

<div align="center">

![Complete](https://raw.githubusercontent.com/Pyrite9/todo-list-js/main/readme-image/Complete.gif)

</div>

---

### Edit | 수정

Click on a task text to turn it into an editable input box. Edit the content and press **Enter** to save the changes.

텍스트 클릭 시 입력창으로 변경. 내용 수정 후 **Enter** 키 입력으로 저장.

<div align="center">

![Edit](https://raw.githubusercontent.com/Pyrite9/todo-list-js/main/readme-image/Edit.gif)

</div>

---

### Delete | 삭제

Hover over a task to reveal the delete button (**X**). Click it to remove the task.

task에 마우스 호버 시 삭제 버튼(**X**) 표시. 클릭하면 task 삭제.

<div align="center">

![Delete](https://raw.githubusercontent.com/Pyrite9/todo-list-js/main/readme-image/Delete.gif)

</div>

---

## Implementation | 구현 구조

### Data Structure | 데이터 구조

모든 할 일은 `todos` 배열에 객체 형태로 저장. LocalStorage에는 이 배열이 JSON 문자열로 직렬화되어 저장됨.

```js
todos = [
  { text: "할 일 내용", done: false },
  { text: "완료된 할 일", done: true }
]
```

| Key | Type | Description |
|-----|------|-------------|
| `text` | `string` | 할 일 텍스트 |
| `done` | `boolean` | 완료 여부 (체크박스 상태) |

---

### Adding a Task | 할 일 추가

`addTodo()` 함수가 입력값을 받아 배열에 push 후 재렌더링.

```js
function addTodo() {
    let todo = todoInput.value.trim();
    
    if (todo === "") return;          // 공백 입력 차단
    
    todos.push({text: todo, done: false});
    todoInput.value = "";             // 입력창 초기화
    
    localStorage.setItem("todo", JSON.stringify(todos));
    todoDisplay();
}
```

**핵심 포인트**
- `trim()`으로 앞뒤 공백 제거 후 검증 → 공백만 입력하는 경우 차단
- 새 항목은 항상 `done: false`로 시작
- 상태 변경 → LocalStorage 저장 → 화면 갱신 순서를 모든 변경 함수가 동일하게 따름

---

### Rendering | 렌더링

`todoDisplay()` 함수가 `todos` 배열 전체를 순회하며 HTML 문자열을 생성, `todo-list` 영역에 `innerHTML`로 일괄 주입.

```js
function todoDisplay() {
    if (todos.length === 0) {
        todoList.innerHTML = `<p>할 일이 없습니다. 할 일을 추가해보세요.</p>`;
        return;
    }

    let html = "";
    for (let i = 0; i < todos.length; i++) {
        html += `
            <div id="todo-item-${i}" class="${todos[i].done ? "done" : ""}"> 
                <input type="checkbox" ${todos[i].done ? "checked" : ""} onclick="toggleDone(${i})">
                <span id="todo-text-${i}" onclick="editTodo(${i})">${todos[i].text}</span>
                <button class="deleteBtn" onclick="deleteTodo(${i})">X</button>
            </div>
        `;
    }
    todoList.innerHTML = html;
}
```

**핵심 포인트**
- **전체 재렌더링 방식**: 변경이 발생할 때마다 리스트 전체를 새로 렌더링. 인덱스 기반 접근이 항상 일관되게 동작
- **빈 상태 처리**: 배열이 비어 있을 때 안내 메시지 표시
- **조건부 클래스**: `done` 상태에 따라 `class="done"` 부여 → CSS에서 취소선 처리

---

### Inline Editing | 인라인 수정

텍스트 클릭 시 `span`을 `input`으로 교체하는 방식. 별도 모달이나 페이지 이동 없이 자리에서 바로 수정 가능.

```js
function editTodo(n) {
    const span = document.querySelector(`#todo-text-${n}`);
    span.outerHTML = `
        <input id="todo-text-${n}" type="text" value="${todos[n].text}" 
               onblur="saveTodo(${n}, this.value)" 
               onkeydown="if(event.key==='Enter') this.blur()">
    `;
}

function saveTodo(n, val) {
    if (val.trim() === "") {          // 공백으로 저장 시도 차단
        todoDisplay();                // 원래 값으로 복원
        return;
    }
    todos[n].text = val;
    localStorage.setItem("todo", JSON.stringify(todos));
    todoDisplay();
}
```

**핵심 포인트**
- `outerHTML` 교체로 DOM 노드를 통째로 변경
- `Enter` 키 입력 시 `blur()` 호출 → `onblur` 이벤트로 저장 로직 자연스럽게 연결
- 공백 저장 시도는 무시하고 원래 텍스트로 복원

---

### Persistence | 영구 저장

페이지 로드 시 `todoInit()`이 LocalStorage에서 데이터 복원.

```js
function todoInit() {
    todos = JSON.parse(localStorage.getItem("todo")) || [];
    todoDisplay();
}
```

`|| []` 패턴으로 저장된 데이터가 없을 때(`null` 반환) 빈 배열로 안전하게 초기화.

---

### Data Flow | 데이터 흐름

모든 사용자 액션은 동일한 흐름을 따름:

```
User Action  →  todos 배열 수정  →  LocalStorage 저장  →  todoDisplay() 재렌더링
```

이 일관된 패턴으로 추가/완료/수정/삭제 어떤 동작이든 상태와 화면이 항상 동기화됨.

---

## Tech Stack | 사용한 기술

### Core
- **HTML5** · **CSS3** · **JavaScript (Vanilla)**

### JavaScript
- **DOM Manipulation** — `querySelector`, `innerHTML`, `outerHTML`
- **LocalStorage** — `setItem`, `getItem`, `JSON.stringify`, `JSON.parse`
- **JSON Object** handling
- **Event Handling** — `onclick`, `onkeydown`, `onblur`

### CSS
- **Flexbox** layout
- **CSS Variables** with relative units (`vw`, `vh`, `em`)
- **Pseudo-classes** — `:hover`, `:focus`, `:checked`
- **Google Fonts** — Inter, Noto Sans KR

---

<div align="center">

Made by [**Pyrite9**](https://github.com/Pyrite9)

</div>
