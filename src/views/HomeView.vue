<script setup lang="ts">
import {useAuthStore} from "@/stores/auth";

const auth = useAuthStore();
</script>

<template>
  <header class="bg-white shadow">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">Home</h1>
    </div>
  </header>
  <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div>
      <div v-if="auth.isAuthenticated()">
        <h1 class="text-2xl text-gray-600">Olá, {{auth.user.name}}</h1>
      </div>
      <div v-else>
        <h1 class="text-2xl text-gray-600">Olá, Visitante!</h1>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>