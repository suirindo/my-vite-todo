<script setup>
import { ref } from 'vue';
import { useTodoList } from '/src/composables/useTodoList.js';
const todoRef = ref('');
const isEditRef = ref(false); //編集ボタンを押したときにtrueにする
const { todoListRef, add, show, edit, del, check } = useTodoList();

const addTodo = () => {
  // IDをミリ秒で登録する
  add(todoRef.value);
  // 登録後は入力を空にする
  todoRef.value = '';
};

// showTodoで受け取ったIDを利用して、入力欄に編集するTODOを表示させる
// v-modelで連動している変数todoRefに値を入れる
// todoリスト(todoListRef)から該当のIDを持つオブジェクトを探す
// 配列から目的のデータを取得するにはfind関数を使う
const showTodo = (id) => {
  // 配列（todoListRef.value）から引数のidと同じ要素を検索する
  // findの「（todo）」には配列の要素が引数として順番に入る
  // 「todo.id === id」がtrueならその時点の要素:todoが返る
  todoRef.value = show(id); //取得した要素からtaskを取り出す
  isEditRef.value = true;
};

const editTodo = () => {
  edit(todoRef.value);
  isEditRef.value = false;
  todoRef.value = '';
};
const deleteTodo = (id) => {
  del(id);
};

const changeCheck = (id) => {
  check(id);
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
      <div class="todo" :class="{ fin: todo.checked }">
        <input
          type="checkbox"
          class="check"
          @change="changeCheck(todo.id)"
          :checked="todo.checked"
        />
        <label>{{ todo.task }}</label>
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

.fin {
  text-decoration: line-through;
  background-color: #ddd;
  color: #777;
}
</style>
