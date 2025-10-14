<script setup lang="ts">
import {ref} from 'vue';

const props = defineProps<{
  hint: string
  initialValue?: string
  disabled?: boolean | null,
  constant?: boolean | null,
}>();

const constant = props.constant ?? false;
const disabled = props.disabled ?? false;
const initialValue = props.initialValue == null ? new Date()
    : new Date(props.initialValue);

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
  getValue: () => new Date(value.value) // Convert string back to Date
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
         class="p-2 border-2 border-gray-300 focus:border-gray-500
         transition-colors focus:outline-none rounded-lg text-gray-700
         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
         [&::-webkit-inner-spin-button]:appearance-none w-full">
</template>