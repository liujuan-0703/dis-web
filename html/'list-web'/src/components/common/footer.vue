<template>
  <div class="myFooter">
   <footer class="alert-message"></footer>
  </div>
</template>

<script>
export default {
 name: 'myFooter',
  data() {
    return {
      msg:"helloheader"
    };
  }

};
</script>
<style lang="less" scoped>
   .myFooter{
      width:100%;
      height:50px;
      background:#000;
      color:#fff;
      bottom:0px;
    }
.alert-message{
  margin:0px;
}
</style>
