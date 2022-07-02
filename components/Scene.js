
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Color, CubeReflectionMapping } from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


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
        camera.position.z = 12
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
        controls.target.y =1
        //risize
        const resize = ( )=> {
            renderer.setSize(currentMount.clientWidth ,
                currentMount.clientHeight)
                camera.aspect = currentMount.clientWidth/currentMount.clientHeight
                camera.updateProjectionMatrix()
        }
        window.addEventListener('resize', resize)
        //loader
        const glftloader = new GLTFLoader()
        glftloader.load('./assets/amongus.gltf',
            (gltf) => {
                scene.add(gltf.scene)
            },
            () => {},
            () => {},
        )
        //texturas
        const textureLoader = new THREE.TextureLoader()
        const map = textureLoader.load('./assets/Wall_Stone_010_basecolor.jpg')
        const aoMap = textureLoader.load('./assets/Wall_Stone_010_ambientOcclusion.jpg')
        const roughnessMap = textureLoader.load('./assets/Wall_Stone_010_roughness.jpg')
        const normalMap = textureLoader.load('./assets/Wall_Stone_010_normal.jpg')
        const heightMap = textureLoader.load('./assets/Wall_Stone_010_height.png')
        //cubo
        const cubo = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,1,1,
                250,
                250,
                250
                ),
            new THREE.MeshStandardMaterial({
                map:map,
                aoMap:aoMap,
                roughnessMap:roughnessMap,
                normalMap:normalMap,
                displacementMap:heightMap,
                displacementScale:0.05
            } )
        )
        cubo.scale.set(3,3,3)
        //scene.add(cubo)

        //luz
        const A0 = new THREE.AmbientLight(0xffffffff,0.5)
        scene.add(A0)
        const pointLight = new THREE.PointLight(
            0xffffffff,
            1.3
        )
        pointLight.position.y = 5
        //scene.add(pointLight)
        const directionalLight =new THREE.DirectionalLight(
            0xffffffff,
            1.3,
        )
        directionalLight.position.set(5,5,5)
        scene.add(directionalLight)
        const enviromentMap = new THREE.CubeTextureLoader()
        const envMap = enviromentMap.load([
            './assets/px.png',
            './assets/nx.png',
            './assets/py.png',
            './assets/ny.png',
            './assets/pz.png',
            './assets/nz.png',
        ])
        scene.environment = envMap
        scene.background = envMap
        //renderer scene
        const animate = () =>{
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