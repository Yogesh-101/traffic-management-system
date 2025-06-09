
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TrafficScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create road
    const roadGeometry = new THREE.PlaneGeometry(10, 2);
    const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);
    
    // Create road lines
    const lineGeometry = new THREE.PlaneGeometry(0.8, 0.1);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    
    for (let i = -4; i <= 4; i += 2) {
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      line.position.set(i, 0.01, 0);
      line.rotation.x = -Math.PI / 2;
      road.add(line);
    }
    
    // Create car
    const carGroup = new THREE.Group();
    
    // Car body
    const carGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.4);
    const carMaterial = new THREE.MeshBasicMaterial({ color: 0x1e3a8a }); // traffic-primary
    const carBody = new THREE.Mesh(carGeometry, carMaterial);
    carBody.position.y = 0.2;
    carGroup.add(carBody);
    
    // Car roof
    const roofGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.4);
    const roofMaterial = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 }); // traffic-secondary
    const carRoof = new THREE.Mesh(roofGeometry, roofMaterial);
    carRoof.position.y = 0.45;
    carRoof.position.x = -0.05;
    carGroup.add(carRoof);
    
    // Car wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 32);
    const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
    
    const wheelPositions = [
      { x: 0.3, y: 0.1, z: 0.2 },
      { x: 0.3, y: 0.1, z: -0.2 },
      { x: -0.3, y: 0.1, z: 0.2 },
      { x: -0.3, y: 0.1, z: -0.2 }
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.rotation.z = Math.PI / 2;
      carGroup.add(wheel);
    });
    
    carGroup.position.y = 0.1;
    carGroup.position.z = -0.5;
    scene.add(carGroup);
    
    // Traffic light
    const trafficLightGroup = new THREE.Group();
    
    // Pole
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 32);
    const poleMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 1;
    trafficLightGroup.add(pole);
    
    // Light housing
    const housingGeometry = new THREE.BoxGeometry(0.3, 0.7, 0.2);
    const housingMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const housing = new THREE.Mesh(housingGeometry, housingMaterial);
    housing.position.y = 1.8;
    trafficLightGroup.add(housing);
    
    // Lights
    const lightGeometry = new THREE.CircleGeometry(0.08, 32);
    
    const redLight = new THREE.Mesh(
      lightGeometry,
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    redLight.position.set(0, 2.0, 0.11);
    trafficLightGroup.add(redLight);
    
    const yellowLight = new THREE.Mesh(
      lightGeometry,
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    yellowLight.position.set(0, 1.8, 0.11);
    trafficLightGroup.add(yellowLight);
    
    const greenLight = new THREE.Mesh(
      lightGeometry,
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    greenLight.position.set(0, 1.6, 0.11);
    trafficLightGroup.add(greenLight);
    
    trafficLightGroup.position.set(3, 0, 1);
    scene.add(trafficLightGroup);
    
    // Position camera
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      carGroup.position.x += 0.03;
      if (carGroup.position.x > 5) {
        carGroup.position.x = -5;
      }
      
      // Traffic light animation
      const time = Date.now() * 0.001;
      const lightCycle = Math.floor(time % 6);
      
      redLight.material.opacity = lightCycle < 2 ? 1 : 0.2;
      yellowLight.material.opacity = lightCycle >= 2 && lightCycle < 3 ? 1 : 0.2;
      greenLight.material.opacity = lightCycle >= 3 ? 1 : 0.2;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={containerRef} className="w-full h-96" />;
};

export default TrafficScene;
