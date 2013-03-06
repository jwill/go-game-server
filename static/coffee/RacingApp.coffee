class RacingApp extends App
  constructor: () ->
    super()
    @init()

  init: () ->
    @carsList = []
    @maxVelocity = 5
    @minVelocity = -5
    @minRotation = -90
    @maxRotation = 90
    @currentRotation = 0
    @currentVelocity = 0
    @interval = 0.5
    @worldBounds = null

    loader = new THREE.JSONLoader()
    @loadCars()
    @setupKeys()
    #@drawScene()

  loadCars: () ->
    loader = new THREE.JSONLoader()
    for i in [1..12]
      loader.load('/public/assets/cars_pack/Car'+i+'.js', @geom, '/public/assets/cars_pack')
      loader.load('/public/assets/urban_road/level2.js', @handleRoadGeom, '/public/assets/urban_road')
      #@drawScene()
      
    
  handleRoadGeom: (g, m) ->
    self = this
    tjs.road = new THREE.Mesh(g, new THREE.MeshFaceMaterial(m))
    #tjs.scene.add(tjs.road)
    tjs.road.scale.x = 8
    tjs.road.scale.z = 8

  geom: (g, m) ->
    self = this
    obj = new THREE.Mesh(g, new THREE.MeshFaceMaterial(m))
    carId = m[0].name.substring(0,2)
    obj.scale.set(6, 6, 6)
    obj.name = 'Car'+carId
    tjs.carsList.push obj
    if (tjs.carsList.length is 12) 
      # Try to wait until all the async calls are done
      setTimeout(tjs.drawScene(), 5000)
    
  drawScene: () ->
    @planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,100), new THREE.MeshBasicMaterial({color: 0x085A14}))
    @planeMesh.rotation.x = -1.57
    @planeMesh.scale.set(20,20,20)
    @scene.add(@planeMesh)

    @car = @carsList[0].clone()
    @car.position.y = 50
    @scene.add(@car)
    @createCameraForCar(@car)
    window.animate()

  createCameraForCar: (car) ->
    @carCamera = new THREE.PerspectiveCamera(60, 3/2, 1, 2000)
    @carCamera.position = new THREE.Vector3(car.position.x, car.position.y + 5, car.position.z - 10)
    @carCamera.target = new THREE.Vector3(car.position.x,car.position.y,car.position.z)
    @scene.add(@carCamera)


  render: () ->
    @updateObjects()
    super()

  updateObjects: () ->
    @rotateAroundObjectAxisAndMove(@car, @yAxis, @currentRotation / 180 * Math.PI, @currentVelocity)
    @rotateAroundObjectAxisAndMove(@carCamera, @yAxis, @currentRotation / 180 * Math.PI, @currentVelocity)

  handleInput: (direction) ->
    if direction is 'up'
      @increment('x')
    else if direction is 'down'
      @decrement('x')
    else if direction is 'left'
      @increment('z')
    else if direction is 'right'
      @decrement('z')

  increment: (axis) ->
    if axis is 'z'
      if (@currentRotation + @interval) < @maxRotation
        @currentRotation += @interval
    if axis is 'x'
      if (@currentVelocity + @interval) < @maxVelocity
        @currentVelocity += @interval

  decrement: (axis) ->
    if axis is 'z'
      if (@currentRotation - @interval) > @minRotation
        @currentRotation -= @interval
    if axis is 'x'
      if (@currentVelocity - @interval) > @minVelocity
        @currentVelocity -= @interval

  rotateAroundObjectAxisAndMove: (object, axis, radians, velocity) ->
    rotObjectMatrix = new THREE.Matrix4()
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians)
    object.matrix.multiply(rotObjectMatrix)
    object.matrix = rotObjectMatrix
    object.rotation.setEulerFromRotationMatrix(object.matrix)
    # calcuate forward motion based on rotation vector
    x = Math.sin(radians) * velocity
    z = Math.cos(radians) * velocity
    object.position.z += z
    object.position.x += x

  setupKeys: () ->
    self = this
    @k.down('w', () ->
      self.handleInput('up'))
    @k.up('w', () -> @currentVelocity = 0)
    @k.down('s', () ->
      self.handleInput('down'))
    @k.up('s', () -> @currentVelocity = 0)
    @k.down('left', () ->
      self.handleInput('left'))
    @k.up('left', () -> )
    @k.down('right', () ->
      self.handleInput('right'))
    @k.up('right', () -> )

window.RacingApp = RacingApp

