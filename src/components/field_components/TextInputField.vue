<script setup lang="ts">
import {ref} from "vue";
import type {Mode} from "../../models.ts";

const props = defineProps<{
  hint: string,
  initialValue?: string | number,
  autocomplete?: string | null,
  disabled: boolean,
  constant?: boolean | null,
}>();

const initialValue = props.initialValue;
const value = ref(initialValue ?? "");
const autocomplete = props.autocomplete ?? "off";
const disabled = ref(props.disabled);
const constant = props.constant ?? false;
const erred = ref(false);

defineExpose({
  getValue: () => value.value,
  errOut: () => erred.value = true,
  greyOut: () => erred.value = false,
  setMode: (mode: Mode) => {
    switch (mode) {
      case "Create":
        value.value = "";
        disabled.value = false;
        break
      case "Edit":
        disabled.value = false;
        break;
      case "View":
        disabled.value = true;
        break;
      default:
        throw "unimplemented"
    }
  },
  setValue: (_value: string | number) => {
    value.value = _value;
  }
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
      v-model="value"
      :disabled="disabled"
      :class="[
        'p-2 border-2 transition-colors focus:outline-none rounded-lg text-gray-700',
        '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none',
        '[&::-webkit-inner-spin-button]:appearance-none w-full',
        erred
          ? 'border-red-300 focus:border-red-500'
          : 'border-gray-300 focus:border-gray-500'
      ]"
      :autocomplete="autocomplete">
  </div>

</template>