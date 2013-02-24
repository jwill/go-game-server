class RacingApp extends App
  constructor: () ->
    super()
    @init()
    @drawScene()
  init: () ->
    loader = new THREE.JSONLoader()
    loader.load('/public/assets/cars_pack/Car3.js', @geom, '/public/assets/cars_pack')

  geom: (g, m) ->
    self = this
    tjs.obj = new THREE.Mesh(g, new THREE.MeshFaceMaterial(m))
    tjs.obj.position.y = 50
    tjs.obj.scale.set(6, 6, 6)
    tjs.scene.add(tjs.obj)
    
  drawScene: () ->
    @planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color: 0x085A14}))
    @planeMesh.rotation.x = -1.57
    @planeMesh.scale.set(20,20,20)
    @scene.add(@planeMesh)

window.RacingApp = RacingApp

