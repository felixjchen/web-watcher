(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{35:function(e,t,n){e.exports=n.p+"static/media/threetree_90.8428407b.png"},40:function(e,t,n){e.exports=n(52)},47:function(e,t,n){},50:function(e,t,n){},52:function(e,t,n){"use strict";n.r(t);var a=n(6),r=n.n(a),c=n(15),l=n(0),s=n.n(l),o=n(72),u=n(11),i=n(58),d=n(70),m=n(59),p=n(60),f=n(61),g=n(69),E=n(71),h=(n(47),n(35)),b=n.n(h),x=function(e){return s.a.createElement("div",{id:"login"},s.a.createElement(i.a,{"aria-label":"header"},s.a.createElement(d.a,{href:"#",prefix:"Web"},"Watcher")),s.a.createElement(m.a,null,s.a.createElement(p.a,null,s.a.createElement(f.a,{id:"leftBox",sm:{span:4,offset:0},md:{span:4,offset:1},lg:{span:4,offset:2}},s.a.createElement("h1",{className:"bx--type-semibold"},"Sign in to your account"),s.a.createElement(g.a,{id:"email",labelText:"Email"}),s.a.createElement(g.a.PasswordInput,{id:"password",labelText:"Password"}),s.a.createElement(E.a,{size:"small",kind:"secondary",onClick:e.signupHandler},"Sign up"),s.a.createElement(E.a,{size:"small",onClick:e.loginHandler},"Log in")),s.a.createElement(f.a,{id:"rightBox",sm:{span:0},md:{span:2},lg:{span:4}},s.a.createElement("img",{src:b.a,alt:"fractel"})))))},w=n(62),y=n(63),v=n(64),O=n(68),k=n(25),j=n(28),T=n(29),B=n(31),I=n(23),S=n(26),P=n(27),C=n(30),H=n(24),N=n(13),J=n(65),W=(n(50),function(){console.log("Add WATCHER")}),R=[{key:"url",header:"URL"},{key:"frequency",header:"Frequency"},{key:"last_run",header:"Last Run"},{key:"options",header:"Options"}],L=function(e){return s.a.createElement("div",{id:"page"},s.a.createElement(w.a,{render:function(){return s.a.createElement(s.a.Fragment,null,s.a.createElement(i.a,{"aria-label":"IBM Platform Name"},s.a.createElement(d.a,{prefix:"Web"},"Watcher"),s.a.createElement(y.a,null,s.a.createElement(v.a,{"aria-label":"Logout",onClick:e.logoutHandler},s.a.createElement(J.a,null)))))}}),s.a.createElement(O.a,{rows:e.watchers,headers:R},function(t){var n=t.rows,a=t.headers,r=t.getHeaderProps,c=t.getRowProps,l=t.getTableProps,o=t.getToolbarProps,u=t.onInputChange,i=t.getTableContainerProps;return s.a.createElement(k.a,Object.assign({title:"Hello ".concat(e.email)},i()),s.a.createElement(j.a,Object.assign({},o(),{"aria-label":"data table toolbar"}),s.a.createElement(T.a,null,s.a.createElement(B.a,{onChange:u}),s.a.createElement(E.a,{onClick:W},"Add Watcher"))),s.a.createElement(I.a,l(),s.a.createElement(S.a,null,s.a.createElement(P.a,null,a.map(function(e){return s.a.createElement(C.a,Object.assign({key:e.key},r({header:e})),e.header)}))),s.a.createElement(H.a,null,n.map(function(e){console.log(e.cells);var t=new Date(0);return t.setUTCSeconds(e.cells[2].value),e.cells[2].value=String(t),e.cells[3].value="DROPDOWN",s.a.createElement(P.a,Object.assign({key:e.id},c({row:e})),e.cells.map(function(e){return s.a.createElement(N.a,{key:e.id},e.value)}))}))))}))},z="https://bwaexdxnvc.execute-api.us-east-2.amazonaws.com/prod",A=null,D=function(){var e=Object(c.a)(r.a.mark(function e(t){var n,a,c,l,i,d,m,p;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.email,a=t.password,null==n&&(n=document.getElementById("email").value),null==a&&(a=document.getElementById("password").value),Object(u.render)(s.a.createElement(o.a,null),document.getElementById("root")),c={method:"POST",credentials:"include",body:JSON.stringify({email:n,password:a}),headers:{"Content-Type":"application/json"},redirect:"follow"},e.next=7,fetch("".concat(z,"/login"),c);case 7:return l=e.sent,e.next=10,l.text();case 10:if(i=e.sent,d=JSON.parse(i),m=d.success,p=d.accessTokenExpiry,console.log(i),m){e.next=18;break}alert("Bad login"),Object(u.render)(s.a.createElement(x,{signupHandler:F,loginHandler:D}),document.getElementById("root")),e.next=21;break;case 18:return e.next=20,U();case 20:A=setTimeout(_,1e3*(p-2));case 21:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),q=function(){var e=Object(c.a)(r.a.mark(function e(){var t,n,a;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t={method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},redirect:"follow"},e.next=3,fetch("".concat(z,"/logout"),t);case 3:return n=e.sent,e.next=6,n.text();case 6:return a=e.sent,Object(u.render)(s.a.createElement(x,{signupHandler:F,loginHandler:D}),document.getElementById("root")),clearTimeout(A),e.abrupt("return",JSON.parse(a).success);case 10:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),F=function(){var e=Object(c.a)(r.a.mark(function e(){var t,n,a,c,l;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=document.getElementById("email").value,n=document.getElementById("password").value,Object(u.render)(s.a.createElement(o.a,null),document.getElementById("root")),a={method:"POST",credentials:"include",body:JSON.stringify({email:t,password:n}),headers:{"Content-Type":"application/json"},redirect:"follow"},e.next=6,fetch("".concat(z,"/user"),a);case 6:return c=e.sent,e.next=9,c.text();case 9:l=e.sent,console.log(l),D({email:t,password:n});case 12:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),U=function(){var e=Object(c.a)(r.a.mark(function e(){var t,n,a,c,l,o;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t={credentials:"include"},e.next=3,fetch("".concat(z,"/user"),t);case 3:return n=e.sent,e.next=6,n.text();case 6:a=e.sent,c=JSON.parse(a),l=c.email,o=c.watchers,console.log("Rendering",l,o),Object(u.render)(s.a.createElement(L,{logoutHandler:q,email:l,watchers:o}),document.getElementById("root"));case 10:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),_=function(){var e=Object(c.a)(r.a.mark(function e(){var t,n,a,c,l,s;return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t={method:"POST",credentials:"include"},e.next=3,fetch("".concat(z,"/refresh"),t);case 3:return n=e.sent,e.next=6,n.text();case 6:if(a=e.sent,c=JSON.parse(a),l=c.success,s=c.accessTokenExpiry,l){e.next=13;break}return e.next=11,q();case 11:e.next=15;break;case 13:A=setTimeout(_,1e3*(s-2)),U();case 15:return e.abrupt("return",l);case 16:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}(),M=function(){var e=Object(c.a)(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,_();case 3:e.sent,e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),console.log("Initial silent refresh fail "+e.t0);case 9:case"end":return e.stop()}},e,null,[[0,6]])}));return function(){return e.apply(this,arguments)}}();Object(u.render)(s.a.createElement(o.a,null),document.getElementById("root")),M()}},[[40,1,2]]]);
//# sourceMappingURL=main.c71bd6dc.chunk.js.map