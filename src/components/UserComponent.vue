<script setup lang="ts">


import {ref} from "vue";
import TextInputField from "./field_components/TextInputField.vue";
import CheckBoxInputField from "./field_components/CheckBoxInputField.vue";
import DateComponent from "./field_components/DateInputField.vue";

const idRef = ref();
const nameRef = ref();
const staffIDRef = ref();
const emailRef = ref();

function save() {
  console.log(idRef.value.getValue());
  console.log(nameRef.value.getValue());
  console.log(staffIDRef.value.getValue());
  console.log(emailRef.value.getValue());
}

</script>

<template>
<div class="">
  <div class="w-full flex justify-center">
    <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ "User Details" }}</h2>
  </div>

  <div class="flex flex-row-reverse">
    <button class="mx-1 border-2 px-4 py-2 rounded-4xl text-red-500
       font-semibold border-red-500 hover:text-red-700 hover:border-red-700
       transition-all duration-300 cursor-pointer">
         Edit
    </button>
    <button class="mx-1 border-2 px-4 py-2 rounded-4xl  text-red-500
       font-semibold border-red-500 hover:text-red-700 hover:border-red-700
       transition-all duration-300 cursor-pointer">
         New
    </button>
  </div>

  <div class="flex flex-col w-full space-y-1">
    <TextInputField hint="UID" ref="idRef" :disabled="true" :constant="true"
                    initialValue="520"/>
    <TextInputField hint="Name" ref="nameRef"/>
    <TextInputField hint="Staff ID" ref="emailRef"/>
    <TextInputField hint="Email" ref="staffIDRef"/>
    <CheckBoxInputField hint="Enabled" class="py-1"/>
    <DateComponent hint="Joined" :initialValue="new Date()"/>
    <DateComponent hint="User Created" :disabled="true" :constant="true"
                   :initialValue="new Date()"/>

    <div class="flex justify-center pt-2">
      <button class="border px-4 py-2 rounded-lg bg-red-700 text-white
       font-semibold border-red-700 hover:bg-red-800
       transition-all duration-300 cursor-pointer" @click="save()">
         Save
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>