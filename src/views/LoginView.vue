<script setup lang="ts">
import {reactive, ref} from "vue";
import {ElNotification} from "element-plus";
import {useRouter} from "vue-router";
import axios from "axios";

axios.defaults.withCredentials = true;

const router = useRouter();

const loading = ref<Boolean>(false);

interface FormData {
  email: string;
  password: string;
}

const form: FormData = reactive<FormData>({
  email: '',
  password: ''
});

async function login() {
  loading.value = true;

  axios.get("http://localhost/sanctum/csrf-cookie").then((response) => {
    axios.post("http://localhost/api/login", form).then((response) => {
      console.log('login', response.data)
      //auth.setToken(response.data.token);
      //auth.setUser(response.data.user);
      ElNotification.success({
        title: 'Success',
        message: 'Login feito com sucesso!',
        offset: 50,
      });
      //router.push({name: 'home'});
    }).catch((error) => {
      ElNotification.error({
        title: 'Erro',
        message: 'Usuário ou senha inválidos!',
        offset: 50,
      });
    }).finally(() => {
      loading.value = false;
    });
  });
}

</script>

<template>
  <div v-loading="loading" class="flex min-h-full flex-col justify-center px-10 py-20 lg:px-12">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <el-form
          ref="ruleFormRef"
          v-model="form"
          label-width="100px"
          class="form"
      >
        <div class="my-2">
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">E-mail</label>
          <div class="mt-2">
            <el-input
                id="name"
                v-model="form.email"
                type="text"
                size="large"
                required
                autofocus
            />
          </div>
        </div>

        <div class="my-2">
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div class="mt-2">
            <el-input
                id="name"
                v-model="form.password"
                type="password"
                size="large"
                show-password
                required
            />
          </div>
        </div>

        <div class="mt-6">
          <button type="submit" @click.prevent="login" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>

</style>
