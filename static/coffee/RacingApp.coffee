class RacingApp extends App
  constructor: (ws) ->
    super()
    @ws = ws
    @init()

  init: () ->
    @playersList = {}
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

  loadCars: () ->
    loader = new THREE.JSONLoader()
    for i in [1..12]
      loader.load('/public/assets/cars_pack/Car'+i+'.js', @geom, '/public/assets/cars_pack')
      #loader.load('/public/assets/urban_road/level2.js', @handleRoadGeom, '/public/assets/urban_road')
      
    
  handleRoadGeom: (g, m) ->
    self = this
    tjs.road = new THREE.Mesh(g, new THREE.MeshFaceMaterial(m),0)
    tjs.road.position.set(0,0,0)
    tjs.road.scale.set(8,1,8)
    tjs.scene.add(tjs.road)

  geom: (g, m) ->
    self = this
    obj = new THREE.Mesh(g, new THREE.MeshFaceMaterial(m))
    carId = m[0].name.substring(0,2)
    obj.name = 'Car'+carId
    tjs.carsList.push obj
    if (tjs.carsList.length is 12) 
      # Try to wait until all the async calls are done
      setTimeout(tjs.drawScene(), 5000)
    
  drawScene: () ->
    
    @planeMesh = new THREE.Mesh(new THREE.CubeGeometry(100,1,100), new THREE.MeshBasicMaterial({color: 0x085A14}), 0)
    @planeMesh.scale.set(20,0.01,20)
    @planeMesh.position.set(0,0,0)
    @scene.add(@planeMesh)

    
    @carClone = @carsList[0].clone()
    @car = new THREE.Mesh(@carClone.geometry, @carClone.material)
    @car.name = @carsList[0].name
    @car.position.set(0, 20, 0)
    @car.scale.set(10,10,10)
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
    @k.down('p', () -> 
      self.toggleCamera())

  toggleCamera: () ->
    if @currentCamera is @camera
      @currentCamera = @carCamera
    else @currentCamera = @camera

  handleMessage: (msg) ->
    switch msg.Operation
      when "RaceGameState" then @loadAndUpdatePlayers(msg.MessageArray)

  loadAndUpdatePlayers: (msg) ->
    arr = JSON.parse(msg)
    createObject = false
    # If only one obj, loop won't execute (and shouldn't)
    for a in arr
      if a.PlayerId isnt app.playerId
        if @playersList[a.PlayerId] is undefined
          # find car id in list
          # clone
          # add to scene
        @playersList[a.PlayerId] = a


  setStateToServer: () ->
    m = {}
    m.PlayerId = ""
    m.Vel = @currentVelocity
    m.CarId = @car.name
    t = @car.position
    m.Pos = [t.x,t.y,t.z]
    m.Rot = @currentRotation
    msg = {}
    msg.Operation = "StateUpdate"
    msg.RoomID = app.roomID
    msg.Sender = app.playerId
    msg.messageMap = JSON.stringify(m)
    console.log msg
    app.ws.send(JSON.stringify(msg))


window.RacingApp = RacingApp

