<!--
针对与/SellerPage 这路径显示
通过子组件注册的方式显示，Seller.vue组件
-->
<template>
  <div class="com-page">
    <!-- Seller -->
    <seller></seller>
  </div>
</template>

<script>
import Seller from '@/components/Seller'
  export default {
    name:'SellerPage',
    components:{Seller},
    data(){
      return{

      }
    }
  }
</script>

<style lang="less" scoped>
  
</style>