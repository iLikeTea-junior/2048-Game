<template>
    <header>
        <h1><slot name="title"></slot></h1>
    </header>
</template>

<style scoped>

header {
  background: linear-gradient( to bottom, #9ad1fc 0%, #73b9e7 15%, #138ee0 50%, #0d75bb 60%, #1484cf 90%, #1991e0 100% );
  border-top: 1px solid #4da1da;
  border-left: 1px solid #4da1da;
  border-right: 1px solid #4da1da;

  height: 75px;
  font-weight: bold;
  color: white;
  padding: 20px;
}

</style>