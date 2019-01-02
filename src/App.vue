<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { getToken, setToken, removeToken , getState, setState} from '@/utils/auth'
export default{
  name: 'App'
}
</script>
