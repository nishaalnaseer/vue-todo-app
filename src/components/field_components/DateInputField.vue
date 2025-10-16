<script setup lang="ts">
import {ref} from 'vue';
import type {Mode} from "../../models.ts";

const props = defineProps<{
  hint: string
  initialValue?: Date | undefined
  disabled: boolean,
  constant?: boolean | null,
}>();

const constant = props.constant ?? false;
const disabled = ref(props.disabled);
const initialValue = props.initialValue ?? new Date();
const erred = ref(false);

// Convert Date to YYYY-MM-DD format for input
function dateToInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const value = ref(dateToInputValue(initialValue));

function parseDate(value: Date): string {
  const shifted = new Date(value.getTime() + 5 * 60 * 60 * 1000);
  return shifted.toUTCString().replace("GMT", "");
}

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  value.value = target.value;
};

defineExpose({
  getValue: () => new Date(value.value),
  errOut: () => erred.value = true,
  greyOut: () => erred.value = false,
  setMode: (mode: Mode) => {
    switch (mode) {
      case "Create":
        value.value = dateToInputValue(new Date());
        disabled.value = false;
        break
      case "Edit":
        if(!constant) {
          disabled.value = false;
        }
        break;
      default:
        throw "unimplemented"
    }
  },
  setValue: (value: string | Date | boolean) => {

  }
});


</script>

<template>
  <div>
    <span class="text-gray-800 text-lg font-semibold">{{ props.hint }}</span>
    <span class="text-gray-800 text-lg font-semibold pr-2" v-if="constant">:</span>
    <span class="text-gray-800 text-lg" v-if="constant">
      {{ parseDate(initialValue) }}
    </span>
  </div>
  <input v-if="!constant" type="date"
         min="2024-01-01"
         max="2025-12-31"
         :disabled="disabled"
         :value="value"
         @input="handleInput"
         autocomplete="off"
         :class="['p-2 border-2',
           'transition-colors focus:outline-none rounded-lg text-gray-700',
           '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none',
           '[&::-webkit-inner-spin-button]:appearance-none w-full',
           erred
             ? 'border-red-300 focus:border-red-500'
             : 'border-gray-300 focus:border-gray-500'
         ]">
</template>