import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** Source geometries must belong exclusively to this static group. Materials/textures stay shared. */
export function bakeStaticGroup(root:THREE.Group) {
  root.updateWorldMatrix(true,true);
  const local=root.matrixWorld.clone().invert(),sources=new Set<THREE.BufferGeometry>();
  const batches=new Map<THREE.Material,THREE.BufferGeometry[]>(),meshes:THREE.Mesh[]=[];
  root.traverse(object=>{
    if(!(object instanceof THREE.Mesh))return;
    const material=object.material as THREE.Material;
    const transformed=object.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(local,object.matrixWorld));
    const geometry=transformed.index?transformed.toNonIndexed():transformed;
    if(geometry!==transformed)transformed.dispose();
    const list=batches.get(material)??[];list.push(geometry);batches.set(material,list);meshes.push(object);sources.add(object.geometry);
  });
  for(const mesh of meshes)mesh.removeFromParent();
  for(const geometry of sources)geometry.dispose();
  for(const [material,parts] of batches) {
    const geometry=mergeGeometries(parts);for(const part of parts)part.dispose();
    if(!geometry)throw new Error('Static lab geometry could not be batched');
    const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
  }
}
