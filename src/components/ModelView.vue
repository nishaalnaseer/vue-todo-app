<script setup lang="ts">

import {
  PaginatedEntity, type FormFieldType,
  type ApplicationModelFields, type Mode
} from "../models.ts";
import {startLoading, stopLoading} from "../base.ts";
import CheckBoxInputField from "./field_components/CheckBoxInputField.vue";
import TextInputField from "./field_components/TextInputField.vue";
import {type Component, type Ref, ref} from "vue";
import DateInputField from "./field_components/DateInputField.vue";
import {apiRoot} from "../konstants.ts";

type FormComponents = typeof TextInputField | typeof DateInputField
    | typeof CheckBoxInputField;


interface FieldComponentInstance {
  getValue: () => string | Date | boolean;
  errOut: () => void;
  greyOut: () => void;
  setMode: (mode: Mode) => void;
  setValue: (value: string | Date | boolean) => void;
}

const mode: Ref<Mode> = ref("Edit");

interface MountedComponent {
  component: FormComponents;
  props: Record<any, any>;
  ref: Ref<FieldComponentInstance | null>;  // Changed this line
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
  if(fieldData == undefined) {
    console.error(`Field data undefined for title ${key}`);
    continue;
  }
  mountedComponents[key] = {
    component: componentMap[meta.formInputType],
    ref: ref(null),
    props: {
      hint: meta.title,
      disabled: meta.formOverrideAsReadOnly,
      constant: meta.formOverrideAsReadOnly,
      initialValue: fieldData!.value,
    },
  };
}


function getCreateData(): Record<string, any> {
  const values: Record<string, any> = {};
  for (const [key, mounted] of Object.entries(mountedComponents)) {
    if (mounted.ref.value && 'getValue' in mounted.ref.value) {

      const meta = appModel.value.metadata[key];
      if(!meta) {
        console.error(`Metadata for key ${key} not found`)
        continue;
      }

      if(!meta.dumpOnCreate) {
        continue;
      }

      values[key] = mounted.ref.value.getValue();
    }
  }
  console.log(values);
  return values;
}

function getUpdateData(): Record<string, any> {
  const values: Record<string, any> = {};
  for (const [key, mounted] of Object.entries(mountedComponents)) {
    // mounted.ref.
    if (mounted.ref.value && 'getValue' in mounted.ref.value) {
      const meta = appModel.value.metadata[key];
      if(!meta) {
        console.error(`Metadata for key ${key} not found`);
        continue;
      }

      if(!meta.dumpOnUpdate) {
        continue;
      }

      values[key] = mounted.ref.value.getValue();
    } else {
      console.log(`Ref value for key ${key} not found`);
    }
  }
  console.log(values);
  return values;
}


async function onSave() {
  let data = {};
  let method = "";
  switch (mode.value) {
    case "Create":
      data = getCreateData();
      method = "POST";
      break;
    case "Edit":
      data = getUpdateData();
      method = "PATCH";
      break;
    case "View":
      return;
    default:
      throw "Unimplemented switch case statement onSave";
  }
  startLoading();

  try {
    const response = await fetch(
      `${apiRoot}/user`,
      {
        method: method,
        body: JSON.stringify(data),
        headers: {
          "Accept": "Application/json",
          "Content-type": "Application/json",
        }
      }
    );
    if(response.status != 201) {
      // todo
    } else {

    }
  } catch (exc) {
    // todo
    console.error("error sending request");
  } finally {
    stopLoading();
  }
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
      :ref="field.ref"
      :is="(field.component as Component)"
      v-bind="field.props"/>

    <div class="flex justify-center pt-2">
      <button class="border px-4 py-2 rounded-lg bg-red-700 text-white
       font-semibold border-red-700 hover:bg-red-800
       transition-all duration-300 cursor-pointer" @click="onSave()">
         Save
      </button>
    </div>
  </div>
</div>
</template>