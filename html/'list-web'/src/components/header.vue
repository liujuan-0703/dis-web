<template>
  <div class="myHeader">
     <ul class="tab-list">
         <li v-for="(item,index)  in tabList" @click="addClass(index)" v-bind:class="{ active:index==current}">
            {{ item.title }}
          </li>
     </ul>

  </div>
</template>

<script>
export default {
 name: 'myHerder',
  data() {
      return {
          tabList:[
            { id: 0, title: "首页1" },
            { id: 1, title: "首页2" },
            { id: 2, title: "首页3" }
          ],
          current:0
      };
    },
methods: {
    addClass: function(index) {
      this.current = index;
    }
  }


};
</script>
<style lang="less" scoped>
html,
body,
div,
ul,
li,
ol,
dl,
dd,
dt,
p,
h1,
h2,
h3,
h4,
h5,
h6,
form,
fieldset,
legend,
img,
header,
footer,
section,
input,
span,
textarea {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-tap-highlight-color: transparent;
	-moz-tap-highlight-color: transparent;
	-ms-tap-highlight-color: transparent;
	-o-tap-highlight-color: transparent;
	tap-highlight-color: transparent;
}
  .tab-list li{
    list-style:none;
    float:left;
    width:100px;
    height:50px;
    text-align:center;
    line-height:50px;
    cursor: pointer;
  }
   .myHeader{
      width:100%;
      height:50px;
      background:#000;
      color:#fff;
    }
.tab-list li:hover{
     color: rgb(255, 208, 75);
     background: rgb(64, 74, 80);
     border-bottom: 4px solid rgb(64, 74, 80);
   }
   .tab-list li.active{
     border-bottom: 4px solid rgb(255, 208, 75);
   }
   .active{
     color: rgb(255, 208, 75);
     background: rgb(64, 74, 80)
   }
</style>
