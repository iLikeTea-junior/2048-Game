<script setup lang="ts">

const props = defineProps(['class'])
</script>

<template>
    <button :class="['frutiger-button', props.class]">
        <div class="inner">
            <div class="top-white"></div>
            <span class="text"><slot></slot></span>
        </div>
    </button>
</template>

<style scoped>

/* From Uiverse.io by SelfMadeSystem */ 
.frutiger-button {
  cursor: pointer;
  position: relative;
  padding: 2px;
  border-radius: 6px;
  border: 0;
  text-shadow: 1px 1px #000a;
  background: linear-gradient(#006caa, #00c3ff);
  box-shadow: 0px 4px 6px 0px #0008;
  transition: 0.3s all;
}
/* background: linear-gradient(darkgreen, green); */

.frutiger-button:hover {
  box-shadow: 0px 6px 12px 0px #0009;
}

.frutiger-button:active {
  box-shadow: 0px 0px 0px 0px #0000;
}

.inner {
  position: relative;
  inset: 0px;
  padding: 1em;
  border-radius: 4px;
  background: radial-gradient(circle at 50% 100%, #30f8f8 10%, #30f8f800 55%),
    linear-gradient(#00526a, #009dcd);
  overflow: hidden;
  transition: inherit;
}

.frutiger-button.green {
  background: linear-gradient(darkgreen, green);
}
.frutiger-button.green .inner {
  background: radial-gradient(circle at 50% 100%, green 10%, green 55%),
  linear-gradient(green, green);
}

.frutiger-button.red {
  background: linear-gradient(darkred, crimson);
}
.frutiger-button.red .inner {
  background: radial-gradient(circle at 50% 100%, crimson 10%, crimson 55%),
  linear-gradient(crimson, crimson);
}

.frutiger-button.orange {
  background: linear-gradient(chocolate, darkorange);
}
.frutiger-button.orange .inner {
  background: radial-gradient(circle at 50% 100%, darkorange 10%, darkorange 55%),
  linear-gradient(darkorange, darkorange);
}

.inner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(-65deg, #0000 40%, #fff7 50%, #0000 70%);
  background-size: 200% 100%;
  background-repeat: no-repeat;
  animation: thing 3s ease infinite;
}

@keyframes thing {
  0% {
    background-position: 130%;
    opacity: 1;
  }

  to {
    background-position: -166%;
    opacity: 0;
  }
}

.top-white {
  position: absolute;
  border-radius: inherit;
  inset: 0 -8em;
  background: radial-gradient(
    circle at 50% -270%,
    #fff 45%,
    #fff6 60%,
    #fff0 60%
  );
  transition: inherit;
}

.inner::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: inherit;
  box-shadow: inset 0px 2px 8px -2px #0000;
}

.frutiger-button:active .inner::after {
  box-shadow: inset 0px 2px 8px -2px #000a;
}

.text {
  position: relative;
  z-index: 1;
  color: white;
  font-weight: 550;
  transition: inherit;
}

</style>