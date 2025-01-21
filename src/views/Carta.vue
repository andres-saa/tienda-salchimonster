<template>
    <div class="image-gallery">
        <img v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9]" style="margin: 0; padding: 0;"
            :src="`/images/menu/menucito${i}.jpeg`"
            :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }" alt="Menucito" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            isMobile: false,
        };
    },
    created() {
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.handleResize);
    },
    methods: {
        handleResize() {
            this.isMobile = window.matchMedia("(max-width: 768px)").matches;
        },
    },
};
</script>

<style scoped>
.image-gallery {
    margin-top: 0rem;
    margin-bottom: 0;
    padding-bottom: 0;
    /* max-width: 1910px; */
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
}


.horizontal-image {
    width: 100%;
    margin: 0;
    padding: 0;
}

.vertical-image {
    width: 100%;
    padding: 0;
    margin: 0;
}
</style>