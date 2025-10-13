<script setup lang="ts">
import {ref} from "vue";
import NavigationBar from "./open_sesame/NavigationBar.vue";

const isDrawerOpen = ref(false);
function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

function getYear() {
  return new Date().getFullYear();
}

</script>

<template>
<div
  v-show="isDrawerOpen"
  class="fixed inset-0 bg-opacity-50 z-40 backdrop-blur-sm bg-black/50
  flex flex-start"
  @click="toggleDrawer">
  <div class="bg-white w-64" @click.stop>
    <p class="text-lg font-bold text-center w-full text-red-700 p-4"
       id="dashboard-heading">Todo App</p>
    <NavigationBar
      label="Create Todo"
      to="/"
      icon="create"
      dimensions="h-[22px] w-[22px]"/>
    <NavigationBar
      label="Todos"
      to="/todos"
      icon="receipt"/>
    <NavigationBar
      label="Users"
      to="/users/1/10"
      dimensions="h-[44px] w-[44px]"
      icon="users1"/>
  </div>
</div>

  <div>
    <div class="bg-red-600 text-white w-full flex py-2">
      <h1 class="text-white text-xl font-bold">
        <div class="flex-row flex flex-start px-4">
          <span class="text-3xl font-bold text-gray-700 dark:text-gray-300 mr-2
                     hover:text-white transition duration-150
                     ease-in-out cursor-pointer items-center" title="Menu" id="menu"
            @click="toggleDrawer">☰</span>
          <div class="items-center flex">
            Todo App
          </div>
        </div>
      </h1>
    </div>

    <main class="min-h-screen p-4">
      <slot />
    </main>

    <footer class="border-t-2 border-gray-400 py-4 flex justify-center
    bg-gray-300">
      © Todo inc. {{ getYear() }}
    </footer>
  </div>
</template>

<style scoped>

</style>