
import React, { useRef, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { Plane } from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {gsap} from'gsap'

export const Scene = () => {
    const mountRef = useRef(null)
    const timeline = new gsap.timeline(
        {defaults:{
            duration:1,
        }
        }
    )
    
    useEffect(() => {
        const currentMount = mountRef.current
        //Scene
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            45, window.innerWidth / window.innerHeight,0.1,1000
        )
        camera.position.z = 45;
        camera.position.y =4;
        camera.position.x=3;
        scene.add (camera)
        //renderer
        const renderer = new THREE.WebGLRenderer({antialias : true})
        renderer.setSize(currentMount.clientWidth,
                    currentMount.clientHeight)
        currentMount.appendChild(renderer.domElement)
        //controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.tartget = new THREE.Vector3(0,0,-40)
        controls.enableDamping =true
        controls.update();
        //suelo
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200),new THREE.MeshPhongMaterial({color:0x0a7d15 ,}))
        plane.rotation.x = - Math.PI / 2,
        scene.add(plane)
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
        //tierra
            const geometry1 = new THREE.SphereGeometry(0.8,32,16,
                )
            const material2 = new THREE.MeshStandardMaterial({
                map:map,
            } )
            const circulo = new THREE.Mesh(geometry1,material2)
            circulo.position.y=1
        scene.add(circulo)
        document.onkeydown = function(e){
            if (e.key === 'ArrowLeft' ) {
                timeline
                    .from(circulo.position, {
                        x:-1,
                    })
                    .from(circulo.rotation,
                        {
                            z: (Math.PI * 2)*-1,
                        },
                        "-=1.0"
                        )
                        movercam()
            }
            else if (e.key === 'ArrowUp' ) {
                timeline
                    .from(circulo.position, {
                        z:-1,
                    })
                    .from(circulo.rotation,
                        {
                            x: Math.PI * 2,
                        },
                        "-=1.0"
                    )
                    movercam()
            }
            else if (e.key === 'ArrowRight' ) {
                timeline
                    .from(circulo.position, {
                        x:+1,
                    })
                    .from(circulo.rotation,
                        {
                            z: (Math.PI * 2),
                        },
                        "-=1.0"
                        )
                    movercam()
            }
            else if (e.key === 'ArrowDown' ) {
                timeline
                    .from(circulo.position, {
                        z:+1,
                    })
                    .from(circulo.rotation,
                        {
                            x: (Math.PI * 2)*-1,
                        },
                        "-=1.0"
                        )
                    movercam()
            }
        }
        function movercam () {
            camera.position.x = circulo.position.x,
            camera.position.z = (circulo.position.z)+9,
            camera.position.y = (circulo.position.y)+2
        }
        //letras
        //luz
        const A0 = new THREE.AmbientLight(0xffffffff,0.7)
        scene.add(A0)
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