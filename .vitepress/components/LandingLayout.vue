<template>
  <header class="header">
    <nav class="nav">
      <a href="#" class="logo"><img :src="theme.logo" /></a>
      <ul class="nav-links">
        <li :key="link.link" :href="link.link" v-for="link in theme.nav">
          <a :href="link.link">{{ link.text }}</a>
        </li>
        <li><a href="#features">Features</a></li>
        <li><a href="#why-h3ravel">Why</a></li>
        <li class="social-link">
          <DarkToggle />
          <a
            target="_blank"
            :key="link.link"
            :href="link.link"
            v-for="link in theme.socialLinks"
          >
            <span
              class="vpi-social-github"
              :style="`--icon: url('https://api.iconify.design/simple-icons/${link.icon}.svg');`"
            >
            </span>
          </a>
        </li>
      </ul>
      <div class="mobile-menu-btn">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  </header>

  <!-- Hero Section -->
  <section class="hero" v-if="!frontmatter.hideHero">
    <div class="hero-content">
      <h1>
        {{
          frontmatter.heroTitle ??
          site.title + " - Laravel's Elegance, TypeScript's Power"
        }}
      </h1>
      <p>
        {{
          frontmatter.heroTitle ??
          'A modern TypeScript runtime-agnostic web framework built on top of H3.'
        }}
      </p>
      <div class="cta-buttons">
        <a
          :href="frontmatter.herorLink ?? '/guide/get-started'"
          class="btn btn-primary"
        >
          {{ frontmatter.heroLinkTitle ?? 'Get Started' }}
        </a>
        <a
          href="https://github.com/h3ravel"
          target="_blank"
          class="btn btn-secondary"
          v-if="!frontmatter.hideHeroGitLink"
        >
          View on GitHub
        </a>
      </div>
    </div>
  </section>
  <section style="margin-bottom: 15px"></section>

  <!-- Features Section -->

  <section id="features" class="section features" v-if="frontmatter.features">
    <div class="container">
      <h2 class="section-title">Features</h2>
      <div class="features-grid">
        <div
          class="feature-card"
          :key="feature.title"
          v-for="feature in frontmatter.features"
        >
          <h3>{{ feature.title }}</h3>
          <p>
            {{ feature.details }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <Content />

  <!-- Why H3ravel Section -->

  <section
    class="section why-section"
    id="why-h3ravel"
    v-if="frontmatter.reasons"
  >
    <div class="container">
      <h2 class="section-title">Why H3ravel?</h2>
      <div class="why-content">
        <div
          class="why-item"
          :key="reason.title"
          v-for="reason in frontmatter.reasons"
        >
          <div class="why-icon">
            <icon :name="reason.icon" :color="reason.color ?? '#fff'" />
          </div>
          <h3>{{ reason.title }}</h3>
          <p>
            {{ reason.details }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a href="/introduction">Docs</a>
        <a href="https://github.com/h3ravel" target="_blank">GitHub</a>
        <a href="/contributing">Contributing</a>
        <a href="https://discord.gg/hsG2A8PuGb" target="_blank">Community</a>
      </div>
      <div class="footer-copyright">
        <Suspense>
          <DownloadsCount />
        </Suspense>
        <p>{{ theme.footer.copyright }}</p>
        <p v-html="theme.footer.message"></p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import 'vitepress/dist/client/theme-default/styles/icons.css';
import '../theme/landing.scss';
import { useData } from 'vitepress';
import DarkToggle from './DarkToggle.vue';
import DownloadsCount from './DownloadsCount.vue';

const { theme, site, frontmatter } = useData();
</script>
