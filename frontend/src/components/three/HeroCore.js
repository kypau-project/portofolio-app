import React, { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Icosahedron, Sphere, Line, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function CoreObject({ mouse }) {
    const groupRef = useRef();
    const coreRef = useRef();
    const wireRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            // ease toward mouse-driven target rotation
            const tx = mouse.current.y * 0.4;
            const ty = mouse.current.x * 0.5 + state.clock.elapsedTime * 0.08;
            groupRef.current.rotation.x += (tx - groupRef.current.rotation.x) * 0.05;
            groupRef.current.rotation.y += (ty - groupRef.current.rotation.y) * 0.05;
        }
        if (coreRef.current) {
            const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
            coreRef.current.scale.setScalar(s);
        }
        if (wireRef.current) wireRef.current.rotation.y -= delta * 0.15;
    });

    // orbiting nodes + connection lines
    const nodes = useMemo(() => {
        const arr = [];
        const count = 14;
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            const r = 2.3;
            arr.push(
                new THREE.Vector3(
                    r * Math.cos(theta) * Math.sin(phi),
                    r * Math.sin(theta) * Math.sin(phi),
                    r * Math.cos(phi)
                )
            );
        }
        return arr;
    }, []);

    const lines = useMemo(() => {
        const segs = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].distanceTo(nodes[j]) < 2.6) {
                    segs.push([nodes[i], nodes[j]]);
                }
            }
        }
        return segs;
    }, [nodes]);

    return (
        <group ref={groupRef}>
            {/* inner glowing core */}
            <Icosahedron ref={coreRef} args={[0.85, 1]}>
                <meshStandardMaterial
                    color="#00D9FF"
                    emissive="#00D9FF"
                    emissiveIntensity={1.4}
                    metalness={0.6}
                    roughness={0.2}
                    wireframe
                />
            </Icosahedron>
            <Icosahedron args={[0.6, 2]}>
                <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1.8} roughness={0.3} />
            </Icosahedron>

            {/* wireframe shell */}
            <Icosahedron ref={wireRef} args={[1.6, 1]}>
                <meshBasicMaterial color="#00FFB3" wireframe transparent opacity={0.25} />
            </Icosahedron>

            {/* connection lines */}
            {lines.map((seg, i) => (
                <Line key={i} points={seg} color="#00D9FF" lineWidth={0.6} transparent opacity={0.35} />
            ))}

            {/* orbiting nodes */}
            {nodes.map((p, i) => (
                <Float key={i} speed={2} rotationIntensity={0} floatIntensity={0.6}>
                    <Sphere args={[0.06, 12, 12]} position={p.toArray()}>
                        <meshStandardMaterial
                            color={i % 3 === 0 ? "#00FFB3" : i % 3 === 1 ? "#00D9FF" : "#8B5CF6"}
                            emissive={i % 3 === 0 ? "#00FFB3" : i % 3 === 1 ? "#00D9FF" : "#8B5CF6"}
                            emissiveIntensity={2}
                        />
                    </Sphere>
                </Float>
            ))}
        </group>
    );
}

function Particles({ count = 260 }) {
    const ref = useRef();
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 4 + Math.random() * 4;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            arr[i * 3 + 2] = r * Math.cos(phi);
        }
        return arr;
    }, [count]);
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.03;
    });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.035} color="#00D9FF" transparent opacity={0.7} sizeAttenuation />
        </points>
    );
}

function Rig({ mouse }) {
    const { camera } = useThree();
    useFrame(() => {
        camera.position.x += (mouse.current.x * 1.2 - camera.position.x) * 0.04;
        camera.position.y += (mouse.current.y * 0.8 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

export default function HeroCore() {
    const mouse = useRef({ x: 0, y: 0 });
    const onMove = (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -((e.clientY / window.innerHeight) * 2 - 1);
        mouse.current = { x, y };
    };
    return (
        <div className="absolute inset-0" onPointerMove={onMove} data-testid="hero-3d-core">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                dpr={[1, 1.8]}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={1.2} color="#00D9FF" />
                <pointLight position={[-5, -3, 2]} intensity={1} color="#8B5CF6" />
                <CoreObject mouse={mouse} />
                <Particles />
                <Rig mouse={mouse} />
                <EffectComposer>
                    <Bloom intensity={0.9} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
