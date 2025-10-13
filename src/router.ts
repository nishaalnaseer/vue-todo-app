// src/router.ts
import { createRouter, createWebHistory } from 'vue-router';

// Import your pages/components
import TodosPage from './components/TodosPage.vue';
import HomePage from './components/TodoCreation.vue';
import PaginatedModelsView from "./components/PaginatedModelsView.vue";

const routes = [
  { path: '/', component: HomePage },
  { path: '/todos', component: TodosPage },
  { path: '/users/:pageNumber/:pageSize', component: PaginatedModelsView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
