
import React, { useRef, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"


export const Scene = () => {
    const mountRef = useRef(null)

    useEffect(() => {
        const currentMount = mountRef.current
        //Scene
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            25,
            currentMount.clientWidth / currentMount.clientHeight,
            0.1,
            1000
        )
        camera.position.z = 2
        camera.position.y =3
        scene.add (camera)
        //renderer
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(currentMount.clientWidth,
                    currentMount.clientHeight)
        currentMount.appendChild(renderer.domElement)
        //controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping =true
        controls.addEventListener( 'change', light_update )
        //risize
        const resize = ( )=> {
            renderer.setSize(currentMount.clientWidth ,
                currentMount.clientHeight)
                camera.aspect = currentMount.clientWidth/currentMount.clientHeight
                camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', resize)
        //texturas
        const textureLoader = new THREE.TextureLoader()
        const map = textureLoader.load('./assets/Albedo.jpg')
        const aoMap = textureLoader.load('./assets/night_lights_modified.png')
        const heightMap = textureLoader.load('./assets/Bump.jpg')
        //tierra
            const geometry1 = new THREE.SphereGeometry(0.8,32,16,
                )
            const material2 = new THREE.MeshStandardMaterial({
                map:map,
                aoMap:aoMap,
                displacementMap:heightMap,
                displacementScale:0.05
            } )
            const circulo = new THREE.Mesh(geometry1,material2)
        scene.add(circulo)
        //lunatexturas
        const textureLoader1 = new THREE.TextureLoader()
        const map1 = textureLoader.load('./assets/lunacolor.jpg')
        //luna
            const geometry = new THREE.SphereGeometry(0.3,32,16,
                )
            const material = new THREE.MeshStandardMaterial({
                map:map1,
            } )
            const luna = new THREE.Mesh(geometry,material)
            luna.position.x = 2
        //movimiento
        const lunaobj = new THREE.Object3D()
        lunaobj.add(luna)
        scene.add(lunaobj)
        //luz
        const A0 = new THREE.AmbientLight(0xffffffff,0.1)
        scene.add(A0)
        const pointLight = new THREE.PointLight(
            0xffffffff,
            1
        )
        scene.add(pointLight)
        function light_update()
        {
            pointLight.position.copy( camera.position);
        }
        const enviromentMap = new THREE.CubeTextureLoader()
        const envMap = enviromentMap.load([
            './assets/px.png',
            './assets/nx.png',
            './assets/py.png',
            './assets/ny.png',
            './assets/pz.png',
            './assets/nz.png',
        ])
        scene.background = envMap

        const animate = () =>{
            circulo.rotateY(0.004)
            luna.rotateY(0.004)
            lunaobj.rotateY(0.02)
            controls.update()
            renderer.render(scene,camera)
            requestAnimationFrame(animate)
        }
        animate()


        //clean
        return () => {
            currentMount.removeChild(renderer.domElement)
        }
    },  [])



    return (
    <div className='Contenedor3D'
        ref={mountRef}
        style={{width:'100%', height:'100vh'}}
    >
    </div>
  )
}

export default Scene