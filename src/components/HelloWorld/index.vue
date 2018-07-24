<template>
  <div class="main">
    <h1>Welcome to STORYBOOK</h1>
    <p>
      This is a UI component dev environment for your app.
    </p>
    <p>
      We've added some basic stories inside the
      <br />
      <code class="code">src/stories</code>
      <br /> directory.
      <br /> A story is a single state of one or more UI components. You can have as many stories as you want.
      <br /> (Basically a story is like a visual test case.)
    </p>
    <p>
      See these sample
      <br />
      <a class="link" @click="onClick" role="button" tabIndex="0">stories</a>
      <br /> for a component called
      <br />
      <code class="code">Button</code>
      .
    </p>
    <p>
      Just like that, you can add your own components as stories.
      <br /> You can also edit those components and see changes right away.
      <br /> (Try editing the
      <code class="code">Button</code> component located at
      <code class="code">src/stories/Button.js</code>.)
    </p>
    <p>
      This is just one thing you can do with Storybook.
      <br /> Have a look at the
      <br />
      <a class="link" href="https://github.com/storybooks/storybook" target="_blank" rel="noopener noreferrer">
        Storybook
      </a>
      <br /> repo for more information.
    </p>
    <p class="note">
      <b>NOTE:</b>
      <br /> Have a look at the
      <br />
      <code class="code">.storybook/webpack.config.js</code>
      <br /> to add webpack loaders and plugins you are using in this project.
    </p>
  </div>
</template>

<script lang="ts">
// tslint:disable-next-line
const log = () => console.log('Welcome to storybook!')
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class HelloWorld extends Vue {
  @Prop(String) private msg!: string
  @Prop({ default: log })
  private showApp!: () => void

  private onClick(event: MouseEvent) {
    event.preventDefault()
    this.showApp()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main {
  margin: 15px;
  max-width: 600;
  line-height: 1.4;
  font-family: 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, freesans,
    sans-serif;
}
.logo {
  width: 200;
}
.link {
  color: #1474f3;
  text-decoration: none;
  border-bottom: 1px solid #1474f3;
  padding-bottom: 2px;
}
.code {
  font-size: 15;
  font-weight: 600;
  padding: 2px 5px;
  border: 1px solid #eae9e9;
  border-radius: 4px;
  background-color: #f3f2f2;
  color: #3a3a3a;
}
.codeBlock {
  background-color: #f3f2f2;
  padding: 1px 10px;
  margin: 10px 0;
}
.note {
  opacity: 0.5;
}
</style>
