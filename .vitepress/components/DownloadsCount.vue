<script lang="ts">
import { h, onBeforeMount, ref } from 'vue';

export default {
  setup() {
    let data = ref({ count: 0, version: '0.0.0', time: '-' });
    const d = async () => {
      try {
        const [{ downloads }, { 'dist-tags': distTags, time }] =
          await Promise.all([
            fetch(
              `https://api.npmjs.org/downloads/point/2025-06-01:${new Date().getFullYear()}-${
                new Date().getMonth() + 1
              }-${new Date().getDate()}/@h3ravel/core`
            ).then((e) => e.json()),
            fetch(`https://registry.npmjs.org/@h3ravel/core`).then((e) =>
              e.json()
            ),
          ]);

        data.value.time = time.modified;
        data.value.count = downloads;
        data.value.version = distTags.latest;
      } catch {}
    };

    onBeforeMount(d);

    return () =>
      h(
        'div',
        {
          class: 'cta-buttons',
        },
        data.value.count > 0
          ? [
              h('div', {
                class: 'downloads-counter',
                innerHTML: `v${data.value.version}`,
              }),
              h('div', {
                class: 'downloads-counter',
                innerHTML: `${data.value.count} Downloads`,
              }),
              h('div', {
                class: 'downloads-counter',
                innerHTML: `Last Updated ${data.value.time}`,
              }),
            ]
          : []
      );
  },
};
</script>
