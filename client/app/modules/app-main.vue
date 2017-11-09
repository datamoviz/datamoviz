<template>
    <main>
        <app-header></app-header>
    </main>
</template>

<script>
    import AppHeader from './app-header.vue';

    export default {
        name: 'app-main',
        components: {
            AppHeader
        }
    }
</script>

<style lang="scss" ref="stylesheet/scss">
    @import '../scss/main';
</style>
