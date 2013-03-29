class RacingApp extends App
  constructor: (ws) ->
    super()
    @ws = ws
    @init()

  init: () ->
    @playersList = {}
    @playersCars = {}
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

    @car = @cloneCar(@carsList[0], 0, 20, 0)
    @scene.add(@car)
    @createCameraForCar(@car)
    window.animate()

  cloneCar: (obj, x, y, z) ->
    carClone = obj.clone()
    tempCar = new THREE.Mesh(carClone.geometry, carClone.material)
    tempCar.name = obj.name
    tempCar.position.set(x, y, z)
    tempCar.scale.set(10,10,10)
    tempCar

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
    # move other players cars
    for id, car in @playersCars
      console.log player
      player = @playersList[id]
      @rotateAroundObjectAxisAndMove(car, @yAxis, player.Rot / 180 * Math.PI, player.Vel)
      

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

  loadAndUpdatePlayers: (arr) ->
    console.log("load and update players")
    console.log arr
    window.x = arr
    # If only one obj, loop won't execute (and shouldn't)
    for raw in arr
      a = JSON.parse(raw)
      if a.PlayerId isnt app.playerId
        console.log("dfdgef")
        if @playersList[a.PlayerId] is undefined
          car = _.findWhere(@carsList, {name: a.CarId})
          p = @cloneCar(car)
          @playersCars[a.PlayerId] = p
          p.position.set(a.Pos[0], a.Pos[1], a.Pos[2])
          @scene.add(p)
        else 
          p = @playersCars[a.PlayerId]
          p.position.set(a.Pos[0], a.Pos[1], a.Pos[2])

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

