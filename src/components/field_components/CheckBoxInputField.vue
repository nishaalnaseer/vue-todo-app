<script setup lang="ts">


import {ref} from "vue";
import type {Mode} from "../../models.ts";

const props = defineProps<{
  hint: string
  initialValue?: boolean
  disabled?: boolean | null,
}>();

const initialValue = props.initialValue ?? true;
const disabled = props.disabled ?? false;
const value = ref(initialValue);

defineExpose({
  getValue: () => value.value,
  errOut: () => {
  },
  greyOut: () => {
  },
  setMode: (mode: Mode) => {},
  setValue: (value: string | Date | boolean) => {

  }
});


</script>

<template>
  <div>
    <div class="text-xl flex justify-center ">
      <label class="flex flex-row cursor-pointer hover:bg-red-50
      rounded-sm items-center space-x-2 select-none">
        <span class="px-2">{{ hint }}</span>
        <input class="w-5 h-5 accent-red-700 cursor-pointer"
               type="checkbox"
               autocomplete="off"
               :disabled="disabled" v-model="value">
      </label>
    </div>
  </div>
</template>

<style scoped>

</style>