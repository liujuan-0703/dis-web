<template>
  <div id="app" class="note" :style="note">
    <my-top></my-top>
    <my-content></my-content>
    <my-footer></my-footer>
    <router-view/>
  </div>
</template>

<script>
import  '../static/js/common/jquery.min.js'
import  '../static/js/common/common.js'
import  '../static/js/common/public.js'
import  '../static/js/common/apiUrl.js'
import  '../static/js/common/Jquery.ETTool-1.0.js'
export default {
  name: 'App',
  data(){
    return{
      note:{
             backgroundImage: "url(" + require("@/assets/images/common/page_bg.png") + ")",
             backgroundRepeat: "no-repeat",
             backgroundSize: "100% 100%",
      },
    }
  }
}
</script>
import  '../static/css/common/common.css'
<style>
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

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin:0px;
  padding:0px;
  width:100%;
  height:100%;
}
</style>
