import san from 'san';

export default san.defineComponent({
  template: `<div>
        <span class="count">{{count}}</span>
        <button on-click="increment">Increment</button>
    </div>`,

  initData() {
    return {
      count: 0,
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
