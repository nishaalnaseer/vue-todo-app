<script setup lang="ts">
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

const currentSegment = route.path.split("/")[1] ?? "";
const toSegment = props.to.split("/")[1] ?? "";

function getSvg(color: string, props: Props): string {
  return `/src/assets/svgs/${props.icon}-${color}.svg`;
}

function mainClass(): string {
  let base = `px-6 flex flex-row w-full justify-center items-center
               rounded-sm font-semibold h-[40px] `;
  if(toSegment === currentSegment) {
    base += ` text-white bg-red-700`;
  } else {
    base += ` hover:bg-red-700 group text-black hover:text-white cursor-pointer`;
  }
  return base;
}

function getWhiteSVGClass(): string {
  let base = "select-none";
  if(toSegment === currentSegment) {
    base += ""
  } else {
    base += " hidden group-hover:block";
  }
  return base;
}

function displayBlackSvg(): boolean {
  return toSegment === currentSegment;
}


</script>

<template>
  <component
    :is="!displayBlackSvg() ? RouterLink : 'div'"
    :to="!displayBlackSvg() ? props.to : undefined">
    <button class="w-full px-2 py-0.25">
      <div :class="mainClass()">
        <span class="px-2">{{ props.label }}</span>
        <img
          v-if="!displayBlackSvg()"
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