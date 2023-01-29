<template>
    <div>
        <div class="round1">
  <div class="round2">
    <span>不通过</span>
  </div>
</div>
    </div>
</template>
<style lang="scss" scoped>
 .round1{
   position: relative;
   width: 100px;
   height: 100px;
   border-radius: 100px;
   border: 1px solid #FF3B30;
   text-align: center;
      .round2{
      position:absolute;
      top:10px;
      left: 10px;
   width: 80px;
   height: 80px;
   border-radius: 80px;
   border: 1px solid #FF3B30;
   transform: rotate(-30deg);
   span{
color: #FF3B30;
line-height: 80px;
font-weight: 500;
font-size: 20px;
   }
   }
   
 
 }
</style>