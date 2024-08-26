<script setup lang="ts">
import {RouterLink, RouterView, useRouter} from 'vue-router'
import { ref } from 'vue'
import {useAuthStore} from "@/stores/auth";
import api from "@/plugins/axios";
import {ElNotification} from "element-plus";

const auth = useAuthStore();
const router = useRouter();

let isDropdown = ref<Boolean>(false)
let showMenu = ref<Boolean>(false)
const loading = ref<Boolean>(false);

function dropdown () {
  isDropdown.value = !isDropdown.value
}

function mobileMenu () {
  showMenu.value = !showMenu.value
}

function logout () {
  loading.value = true;

  api.post('/logout', {
    token: auth.token,
    user_id: auth.user.id
  }).then((response) => {
    console.log(response.data)
    auth.clear();
    router.push({name: 'home'})
    dropdown();
  }).catch((error) => {
    ElNotification.error({
      title: 'Erro',
      message: 'Erro ao fazer logout!',
      offset: 50,
    });
  }).finally(() => {
    loading.value = false;
  });
}

</script>

<template>
  <nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button type="button" @click="mobileMenu" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>

            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

            <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="hidden sm:block">
            <div class="flex space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <RouterLink class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          :class="{ 'bg-gray-900': $route.path === '/' }" to="/">
                Home
              </RouterLink>

              <RouterLink v-show="auth.isAuthenticated()"
                          class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          :class="{ 'bg-gray-900': $route.path === '/produtos' }"
                          to="/produtos">
                Produtos
              </RouterLink>

              <RouterLink v-show="auth.isAuthenticated()"
                          class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                          :class="{ 'bg-gray-900': $route.path === '/categorias' }"
                          to="/categorias">
                Categorias
              </RouterLink>
            </div>
          </div>
        </div>

        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <div class="relative ml-3" v-if="auth.isAuthenticated()">
            <div>
              <button type="button" @click="dropdown" class="relative flex justify-center gap-1 rounded-full bg-gray-800 text-sm font-medium text-white">
                <span>{{ auth.user.name }}</span>
                <span>
                  <font-awesome-icon :icon="['fas', 'angle-down']" />
                </span>
              </button>
            </div>

            <div v-show="isDropdown" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
              <!-- Active: "bg-gray-100", Not Active: "" -->
              <a href="#" @click="dropdown" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">Profile</a>
              <a href="#" @click.prevent="logout" class="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-2">Sign out</a>
            </div>
          </div>
          <div v-else>
            <RouterLink class="relative flex justify-center gap-1 rounded-full bg-gray-800 text-sm font-medium text-white" to="/login">Login</RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div v-show="showMenu" class="sm:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <RouterLink class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    :class="{ 'bg-gray-900': $route.path === '/' }"
                    to="/">
          Home
        </RouterLink>

        <RouterLink v-show="auth.isAuthenticated()"
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    :class="{ 'bg-gray-900': $route.path === '/produtos' }"
                    to="/produtos">
          Produtos
        </RouterLink>

        <RouterLink v-show="auth.isAuthenticated()"
                    class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                    :class="{ 'bg-gray-900': $route.path === '/categorias' }"
                    to="/categorias">
          Categorias
        </RouterLink>
      </div>
    </div>
  </nav>

  <div>
    <RouterView />
  </div>
</template>

<style scoped>
</style>
