<script setup lang="ts">
import {ref} from "vue";
import type {Mode} from "../../models.ts";

const props = defineProps<{
  hint: string,
  initialValue?: string | number,
  autocomplete?: string | null,
  disabled: boolean,
  constant?: boolean | null,
  onChanged?(value: string | number): void,
  onFocus?(): void,
  onFocusLost?(): void,
}>();

const initialValue = props.initialValue;
const value = ref(initialValue ?? "");
const autocomplete = props.autocomplete ?? "off";
const disabled = ref(props.disabled);
const constant = props.constant ?? false;
const erred = ref(false);

function handleInput() {
  if(props.onChanged != null) {
    console.log(value.value);
    props.onChanged(value.value);
  }
}

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
    if(props.hint == "UID") {
      console.log(`UID ${_value}`);
    }
    value.value = _value;
  }
});

function onFocus() {
  if(props.onFocus) {
    props.onFocus();
  }
}

function onFocusLost() {
  if(props.onFocusLost) {
    props.onFocusLost();
  }
}

</script>

<template>
  <div class="w-full">
    <div>
      <span class="text-gray-800 text-lg font-semibold">{{ props.hint }}</span>
      <span class="text-gray-800 text-lg font-semibold pr-2" v-if="constant">:</span>
      <span class="text-gray-800 text-lg" v-if="constant">{{ value }}</span>
    </div>
    <input
      v-if="!constant"
      v-model="value"
      :disabled="disabled"
      @focus="onFocus()"
      @blur="onFocusLost()"
      @input="handleInput"
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