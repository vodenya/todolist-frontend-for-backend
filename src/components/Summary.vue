<template>
  <div class="summary">
    <div class="hr"></div>
    <div class="status">
      <span class="complete">{{ completedArrLength }}</span>
      /
      <span class="incomplete">{{ todoArrLength + completedArrLength }}</span>
      (
      <span class="percentage" :class="percentageColor">
        {{ percentage }}%
      </span>
      done)
    </div>
  </div>
</template>

<script>
export default {
  name: "Summary",
  props: {
    todoArrLength: Number,
    completedArrLength: Number,
  },
  computed: {
    percentageColor() {
      if (this.percentage >= 0 && this.percentage < 50) {
        return "red";
      } else if (this.percentage >= 50 && this.percentage <= 99) {
        return "orange";
      } else if (this.percentage >= 100) {
        return "green";
      }
      return "";
    },
    percentage() {
      const num = (
        (100 * this.completedArrLength) /
        (this.todoArrLength + this.completedArrLength)
      ).toFixed(0);
      return num;
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  display: grid;
  grid-template-columns: auto max-content;
  grid-gap: 10px;
  margin: 20px 0;
  .hr {
    border: none;
    border-bottom: 1px solid #d3d3d3;
  }
  .status {
    font-size: 14px;
  }
}

.red {
  color: red;
}
.orange {
  color: rgb(255, 174, 0);
}
.green {
  color: rgb(0, 216, 0);
}
</style>