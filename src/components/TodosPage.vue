<script setup lang="ts">

import AppRoot from "./AppRoot.vue";
import type {Todo} from "../models"
import {ref, watch} from "vue";

const todosValue: Map<string, Todo> = new Map();
for (let i = 1; i <= 50; i++) {
  const key = `todo-${i}`;
  const value: Todo = {
    todo: `Demo Todo #${i}`,
    date: new Date(2025, 9, i % 30 + 1)
  };
  todosValue.set(key, value);
}

const todos = ref<Map<string, Todo>>(todosValue);
const isOverlayOpen = ref(false);
let selectedTodo: Todo | null = null;

function showTodo(todo: Todo) {
  isOverlayOpen.value = true;
  selectedTodo = todo;
}

function closeOverlay() {
  isOverlayOpen.value = false;
}

watch(isOverlayOpen, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});

</script>

<template>
  <AppRoot>
    <div
      v-if="isOverlayOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center
      justify-center z-50"
      @click.self="closeOverlay"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg min-w-[300px] max-w-[400px]">
        <div class="w-full flex justify-center">
          <h2 class="text-xl font-semibold text-red-700 mb-2">Todo Details</h2>
        </div>
        <div>
          <span class="font-semibold">Date:</span>
          <span class="px-2">{{ selectedTodo?.date.toUTCString() }}</span>
        </div>
        <div>
          <span class="font-semibold">Todo:</span>
          <span class="px-2">{{ selectedTodo?.todo }}</span>
        </div>

        <div class="w-full flex justify-center">
          <button @click="closeOverlay"
            class="text-red-500 hover:text-red-600 cursor-pointer border
            border-red-400 hover:hover-red-600 px-2 rounded-sm
             bg-red-50 hover:bg-red-100 mt-2">
              Close
          </button>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center flex-col">
      <div class="text-2xl font-semibold text-red-800 text-center py-2">
        Todos
      </div>

      <table class="table-auto border-collapse w-full text-left rounded-full
          text-sm">
        <thead class="bg-gray-200 ">
          <tr class="w-full">
            <th class="px-4 py-2 font-medium text-gray-700">Date</th>
            <th class="px-4 py-2 font-medium text-gray-700">Todo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="[id, todo] in todos" :key="id" @click="showTodo(todo)"
               class="hover:bg-gray-100 cursor-pointer">
            <td class="px-4 py-2">{{ todo.date.toUTCString() }}</td>
            <td class="px-4 py-2">{{ todo.todo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AppRoot>
</template>

<style scoped>

</style>