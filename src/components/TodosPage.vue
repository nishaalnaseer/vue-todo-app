<script setup lang="ts">

import PaginatedModelsView from "./PaginatedModelsView.vue";
import {TodoPagination} from "../models.ts";
</script>

<template>
<PaginatedModelsView :appModel="new TodoPagination()"/>
</template>

<style scoped>

</style>