<template>
  <div ref="view" class="flex-0-1 overflow-y-hidden">
    <transition-group name="item">
      <template v-for="{ item, index } in display" :key="index" :item="item">
        <div
          :ref="
            (el) => {
              elements[index] = el as Element | null;
            }
          "
        >
          <slot :item="item"></slot>
        </div>
      </template>
    </transition-group>
    <div ref="tag"></div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, watchEffect, watch } from "vue";
import { Raw } from "vue";

const props = defineProps<{
  items: readonly T[];
}>();

class ListItem {
  constructor(
    readonly item: T,
    readonly index: number,
  ) {}
}

const start = ref(0);
const length = ref(1);
const display = ref<Raw<ListItem>[]>([]);
const elements = ref<(Element | null)[]>([]);
const view = ref<Element | null>(null);
const tag = ref<Element | null>(null);
const observing = ref(false);

let checkVisible:
  | ((target: Element, isIntersecting: boolean) => undefined)
  | null = null;

const observer = new IntersectionObserver(
  (entries, observer) => {
    if (tag.value && observing) {
      let flag = false;
      entries.forEach(({ target, isIntersecting }) => {
        if (target === tag.value && isIntersecting) {
          flag = true;
        } else if (checkVisible) {
          checkVisible(target, isIntersecting);
        }
      });

      if (flag) {
        observer.unobserve(tag.value);
        observing.value = false;
        length.value = length.value * 2;
      }
    }
  },
  {
    root: view.value,
    rootMargin: "0px",
    threshold: 1.0,
  },
);

watch(
  () => props.items,
  (items) => {
    elements.value = Array(items.length).fill(null);
  },
);

watchEffect(() => {
  let end = start.value + length.value;
  if (end > props.items.length) {
    end = props.items.length;
  }
  display.value = props.items.slice(start.value, end).map((item, index) => ({
    item,
    index: start.value + index,
  }));
});

watch(
  display,
  (display_) => {
    if (tag.value && !observing.value) {
      observing.value = true;
      observer.observe(tag.value);
    }
  },
  { immediate: true, flush: "post" },
);

const scrollToIndex = (index: number) => {
  if (index < 0 || index >= props.items.length) {
    return;
  }
  start.value = index;
};

const makeVisible = (index: number) => {
  if (index < 0 || index >= props.items.length) {
    return;
  }
  const el = elements.value[index];
  if (!el) {
    scrollToIndex(index);
  } else if (!checkVisible) {
    checkVisible = (target: Element, isIntersecting: boolean) => {
      if (target === el) {
        if (!isIntersecting) {
          scrollToIndex(index);
        }
        observer.unobserve(el);
        checkVisible = null;
      }
    };
    observer.observe(el);
  }
};

defineExpose({
  scrollToIndex,
  makeVisible,
});
</script>
