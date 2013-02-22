class App
  constructor: () ->
    height = 450
    width = 950
    
    fov = 45
    aspect = width / height
    near = 0.1
    far = 10000

    light = new THREE.DirectionalLight(0xFFFFFF)
    
    light.position.x = 10
    light.position.y = 200
    light.position.z = 130
    
    
    @renderer = new THREE.WebGLRenderer({autoClear:true})
    #@renderer.setClearColor(new THREE.Color(0x000000))
    @renderer.setSize(width, height)
    
    @camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    @camera.position.z = 200
    @camera.target = new THREE.Vector3(0,150,0)
    
    @scene = new THREE.Scene()
    @scene.add(light)
    
    $('#board').empty()
    $("#board").get(0).appendChild(@renderer.domElement)
    
    @scene.add(@camera)
    
  render: () ->
    @renderer.render(@scene, @camera)

  started: () ->
    @started = true

  stopAnimation: () ->
    cancelAnimationFrame(@requestId)

window.App = App
  
window.animate = () ->
  window.tjs.requestId = requestAnimationFrame(window.animate)
  window.tjs.render()
