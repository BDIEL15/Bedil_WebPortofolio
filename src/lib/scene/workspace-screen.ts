// Shared by the first-paint terminal canvas and the physical monitor texture.
export const workspaceSize={width:1536,height:864};
export const bootSteps=['interface loaded','workbench assembled','graphics prepared','workspace ready'] as const;
const bootCommand='$ boot observatory',bootTail='opening workspace...';
export function terminalFrame(seconds:number,phase:number,readyAt:number|null){
  const command=bootCommand.slice(0,Math.max(0,Math.floor(seconds*24)));
  const rows=Math.max(0,Math.min(4,Math.floor((seconds-.85)/.22)+1));
  const tail=phase===3&&readyAt!==null?bootTail.slice(0,Math.max(0,Math.floor((seconds-Math.max(1.7,readyAt))*32))):'';
  const complete=command===bootCommand&&rows===4&&tail===bootTail;
  return {command,rows,tail,complete,cursor:!complete&&Math.floor(seconds*2.4)%2===0,prepared:command===bootCommand};
}
const source='const lab = {\n  curiosity: true,\n  mode: "exploring",\n};\n\nfunction makeSomething() {\n  return lab.curiosity\n    ? "one more experiment"\n    : "take a break";\n}\n\nmakeSomething();';
const events:{at:number;text:string;key:string}[]=[];
const initialCode='// a little room to build\nimport { curiosity } from "./everyday";\n\nconst ideas = ["software", "robotics"];\n\n';
let at=1.2,text=initialCode;
for(const character of source){
  at+=character==='\n'?.42:character===' '?.095:.075;
  text+=character;events.push({at,text,key:character==='\n'?'Enter':character===' '? '':character.toUpperCase()});
  // A small correction, then a pause before carrying on.
  if(text.endsWith('curiosity: true')){
    at+=.1;events.push({at,text:text+'e',key:'E'});at+=.32;events.push({at,text,key:'Back'});
  }
}
export const codingPeriod=at+4;
export function codingFrame(seconds:number){
  const time=((seconds%codingPeriod)+codingPeriod)%codingPeriod;
  let low=0,high=events.length;
  while(low<high){const mid=(low+high)>>>1;if(events[mid].at<=time)low=mid+1;else high=mid;}
  const event=events[low-1],age=event?time-event.at:Infinity;
  return {text:event?.text??initialCode,key:event?.key??null,press:age<.15?Math.sin(Math.PI*age/.15)**2:0,cursor:Math.floor(time*2)%2===0};
}
export function paintWorkspace(ink:CanvasRenderingContext2D,mode:'boot'|'code',seconds=0,phase=3,aspect=16/9,terminal?:ReturnType<typeof terminalFrame>){
  ink.setTransform((ink.canvas?.width??768)/768,0,0,(ink.canvas?.height??432)/432,0,0);
  ink.clearRect(0,0,768,432);ink.fillStyle='#111b19';ink.fillRect(0,0,768,432);
  ink.fillStyle='#1c2924';ink.fillRect(0,0,768,42);
  const visibleWidth=Math.min(768,432*aspect),left=(768-visibleWidth)/2+Math.min(38,visibleWidth*.08),font=Math.min(18,visibleWidth/23);
  ink.font=`${mode==='boot'?Math.min(14,font):14}px monospace`;ink.fillStyle='#a8b7a2';ink.fillText(mode==='boot'?'abdiel@personal-lab: ~':'personal-lab / workspace.ts',mode==='boot'?left:28,27);
  ink.textBaseline='alphabetic';
  if(mode==='boot'){
    ink.font=`${font}px monospace`;ink.fillStyle='#e3ddcc';ink.fillText(terminal?.command??bootCommand,left,106);
    bootSteps.forEach((label,index)=>{
      if(terminal&&index>=terminal.rows)return;
      ink.fillStyle=index<=phase?'#b2c399':'#64786b';
      ink.fillText(`${index<=phase?'[ready]':'[ ... ]'} ${label}`,left,158+index*37);
    });
    ink.fillStyle='#dbb77e';ink.fillText(terminal?.tail??(phase===3?bootTail:'preparing workspace...'),left,355);
    if(terminal?.cursor){const value=terminal.tail||terminal.command,y=terminal.tail?355:106;ink.fillRect(left+ink.measureText(value).width+3,y-font*.8,font*.5,font);}
    return;
  }
  const frame=codingFrame(seconds),lines=frame.text.split('\n'),offset=Math.max(0,lines.length-11);
  ink.font='17px monospace';
  lines.slice(offset).forEach((line,index)=>{
    ink.fillStyle='#5d7466';ink.fillText(String(offset+index+1).padStart(2,' '),23,79+index*27);
    ink.fillStyle=line.trim().startsWith('//')?'#829982':/const|function|return/.test(line)?'#d6b77e':line.includes('"')?'#b2c399':'#d8dfcf';
    ink.fillText(line,68,79+index*27);
    if(index===Math.min(lines.length-1,10)&&frame.cursor){ink.fillStyle='#d6b77e';ink.fillRect(68+ink.measureText(line).width+2,63+index*27,8,19);}
  });
  ink.fillStyle='#1c2924';ink.fillRect(0,404,768,28);ink.fillStyle='#8ba58d';ink.font='12px monospace';ink.fillText('TypeScript   •   illustrative workspace',25,423);
}
