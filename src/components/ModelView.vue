<script setup lang="ts">
import {
  PaginatedEntity,
  type FormFieldType,
  type ApplicationModelFields,
  type Mode,
  type ApplicationFormFieldMetaData,
  type ApplicationBaseObject,
  type ApplicationBaseField
} from "../models.ts";
import {responseToStr, startLoading, stopLoading} from "../base.ts";
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
  setValue: (value: ApplicationBaseField) => void;
}

interface MountedComponent {
  component: FormComponents;
  metadata: ApplicationFormFieldMetaData,
  props: Record<any, any>;
}

const props = defineProps<{
  appModel: PaginatedEntity
  object: ApplicationModelFields | null,
  refreshPage: (showLoading: boolean) => Promise<void>;
}>();

const orderedFields = orderFields(props.appModel.metadata);
const appModel = ref(props.appModel);
const object = ref(props.object);
const requestErr = ref("");
const componentMap: Record<FormFieldType, FormComponents> = {
  "TextInputField": TextInputField,
  "DateInputField": DateInputField,
  "CheckBoxInputField": CheckBoxInputField,
} as const;

const mountedComponents: Record<string, MountedComponent> = {};
// Store refs separately
const componentRefs: Record<string, Ref<FieldComponentInstance | null>> = {};

const mode: Ref<Mode> = ref(props.object != null ? "View" : "Create");

for (const [key, meta] of Object.entries(appModel.value.metadata)) {
  const fieldData = object.value?.fields.find(f => f.title === key);
  let initialValue = null;
  if(fieldData == null) {
    if(!meta.dumpOnCreate) {
      continue;
    }

  } else {
    initialValue = fieldData!.value;
  }

  componentRefs[key] = ref(null); // Create ref for each component
  mountedComponents[key] = {
    component: componentMap[meta.formInputType],
    metadata: meta,
    props: {
      hint: meta.title,
      disabled: (meta.formOverrideAsReadOnly || mode.value == 'View'),
      constant: meta.formOverrideAsReadOnly,
      initialValue: initialValue,
    },
  };
}

// Function to set ref
const setComponentRef = (key: string) => (el: any) => {
  componentRefs[key]!.value = el;
};

function getCreateData(): Record<string, any> | null {
  const values: Record<string, any> = {};
  let erred = false;
  for (const [key, _] of Object.entries(mountedComponents)) {
    const ref = componentRefs[key]?.value;
    if (ref) {
      const meta = appModel.value.metadata[key];
      if(!meta) {
        console.error(`Metadata for key ${key} not found`);
        continue;
      }

      if(!meta.dumpOnCreate) {
        continue;
      }

      const value = meta.fieldValidation(ref.getValue());
      if(value === null) {
        erred = erred || true;
        ref.errOut();
      } else {
        ref.greyOut();
        values[meta.jsonKey] = value;
      }
    } else {
      console.log(`Ref value for key ${key} not found`);
    }
  }
  if(erred) {
    return null;
  }

  return values;
}

function getUpdateData(): Record<string, any> | null {
  const values: Record<string, any> = {};
  let erred = false;
  for (const [key, _] of Object.entries(mountedComponents)) {
    const ref = componentRefs[key]?.value;
    if (ref) {
      const meta = appModel.value.metadata[key];
      if(!meta) {
        console.error(`Metadata for key ${key} not found`);
        continue;
      }

      if(!meta.dumpOnUpdate) {
        continue;
      }

      const value = meta.fieldValidation(ref.getValue());
      if(value === null) {
        erred = erred || true;
        ref.errOut();
      } else {
        ref.greyOut();
        values[meta.jsonKey] = value;
      }
    } else {
      console.log(`Ref value for key ${key} not found`);
    }
  }
  if(erred) {
    return null;
  }

  return values;
}

async function onSave() {
  let data: Record<string, any> | null = {};
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
  if(!data) {
    return;
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
      requestErr.value = await responseToStr(response);
    } else {
      requestErr.value = "";
      const resource: ApplicationBaseObject = await response.json();
      const fields = [];
      for (const [key, meta] of
        Object.entries(appModel.value.metadata)) {
        let fieldValue = resource[meta.jsonKey];

        if(fieldValue == null) {
          console.error(`field value for ${key} is ${fieldValue}`);
          continue;
        }

        if(meta.fromJson != null) {
          fieldValue = meta.fromJson(fieldValue);
        }

        fields.push(
          {
            title: meta.title,
            value: fieldValue,
          },
        )
      }

      for (const [key, _] of Object.entries(mountedComponents)) {
        const fieldData = fields.find(f => f.title === key);
        const ref = componentRefs[key]?.value;
        if(!ref) {
          console.error(`Ref for key ${key} not found!`);
          continue;
        }
        if(!fieldData) {
          console.error(`fieldData for key ${key} not found!`);
          continue;
        }

        ref.setValue(fieldData.value);
      }

      mode.value = 'View';
      props.refreshPage(false).then(_ => _);
    }
  } catch (exc) {
    requestErr.value = "Error connecting to server";
    console.error("error sending request");
  } finally {
    stopLoading();
  }
  console.log(requestErr.value);
}

function getHeading(mode: string): string {
  switch (mode) {
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


function setMode(_mode: Mode) {
  mode.value = _mode;
  for (const [_, value] of Object.entries(componentRefs)) {
    value.value?.setMode(_mode);
  }
}


function orderFields(
  metadata: Record<string, ApplicationFormFieldMetaData>
): ApplicationFormFieldMetaData[][] {
  const rows: ApplicationFormFieldMetaData[][] = [];

  Object.values(metadata).forEach(field => {
    const row = field.positionRow;
    const col = field.positionColumn;

    if (!rows[row]) rows[row] = [];
    rows[row][col] = field;
  });

  return rows;
}

</script>

<template>
<div class="">
  <div class="w-full flex justify-center">
    <div class="text-xl font-semibold text-gray-700 mb-2">
      {{ getHeading(mode) }}
    </div>
  </div>

  <div class="flex flex-row-reverse">
    <button v-show="mode === 'View'"
            class="mx-1 border-2 px-4 py-1 rounded-4xl text-red-500
       font-semibold border-red-500 hover:text-red-700 hover:border-red-700
       transition-all duration-300 cursor-pointer" @click="setMode('Edit')">
         Edit
    </button>
    <button v-show="mode !== 'Create'"
            class="mx-1 border-2 px-4 py-1 rounded-4xl  text-red-500
       font-semibold border-red-500 hover:text-red-700 hover:border-red-700
       transition-all duration-300 cursor-pointer" @click="setMode('Create')">
         New
    </button>
  </div>

  <div class="flex flex-col w-full space-y-1">
    <div v-for="(row, rowIndex) in orderedFields">
      <div class="flex gap-2" :key="rowIndex">
        <template v-for="field in row" :key="field.jsonKey">
          <component
            v-if="mode != 'Create' || field.dumpOnCreate"
            :ref="setComponentRef(field.title)"
            :is="componentMap[field.formInputType] as Component"
            v-bind="mountedComponents[field.title]!.props"
          />
        </template>
      </div>
    </div>
    <div v-if="requestErr !== ''"
         class="justify-center text-red-600 font-semibold flex w-full">
      {{requestErr}}
    </div>
    <div class="flex justify-center pt-2" v-if="mode != 'View'">
      <button class="border px-4 py-2 rounded-lg bg-red-700 text-white
       font-semibold border-red-700 hover:bg-red-800
       transition-all duration-300 cursor-pointer" @click="onSave()">
         Save
      </button>
    </div>
  </div>
</div>
</template>