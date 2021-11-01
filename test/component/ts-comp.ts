import { defineComponent } from 'san';

export default defineComponent<any, any>({
  template: `<div>
        <span class="count">{{count}}</span>
        <button on-click="increment">Increment</button>
    </div>` as string,

  initData() {
    return {
      count: 0 as number,
    };
  },

  inited() {
    console.log('inited');
  },

  increment() {
    let count = this.data.get('count');
    this.data.set('count', ++count);
  },
});
