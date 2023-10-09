//dbscan.js от Megospc
//Версия: 1.0.0

export function dbScan(arr, options = {}) {
  if (typeof arr != "object" || arr === null) throw new TypeError("nodes is not an object");
  if (!arr instanceof Array) throw new TypeError("nodes is not an array");
  
  if (typeof options != "object" || options === null) throw new TypeError("options is not an object");
  
  options.metric ??= (x0, y0, x1, y1) => Math.sqrt((x0-x1)**2+(y0-y1)**2);
  
  if (typeof options.metric != "function") throw new TypeError("options.metric is not a function");
  
  let nodes = [];
  
  for (let i = 0; i < arr.length; i++) {
    const p = arr[i];
    
    if (typeof p != "object" || p === null) throw new TypeError(`nodes[${i}] is not an object`);
    
    nodes[i] = {
      ...p,
      _DBSchecked: false
    }
  }
  
  let mains = [];
  
  for (let i = 0; i < nodes.length; i++) {
    const p = nodes[i];
    
    if (!options.main) {
      mains.push(p);
      continue;
    }
    
    let count = 0;
    for (let j = 0; j < nodes.length; j++) {
      if (i == j) continue;
      
      const o = nodes[j];
      
      if (options.metric(p.x, p.y, o.x, o.y) < options.radius) if (++count >= options.main) {
        mains.push(p);
        break;
      }
    }
  }
  
  function check(p, group) {
    for (let i = 0; i < nodes.length; i++) {
      const o = nodes[i];
      
      if (o._DBSchecked) continue;
      
      if (options.metric(p.x, p.y, o.x, o.y) <= options.radius) {
        o.group = group;
        o._DBSchecked = true;
        if (mains.includes(o)) check(o, group);
      }
    }
  }
  
  for (let j = 1; j < (options.clusters ?? mains.length); j++) {
    const i = mains.findIndex(x => !x._DBSchecked);
    
    if (i >= 0) {
      const p = mains[i];
      p.group = j;
      p._DBSchecked = true;
      
      check(p, j);
    } else break;
  }
  
  for (let i = 0; i < nodes.length; i++) {
    const p = nodes[i];
    
    if (!p._DBSchecked) p.group = 0;
    
    delete p._DBSchecked;
  }
  
  return nodes;
}
