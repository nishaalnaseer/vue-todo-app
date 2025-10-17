<script setup lang="ts">

import AppRoot from "./AppRoot.vue";
import {
  type ApplicationModelFields, PaginatedEntity
} from "../models.ts";
import {apiRoot} from "./../konstants.ts";
import { onMounted, ref, watch, computed } from "vue";
import {RouterLink, useRoute} from "vue-router";
import ModelView from "./ModelView.vue";
import {startLoading, stopLoading} from "../base.ts";

const route = useRoute();

const props = defineProps<{appModel: PaginatedEntity}>();

const appModel = ref(props.appModel);
const isOverlayOpen = ref(false);
const paginationTokens = ref<string[]>([]);
const segment = computed(() => route.path.split('/')[1] ?? "");
let selectedResource: ApplicationModelFields | null = null;

const componentMap = {
  users: ModelView,
  todos: ModelView,
} as const;


function closeOverlay() {
  isOverlayOpen.value = false;
}


async function fetchData(showLoading: boolean = true) {
  const pageNumber = route.params.pageNumber;
  const pageSize = route.params.pageSize;
  const url = `${apiRoot}${appModel.value.getResourcesRoute}/${pageNumber}/${pageSize}`
  try {
    if(showLoading) {
      startLoading();
    }

    const response = await fetch(url);
    if(response.status != 200) {
      console.error(`Got unexpected status code ${response.status}
      \nContent: ${await response.text()}`);
      return;
    }
    await appModel.value.onResponse(response);
    paginationTokens.value = getPaginationTokens();
  } catch (exc) {
    console.error('Error loading data: ', exc)
  } finally {
    if(showLoading) {
      stopLoading();
    }
  }
}

// Call on mount
onMounted(() => {
  fetchData();
});

// Watch for route parameter changes
watch(() => route.params, () => {
  fetchData();
}, { deep: true });
watch(isOverlayOpen, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});

function getPaginationTokens(): string[] {
  const currentPage: number = appModel.value.current_page;
  const totalPages: number = appModel.value.totalPages;

  const tokens: string[] = [];
  let leftPartEnd = currentPage - 2;
  let rightPartEnd = currentPage + 3;
  if(leftPartEnd < 1) {
    leftPartEnd = 1;
  }
  if(rightPartEnd > totalPages) {
      rightPartEnd = totalPages;
  }

  if(leftPartEnd != 1) {
    tokens.push('1');
    if(leftPartEnd != 2) {
      tokens.push('...');
    }
  }

  for(let currentNum = leftPartEnd; currentNum < currentPage; currentNum++) {
    tokens.push(`${currentNum}`);
  }
  tokens.push(`${currentPage}`);

  if(currentPage < totalPages) {
    for(let currentNum = currentPage+1; currentNum < rightPartEnd; currentNum++) {
      tokens.push(`${currentNum}`);
    }
  }

  if(rightPartEnd !== totalPages) {
    tokens.push("...")
  }

  if(currentPage < totalPages) {
    tokens.push(`${totalPages}`);
  }
  return tokens;
}


function showResource(resource: ApplicationModelFields) {
  isOverlayOpen.value = true;
  selectedResource = resource;
}


function onNew() {
  selectedResource = null;
  isOverlayOpen.value = true;
}

</script>

<template>
  <div
    v-if="isOverlayOpen"
    @click.self="closeOverlay"
    class="fixed inset-0 bg-black/50 backdrop-blur-xs
    flex items-center justify-center z-50 " style="overflow: auto;">
    <div class="bg-white rounded-lg p-4 w-128 max-h-[90vh] overflow-y-auto
    flex flex-col"
         @click.stop>
      <component
        v-if="componentMap[segment as keyof typeof componentMap]"
        :is="componentMap[segment as keyof typeof componentMap]"
        :appModel="appModel"
        :refreshPage="fetchData"
        :object="selectedResource"/>
    </div>
  </div>
  <AppRoot>
    <div class="py-2 w-full text-center font-bold text-gray-700 text-lg">
      {{ appModel.paginatedHeading }}
    </div>
    <div class="p-2 w-full text-end font-bold text-gray-700 text-lg">
      <button class="mx-1 border-2 px-4 py-1 rounded-4xl  text-red-500
       font-semibold border-red-500 hover:text-red-700 hover:border-red-700
       transition-all duration-300 cursor-pointer" @click="onNew()">
           New
      </button>
    </div>
    <div class="overflow-x-auto rounded-lg border border-gray-300 mb-2">
      <table class="table-auto border-collapse w-full text-left text-sm">
        <thead class="bg-gray-200 ">
          <tr>
            <th v-for="header in Object.values(appModel.metadata)"
                :key="header.title"
                class="px-4 py-2 font-medium text-gray-700">
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in appModel.resources"
              class="hover:bg-gray-100 h-12 text-left text-sm cursor-pointer"
              @click="showResource(row)">
            <td v-for="cell in row.fields.filter(
                c => appModel.metadata[c.title]?.showOnTable ?? false
              )"
              class="font-medium text-gray-600 px-4 py-2">
                {{ appModel.toStr(cell) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="w-full flex">
      `<div class="flex-1 px-2 py-4">
        <div>
          Showing page {{ route.params.pageNumber }} of {{ appModel.totalPages }}
        </div>
      </div>`
      <div class="flex-1 px-4 py-4 flex justify-end flex-row">

        <RouterLink
          :to="`/${segment}/${appModel.current_page-1}/${appModel.rows_per_page}`"
          v-if="appModel.current_page !== 1">
          <img src="/src/assets/svgs/right-arrow.svg" alt="Users"
             class="h-[30px] w-[30px] px-1 select-none cursor-pointer rotate-180">
        </RouterLink>

        <div class="h-full items-center flex" id="page-numbers">
          <div v-for="token in paginationTokens">
            <div v-if="token === '...' " class="px-0.5">{{ token }} </div>
            <RouterLink
              :to="`/${segment}/${token}/${appModel.rows_per_page}`"
              v-if="token !== '...' && parseInt(token) !== appModel.current_page">
              <div class="px-0.5 font-semibold cursor-pointer">
                {{ token }}
              </div>
            </RouterLink>
            <div v-if="token !== '...' && parseInt(token) === appModel.current_page"
              class="px-0.5 font-semibold text-red-600">
              {{ token }}
            </div>
          </div>
        </div>

        <RouterLink
          :to="`/${segment}/${appModel.current_page+1}/${appModel.rows_per_page}`"
          v-if="appModel.current_page !== appModel.totalPages">
          <img src="/src/assets/svgs/right-arrow.svg" alt="Users"
             class="h-[30px] w-[30px] px-1 select-none cursor-pointer">
        </RouterLink>

      </div>
    </div>
  </AppRoot>
</template>

<style scoped>

</style>