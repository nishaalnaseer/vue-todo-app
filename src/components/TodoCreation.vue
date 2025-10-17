<script setup lang="ts">
import { ref } from 'vue';
import AppRoot from "./AppRoot.vue";
import {type Todo, UsersPagination} from "../models"
import ForeignRefInputField from "./field_components/ForeignRefInputField.vue";


const newTodo = ref('');
const todos = ref<Map<string, Todo>>(new Map());

function addTodo() {
  const description = newTodo.value.trim();
  if (!description) return;

  const id = Date.now().toString(); // key for Map
  todos.value.set(
      id, { todo: description, date: new Date(), done: false, id:parseInt(id) }
  );
  newTodo.value = '';
}
function removeTodo(description: string) {
  todos.value.delete(description);
}

</script>

<template>
  <AppRoot>
    <div id="todos" class="w-full flex justify-center py-4">
      <div class="w-128 flex flex-col flex-start px-2 ">
        <div v-for="[id, todo] in todos" :key="id" class="rounded-lg p-3 mb-2
        border-2 border-gray-400">
          <div class="font-semibold text-xl text-gray-700">{{ todo.todo }}</div>
          <div class="text-sm text-gray-700">{{ todo.date.toUTCString() }}</div>
          <span>
            <span class="text-sm text-gray-800">Done?</span>
            <span class="text-sm text-gray-700 px-2">
              {{ todo.done ? "Yes" : "No"}}
            </span>
          </span>

          <div class="flex justify-center w-full pt-4 items-center">
            <button @click="removeTodo(id)"
            class="text-red-500 hover:text-red-600 cursor-pointer border
            border-red-400 hover:hover-red-600 px-2 rounded-sm
             bg-red-50 hover:bg-red-100 items-center">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex py-2 px-2 justify-center">
      <div class="w-64 flex-col flex">
        <input id="add" placeholder="Todo Description"
               v-model="newTodo"
               @keyup.enter="addTodo"
               class="p-2 border-2 border-red-300 focus:border-red-800
               transition-colors
               focus:outline-none rounded-sm text-gray-700 [appearance:textfield]
               [&::-webkit-outer-spin-button]:appearance-none
               [&::-webkit-inner-spin-button]:appearance-none">

        <div>
          <ForeignRefInputField
              hint="Select User"
              :appModel="new UsersPagination()"/>
        </div>

        <button class="my-2 py-2 font-semibold border-2 cursor-pointer
        text-red-700 rounded-sm hover:text-red-800" @click="addTodo">
          Add Todo
        </button>
      </div>
    </div>
  </AppRoot>
</template>

<style scoped>
</style>
