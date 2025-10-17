<script setup lang="ts">
import {type Ref, ref} from "vue";
import {
  type ApplicationBaseField, type ApplicationBaseObject,
  type Mode, PaginatedEntity
} from "../../models.ts";
import TextInputField from "./TextInputField.vue";
import {apiRoot} from "../../konstants.ts";

// todo fix this when its coming from ModelView
const props = defineProps<{
  hint: string;
  appModel: PaginatedEntity,
  disabled?: boolean,
  initialSelection?: ApplicationBaseObject
}>();
console.log(JSON.stringify(props.initialSelection));

const debounceMs = 300;

const textInputField: Ref<InstanceType<typeof TextInputField> | null> = ref(null);
let selectedObjectID: ApplicationBaseField = 0;

if(props.initialSelection) {
  selectedObjectID = props.appModel.getUniqueID(props.initialSelection);
}

const results = ref<ApplicationBaseObject[]>([]);
const showResults = ref(false);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const searchAPI = async (query: string) => {
  try {
    const url = new URL(`${apiRoot}${props.appModel.getResourcesRoute}/1/5`);
    url.searchParams.append("search", query);

    const response = await fetch(url.toString());

    if (response.status !== 200) {
      console.error("Got unexpected status code from server");
      return
    }

    const data = await response.json();
    // Fix: Check for data.page instead of data.results
    results.value = data.page;
    showResults.value = true;
    // emit("results", results.value);
  } catch (error) {
    results.value = [];
    showResults.value = false;
  } finally {
  }
};

function handleInput(value: string) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    searchAPI(value);
  }, debounceMs);
}

const selectResult = (result: ApplicationBaseObject) => {
  if (textInputField.value) {
    textInputField.value?.setValue(props.appModel.getUniqueStr(result));
  }
  selectedObjectID = props.appModel.getUniqueID(result);
  showResults.value = false;
  // emit("select", result);
};

const handleBlur = () => {
  setTimeout(() => {
    showResults.value = false;
  }, 200);
};

defineExpose({
  getValue: () => selectedObjectID,
  errOut: () => {
    textInputField.value?.errOut();
  },
  greyOut: () => {
    textInputField.value?.greyOut();
  },
  setMode: (mode: Mode) => {
    textInputField.value?.setMode(mode);
  },
  setValue: (_value: ApplicationBaseObject) => {
    textInputField.value?.setValue(props.appModel.getUniqueStr(_value));
    selectedObjectID = props.appModel.getUniqueID(_value);
  }
});
</script>

<template>

  <div class="w-full relative">
    <div class="relative">
      <TextInputField
        ref="textInputField"
        @focus="results.length > 0 ? showResults = true : null"
        :onFocusLost="handleBlur"
        :disabled="props.disabled"
        :hint="`${props.hint}`"
        autocomplete="off"
        :onChanged="handleInput"
      />
    </div>

    <div
      v-if="showResults && results.length > 0"
      class="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300
      rounded-lg shadow-lg max-h-60 overflow-y-auto">
      <div
        v-for="result in results"
        :key="appModel.getUniqueID(result)"
        @click="selectResult(result)"
        class="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200
        last:border-b-0 transition-colors">
        <slot name="result" :result="result">
          <div class="text-gray-800">{{appModel.getUniqueStr(result)}}</div>
        </slot>
      </div>
    </div>

    <div
      v-if="showResults && results.length === 0"
      class="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300
      rounded-lg shadow-lg p-3 text-gray-500 text-center">
      No results found
    </div>
  </div>
</template>