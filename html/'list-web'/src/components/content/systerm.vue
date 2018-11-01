<template>
  <div name="myTop"></div>
</template>

<script>
import MyTop from '@/components/common/top'
export default {
 name: 'myStserm',

  data() {
    return {
      msg:"helloheader"
    };
  }

};
</script>
<style lang="less" scoped>

.formBox{
  width:100%;
  height:50px;
  text-align:left;
  color:#fff;
  padding-left:20px;
}
.input{
   width:180px;
   height:30px;
   line-height:30px;
   border:1px solid #fff;
   color:#fff;
   border-radius:3px;
   background:none;
   padding-left:10px;
}
.submit{
margin-left: 15px;
    margin-top: 11px;
    display: inline-block;
    color: #fff;
    font-size: 14px;
    width: 70px;
    height: 34px;
    line-height: 31px;
    text-align: center;
    margin-bottom: 10px;
    border-radius: 2px !important;
    cursor: pointer;
    border: none;
    background:#555;
}
.table{
  width:100%;
  height:auto;
  border:1px solid #fff;
  border-radius:3px;
  text-align:left;
}
.table theader{
  width:100%;
  height:50px;
  line-height:50px;
}
.table theader>tr>th{
  width:25%;
}
</style>
