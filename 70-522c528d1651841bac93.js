(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{1021:function(e,t,o){"use strict";o.r(t),o.d(t,"VisJsGraphViewer",(function(){return i}));var s=o(959),r=o(68),n=o(2),d=function(e,t,o,s){var r,n=arguments.length,d=n<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,o):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)d=Reflect.decorate(e,t,o,s);else for(var i=e.length-1;i>=0;i--)(r=e[i])&&(d=(n<3?r(d):n>3?r(t,o,d):r(t,o))||d);return n>3&&d&&Object.defineProperty(t,o,d),d};let i=class extends n.Component{constructor(){super(...arguments),this.divRef=n.createRef(),this.nodes=new s.a,this.edges=new s.a}render(){return n.createElement("div",{style:{height:"100%"},ref:this.divRef})}synchronizeData(){const e=new Set;for(const t of this.props.nodes)e.add(t.id),this.nodes.update({id:t.id,label:void 0!==t.label?t.label:t.id,color:t.color,shape:t.shape});this.nodes.forEach(t=>{e.has(t.id)||this.nodes.remove(t)});const t=new Set;for(const e of this.props.edges){const s=(o=e).id?o.id:o.from+"####"+o.to+"|"+o.label;t.add(s),this.edges.update({id:s,label:void 0!==e.label?e.label:"",from:e.from,to:e.to,color:e.color,dashes:e.dashes})}var o;this.edges.forEach(e=>{t.has(e.id)||this.edges.remove(e)})}componentDidUpdate(){this.synchronizeData()}componentDidMount(){this.synchronizeData();const e={nodes:this.nodes,edges:this.edges};new s.b(this.divRef.current,e,{edges:{arrows:{to:{enabled:!0,scaleFactor:1,type:"arrow"}}}})}};i=d([r.observer],i)}}]);
//# sourceMappingURL=70-522c528d1651841bac93.js.map