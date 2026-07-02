import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Html, Line } from "@react-three/drei";
import * as THREE from "three";

function latLngToVec3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

function Globe({ disclosures, onHover }) {
    const groupRef = useRef();
    const R = 2;
    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.08;
    });

    const points = useMemo(
        () => disclosures.map((d) => ({ ...d, pos: latLngToVec3(d.lat, d.lng, R + 0.02) })),
        [disclosures]
    );

    // arcs from a hub (Indonesia) to each point
    const hub = useMemo(() => latLngToVec3(-6.2, 106.8, R + 0.02), []);
    const arcs = useMemo(() => {
        return points.map((p) => {
            const mid = hub.clone().add(p.pos).multiplyScalar(0.5);
            mid.setLength(R + 0.8);
            const curve = new THREE.QuadraticBezierCurve3(hub, mid, p.pos);
            return curve.getPoints(30);
        });
    }, [points, hub]);

    // latitude/longitude wireframe
    return (
        <group ref={groupRef}>
            <Sphere args={[R, 48, 48]}>
                <meshStandardMaterial color="#0a1030" emissive="#00121f" transparent opacity={0.85} roughness={0.7} />
            </Sphere>
            <Sphere args={[R + 0.005, 24, 24]}>
                <meshBasicMaterial color="#00D9FF" wireframe transparent opacity={0.12} />
            </Sphere>
            {arcs.map((pts, i) => (
                <Line key={i} points={pts} color="#00FFB3" lineWidth={0.7} transparent opacity={0.45} />
            ))}
            {points.map((p, i) => (
                <group key={i} position={p.pos.toArray()}>
                    <Sphere
                        args={[0.05, 12, 12]}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            onHover(p);
                        }}
                        onPointerOut={() => onHover(null)}
                    >
                        <meshBasicMaterial color="#FF4D6D" />
                    </Sphere>
                    <Ping />
                </group>
            ))}
        </group>
    );
}

function Ping() {
    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            const t = (state.clock.elapsedTime % 2) / 2;
            ref.current.scale.setScalar(1 + t * 3);
            ref.current.material.opacity = 0.5 * (1 - t);
        }
    });
    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color="#FF4D6D" transparent opacity={0.5} />
        </mesh>
    );
}

export default function GlobeScene({ disclosures = [] }) {
    const [hovered, setHovered] = useState(null);
    return (
        <div className="relative h-[420px] md:h-[520px] w-full" data-testid="globe-3d">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.8]}>
                <ambientLight intensity={0.6} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#00D9FF" />
                <pointLight position={[-5, -2, -3]} intensity={0.6} color="#8B5CF6" />
                <Globe disclosures={disclosures} onHover={setHovered} />
            </Canvas>
            {hovered && (
                <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 glass-panel-strong px-4 py-3 text-center">
                    <div className="font-display text-sm font-semibold text-white">{hovered.institution}</div>
                    <div className="mt-1 font-mono text-[11px] text-cyan-300">
                        {hovered.country} · {hovered.status} · {hovered.year}
                    </div>
                </div>
            )}
        </div>
    );
}
