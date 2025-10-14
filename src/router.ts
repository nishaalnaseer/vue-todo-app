// src/router.ts
import { createRouter, createWebHistory } from 'vue-router';

// Import your pages/components
import TodosPage from './components/TodosPage.vue';
import HomePage from './components/TodoCreation.vue';
import UsersPage from "./components/UsersPage.vue";

const routes = [
  { path: '/', component: HomePage },
  { path: '/todos/:pageNumber/:pageSize', component: TodosPage },
  { path: '/users/:pageNumber/:pageSize', component: UsersPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
