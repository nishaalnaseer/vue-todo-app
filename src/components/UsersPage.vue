<script setup lang="ts">

import PaginatedModelsView from "./PaginatedModelsView.vue";
import {UsersPagination} from "../models.ts";
</script>

<template>
  <PaginatedModelsView :appModel="new UsersPagination()"/>
</template>