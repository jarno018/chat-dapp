<!-- Based upon https://plnkr.co/edit/VVclW0?p=preview&preview-->
<script lang="ts">

  let colors:string[] = [
  "#7bd148",
  "#5484ed",
  "#a4bdfc",
  "#46d6db",
  "#7ae7bf",
  "#51b749",
  "#fbd75b",
  "#ffb878",
  "#ff887c",
  "#dc2127",
  "#dbadff",
  "#e1e1e1"
  ]

</script>

<select name="" id="">
  {#each colors as color}
    <option value={color}>{color}</option>
  {/each}
</select>

<style>
  @import "http://netdna.bootstrapcdn.com/font-awesome/4.0.0/css/font-awesome.css";
</style>