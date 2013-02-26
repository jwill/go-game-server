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
    @forwardVector = new THREE.Vector3(0,0,1)
    loader = new THREE.JSONLoader()
    @loadCars()
    @setupKeys()
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
    window.animate()

  render: () ->
    @updateObjects()
    super()

  updateObjects: () ->
    @car.position.z += @currentVelocity
    @rotateAroundObjectAxis(@car, @yAxis, @currentRotation / 180 * Math.PI)
    #@car.rotation.y += @currentRotation

  handleInput: (direction) ->
    if direction is 'up'
      @increment('x')
    else if direction is 'down'
      @decrement('x')
    else if direction is 'left'
      @increment('z')
    else @decrement('z')

  increment: (axis) ->
    if axis is 'z'
      if (@currentRotation + @interval) < @maxRotation
        @currentRotation += @interval
    if axis is 'x'
      if (@currentVelocity + @interval) < @maxVelocity
        @currentVelocity += @interval

  decrement: (axis) ->
    if axis is 'z'
      if (@currentRotation - @interval) < @maxRotation
        @currentRotation -= @interval
    if axis is 'x'
      if (@currentVelocity - @interval) < @maxVelocity
        @currentVelocity -= @interval

  rotateAroundObjectAxis: (object, axis, radians) ->
    rotObjectMatrix = new THREE.Matrix4()
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians)
    object.matrix.multiply(rotObjectMatrix)
    object.matrix = rotObjectMatrix
    object.rotation.setEulerFromRotationMatrix(object.matrix)

  calculateForwardMotion: (object, forward, radians) ->
    #forwardMatrix = new THREE.Matrix4().identity()

  setupKeys: () ->
    self = this
    @k.down('w', () ->
      self.handleInput('up'))
    @k.up('w', () -> )
    @k.down('s', () ->
      self.handleInput('down'))
    @k.up('s', () -> )
    @k.down('a', () ->
      self.handleInput('left'))
    @k.up('a', () -> )
    @k.down('d', () ->
      self.handleInput('right'))
    @k.up('d', () -> )

window.RacingApp = RacingApp

