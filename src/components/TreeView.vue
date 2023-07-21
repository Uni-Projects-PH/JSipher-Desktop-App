<script setup lang="ts">
import { ElementType, Package, type UmlModel } from '@/@types/model';
import { computed } from 'vue';
import TreeViewPackage from './TreeViewPackage.vue';

const props = defineProps<{
    model: UmlModel
}>();
/*const emit = defineEmits<{
    (e: 'package-selected', package: Package): void
}>();*/

const packages = computed(() => {
    return props.model.elements.filter(x => x.type === ElementType.Package).map(x => x as Package);
});

</script>

<template>
    <div class="treeview">
        <TreeViewPackage v-for="child in packages" :package="child" :key="child.id"/>
    </div>
</template>

<style scoped lang="scss">
.treeview {
    padding: 1rem;
    display: flex;
    flex-direction: column;
}
</style>