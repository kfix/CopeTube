(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const u of document.querySelectorAll('link[rel="modulepreload"]'))s(u);new MutationObserver(u=>{for(const c of u)if(c.type==="childList")for(const f of c.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&s(f)}).observe(document,{childList:!0,subtree:!0});function i(u){const c={};return u.integrity&&(c.integrity=u.integrity),u.referrerpolicy&&(c.referrerPolicy=u.referrerpolicy),u.crossorigin==="use-credentials"?c.credentials="include":u.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(u){if(u.ep)return;u.ep=!0;const c=i(u);fetch(u.href,c)}})();function Ae(){}function rn(e,n){for(const i in n)e[i]=n[i];return e}function Pn(e){return e()}function fn(){return Object.create(null)}function lt(e){e.forEach(Pn)}function On(e){return typeof e=="function"}function Ht(e,n){return e!=e?n==n:e!==n||e&&typeof e=="object"||typeof e=="function"}function Fn(e){return Object.keys(e).length===0}function l(e,n){e.appendChild(n)}function Ie(e,n,i){e.insertBefore(n,i||null)}function Me(e){e.parentNode&&e.parentNode.removeChild(e)}function Zt(e,n){for(let i=0;i<e.length;i+=1)e[i]&&e[i].d(n)}function y(e){return document.createElement(e)}function _(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function P(e){return document.createTextNode(e)}function j(){return P(" ")}function R(e,n,i,s){return e.addEventListener(n,i,s),()=>e.removeEventListener(n,i,s)}function t(e,n,i){i==null?e.removeAttribute(n):e.getAttribute(n)!==i&&e.setAttribute(n,i)}function me(e){return e===""?null:+e}function zn(e){return Array.from(e.childNodes)}function ie(e,n){n=""+n,e.wholeText!==n&&(e.data=n)}function V(e,n){e.value=n==null?"":n}function H(e,n,i,s){i===null?e.style.removeProperty(n):e.style.setProperty(n,i,s?"important":"")}function Mt(e,n){for(let i=0;i<e.options.length;i+=1){const s=e.options[i];if(s.__value===n){s.selected=!0;return}}e.selectedIndex=-1}function hn(e){const n=e.querySelector(":checked")||e.options[0];return n&&n.__value}function Ln(e,n,{bubbles:i=!1,cancelable:s=!1}={}){const u=document.createEvent("CustomEvent");return u.initCustomEvent(e,i,s,n),u}let dt;function _t(e){dt=e}function Nn(){if(!dt)throw new Error("Function called outside component initialization");return dt}function En(){const e=Nn();return(n,i,{cancelable:s=!1}={})=>{const u=e.$$.callbacks[n];if(u){const c=Ln(n,i,{cancelable:s});return u.slice().forEach(f=>{f.call(e,c)}),!c.defaultPrevented}return!0}}const gt=[],cn=[],zt=[],pn=[],In=Promise.resolve();let Kt=!1;function Gn(){Kt||(Kt=!0,In.then(Cn))}function mt(e){zt.push(e)}const Vt=new Set;let At=0;function Cn(){const e=dt;do{for(;At<gt.length;){const n=gt[At];At++,_t(n),Bn(n.$$)}for(_t(null),gt.length=0,At=0;cn.length;)cn.pop()();for(let n=0;n<zt.length;n+=1){const i=zt[n];Vt.has(i)||(Vt.add(i),i())}zt.length=0}while(gt.length);for(;pn.length;)pn.pop()();Kt=!1,Vt.clear(),_t(e)}function Bn(e){if(e.fragment!==null){e.update(),lt(e.before_update);const n=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,n),e.after_update.forEach(mt)}}const Lt=new Set;let Rn;function Et(e,n){e&&e.i&&(Lt.delete(e),e.i(n))}function Qt(e,n,i,s){if(e&&e.o){if(Lt.has(e))return;Lt.add(e),Rn.c.push(()=>{Lt.delete(e),s&&(i&&e.d(1),s())}),e.o(n)}else s&&s()}function gn(e,n){const i={},s={},u={$$scope:1};let c=e.length;for(;c--;){const f=e[c],p=n[c];if(p){for(const o in f)o in p||(s[o]=1);for(const o in p)u[o]||(i[o]=p[o],u[o]=1);e[c]=p}else for(const o in f)u[o]=1}for(const f in s)f in i||(i[f]=void 0);return i}function Yt(e){return typeof e=="object"&&e!==null?e:{}}function xt(e){e&&e.c()}function It(e,n,i,s){const{fragment:u,after_update:c}=e.$$;u&&u.m(n,i),s||mt(()=>{const f=e.$$.on_mount.map(Pn).filter(On);e.$$.on_destroy?e.$$.on_destroy.push(...f):lt(f),e.$$.on_mount=[]}),c.forEach(mt)}function Gt(e,n){const i=e.$$;i.fragment!==null&&(lt(i.on_destroy),i.fragment&&i.fragment.d(n),i.on_destroy=i.fragment=null,i.ctx=[])}function Hn(e,n){e.$$.dirty[0]===-1&&(gt.push(e),Gn(),e.$$.dirty.fill(0)),e.$$.dirty[n/31|0]|=1<<n%31}function Ut(e,n,i,s,u,c,f,p=[-1]){const o=dt;_t(e);const r=e.$$={fragment:null,ctx:[],props:c,update:Ae,not_equal:u,bound:fn(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(o?o.$$.context:[])),callbacks:fn(),dirty:p,skip_bound:!1,root:n.target||o.$$.root};f&&f(r.root);let g=!1;if(r.ctx=i?i(e,n.props||{},(w,I,...D)=>{const O=D.length?D[0]:I;return r.ctx&&u(r.ctx[w],r.ctx[w]=O)&&(!r.skip_bound&&r.bound[w]&&r.bound[w](O),g&&Hn(e,w)),I}):[],r.update(),g=!0,lt(r.before_update),r.fragment=s?s(r.ctx):!1,n.target){if(n.hydrate){const w=zn(n.target);r.fragment&&r.fragment.l(w),w.forEach(Me)}else r.fragment&&r.fragment.c();n.intro&&Et(e.$$.fragment),It(e,n.target,n.anchor,n.customElement),Cn()}_t(o)}class qt{$destroy(){Gt(this,1),this.$destroy=Ae}$on(n,i){if(!On(i))return Ae;const s=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return s.push(i),()=>{const u=s.indexOf(i);u!==-1&&s.splice(u,1)}}$set(n){this.$$set&&!Fn(n)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}const{PI:Dn,sin:Sn,cos:Bt,tan:Un,sqrt:Wt,pow:qn,abs:Xn,trunc:Jn}=Math,it=2*Dn,Nt=5;function Vn(e){return e*(Dn/180)}function Te(e){return qn(e,2)}function*Yn(e,n,i=1){for(var s=e;s<=n;s+=i)yield s}function*Wn(e,n,i=1){for(var s=n;s>=e;s-=i)yield s}class vt{constructor(n){this.degrees=new Number(n)}get complementaries(){return[new vt(this.degrees+90),new vt(90-this.degrees)]}toString(n=0,i=1){return`${Jn(n+this.degrees*i)}\xB0`}get radians(){return Vn(this.degrees)}get sine(){return Sn(this.radians)}get cosine(){return Bt(this.radians)}}class Rt{constructor(n,i=0,s=0){this.diameter=Number(n),this.faces=Number(s),this.gauge=Number(i)}toString(){return`\u2300${diameter}`}get radius(){return this.diameter/2}get inner_diameter(){return this.diameter-this.gauge*2}get inner_radius(){return this.inner_diameter/2}get circumference(){return this.faces==0?it*this.radius:this.faces*this.diameter}get inner_circumference(){return this.faces==0?it*this.inner_radius:this.faces*this.inner_diameter}edge_point_from_arcangle(n,i=!1){const s=(i?this.inner_radius:this.radius)*Bt(n),u=(i?this.inner_radius:this.radius)*Sn(n);return n==it&&console.log([s,u]),[s,u]}*gen_edge_plot(n=.01,i=!1,s=!1){if(this.faces==0){for(var u=i?Wn(0,it-n,n):Yn(0+n,it,n),c;!(c=u.next()).done;){const f=c.value,p=(s?this.inner_radius:this.radius)*f,[o,r]=this.edge_point_from_arcangle(f,s);yield[o.toFixed(Nt),r.toFixed(Nt),p.toFixed(Nt),f]}return!0}else return!1}}class Mn{toString(){return`\u2220${degrees.to_s()}\xB0`}constructor(n,i,s,u=0){if(n.faces>0)throw"A tube must a number of faces, not zero.";if(s.degrees!=0&&(s.radians<=0||s.radians>=it))throw"invalid angle: miters must be between 0\xBA (perpendicular) and 90\xBA (butted)";if(Xn(u)>i.diameter)throw"offset cannot be greater than join_tube's OD";this.cut_tube=n,this.join_tube=i,this.angle=s,this.offset=Number(u)}develop_z_cartesian(n,i){return(Wt(Te(this.join_tube.radius)-Te(n))+i*this.angle.sine)/this.angle.cosine}develop_z_polar(n){return Wt(Te(this.join_tube.radius)-Te(this.cut_tube.inner_radius)+Te(this.cut_tube.radius*Bt(n)))/this.angle.sine-Un(90-this.angle.radians)*this.cut_tube.radius*Bt(n)}develop_z_quadratic(n,i,s=0,u=1){const c=n-this.offset,f=this.angle,p=f.cosine,o=f.sine,r=Te(p),g=2*i*o*p,w=Te(c)+Te(i)*Te(o)-Te(this.join_tube.radius),I=Te(g)-4*r*w;return[((g+u*Wt(I))/(2*r)).toFixed(Nt),I]}*gen_z_offsets(n,i=[1]){for(let u of i)for(var s;!(s=n.next()).done;){let[c,f,p,o]=s.value,r,g=0;[r,g]=this.develop_z_quadratic(c,f,o,u),yield[p,r]}}}class $t{constructor(n,{hflip:i=!1,vflip:s=!1,horiz:u=!1,contra:c=!1,resolution:f=.01,inner:p=!1}={}){this.resolution=f,this.joint=n,this.inner=p,this.contra=c,this.horiz=u,this.vflip=s,this.hflip=i;let o=[1];n.cut_tube.radius>n.join_tube.radius;let r=n.cut_tube.gen_edge_plot(f,c,p);this.offsets=[],this.min=0,this.max=0,this.count=0;let g;for(;!(g=this.joint.gen_z_offsets(r,o).next()).done;){if(this.offsets.push(g.value),!isNaN(g.value[1])){let w=Number(g.value[1]);(this.count==0||w<this.min)&&(this.min=w),(this.count==0||w>this.max)&&(this.max=w)}this.count++}this.width=this.max-this.min,this.height=p?this.joint.cut_tube.inner_circumference:this.joint.cut_tube.circumference,this.svg_path_commands=[...this.gen_svg_path(this.offsets)]}nibble_edge(n){return this.hflip?n-this.min:this.max-n}jog_across(n){return[(this.horiz?"V":"H")+" "+(this.hflip?this.width-n:n)]}jog_down(n){return[(this.horiz?"H":"V")+" "+(this.vflip?this.height-n:n)]}projectOffset(n,i){return this.horiz?[n,this.nibble_edge(i)]:[this.nibble_edge(i),n]}*gen_svg_path(n){var i=!1;const s=["L"],u=["M"],c=["Z"];var f=[0,0];this.vflip&&(f[1]=this.height),this.hflip&&(f[0]=this.width),yield u,yield f;for(let[p,o]of n){if(this.vflip&&(p=this.height-p),isNaN(o)){i=!0;continue}i&&(yield this.jog_across(this.width),yield this.jog_down(p),i=!1),yield s,yield this.projectOffset(p,o)}i&&(yield this.jog_across(this.width)),yield this.jog_down(this.height),yield this.jog_across(0),yield c}}function Zn(e){let n,i,s,u,c,f,p,o,r,g,w,I,D,O,B,m,X,Q,S,U,Z,k,M,F,x,C;return{c(){n=_("svg"),i=_("g"),s=_("rect"),u=_("text"),c=P(e[2]),f=_("g"),p=_("svg"),o=_("defs"),r=_("mask"),g=_("path"),I=_("mask"),D=_("path"),B=_("rect"),m=_("rect"),X=_("line"),Q=_("g"),S=_("text"),U=P(e[4]),Z=_("foreignObject"),k=y("input"),M=_("foreignObject"),F=y("input"),t(s,"class","previewJoinTube svelte-ybv9p"),t(s,"width","120"),t(s,"height","15"),H(s,"fill",e[1]),t(u,"x","30"),t(u,"y","9pt"),t(u,"fontsize","9pt"),t(u,"class","svelte-ybv9p"),t(g,"class","previewCope svelte-ybv9p"),H(g,"fill","#FFFFFF"),H(g,"stroke","#000000"),t(g,"d",w=e[5].join(" ")),t(g,"transform","translate(-0.75,-7.5)"),t(r,"id","miterMask"),t(D,"class","previewCope svelte-ybv9p"),H(D,"fill","none"),H(D,"stroke","#FFFFFF"),H(D,"stroke-width","1.5px"),t(D,"d",O=e[5].join(" ")),t(D,"transform","translate(-0.75,-7.5)"),t(I,"id","miterOutline"),t(B,"width","100%"),t(B,"height","100%"),t(B,"fill","purple"),t(B,"mask","url(#miterOutline)"),t(m,"width","100%"),t(m,"height","100%"),t(m,"stroke","black"),t(m,"mask","url(#miterMask)"),H(m,"fill",e[3]),t(X,"class","guides svelte-ybv9p"),t(X,"y1","50%"),t(X,"y2","50%"),t(X,"x1","-30"),t(X,"x2","100%"),t(S,"x","30%"),t(S,"y","9pt"),t(S,"fontsize","9pt"),t(S,"class","svelte-ybv9p"),t(k,"class","previewAngleDrag svelte-ybv9p"),t(k,"type","range"),t(k,"min","0"),t(k,"max","45"),t(k,"step","0.5"),t(k,"title","drag to adjust cope angle"),H(k,"height","100px"),t(Z,"x","10"),t(Z,"y","-0.5"),t(Z,"height","100%"),t(Z,"width","100%"),t(p,"width","100"),t(p,"height","15"),t(p,"x","18.5"),t(p,"y","3"),t(p,"class","svelte-ybv9p"),t(f,"transform",e[6]),t(F,"class","previewAnglePull svelte-ybv9p"),t(F,"type","range"),t(F,"min","0"),t(F,"max","45"),t(F,"step","0.5"),t(F,"title","drag to adjust cope angle"),t(M,"x","7.5"),t(M,"y","90%"),t(M,"height","100%"),t(M,"width","100%"),t(n,"class","jointModel svelte-ybv9p"),t(n,"height","110"),t(n,"width","120")},m(A,L){Ie(A,n,L),l(n,i),l(i,s),l(i,u),l(u,c),l(n,f),l(f,p),l(p,o),l(o,r),l(r,g),l(o,I),l(I,D),l(p,B),l(p,m),l(p,X),l(p,Q),l(Q,S),l(S,U),l(p,Z),l(Z,k),V(k,e[0]),l(n,M),l(M,F),V(F,e[0]),x||(C=[R(k,"change",e[9]),R(k,"input",e[9]),R(k,"input",e[10]),R(F,"change",e[11]),R(F,"input",e[11]),R(F,"input",e[12])],x=!0)},p(A,[L]){L&2&&H(s,"fill",A[1]),L&4&&ie(c,A[2]),L&32&&w!==(w=A[5].join(" "))&&t(g,"d",w),L&32&&O!==(O=A[5].join(" "))&&t(D,"d",O),L&8&&H(m,"fill",A[3]),L&16&&ie(U,A[4]),L&1&&V(k,A[0]),L&64&&t(f,"transform",A[6]),L&1&&V(F,A[0])},i:Ae,o:Ae,d(A){A&&Me(n),x=!1,lt(C)}}}function Kn(e,n,i){let s;const u=En();let{angle:c}=n,{keepColor:f}=n,{joinTitle:p}=n,{cutColor:o}=n,{cutTitle:r}=n,g,w;function I(){c=me(this.value),i(0,c)}const D=m=>u("angleChanged",m.target.value);function O(){c=me(this.value),i(0,c)}const B=m=>u("angleChanged",m.target.value);return e.$$set=m=>{"angle"in m&&i(0,c=m.angle),"keepColor"in m&&i(1,f=m.keepColor),"joinTitle"in m&&i(2,p=m.joinTitle),"cutColor"in m&&i(3,o=m.cutColor),"cutTitle"in m&&i(4,r=m.cutTitle)},e.$$.update=()=>{if(e.$$.dirty&257){let m=new vt(c);m.complementaries[0],m.complementaries[1];let X=new Rt(30/Math.PI,0,0),Q=new Rt(30/Math.PI,0,0),S=new Mn(X,Q,m,0);try{i(8,g=new $t(S,{hflip:!0,vflip:!1,resolution:.2})),i(5,w=[...g.svg_path_commands,"V 30","H 100","V 0","H 0","Z"])}catch{console.error("failed to plot preview path")}}e.$$.dirty&1&&i(6,s=`rotate(${90-Number(c)}, 18.5, 7.25)`)},[c,f,p,o,r,w,s,u,g,I,D,O,B]}class Qn extends qt{constructor(n){super(),Ut(this,n,Kn,Zn,Ht,{angle:0,keepColor:1,joinTitle:2,cutColor:3,cutTitle:4})}}function _n(e){let n,i,s,u,c,f,p,o;return{c(){n=_("svg"),i=_("path"),t(i,"class","cope svelte-1wx5xw3"),H(i,"fill","none"),H(i,"stroke-dasharray","7 3"),t(i,"d",s=e[15].join(" ")),t(n,"class","cope_vbox svelte-1wx5xw3"),t(n,"x",u=e[21](e[11])),t(n,"y",c=e[21](e[4])),t(n,"width",f=e[21](e[14])),t(n,"height",p=e[21](e[17])),t(n,"preserveAspectRatio",e[12]),t(n,"viewBox",o=`0 0 ${e[14]} ${e[13]}`)},m(r,g){Ie(r,n,g),l(n,i)},p(r,g){g[0]&32768&&s!==(s=r[15].join(" "))&&t(i,"d",s),g[0]&2048&&u!==(u=r[21](r[11]))&&t(n,"x",u),g[0]&16&&c!==(c=r[21](r[4]))&&t(n,"y",c),g[0]&16384&&f!==(f=r[21](r[14]))&&t(n,"width",f),g[0]&131072&&p!==(p=r[21](r[17]))&&t(n,"height",p),g[0]&4096&&t(n,"preserveAspectRatio",r[12]),g[0]&24576&&o!==(o=`0 0 ${r[14]} ${r[13]}`)&&t(n,"viewBox",o)},d(r){r&&Me(n)}}}function xn(e){let n,i,s,u=dn()+"",c,f,p,o,r,g,w=e[6]=="in"?"1":"10",I,D,O,B,m,X,Q,S,U,Z,k,M,F,x,C,A,L,he,se,fe,Y,T,le,N=e[22](e[18].toFixed(2))+"",G,ve,K,d,ce=e[23].get(270).first()+"",Ze,st,E,we,qe,Fe=e[20].degrees+"",Ke,Xe,Qe,ze,xe=e[23].get(180).first()+"",ot,$,Pe,be,wt=e[23].get(270).last()+"",ut,at,pe,Le,Ge,ne,oe,Be=e[22](e[17].toFixed(2))+"",$e,ee,Ne,Re,rt,Je,Ve,ye,Ye,q,ge,_e,je,He=e[19].degrees+"",Oe,Ce,J,De,bt=e[23].get(0).first()+"",Ee,te,ue,W,ft=e[23].get(90).first()+"",et,tt,ke,a,v=e[23].get(90).last()+"",de,yt,z,Se,jt,ae,We,tn,kt=e[22](e[18].toFixed(2))+"",Xt,nn,ln,ht,Ue,ct,sn,Tt=e[22](e[18].toFixed(2))+"",Jt,on,un,nt,An=dn()+"",an,Pt,Ot,Ct,Dt,St,re=e[10]&&_n(e);return{c(){n=_("svg"),i=_("title"),s=P("CopeTube "),c=P(u),f=_("desc"),p=_("metadata"),o=_("svg"),r=_("rect"),g=_("text"),I=P(w),O=_("svg"),B=_("rect"),m=_("path"),re&&re.c(),M=_("svg"),F=_("line"),x=_("line"),C=_("line"),A=_("line"),L=_("line"),Y=_("svg"),T=_("text"),le=_("tspan"),G=P(N),ve=j(),K=_("text"),d=_("tspan"),Ze=P(ce),st=j(),E=_("text"),we=_("tspan"),qe=P("\u29A6"),Ke=P(Fe),Xe=P("\xB0"),Qe=j(),ze=_("tspan"),ot=P(xe),$=j(),Pe=_("text"),be=_("tspan"),ut=P(wt),at=j(),ne=_("svg"),oe=_("text"),$e=P(Be),ee=_("text"),Ne=_("tspan"),Re=P(e[8]),rt=j(),q=_("svg"),ge=_("text"),_e=_("tspan"),je=P("\u29A3\u29A2"),Oe=P(He),Ce=P("\xB0"),J=j(),De=_("tspan"),Ee=P(bt),te=j(),ue=_("text"),W=_("tspan"),et=P(ft),tt=j(),ke=_("text"),a=_("tspan"),de=P(v),yt=j(),ae=_("svg"),We=_("tspan"),tn=P("\u300A"),Xt=P(kt),nn=P("\u300B"),ln=j(),ht=_("rect"),Ue=_("text"),ct=_("tspan"),sn=P("\u2702\uFE0E "),Jt=P(Tt),on=P(" \u2702\uFE0E"),un=j(),nt=_("tspan"),an=P(An),t(r,"class","previewGauge svelte-1wx5xw3"),t(r,"x","0px"),t(r,"width","100%"),t(r,"height","100%"),t(r,"title","ruler to confirm pixel density"),t(g,"dx","9"),t(g,"dy","13"),t(g,"class","svelte-1wx5xw3"),t(o,"class","sizeGauge svelte-1wx5xw3"),t(o,"x","10px"),t(o,"y","-22px"),t(o,"width",D=e[6]=="in"?"1in":"1cm"),t(o,"height","20px"),t(B,"class","cope_bbox svelte-1wx5xw3"),t(B,"height","100%"),t(B,"width","100%"),H(B,"fill",e[1]?e[9]:e[7]),t(m,"class","cope svelte-1wx5xw3"),t(m,"d",X=e[16].join(" ")),H(m,"fill",e[1]?e[7]:e[9]),t(O,"class","cope_vbox svelte-1wx5xw3"),t(O,"x",Q=e[21](e[5])),t(O,"y",S=e[21](e[4])),t(O,"width",U=e[21](e[18])),t(O,"height",Z=e[21](e[17])),t(O,"viewBox",k=`0 0 ${e[18]} ${e[17]}`),t(F,"x1","0%"),t(F,"y1","0%"),t(F,"x2","100%"),t(F,"y2","0%"),t(x,"x1","0%"),t(x,"y1","25%"),t(x,"x2","100%"),t(x,"y2","25%"),t(C,"x1","0%"),t(C,"y1","50%"),t(C,"x2","100%"),t(C,"y2","50%"),t(A,"x1","0%"),t(A,"y1","75%"),t(A,"x2","100%"),t(A,"y2","75%"),t(L,"x1","0%"),t(L,"y1","100%"),t(L,"x2","100%"),t(L,"y2","100%"),t(M,"class","guides svelte-1wx5xw3"),t(M,"y",he=e[21](e[4])),t(M,"width",se=e[21](e[5]+e[18])),t(M,"height",fe=e[21](e[17])),t(le,"dx","30px"),t(le,"dy","-2px"),t(T,"x","100%"),t(T,"y","0%"),t(T,"class","svelte-1wx5xw3"),t(d,"class","ctc_ds"),t(d,"x","0%"),t(d,"dy","-1pt"),t(K,"x","0%"),t(K,"y","0%"),H(K,"transform","rotateX(180deg)"),H(K,"text-anchor","begin"),t(K,"class","svelte-1wx5xw3"),t(we,"dy","-1pt"),t(ze,"class","mtm_t"),t(ze,"x","0%"),t(ze,"dy","8pt"),t(E,"x","0%"),t(E,"y","25%"),t(E,"class","svelte-1wx5xw3"),t(be,"class","ctc_ds"),t(be,"x","0%"),t(be,"dy","-8pt"),t(Pe,"x","0%"),t(Pe,"y","100%"),t(Pe,"class","svelte-1wx5xw3"),t(Y,"class","titles svelte-1wx5xw3"),t(Y,"y",pe=e[21](e[4])),t(Y,"width",Le=e[21](e[5])),t(Y,"height",Ge=e[21](e[17])),t(oe,"class","join_od svelte-1wx5xw3"),t(oe,"x","50%"),t(oe,"y","-5%"),t(Ne,"class","mtm_t"),t(Ne,"x","20%"),t(Ne,"dy","8pt"),t(ee,"y","0%"),t(ee,"class","svelte-1wx5xw3"),t(ne,"class","titles turned svelte-1wx5xw3"),t(ne,"width",Je=e[21](e[17])),t(ne,"x",Ve=e[21](e[5])),t(ne,"height",ye=e[21](e[5])),t(ne,"y",Ye=e[21](e[4])),t(_e,"dy","-1pt"),t(De,"class","mtm_b"),t(De,"x","0%"),t(De,"dy","8pt"),t(ge,"x","0%"),t(ge,"y","25%"),t(ge,"class","svelte-1wx5xw3"),t(W,"class","ctc_ds"),t(W,"x","0%"),t(W,"dy","-4pt"),t(ue,"x","0%"),t(ue,"y","50%"),t(ue,"class","svelte-1wx5xw3"),t(a,"class","ctc_ds"),t(a,"x","0%"),t(a,"dy","9pt"),t(ke,"x","0%"),t(ke,"y","50%"),t(ke,"class","svelte-1wx5xw3"),t(q,"class","titles flipped svelte-1wx5xw3"),t(q,"y",z=e[21](e[4]+e[17])),t(q,"width",Se=e[21](e[5])),t(q,"height",jt=e[21](e[17])),t(We,"x","1px"),t(We,"dy","7pt"),t(ht,"class","tabcut svelte-1wx5xw3"),t(ht,"height","100%"),t(ht,"width","100%"),t(nt,"class","ctc_ds"),t(nt,"x","0%"),t(nt,"dy","6pt"),t(Ue,"class","tile_strip svelte-1wx5xw3"),t(Ue,"x","1px"),t(Ue,"y","6pt"),t(ae,"class","tab svelte-1wx5xw3"),t(ae,"x",Pt=e[21](e[5])),t(ae,"y",Ot=e[21](e[4]+e[17])),t(ae,"width",Ct=e[21](e[18])),t(ae,"height","18pt"),t(n,"class","miterTemplate svelte-1wx5xw3"),t(n,"width",Dt=e[21](e[2])),t(n,"height",St=e[21](e[3])),t(n,"preserveAspectRatio","xMinYMin slice"),H(n,"--ppi-scale-factor",Ft(1,e[0])),H(n,"--ppi-scale-pct",(Ft(100,e[0]).toFixed(3)-100).toString()+"%")},m(h,b){Ie(h,n,b),l(n,i),l(i,s),l(i,c),l(n,f),l(n,p),l(n,o),l(o,r),l(o,g),l(g,I),l(n,O),l(O,B),l(O,m),re&&re.m(n,null),l(n,M),l(M,F),l(M,x),l(M,C),l(M,A),l(M,L),l(n,Y),l(Y,T),l(T,le),l(le,G),l(T,ve),l(Y,K),l(K,d),l(d,Ze),l(K,st),l(Y,E),l(E,we),l(we,qe),l(we,Ke),l(we,Xe),l(E,Qe),l(E,ze),l(ze,ot),l(E,$),l(Y,Pe),l(Pe,be),l(be,ut),l(Pe,at),l(n,ne),l(ne,oe),l(oe,$e),l(ne,ee),l(ee,Ne),l(Ne,Re),l(ee,rt),l(n,q),l(q,ge),l(ge,_e),l(_e,je),l(_e,Oe),l(_e,Ce),l(ge,J),l(ge,De),l(De,Ee),l(ge,te),l(q,ue),l(ue,W),l(W,et),l(ue,tt),l(q,ke),l(ke,a),l(a,de),l(ke,yt),l(n,ae),l(ae,We),l(We,tn),l(We,Xt),l(We,nn),l(ae,ln),l(ae,ht),l(ae,Ue),l(Ue,ct),l(ct,sn),l(ct,Jt),l(ct,on),l(Ue,un),l(Ue,nt),l(nt,an)},p(h,b){b[0]&64&&w!==(w=h[6]=="in"?"1":"10")&&ie(I,w),b[0]&64&&D!==(D=h[6]=="in"?"1in":"1cm")&&t(o,"width",D),b[0]&642&&H(B,"fill",h[1]?h[9]:h[7]),b[0]&65536&&X!==(X=h[16].join(" "))&&t(m,"d",X),b[0]&642&&H(m,"fill",h[1]?h[7]:h[9]),b[0]&32&&Q!==(Q=h[21](h[5]))&&t(O,"x",Q),b[0]&16&&S!==(S=h[21](h[4]))&&t(O,"y",S),b[0]&262144&&U!==(U=h[21](h[18]))&&t(O,"width",U),b[0]&131072&&Z!==(Z=h[21](h[17]))&&t(O,"height",Z),b[0]&393216&&k!==(k=`0 0 ${h[18]} ${h[17]}`)&&t(O,"viewBox",k),h[10]?re?re.p(h,b):(re=_n(h),re.c(),re.m(n,M)):re&&(re.d(1),re=null),b[0]&16&&he!==(he=h[21](h[4]))&&t(M,"y",he),b[0]&262176&&se!==(se=h[21](h[5]+h[18]))&&t(M,"width",se),b[0]&131072&&fe!==(fe=h[21](h[17]))&&t(M,"height",fe),b[0]&262144&&N!==(N=h[22](h[18].toFixed(2))+"")&&ie(G,N),b[0]&1048576&&Fe!==(Fe=h[20].degrees+"")&&ie(Ke,Fe),b[0]&16&&pe!==(pe=h[21](h[4]))&&t(Y,"y",pe),b[0]&32&&Le!==(Le=h[21](h[5]))&&t(Y,"width",Le),b[0]&131072&&Ge!==(Ge=h[21](h[17]))&&t(Y,"height",Ge),b[0]&131072&&Be!==(Be=h[22](h[17].toFixed(2))+"")&&ie($e,Be),b[0]&256&&ie(Re,h[8]),b[0]&131072&&Je!==(Je=h[21](h[17]))&&t(ne,"width",Je),b[0]&32&&Ve!==(Ve=h[21](h[5]))&&t(ne,"x",Ve),b[0]&32&&ye!==(ye=h[21](h[5]))&&t(ne,"height",ye),b[0]&16&&Ye!==(Ye=h[21](h[4]))&&t(ne,"y",Ye),b[0]&524288&&He!==(He=h[19].degrees+"")&&ie(Oe,He),b[0]&131088&&z!==(z=h[21](h[4]+h[17]))&&t(q,"y",z),b[0]&32&&Se!==(Se=h[21](h[5]))&&t(q,"width",Se),b[0]&131072&&jt!==(jt=h[21](h[17]))&&t(q,"height",jt),b[0]&262144&&kt!==(kt=h[22](h[18].toFixed(2))+"")&&ie(Xt,kt),b[0]&262144&&Tt!==(Tt=h[22](h[18].toFixed(2))+"")&&ie(Jt,Tt),b[0]&32&&Pt!==(Pt=h[21](h[5]))&&t(ae,"x",Pt),b[0]&131088&&Ot!==(Ot=h[21](h[4]+h[17]))&&t(ae,"y",Ot),b[0]&262144&&Ct!==(Ct=h[21](h[18]))&&t(ae,"width",Ct),b[0]&4&&Dt!==(Dt=h[21](h[2]))&&t(n,"width",Dt),b[0]&8&&St!==(St=h[21](h[3]))&&t(n,"height",St),b[0]&1&&H(n,"--ppi-scale-factor",Ft(1,h[0])),b[0]&1&&H(n,"--ppi-scale-pct",(Ft(100,h[0]).toFixed(3)-100).toString()+"%")},i:Ae,o:Ae,d(h){h&&Me(n),re&&re.d()}}}function dn(){return new Date().toLocaleDateString()}function Ft(e,n){let i=96;return e*(n/window.devicePixelRatio/i)}function $n(e,n,i){let s,u,c,f,p,o,r,g,w,I,D,O,B,m,X,Q;Array.prototype.last=function(){return this[this.length-1]},Array.prototype.first=function(){return this[0]};let{angle:S}=n,{offset:U}=n,{device_ppi:Z=96}=n,{southpaw:k}=n,{width:M}=n,{height:F}=n,{fromTop:x}=n,{fromLeft:C}=n,{units:A="in"}=n,{unitSymbol:L="\u2033"}=n,{keepColor:he}=n,{joinTitle:se}=n,{cutColor:fe}=n,{cutTitle:Y}=n,{joinOD:T}=n,{cutOD:le}=n,{cutGauge:N}=n;function G(d){try{return d.toFixed(3)+A}catch{return d}}function ve(d){try{return d.toString()+L}catch{return d}}let K=new Map([[0,["Top"]],[90,["DS","\u{1F6B2}"]],[180,["Gnd"]],[270,["NDS","\u{1F6B2}"]]]);return e.$$set=d=>{"angle"in d&&i(24,S=d.angle),"offset"in d&&i(25,U=d.offset),"device_ppi"in d&&i(0,Z=d.device_ppi),"southpaw"in d&&i(1,k=d.southpaw),"width"in d&&i(2,M=d.width),"height"in d&&i(3,F=d.height),"fromTop"in d&&i(4,x=d.fromTop),"fromLeft"in d&&i(5,C=d.fromLeft),"units"in d&&i(6,A=d.units),"unitSymbol"in d&&i(26,L=d.unitSymbol),"keepColor"in d&&i(7,he=d.keepColor),"joinTitle"in d&&i(8,se=d.joinTitle),"cutColor"in d&&i(9,fe=d.cutColor),"cutTitle"in d&&i(27,Y=d.cutTitle),"joinOD"in d&&i(28,T=d.joinOD),"cutOD"in d&&i(29,le=d.cutOD),"cutGauge"in d&&i(10,N=d.cutGauge)},e.$$.update=()=>{e.$$.dirty[0]&16777216&&i(33,s=new vt(S)),e.$$.dirty[1]&4&&i(20,u=s.complementaries[0]),e.$$.dirty[1]&4&&i(19,c=s.complementaries[1]),e.$$.dirty[0]&536871936&&i(35,f=new Rt(le,N,0)),e.$$.dirty[0]&268435456&&i(34,p=new Rt(T,0,0)),e.$$.dirty[0]&33554432|e.$$.dirty[1]&28&&i(32,o=new Mn(f,p,s,U)),e.$$.dirty[0]&2|e.$$.dirty[1]&2&&i(31,r=new $t(o,{hflip:k})),e.$$.dirty[1]&1&&i(18,g=r.width),e.$$.dirty[1]&1&&i(17,w=r.height),e.$$.dirty[1]&1&&i(16,I=r.svg_path_commands),e.$$.dirty[0]&2|e.$$.dirty[1]&2&&i(30,D=new $t(o,{hflip:k,inner:!0})),e.$$.dirty[0]&1073741824&&i(15,O=D.svg_path_commands),e.$$.dirty[0]&1073741824&&i(14,B=D.width),e.$$.dirty[0]&1073741824&&i(13,m=D.height),e.$$.dirty[0]&2&&i(12,X=(k?"xMaxYMin":"xMinYMin")+" slice"),e.$$.dirty[0]&1073741858|e.$$.dirty[1]&1&&i(11,Q=k?C+r.width-D.width:C)},[Z,k,M,F,x,C,A,he,se,fe,N,Q,X,m,B,O,I,w,g,c,u,G,ve,K,S,U,L,Y,T,le,D,r,o,s,p,f]}class ei extends qt{constructor(n){super(),Ut(this,n,$n,xn,Ht,{angle:24,offset:25,device_ppi:0,southpaw:1,width:2,height:3,fromTop:4,fromLeft:5,units:6,unitSymbol:26,keepColor:7,joinTitle:8,cutColor:9,cutTitle:27,joinOD:28,cutOD:29,cutGauge:10},null,[-1,-1])}}function ti(e){var n,i;return n=document.createElement("canvas"),n.height=1,n.width=1,i=n.getContext("2d"),i.fillStyle=e,i.fillRect(0,0,1,1),i.getImageData(0,0,1,1).data}function ni(e){return("0"+e.toString(16)).slice(-2)}function mn(e){var n,i;return n=ti(e),i=[0,1,2].map(function(s){return ni(n[s])}).join(""),"#"+i}const vn={in:{maxOD:"4.0",maxGauge:"0.25",stepping:"0.1",units:"in",unitName:"Inches",unitSymbol:"\u2033"},mm:{maxOD:"90.0",maxGauge:"4.00",stepping:"0.5",units:"mm",unitName:"Millimeters",unitSymbol:"\u339C"}},en={'dymo-1x3.5"':{in:{width:1.125,height:3.5,fromLeft:.3,fromTop:.1},mm:{width:28.575,height:88.9,fromLeft:7.62,fromTop:2.54}},"credit-card":{in:{width:2.125,height:3.375,fromLeft:.3,fromTop:.1},mm:{width:53.98,height:85.6,fromLeft:7.62,fromTop:2.54}},"US-letter":{in:{width:8.5,height:11,fromLeft:.5,fromTop:.5},mm:{width:215.9,height:279.4,fromLeft:12.7,fromTop:12.7}}},ii=new Map([[96,["default"]],[113.49,["MacBook Pro 13 (early 2012)"]],[127.68,['MacBook Air 13" (2012-13)']],[135.09,['MacBook Air 11" (2013)']],[220.53,['MacBook Pro 15" Retina']],[224.42,["MacBook Air M2 (2022)"]],[226.42,["MacBook 2015"]],[226.98,['MacBook Pro 13" (2012-17)']],[264,["iPad Air 2","iPad (2018)"]],[323.61,["Apple iPhone 11","Apple iPhone XR"]],[325.61,["iPhone 6/6S"]],[325.97,["iPad mini Retina/2/3/4/5","iPhone 5/5S/SE","iPod touch 4/5/6/7 (2010-2019)"]],[364.38,["iPhone 7"]],[455.55,["iPhone XS Max","iPhone 11 Pro Max"]],[460,["iPhone 13"]],[462.63,["iPhone 6/6S/7/8 Plus","iPhone X/XS","iPhone 11 Pro"]]]);function wn(e,n,i){const s=e.slice();return s[30]=n[i][0],s[31]=n[i][1],s}function bn(e,n,i){const s=e.slice();return s[34]=n[i][0],s[35]=n[i][1],s}function yn(e,n,i){const s=e.slice();return s[38]=n[i],s}function jn(e){let n,i=e[38]+"",s;return{c(){n=y("option"),s=P(i),n.__value=e[34],n.value=n.__value,t(n,"class","svelte-14381vp")},m(u,c){Ie(u,n,c),l(n,s)},p:Ae,d(u){u&&Me(n)}}}function kn(e){let n,i,s=e[34]+"",u,c=e[35],f=[];for(let p=0;p<c.length;p+=1)f[p]=jn(yn(e,c,p));return{c(){n=y("optgroup"),i=y("option"),u=P(s);for(let p=0;p<f.length;p+=1)f[p].c();i.__value=e[34],i.value=i.__value,t(i,"class","svelte-14381vp"),t(n,"label","----")},m(p,o){Ie(p,n,o),l(n,i),l(i,u);for(let r=0;r<f.length;r+=1)f[r].m(n,null)},p(p,o){if(o[0]&128){c=p[35];let r;for(r=0;r<c.length;r+=1){const g=yn(p,c,r);f[r]?f[r].p(g,o):(f[r]=jn(g),f[r].c(),f[r].m(n,null))}for(;r<f.length;r+=1)f[r].d(1);f.length=c.length}},d(p){p&&Me(n),Zt(f,p)}}}function Tn(e){let n,i=e[30]+"",s;return{c(){n=y("option"),s=P(i),n.__value=e[30],n.value=n.__value,t(n,"class","svelte-14381vp")},m(u,c){Ie(u,n,c),l(n,s)},p:Ae,d(u){u&&Me(n)}}}function li(e){let n,i,s,u,c,f,p,o,r,g,w,I,D,O,B,m,X,Q,S,U,Z,k,M,F,x,C,A,L,he,se,fe,Y,T,le,N,G,ve,K,d,ce,Ze,st,E,we,qe,Fe,Ke,Xe,Qe,ze,xe,ot,$,Pe,be,wt,ut,at,pe,Le=e[2].southpaw?"lefty":"righty",Ge,ne,oe,Be,$e,ee,Ne,Re,rt,Je,Ve,ye,Ye,q,ge,_e,je,He,Oe,Ce,J,De,bt,Ee=e[7],te=[];for(let a=0;a<Ee.length;a+=1)te[a]=kn(bn(e,Ee,a));let ue=Object.entries(en),W=[];for(let a=0;a<ue.length;a+=1)W[a]=Tn(wn(e,ue,a));const ft=[e[2]];let et={};for(let a=0;a<ft.length;a+=1)et=rn(et,ft[a]);je=new Qn({props:et}),je.$on("angleChanged",e[28]);const tt=[e[2],{unitSymbol:e[6].unitSymbol},{units:e[6].units},e[5],{device_ppi:e[3]}];let ke={};for(let a=0;a<tt.length;a+=1)ke=rn(ke,tt[a]);return Ce=new ei({props:ke}),{c(){n=y("div"),i=y("div"),s=y("span"),u=y("input"),c=j(),f=y("input"),p=j(),o=y("label"),o.textContent="\u2300",r=j(),g=y("input"),D=j(),O=y("label"),B=P(e[4]),m=j(),X=y("br"),Q=j(),S=y("span"),U=y("input"),Z=j(),k=y("input"),M=j(),F=y("label"),F.textContent="\u2300",x=j(),C=y("input"),he=j(),se=y("label"),fe=P(e[4]),Y=j(),T=y("br"),le=j(),N=y("span"),G=y("input"),d=j(),ce=y("label"),Ze=P(e[4]),st=j(),E=y("input"),Ke=j(),Xe=y("label"),Qe=P(e[4]),ze=j(),xe=y("label"),xe.textContent="\u27C0",ot=j(),$=y("input"),Pe=j(),be=y("label"),be.textContent="\xB0",wt=j(),ut=y("br"),at=j(),pe=y("button"),Ge=P(Le),ne=j(),oe=y("button"),Be=P(e[0]),$e=j(),ee=y("select");for(let a=0;a<te.length;a+=1)te[a].c();Ne=j(),Re=y("label"),Re.textContent="dpi",rt=j(),Je=y("br"),Ve=j(),ye=y("button"),ye.textContent="\u{1F5A8}",Ye=j(),q=y("select");for(let a=0;a<W.length;a+=1)W[a].c();ge=j(),_e=y("div"),xt(je.$$.fragment),He=j(),Oe=y("div"),xt(Ce.$$.fragment),t(u,"type","color"),t(u,"title","color of uncut tube"),t(u,"class","svelte-14381vp"),t(f,"type","text"),t(f,"title","name of uncut tube"),t(f,"class","svelte-14381vp"),t(o,"class","units svelte-14381vp"),t(g,"class","sizeInput svelte-14381vp"),t(g,"type","number"),t(g,"inputmode","decimal"),t(g,"pattern","[0-9.]*"),t(g,"min","0.1"),t(g,"max",w=e[6].maxOD),t(g,"step",I=e[6].stepping),t(g,"title","OD of uncut tube"),t(O,"class","units svelte-14381vp"),t(U,"type","color"),t(U,"title","color of coped tube"),t(U,"class","svelte-14381vp"),t(k,"type","text"),t(k,"title","name of coped tube"),t(k,"class","svelte-14381vp"),t(F,"class","units svelte-14381vp"),t(C,"class","sizeInput svelte-14381vp"),t(C,"type","number"),t(C,"inputmode","decimal"),t(C,"pattern","[0-9.]*"),t(C,"min","0.1"),t(C,"max",A=e[6].maxOD),t(C,"step",L=e[6].stepping),t(C,"title","OD of coped tube"),t(se,"class","units svelte-14381vp"),t(G,"class","sizeInput svelte-14381vp"),t(G,"type","number"),t(G,"inputmode","decimal"),t(G,"pattern","[0-9.]*"),t(G,"min","0.00"),t(G,"max",ve=e[6].maxGauge),t(G,"step",K=e[6].stepping),t(G,"title","gauge (wall thickness) of coped tube"),t(ce,"class","units svelte-14381vp"),t(E,"class","sizeInput svelte-14381vp"),t(E,"type","number"),t(E,"inputmode","decimal"),t(E,"pattern","[-0-9.]*"),t(E,"min",we=-e[2].joinOD),t(E,"max",qe=e[2].joinOD),t(E,"step",Fe=e[6].stepping),t(E,"title","offset of tube centerlines"),t(Xe,"class","units svelte-14381vp"),t(xe,"class","units svelte-14381vp"),t($,"class","sizeInput svelte-14381vp"),t($,"type","number"),t($,"inputmode","decimal"),t($,"pattern","[0-9.]*"),t($,"min","0.0"),t($,"max","75"),t($,"step","any"),t($,"title","inclination angle of joint"),t(be,"class","units svelte-14381vp"),t(pe,"title","click to invert filing orientation"),t(pe,"class","svelte-14381vp"),H(pe,"width","6.5ch"),t(oe,"title","click to change units"),t(oe,"class","svelte-14381vp"),H(oe,"width","3.5ch"),t(ee,"title","choose viewing device's DPI"),t(ee,"class","svelte-14381vp"),e[3]===void 0&&mt(()=>e[25].call(ee)),H(ee,"width","4ch"),t(Re,"class","units svelte-14381vp"),t(ye,"title","print this!"),t(ye,"class","svelte-14381vp"),t(q,"title","choose paper size (red box shows its bounds)"),t(q,"class","svelte-14381vp"),e[1]===void 0&&mt(()=>e[27].call(q)),t(i,"id","controls"),t(i,"class","svelte-14381vp"),t(_e,"id","visualization"),t(_e,"class","svelte-14381vp"),t(n,"id","ctpanel"),t(n,"class","svelte-14381vp"),t(Oe,"id","template"),t(Oe,"class","svelte-14381vp")},m(a,v){Ie(a,n,v),l(n,i),l(i,s),l(s,u),V(u,e[2].keepColor),l(s,c),l(s,f),V(f,e[2].joinTitle),l(s,p),l(s,o),l(s,r),l(s,g),V(g,e[2].joinOD),l(s,D),l(s,O),l(O,B),l(i,m),l(i,X),l(i,Q),l(i,S),l(S,U),V(U,e[2].cutColor),l(S,Z),l(S,k),V(k,e[2].cutTitle),l(S,M),l(S,F),l(S,x),l(S,C),V(C,e[2].cutOD),l(S,he),l(S,se),l(se,fe),l(i,Y),l(i,T),l(i,le),l(i,N),l(N,G),V(G,e[2].cutGauge),l(N,d),l(N,ce),l(ce,Ze),l(N,st),l(N,E),V(E,e[2].offset),l(N,Ke),l(N,Xe),l(Xe,Qe),l(N,ze),l(N,xe),l(N,ot),l(N,$),V($,e[2].angle),l(N,Pe),l(N,be),l(i,wt),l(i,ut),l(i,at),l(i,pe),l(pe,Ge),l(i,ne),l(i,oe),l(oe,Be),l(i,$e),l(i,ee);for(let de=0;de<te.length;de+=1)te[de].m(ee,null);Mt(ee,e[3]),l(i,Ne),l(i,Re),l(i,rt),l(i,Je),l(i,Ve),l(i,ye),l(i,Ye),l(i,q);for(let de=0;de<W.length;de+=1)W[de].m(q,null);Mt(q,e[1]),l(n,ge),l(n,_e),It(je,_e,null),Ie(a,He,v),Ie(a,Oe,v),It(Ce,Oe,null),J=!0,De||(bt=[R(u,"input",e[9]),R(f,"input",e[10]),R(g,"input",e[11]),R(g,"input",e[12]),R(U,"input",e[13]),R(k,"input",e[14]),R(C,"input",e[15]),R(C,"input",e[16]),R(G,"input",e[17]),R(G,"input",e[18]),R(E,"input",e[19]),R(E,"input",e[20]),R($,"input",e[21]),R($,"input",e[22]),R(pe,"click",e[23]),R(oe,"click",e[24]),R(ee,"change",e[25]),R(ye,"click",e[26]),R(q,"change",e[27])],De=!0)},p(a,v){if(v[0]&4&&V(u,a[2].keepColor),v[0]&4&&f.value!==a[2].joinTitle&&V(f,a[2].joinTitle),(!J||v[0]&64&&w!==(w=a[6].maxOD))&&t(g,"max",w),(!J||v[0]&64&&I!==(I=a[6].stepping))&&t(g,"step",I),v[0]&4&&me(g.value)!==a[2].joinOD&&V(g,a[2].joinOD),(!J||v[0]&16)&&ie(B,a[4]),v[0]&4&&V(U,a[2].cutColor),v[0]&4&&k.value!==a[2].cutTitle&&V(k,a[2].cutTitle),(!J||v[0]&64&&A!==(A=a[6].maxOD))&&t(C,"max",A),(!J||v[0]&64&&L!==(L=a[6].stepping))&&t(C,"step",L),v[0]&4&&me(C.value)!==a[2].cutOD&&V(C,a[2].cutOD),(!J||v[0]&16)&&ie(fe,a[4]),(!J||v[0]&64&&ve!==(ve=a[6].maxGauge))&&t(G,"max",ve),(!J||v[0]&64&&K!==(K=a[6].stepping))&&t(G,"step",K),v[0]&4&&me(G.value)!==a[2].cutGauge&&V(G,a[2].cutGauge),(!J||v[0]&16)&&ie(Ze,a[4]),(!J||v[0]&4&&we!==(we=-a[2].joinOD))&&t(E,"min",we),(!J||v[0]&4&&qe!==(qe=a[2].joinOD))&&t(E,"max",qe),(!J||v[0]&64&&Fe!==(Fe=a[6].stepping))&&t(E,"step",Fe),v[0]&4&&me(E.value)!==a[2].offset&&V(E,a[2].offset),(!J||v[0]&16)&&ie(Qe,a[4]),v[0]&4&&me($.value)!==a[2].angle&&V($,a[2].angle),(!J||v[0]&4)&&Le!==(Le=a[2].southpaw?"lefty":"righty")&&ie(Ge,Le),(!J||v[0]&1)&&ie(Be,a[0]),v[0]&128){Ee=a[7];let z;for(z=0;z<Ee.length;z+=1){const Se=bn(a,Ee,z);te[z]?te[z].p(Se,v):(te[z]=kn(Se),te[z].c(),te[z].m(ee,null))}for(;z<te.length;z+=1)te[z].d(1);te.length=Ee.length}if(v[0]&136&&Mt(ee,a[3]),v&0){ue=Object.entries(en);let z;for(z=0;z<ue.length;z+=1){const Se=wn(a,ue,z);W[z]?W[z].p(Se,v):(W[z]=Tn(Se),W[z].c(),W[z].m(q,null))}for(;z<W.length;z+=1)W[z].d(1);W.length=ue.length}v[0]&2&&Mt(q,a[1]);const de=v[0]&4?gn(ft,[Yt(a[2])]):{};je.$set(de);const yt=v[0]&108?gn(tt,[v[0]&4&&Yt(a[2]),v[0]&64&&{unitSymbol:a[6].unitSymbol},v[0]&64&&{units:a[6].units},v[0]&32&&Yt(a[5]),v[0]&8&&{device_ppi:a[3]}]):{};Ce.$set(yt)},i(a){J||(Et(je.$$.fragment,a),Et(Ce.$$.fragment,a),J=!0)},o(a){Qt(je.$$.fragment,a),Qt(Ce.$$.fragment,a),J=!1},d(a){a&&Me(n),Zt(te,a),Zt(W,a),Gt(je),a&&Me(He),a&&Me(Oe),Gt(Ce),De=!1,lt(bt)}}}function si(e){{console.warn("probably popup-blocked, falling back to window.print!"),window.print();return}}function pt(e){const n=e.target.value;n&&(n.length>4||n.length)}function oi(e,n,i){let s,u,c;function f(){let T=["default"],le=[],N=ii;navigator.userAgent.includes("Macintosh")?T.push("MacBook","iPad"):navigator.userAgent.includes("iPhone")?T.push("iPhone"):navigator.userAgent.includes("iPad")?T.push("iPad"):navigator.userAgent.includes("iPod touch")?T.push("iPod"):le.push("iPod","iPad","iPhone","MacBook");for(const[G,ve]of N){let K=ve.filter(d=>T.some(ce=>d.includes(ce))&&le.every(ce=>!d.includes(ce)));K.length==0?N.delete(G):N.set(G,K)}return N}let p=Array.from(f()),o={angle:17,cutOD:1,cutGauge:0,cutTitle:"TopTube",cutColor:mn("lightgrey"),joinOD:1,joinTitle:"SeatTube",keepColor:mn("lightblue"),offset:0,southpaw:!1},r=96,g="in",w='dymo-1x3.5"';function I(){let T=g=="in"?"mm":"in";switch(T){case"mm":i(2,o.joinOD*=25.4,o),i(2,o.cutOD*=25.4,o),i(2,o.cutGauge*=25.4,o),i(2,o.offset*=25.4,o);break;case"in":i(2,o.joinOD/=25.4,o),i(2,o.cutOD/=25.4,o),i(2,o.cutGauge/=25.4,o),i(2,o.offset/=25.4,o);break}i(0,g=T)}function D(){o.keepColor=this.value,i(2,o)}function O(){o.joinTitle=this.value,i(2,o)}const B=T=>pt(T);function m(){o.joinOD=me(this.value),i(2,o)}function X(){o.cutColor=this.value,i(2,o)}function Q(){o.cutTitle=this.value,i(2,o)}const S=T=>pt(T);function U(){o.cutOD=me(this.value),i(2,o)}const Z=T=>pt(T);function k(){o.cutGauge=me(this.value),i(2,o)}const M=T=>pt(T);function F(){o.offset=me(this.value),i(2,o)}const x=T=>pt(T);function C(){o.angle=me(this.value),i(2,o)}const A=T=>i(2,o.southpaw=!o.southpaw,o),L=T=>I();function he(){r=hn(this),i(3,r),i(7,p)}const se=T=>si();function fe(){w=hn(this),i(1,w)}const Y=T=>i(2,o.angle=T.detail,o);return e.$$.update=()=>{e.$$.dirty[0]&1&&i(6,s=vn[g]),e.$$.dirty[0]&3&&i(5,u=en[w][g]),e.$$.dirty[0]&1&&i(4,c=vn[g].unitSymbol)},[g,w,o,r,c,u,s,p,I,D,O,B,m,X,Q,S,U,Z,k,M,F,x,C,A,L,he,se,fe,Y]}class ui extends qt{constructor(n){super(),Ut(this,n,oi,li,Ht,{},null,[-1,-1])}}function ai(e){let n,i;return n=new ui({}),{c(){xt(n.$$.fragment)},m(s,u){It(n,s,u),i=!0},p:Ae,i(s){i||(Et(n.$$.fragment,s),i=!0)},o(s){Qt(n.$$.fragment,s),i=!1},d(s){Gt(n,s)}}}class ri extends qt{constructor(n){super(),Ut(this,n,null,ai,Ht,{})}}new ri({target:document.getElementById("app")});
