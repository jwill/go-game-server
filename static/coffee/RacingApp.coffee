class RacingApp extends App
  constructor: () ->
    super()
    @init()

  init: () ->
    @carsList = []
    loader = new THREE.JSONLoader()
    @loadCars()
    #@drawScene()

  loadCars: () ->
    loader = new THREE.JSONLoader()
    for i in [1..12]
      loader.load('/public/assets/cars_pack/Car'+i+'.js', @geom, '/public/assets/cars_pack')
      #@drawScene()
      
    
  geom: (g, m) ->
    self = this
    obj = new THREE.Mesh(g, new THREE.MeshFaceMaterial(m))
    carId = m[0].name.substring(0,2)
    obj.scale.set(6, 6, 6)
    obj.name = 'Car'+carId
    tjs.carsList.push obj
    if (tjs.carsList.length is 12) 
      // Try to wait until all the async calls are done
      setTimeout(tjs.drawScene(), 5000)
    
  drawScene: () ->
    
    @planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color: 0x085A14}))
    @planeMesh.rotation.x = -1.57
    @planeMesh.scale.set(20,20,20)
    @scene.add(@planeMesh)

    @car = @carsList[0].clone()
    @car.position.y = 50
    @scene.add(@car)
    window.animate()

window.RacingApp = RacingApp

