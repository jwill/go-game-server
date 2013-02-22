class RacingApp extends App
  constructor: () ->
    super()
    @init()
    @drawScene()
  init: () ->
    loader = new THREE.JSONLoader()
    loader.load('/public/assets/cars_pack/Car1_.js', @geom, '/public/assets/cars_pack')

  geom: (g, m) ->
    self = this
    console.log(g)
    console.log(m)
    #tjs.obj = new THREE.Mesh(g, new THREE.MeshBasicMaterial( { color: 0x606060, morphTargets: false } ))
    tjs.obj = new THREE.Mesh(g, new THREE.MeshFaceMaterial(m))
    tjs.obj.scale.set(6, 6, 6)
    console.log(tjs.obj)
    window.tjs.scene.add(tjs.obj)
    
  drawScene: () ->
      
    #@scene.add(@obj)
    #@scene.add(@triangle)
    #@scene.add(@square)


    
window.RacingApp = RacingApp

