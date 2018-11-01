<template>
<div class="MyTop">
    <h5 class="alermBox" :style="alermBox"></h5>
</div>
</template>

<script>
export default {
 name: 'top',
  data() {
    return {
       alermBox:{
       backgroundImage: "url(" + require("../../assets/images/common/page_center_bg.png") + ") ",
       backgroundPosition: "center center",
       backgroundRepeat: "no-repeat",
       backgroundSize: "cover",
       }
    };
  },

};
</script>
<style scoped>
   .MyTop{
     width:100%;
     height:55px;
     line-height:55px;
     background:#000;
     opacity:0.5 ;
     padding:10px;
   }
   .alermBox{
        color:#fff;
        text-align:left;
        height:40px;
        line-height:40px;
        padding-left:10px;
        font-size: 18px;
        position: relative;
        border-left: 3px solid rgb(121, 235, 255);
        z-index:888;
   }
</style>
