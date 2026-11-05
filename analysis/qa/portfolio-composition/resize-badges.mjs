import sharp from 'sharp';
import {stat} from 'node:fs/promises';

let before=0,after=0;
for(const name of ['digilab-id','exercise-id','kominfo-ime-id']){
  const source=`public/photos/${name}.png`,target=`public/photos/${name}-512.webp`;
  await sharp(source).resize({width:512,height:512,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(target);
  const original=await stat(source),derivative=await stat(target);
  before+=original.size;after+=derivative.size;
  console.log(JSON.stringify({source,target,before:original.size,after:derivative.size,...await sharp(target).metadata()}));
}
if(after>350000)throw Error('Badge size budget exceeded');
console.log(JSON.stringify({before,after,reduction:Math.round((1-after/before)*100)+'%'}));
