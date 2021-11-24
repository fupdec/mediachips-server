<template>
  <div class="loader">
    <svg viewBox="0 0 640 640" style="width: 20%;">
      <path class="logo" d="M300.5,600.5C125,600.5.5,476,.5,300.5S90,.5,150.5.5s89.5,150,150,150S390,.5,450.5.5s150,124.5,150,300S476,600.5,300.5,600.5Zm150-400c-115,0-58.5,200-150,200-88.5,0-29-200-150-200-150,0-150,400,150,400S601.5,200.5,450.5,200.5Z"/>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  padding-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}
.logo {
  fill: none;
  stroke-width: 3px;
  stroke: #9189ff; 
  stroke-dasharray: 1000;
  stroke-dashoffset: 2000;
  animation: dash 4s linear forwards infinite;
}
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}
</style>