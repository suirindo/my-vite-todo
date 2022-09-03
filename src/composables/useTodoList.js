import { ref } from 'vue';

// 分離したロジックを外部から使えるようにexportする
export const useTodoList = () => {
  // ローカルストレージにtodoListが存在していればparseし、
  // なければundifinedになるため空配列をセットする。
  const ls = localStorage.todoList;
  const todoListRef = ref([]);
  todoListRef.value = ls ? JSON.parse(ls) : [];
  //   const todo = todoListRef.value.find((todo) => todo.id === id);
  //   const idx = todoListRef.value.findIndex((todo) => todo.id === id);

  const add = (task) => {
    const id = new Date().getItem();
    todoListRef.value.push({ id: id, task: task });
    localStorage.todoList = JSON.stringify(todoListRef.value);
  };

  const findById = (id) => {
    return todoListRef.value.find((todo) => todo.id === id);
  };
  // TODOリストからIDを元にそのインデックスを取得
  const findIndexById = (id) => {
    return todoListRef.value.findIndex((todo) => todo.id === id);
  };

  // 編集ボタンが押された時の表示処理
  const editId = ref(-1); // リアクティブにする
  const show = (id) => {
    const todo = findById(id);
    editId.value = id;
    return todo.task; //画面処理させるために返す
  };

  // 変更ボタンが押された時の処理
  const edit = (task) => {
    const todo = findById(editId.value);
    const idx = findIndexById(editId.value);
    todo.task = task;
    todoListRef.value.splice(idx, 1, todo);
    localStorage.todoList = JSON.stringify(todoListRef.value);
    editId.value = -1;
  };

  // 削除ボタンが押された時の処理
  const del = (id) => {
    const todo = findById(id);
    const delMsg = '「' + todo.task + '」を削除しますか？';
    if (!confirm(delMsg)) return;

    const idx = findIndexById(id);
    todoListRef.value.splice(idx, 1);
    localStorage.todoList = JSON.stringify(todoListRef.value);
  };

  // チェックボックスが押されたときの処理
  const check = (id) => {
    const todo = findById(id);
    const idx = findIndexById(id);
    todo.checked = !todo.checked;
    todoListRef.value.splice(idx, 1, todo);
    localStorage.todoList = JSON.stringify(todoListRef.value);
  };

  // return することで外部から使うことができる
  return { todoListRef, add, show, edit, del, check };
};
