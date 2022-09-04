<script setup>
import { ref } from 'vue';
import { useTodoList } from '/src/composables/useTodoList.js';
const todoRef = ref('');
const todoListRef = ref([]);
const ls = localStorage.todoList;
todoListRef.value = ls ? JSON.parse(ls) : [];
const addTodo = () => {
  // IDをミリ秒で登録する
  const id = new Date().getTime();
  // 配列に入力TODOを格納
  todoListRef.value.push({ id: id, task: todoRef.value });
  // ローカルストレージに登録 ローカルストレージに普通に登録するとただの文字列になるため、配列やオブジェクトを登録する場合はJSONコードにシリアライズ化する必要がある
  localStorage.todoList = JSON.stringify(todoListRef.value);
  // 登録後は入力を空にする
  todoRef.value = '';
};
const isEditRef = ref(false); //編集ボタンを押したときにtrueにする
let editId = -1;

// showTodoで受け取ったIDを利用して、入力欄に編集するTODOを表示させる
// v-modelで連動している変数todoRefに値を入れる
// todoリスト(todoListRef)から該当のIDを持つオブジェクトを探す
// 配列から目的のデータを取得するにはfind関数を使う
const showTodo = (id) => {
  // 配列（todoListRef.value）から引数のidと同じ要素を検索する
  // findの「（todo）」には配列の要素が引数として順番に入る
  // 「todo.id === id」がtrueならその時点の要素:todoが返る
  const todo = todoListRef.value.find((todo) => todo.id === id);
  todoRef.value = todo.task; //取得した要素からtaskを取り出す
  isEditRef.value = true;
  editId = id;
};

const editTodo = () => {
  //変更ボタンを押した
  // 編集対象となるTODOを取得
  const todo = todoListRef.value.find((todo) => todo.id === editId);

  // TODOリストから編集対象のインデックスを取得
  const idx = todoListRef.value.findIndex((todo) => todo.id === editId);

  // taskを編集後のTODOで置き換え
  todo.task = todoRef.value;

  // splice関数でインデックスを元に対象オブジェクトを置き換え
  todoListRef.value.splice(idx, 1, todo);

  localStorage.todoList = JSON.stringify(todoListRef.value); // ローカルストレージに保存
  isEditRef.value = false; //編集モードを解除
  editIndex = -1; // IDを初期値に戻す
  todoRef.value = '';
};
const deleteTodo = (id) => {
  const { todo, idx } = useTodoList(id);
  const delMsg = '「' + todo.task + '」を削除しますか？';
  if (!confirm(delMsg)) return;

  todoListRef.value.splice(idx, 1);
  localStorage.todoList = JSON.stringify(todoListRef.value);
};
</script>
<template>
  <div class="box-input">
    <input
      type="text"
      class="todo-input"
      v-model="todoRef"
      placeholder="+ TODOを入力"
    />
    <button class="btn green" @click="editTodo" v-show="isEditRef">変更</button>
    <button class="btn" @click="addTodo" v-show="isEditRef">追加</button>
  </div>

  <div class="box-list">
    <div class="todo_list" v-for="todo in todoListRef" :key="todo.id">
      <div class="todo">
        <input type="checkbox" class="check" /><label>{{ todo.task }}</label>
      </div>
      <div class="btns">
        <button class="btn green" @click="showTodo(todo.id)">編</button>
        <button class="btn pink" @click="deleteTodo(todo.id)">削</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box_list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.todo_list {
  display: flex;
  align-items: center;
  gap: 8px;
}

.todo {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 12px;
  width: 300px;
}

.check {
  border: 1x solid red;
  transform: scale(1.6);
  margin: 0 16px 2px 6px;
}

.btns {
  display: flex;
  gap: 4px;
}

.green {
  background-color: #00c853;
}
.pink {
  background-color: #ff4081;
}

.box_input {
  margin-top: 20px;
}
.todo_input {
  width: 300px;
  margin-right: 8px;
  padding: 8px;
  font-size: 18px;
  border: 1px solid #aaa;
  border-radius: 6px;
}

.btn {
  padding: 8px;
  background-color: #03a9f4;
  border-radius: 6px;
  color: #fff;
  text-align: center;
  font-size: 14px;
}
</style>
