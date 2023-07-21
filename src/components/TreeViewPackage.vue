<script setup lang="ts">
import { ElementType, Package } from '@/@types/model';
import { computed, inject } from 'vue';

const props = defineProps<{
    package: Package
}>();

const packages = computed(() => {
    return props.package.children.filter(x => x.type === ElementType.Package).map(x => x as Package);
});

const selectPackage: (pkg: Package) => void = inject("selectPackage")!;

</script>

<template>
    <div class="treeview--package">
        <h3 @click="selectPackage(props.package)">{{ props.package.name }}</h3>
        <div class="treeview--package-children" v-if="packages.length > 0">
            <TreeViewPackage v-for="child in packages" :package="child" :key="child.id"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
.treeview--package {
    display: flex;
    flex-direction: column;

    h3 {
        margin: 0;
        cursor: pointer;
        user-select: none;
    }

    .treeview--package-children {
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
    }
}
</style>