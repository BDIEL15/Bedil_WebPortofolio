// Original cursive-like study marks, not portfolio writing or personal claims.
export const notebookSegments: [number,number][] = [];
for(let row=0;row<4;row++)for(let word=0;word<3;word++)for(let step=0;step<48;step++) {
  for(const t of [step/48,(step+1)/48]) {
    notebookSegments.push([-.85+word*.235+t*.19,-.28+row*.15+Math.sin(t*Math.PI*8)*.025+Math.sin(t*Math.PI*4)*.012]);
  }
}
export function notebookMotion(seconds:number) {
  const phase=((seconds%12)+12)%12;
  const progress=Math.min(1,phase/9);
  const index=Math.min(notebookSegments.length/2-1,Math.floor(progress*notebookSegments.length/2));
  const a=notebookSegments[index*2],b=notebookSegments[index*2+1];
  const fraction=progress===1?1:progress*notebookSegments.length/2-index;
  let x=a[0]+(b[0]-a[0])*fraction,z=a[1]+(b[1]-a[1])*fraction;
  const returning=Math.max(0,(phase-10.5)/1.5),ease=returning*returning*(3-2*returning);
  x+=(notebookSegments[0][0]-x)*ease;z+=(notebookSegments[0][1]-z)*ease;
  return {count:Math.floor(progress*notebookSegments.length/2)*2,x,z,lift:Math.sin(returning*Math.PI)*.18,opacity:1-ease};
}
