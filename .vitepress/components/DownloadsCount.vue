<script lang="ts">
import { h } from 'vue';
let data = { count: 0, version: '0.0.0', time: '-' };
try {
  const [{ downloads }, { 'dist-tags': distTags, time }] = await Promise.all([
    fetch(
      `https://api.npmjs.org/downloads/point/2025-06-01:${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}/@h3ravel/core`
    ).then((e) => e.json()),
    fetch(`https://registry.npmjs.org/@h3ravel/core`).then((e) => e.json()),
  ]);
  data.time = time.modified;
  data.count = downloads;
  data.version = distTags.latest;
} catch {}

export default {
  setup() {
    return () =>
      h(
        'div',
        {
          class: 'cta-buttons',
        },
        data.count > 0
          ? [
              h('div', {
                class: 'downloads-counter',
                innerHTML: `v${data.version}`,
              }),
              h('div', {
                class: 'downloads-counter',
                innerHTML: `${data.count} Downloads`,
              }),
              h('div', {
                class: 'downloads-counter',
                innerHTML: `Last Updated ${data.time}`,
              }),
            ]
          : []
      );
  },
};
</script>
