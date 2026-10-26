import type { LabCameraPose } from './lab-camera';

export type LabFlightKind='intro'|'route'|'overview'|'reset';
export type LabFlight={from:LabCameraPose;to:LabCameraPose;velocity:LabCameraPose;duration:number;lift:number;pullback:number;widen:number;kind:LabFlightKind};
export type LabFlightSample={pose:LabCameraPose;velocity:LabCameraPose};
const cameraClearance=[[1,1.9,2.75],[2,.85,1]] as const;
export function stillCameraVelocity():LabCameraPose {return {position:[0,0,0],target:[0,0,0],fov:0};}

export function createLabFlight(from:LabCameraPose,to:LabCameraPose,velocity:LabCameraPose,kind:LabFlightKind,portrait:boolean):LabFlight {
  const distance=Math.hypot(...to.position.map((value,i)=>value-from.position[i]));
  return {from:structuredClone(from),to:structuredClone(to),velocity:structuredClone(velocity),kind,
    duration:kind==='intro'?(portrait?2.6:3):kind==='reset'?1.25:kind==='overview'?1.95:Math.min(2.35,1.5+distance*.11),
    lift:kind==='route'?Math.min(.08,distance*.02):0,
    pullback:kind==='route'?Math.min(.25,distance*.045):0,
    widen:0,
  };
}

/** Quintic arrival plus a gentle outward arc. The incoming velocity survives rapid retargets. */
export function sampleLabFlight(flight:LabFlight,seconds:number,out:LabFlightSample) {
  const t=Math.max(0,Math.min(1,seconds/flight.duration)),t2=t*t,t3=t2*t,t4=t3*t,t5=t4*t;
  const s=6*t5-15*t4+10*t3,ds=(30*t4-60*t3+30*t2)/flight.duration;
  const v=t-6*t3+8*t4-3*t5,dv=1-18*t2+32*t3-15*t4;
  const arc=64*t3*(1-t)**3,dArc=192*t2*(1-t)**2*(1-2*t)/flight.duration;
  for(const key of ['position','target'] as const)for(let i=0;i<3;i++) {
    const offset=key==='position'?(i===1?flight.lift:i===2?flight.pullback:0):0;
    const delta=flight.to[key][i]-flight.from[key][i];
    out.pose[key][i]=flight.from[key][i]+delta*s+flight.velocity[key][i]*flight.duration*v+offset*arc;
    out.velocity[key][i]=delta*ds+flight.velocity[key][i]*dv+offset*dArc;
  }
  out.pose.fov=flight.from.fov+(flight.to.fov-flight.from.fov)*s+flight.velocity.fov*flight.duration*v+flight.widen*arc;
  out.velocity.fov=(flight.to.fov-flight.from.fov)*ds+flight.velocity.fov*dv+flight.widen*dArc;
  // Rapid overview retargets can carry high inward velocity. Brake softly before the furniture, without a hard position clamp.
  for(const [axis,floor,threshold]of cameraClearance) {
    const edge=Math.min(threshold,flight.from.position[axis]),gap=Math.max(1e-6,edge-floor);
    if(out.pose.position[axis]<edge) {
      const compression=Math.exp((out.pose.position[axis]-edge)/gap);
      out.pose.position[axis]=edge-gap+gap*compression;out.velocity.position[axis]*=compression;
    }
  }
  return out;
}
