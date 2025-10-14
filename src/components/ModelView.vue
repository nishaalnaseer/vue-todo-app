<script setup lang="ts">

import {
  PaginatedEntity, type FormFieldType,
  type ApplicationModelFields
} from "../models.ts";
import CheckBoxInputField from "./field_components/CheckBoxInputField.vue";
import TextInputField from "./field_components/TextInputField.vue";
import {type Component, type Ref, ref} from "vue";
import DateInputField from "./field_components/DateInputField.vue";

type Modes = | "View" | "Create" | "Edit";
type FormComponents = typeof TextInputField | typeof DateInputField
    | typeof CheckBoxInputField;
const mode: Ref<Modes> = ref("View");
interface MountedComponent {
  component: FormComponents;
  props: Record<any, any>;
}

const props = defineProps<{
  appModel: PaginatedEntity
  object: ApplicationModelFields | null,
}>();

const appModel = ref(props.appModel);
const object = ref(props.object);
const componentMap: Record<FormFieldType, FormComponents> = {
  "TextInputField": TextInputField,
  "DateInputField": DateInputField,
  "CheckBoxInputField": CheckBoxInputField,
} as const;
const mountedComponents: Record<string, MountedComponent> = {};
for (const [key, meta] of Object.entries(appModel.value.metadata)) {
  const fieldData = object.value?.fields.find(f => f.title === key);
  const initialVal = fieldData ? meta.toStr(fieldData.value) : null;
  mountedComponents[key] = {
    component: componentMap[meta.formInputType],
    props: {
      hint: meta.title,
      disabled: meta.formOverrideAsReadOnly,
      constant: meta.formOverrideAsReadOnly,
      initialValue: initialVal,
    },
  };
}


function save() {
}

function getHeading(): string {
  switch (mode.value) {
    case "View":
      return appModel.value.formHeadingOnRead;
    case "Edit":
      return appModel.value.formHeadingOnUpdate;
    case "Create":
      return appModel.value.formHeadingOnCreate;
    default:
      throw "Unimplemented view mode";
  }
}

// onMounted(() => {
//   // onLoad();
// })


</script>

<template>
<div class="">
  <div class="w-full flex justify-center">
    <div class="text-xl font-semibold text-gray-700 mb-2">
      {{ getHeading() }}
    </div>
  </div>

  <div class="flex flex-row-reverse">
    <button class="mx-1 border-2 px-4 py-1 rounded-4xl text-red-500
       font-semibold border-red-500 hover:text-red-700 hover:border-red-700
       transition-all duration-300 cursor-pointer">
         Edit
    </button>
    <button class="mx-1 border-2 px-4 py-1 rounded-4xl  text-red-500
       font-semibold border-red-500 hover:text-red-700 hover:border-red-700
       transition-all duration-300 cursor-pointer">
         New
    </button>
  </div>

  <div class="flex flex-col w-full space-y-1">
    <component
      v-for="(field, key) in mountedComponents"
      :key="key"
      :is="(field.component as Component)"
      v-bind="field.props"/>

<!--    <TextInputField hint="UID" ref="idRef" :disabled="true" :constant="true"-->
<!--                    initialValue="520"/>-->
<!--    <TextInputField hint="Name" ref="nameRef"/>-->
<!--    <TextInputField hint="Staff ID" ref="emailRef"/>-->
<!--    <TextInputField hint="Email" ref="staffIDRef"/>-->
<!--    <CheckBoxInputField hint="Enabled" class="py-1"/>-->
<!--    <DateComponent hint="Joined" :initialValue="new Date()"/>-->
<!--    <DateComponent hint="User Created" :disabled="true" :constant="true"-->
<!--                   :initialValue="new Date()"/>-->

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