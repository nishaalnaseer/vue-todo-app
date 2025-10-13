<script setup lang="ts">
import { defineProps } from 'vue';
import {RouterLink, useRoute} from 'vue-router';

const route = useRoute();

interface Props {
  label: string;
  to: string;
  icon: string;
  dimensions?: string;
}

const props = defineProps<Props>();
const dimensions = props.dimensions ?? 'h-[26px] w-[26px]';

function getSvg(color: string, props: Props): string {
  return `/src/assets/svgs/${props.icon}-${color}.svg`;
}

function mainClass(): string {
  let base = `px-6 flex flex-row w-full justify-center items-center
               rounded-sm font-semibold h-[40px] `;
  if(route.path === props.to) {
    base += ` text-white bg-red-700`;
  } else {
    base += ` hover:bg-red-700 group text-black hover:text-white cursor-pointer`;
  }
  return base;
}

function getWhiteSVGClass(): string {
  let base = "select-none";
  if(route.path === props.to) {
    base += " block"
  } else {
    base += " hidden group-hover:block";
  }
  return base;
}

function displayBlack(): boolean {
  return route.path !== props.to;
}


</script>

<template>
  <component
    :is="displayBlack() ? RouterLink : 'div'"
    :to="displayBlack() ? props.to : undefined">
    <button class="w-full px-2 py-0.25">
      <div :class="mainClass()">
        <span class="px-2">{{ props.label }}</span>
        <img
          v-if="displayBlack()"
          :src="getSvg('b', props)"
          :class="`${dimensions} group-hover:hidden select-none`"
          alt=""
        />
        <img
          :src="getSvg('w', props)"
          :class="`${dimensions} ${getWhiteSVGClass()}`"
          alt=""
        />
      </div>
    </button>
  </component>
</template>

<style scoped>

</style>