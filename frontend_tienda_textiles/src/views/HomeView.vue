<script setup lang="ts">
import HeroBanner from '@/components/home/HeroBanner.vue'
import ServicesSection from '@/components/home/ServicesSection.vue'
import CategoryShowcase from '@/components/home/CategoryShowcase.vue'
import ProductCarousel from '@/components/home/ProductCarousel.vue'
import PromoBanner from '@/components/home/PromoBanner.vue'
import BlogPreview from '@/components/home/BlogPreview.vue'
import NewsletterForm from '@/components/home/NewsletterForm.vue'
import InstagramGallery from '@/components/home/InstagramGallery.vue'
</script>

<template>
  <div class="home-page">
    <HeroBanner />
    <ServicesSection />
    <CategoryShowcase />
    <ProductCarousel />
    <PromoBanner />
    <BlogPreview />
    <NewsletterForm />
    <InstagramGallery />
  </div>
</template>

<style scoped>
.home-page {
  background-color: var(--color-bg);
  color: var(--text-primary);
}
</style>
