import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  MapPin,
  X,
  Maximize2,
  RotateCcw,
  Home,
  MessageSquare,
  Users,
  ShieldCheck,
  Building,
  TreePine,
  Layers,
  Compass,
  Phone,
  Sparkles,
} from 'lucide-react';
import { Warga, Rumah } from '../types';

interface Peta3DLingkunganModalProps {
  isOpen: boolean;
  onClose: () => void;
  wargaList: Warga[];
  rumahList: Rumah[];
  onOpenWhatsAppForWarga?: (warga: Warga) => void;
}

interface Building3DData {
  id: string;
  type: 'RUMAH' | 'BALAI_WARGA' | 'POS_KAMLING' | 'MASJID' | 'TAMAN' | 'LAPANGAN';
  title: string;
  nomorRumah: string;
  rt: string;
  rw: string;
  pemilikNama: string;
  penghuniCount: number;
  status: 'HUNI' | 'KOSONG' | 'FASUM';
  color: number;
  position: [number, number, number];
  size: [number, number, number];
  wargaMatch?: Warga;
}

export const Peta3DLingkunganModal: React.FC<Peta3DLingkunganModalProps> = ({
  isOpen,
  onClose,
  wargaList = [],
  rumahList = [],
  onOpenWhatsAppForWarga,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Selected Building state
  const [selectedBuilding, setSelectedBuilding] = useState<Building3DData | null>(null);
  const [selectedRtFilter, setSelectedRtFilter] = useState<string>('ALL');

  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filtered Buildings
  const [buildingsData, setBuildingsData] = useState<Building3DData[]>([]);

  // Initialize Buildings Data from prop or default layout
  useEffect(() => {
    const defaultData: Building3DData[] = [];

    // Fasilitas Umum
    defaultData.push({
      id: 'fasum-balai',
      type: 'BALAI_WARGA',
      title: 'Balai Warga & Sekretariat RT/RW',
      nomorRumah: 'Blok Utama',
      rt: '003',
      rw: '012',
      pemilikNama: 'Pengurus RT 003 / RW 012',
      penghuniCount: 0,
      status: 'FASUM',
      color: 0x0056b3, // Royal Blue
      position: [0, 0, 0],
      size: [6, 4, 8],
    });

    defaultData.push({
      id: 'fasum-pos',
      type: 'POS_KAMLING',
      title: 'Pos Kamling & Siskamling Utama',
      nomorRumah: 'Pos 01',
      rt: '003',
      rw: '012',
      pemilikNama: 'Tim Siskamling & Linmas',
      penghuniCount: 0,
      status: 'FASUM',
      color: 0x059669, // Emerald Green
      position: [-10, 0, 10],
      size: [4, 3, 4],
    });

    defaultData.push({
      id: 'fasum-masjid',
      type: 'MASJID',
      title: 'Masjid Al-Ikhlas Sukamaju',
      nomorRumah: 'Blok DKM',
      rt: '003',
      rw: '012',
      pemilikNama: 'Pengurus DKM Al-Ikhlas',
      penghuniCount: 0,
      status: 'FASUM',
      color: 0x0d9488, // Teal
      position: [12, 0, -10],
      size: [8, 6, 8],
    });

    // Generate Residential Houses Grid (RT 001 - RT 005)
    let index = 0;
    const rts = ['001', '002', '003', '004', '005'];
    
    for (let row = -2; row <= 2; row++) {
      for (let col = -3; col <= 3; col++) {
        if (row === 0 && col === 0) continue; // Reserved for Balai Warga
        if (row === -1 && col === 2) continue; // Reserved for Masjid

        const houseNum = `${col < 0 ? 'A' : 'B'}-${Math.abs(row * 4) + Math.abs(col) + 1}`;
        const rtVal = rts[(Math.abs(row) + Math.abs(col)) % rts.length];

        // Find matching Warga
        const matchedWarga = wargaList[index % Math.max(wargaList.length, 1)];
        index++;

        const isHuni = index % 5 !== 0;

        defaultData.push({
          id: `house-${row}-${col}`,
          type: 'RUMAH',
          title: `Rumah Blok ${houseNum}`,
          nomorRumah: `No. ${houseNum}`,
          rt: rtVal,
          rw: '012',
          pemilikNama: isHuni ? (matchedWarga?.nama || `Warga RT ${rtVal}`) : 'Rumah Kosong / Disewakan',
          penghuniCount: isHuni ? Math.floor(Math.random() * 3) + 2 : 0,
          status: isHuni ? 'HUNI' : 'KOSONG',
          color: isHuni ? (rtVal === '003' ? 0x3b82f6 : 0xf59e0b) : 0x94a3b8,
          position: [col * 9, 0, row * 9],
          size: [4.5, 3.5, 5],
          wargaMatch: isHuni ? matchedWarga : undefined,
        });
      }
    }

    setBuildingsData(defaultData);
  }, [wargaList, rumahList]);

  // Three.js Render Engine Effect
  useEffect(() => {
    if (!isOpen || !mountRef.current || buildingsData.length === 0) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9); // Light Gray BG
    scene.fog = new THREE.FogExp2(0xf1f5f9, 0.012);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 35, 45);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(30, 50, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xe2e8f0, 0x0f172a, 0.4);
    scene.add(hemiLight);

    // 5. Environment Ground & Roads
    const groundGroup = new THREE.Group();

    // Grass Base
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    groundGroup.add(ground);

    // Roads Grid (Asphalt)
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    
    // Main Avenue
    const mainRoadGeo = new THREE.PlaneGeometry(8, 110);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(0, 0.01, 0);
    mainRoad.receiveShadow = true;
    groundGroup.add(mainRoad);

    // Cross Road
    const crossRoadGeo = new THREE.PlaneGeometry(110, 8);
    const crossRoad = new THREE.Mesh(crossRoadGeo, roadMat);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.set(0, 0.01, 0);
    crossRoad.receiveShadow = true;
    groundGroup.add(crossRoad);

    // Road Markings (Yellow Lines)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const lineGeo = new THREE.PlaneGeometry(0.5, 100);
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.02, 0);
    groundGroup.add(line);

    scene.add(groundGroup);

    // 6. Buildings Group
    const buildingsGroup = new THREE.Group();
    meshesGroupRef.current = buildingsGroup;

    buildingsData.forEach((bData) => {
      if (selectedRtFilter !== 'ALL' && bData.type === 'RUMAH' && bData.rt !== selectedRtFilter) {
        return;
      }

      const houseGroup = new THREE.Group();
      houseGroup.position.set(bData.position[0], bData.position[1], bData.position[2]);
      houseGroup.userData = bData;

      // House Base / Wall Mesh
      const wallGeo = new THREE.BoxGeometry(bData.size[0], bData.size[1], bData.size[2]);
      const wallMat = new THREE.MeshStandardMaterial({
        color: bData.color,
        roughness: 0.4,
        metalness: 0.1,
      });
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.y = bData.size[1] / 2;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      houseGroup.add(wallMesh);

      // Roof Mesh (Pyramid / Prism)
      const roofGeo = new THREE.ConeGeometry(bData.size[0] * 0.75, bData.size[1] * 0.6, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: bData.type === 'FASUM' ? 0x0f172a : 0xef4444,
        roughness: 0.3,
      });
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.position.y = bData.size[1] + (bData.size[1] * 0.3);
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = true;
      houseGroup.add(roofMesh);

      // Door Accent
      const doorGeo = new THREE.BoxGeometry(1, 1.8, 0.1);
      const doorMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
      const doorMesh = new THREE.Mesh(doorGeo, doorMat);
      doorMesh.position.set(0, 0.9, (bData.size[2] / 2) + 0.05);
      houseGroup.add(doorMesh);

      buildingsGroup.add(houseGroup);
    });

    scene.add(buildingsGroup);

    // 7. Mouse Orbit & Pan Interaction Controls
    const domElem = renderer.domElement;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !cameraRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      const camera = cameraRef.current;
      
      // Orbit around center Y
      const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      let angle = Math.atan2(camera.position.z, camera.position.x);

      angle -= deltaX * 0.005;
      camera.position.x = radius * Math.cos(angle);
      camera.position.z = radius * Math.sin(angle);

      // Height angle
      camera.position.y = Math.max(10, Math.min(70, camera.position.y + deltaY * 0.1));
      camera.lookAt(0, 0, 0);

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Raycaster Tap/Click Event with GSAP Animation Focus
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !meshesGroupRef.current) return;

      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(meshesGroupRef.current.children, true);

      if (intersects.length > 0) {
        // Find topmost house group
        let clickedObj: THREE.Object3D | null = intersects[0].object;
        while (clickedObj && !clickedObj.userData?.id && clickedObj.parent) {
          clickedObj = clickedObj.parent;
        }

        if (clickedObj && clickedObj.userData?.id) {
          const bData = clickedObj.userData as Building3DData;
          setSelectedBuilding(bData);

          // GSAP Smooth Camera Focus Animation
          const targetX = bData.position[0];
          const targetZ = bData.position[2];

          gsap.to(cameraRef.current.position, {
            duration: 1.2,
            x: targetX + 10,
            y: 18,
            z: targetZ + 15,
            ease: 'power2.inOut',
            onUpdate: () => {
              cameraRef.current?.lookAt(targetX, bData.size[1] / 2, targetZ);
            },
          });

          // GSAP House Jump/Bounce Effect
          gsap.to(clickedObj.position, {
            duration: 0.3,
            y: 2,
            yoyo: true,
            repeat: 1,
            ease: 'power1.out',
          });
        }
      }
    };

    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElem.addEventListener('click', handleCanvasClick);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElem.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, buildingsData, selectedRtFilter]);

  if (!isOpen) return null;

  // Reset Camera Overview
  const handleResetCamera = () => {
    setSelectedBuilding(null);
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        duration: 1.2,
        x: 0,
        y: 35,
        z: 45,
        ease: 'power2.inOut',
        onUpdate: () => {
          cameraRef.current?.lookAt(0, 0, 0);
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-white rounded-3xl border-4 border-slate-900 shadow-[10px_10px_0px_0px_#0f172a] w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b-4 border-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_0px_#ffffff]">
              <Compass className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Peta 3D Interaktif Lingkungan RT/RW
                <span className="px-2 py-0.5 rounded-full bg-sky-400 text-slate-950 text-[10px] font-black uppercase border border-white">
                  Three.js + GSAP 3D Engine
                </span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Tap / Klik blok bangunan untuk fokus kamera GSAP & lihat data detail penghuni
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Controls Bar */}
        <div className="bg-slate-100 p-3 border-b-2 border-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs font-bold shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 flex items-center gap-1">
              <Layers className="w-4 h-4 text-emerald-600" /> Filter RT:
            </span>
            <select
              value={selectedRtFilter}
              onChange={(e) => {
                setSelectedRtFilter(e.target.value);
                setSelectedBuilding(null);
              }}
              className="bg-white border-2 border-slate-900 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none"
            >
              <option value="ALL">Semua RT (RT 001 - RT 005)</option>
              <option value="001">RT 001</option>
              <option value="002">RT 002</option>
              <option value="003">RT 003</option>
              <option value="004">RT 004</option>
              <option value="005">RT 005</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetCamera}
              className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-900 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
              <span>Reset Kamera Panorama</span>
            </button>
          </div>
        </div>

        {/* Main 3D Canvas Stage */}
        <div className="flex-1 relative bg-slate-200 overflow-hidden">
          {/* Canvas Container */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating Instructions Overlay */}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white p-2.5 rounded-2xl border border-slate-700 text-[11px] font-medium space-y-1 shadow-lg pointer-events-none max-w-xs">
            <div className="font-black text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Panduan Navigasi 3D:
            </div>
            <p className="text-slate-200">
              • <strong>Geser (Drag Mouse/Touch):</strong> Putar sudut pandang kamera 3D
            </p>
            <p className="text-slate-200">
              • <strong>Tap / Klik Bangunan:</strong> Animasi GSAP zoom in & lihat detail warga
            </p>
          </div>

          {/* Selected Building Detail Floating Card */}
          {selectedBuilding && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-200 z-10">
              <div className="flex items-start justify-between border-b-2 border-slate-200 pb-2">
                <div>
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-amber-300 text-slate-950 border border-slate-900">
                    {selectedBuilding.type}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-1">
                    {selectedBuilding.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    {selectedBuilding.nomorRumah} • RT {selectedBuilding.rt} / RW {selectedBuilding.rw}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedBuilding(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-medium text-slate-700">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Penghuni / Pemilik:</span>
                  <span className="font-extrabold text-slate-900">
                    {selectedBuilding.pemilikNama}
                  </span>
                </div>

                {selectedBuilding.type === 'RUMAH' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 block font-bold">Status Hunian</span>
                      <span className="font-black text-emerald-700">
                        {selectedBuilding.status === 'HUNI' ? 'Dihuni' : 'Kosong'}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 block font-bold">Jumlah Jiwa</span>
                      <span className="font-black text-slate-900">
                        {selectedBuilding.penghuniCount} Orang
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {selectedBuilding.wargaMatch && onOpenWhatsAppForWarga && (
                <button
                  onClick={() => {
                    if (selectedBuilding.wargaMatch) {
                      onOpenWhatsAppForWarga(selectedBuilding.wargaMatch);
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Hubungi via WhatsApp Dispatcher</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
