/* Independent building assets and placement. Coordinates use the SVG plan units.
   Each object has its own picture, label, position and road connection.
   Moving x/y moves the picture, label, selection area and local driveway.
   For a substantial site rearrangement, review road junctions and routing as well. */
window.SITE_LAYOUT={
 buildings:[
  {id:'admin',image:'admin-plaster',x:45,y:100,width:160,height:145,label:'Службы',roadY:null},
  {id:'warehouse1',image:'warehouse',x:315,y:115,width:220,height:165,label:'Склад № 1',roadY:320},
  {id:'warehouse2',image:'warehouse-metal',x:585,y:75,width:205,height:145,label:'Склад № 2',roadY:320},
  {id:'workshop2',image:'workshop',x:780,y:170,width:205,height:155,label:'Цех Б',roadY:350},
  {id:'receiving',image:'receiving-metal',x:230,y:360,width:220,height:155,label:'Пункт приёмки',roadY:560},
  {id:'workshop1',image:'workshop-concrete',x:460,y:365,width:235,height:165,label:'Цех А',roadY:560},
  {id:'warehouse3',image:'warehouse',x:760,y:400,width:225,height:150,label:'Склад № 3',roadY:580}
 ],
 mainRoad:'M35 330H205V320H745V350H945 M205 320V560H745V580H945 M745 320V580',
 mainY:320,bottomY:560,bypassX:745,
 gate:{x:70,y:330}
};
