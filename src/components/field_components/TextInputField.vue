<script setup lang="ts">
import {ref} from "vue";

const props = defineProps<{
  hint: string
  initialValue?: string | number,
  autocomplete?: string | null,
  disabled?: boolean | null,
  constant?: boolean | null,
}>();

const initialValue = props.initialValue;
const description = ref(initialValue ?? "");
const autocomplete = props.autocomplete ?? "off";
const disabled = props.disabled ?? false;
const constant = props.constant ?? false;
defineExpose({
  getValue: () => description.value
});
</script>

<template>
  <div class="w-full">
    <div>
      <span class="text-gray-800 text-lg font-semibold">{{ props.hint }}</span>
      <span class="text-gray-800 text-lg font-semibold pr-2" v-if="constant">:</span>
      <span class="text-gray-800 text-lg" v-if="constant">{{ initialValue }}</span>
    </div>
    <input
      v-if="!constant"
      v-model="description"
      :disabled="disabled"
      class="p-2 border-2 border-gray-300 focus:border-gray-500
      transition-colors focus:outline-none rounded-lg text-gray-700
      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
      [&::-webkit-inner-spin-button]:appearance-none w-full"
      :autocomplete="autocomplete">
  </div>

</template>