import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";

type DossierStage3DProps = {
  currentIndex: number;
  hasOpenedCase: boolean;
  missionCompletion: number;
  peopleCount: number;
  view: string;
  deckMotion: "idle" | "next" | "previous" | "shuffle";
};

function useReducedMotionPreference() {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
}

function DossierScene({ currentIndex, hasOpenedCase, missionCompletion, peopleCount, view, deckMotion }: DossierStage3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const folderRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotionPreference();

  const accentColor = view === "deck" ? "#c7b987" : view === "missions" ? "#b8d9c9" : "#d8d1bd";
  const progress = THREE.MathUtils.clamp(missionCompletion / 100, 0, 1);
  const motionBias = deckMotion === "next" ? -0.18 : deckMotion === "previous" ? 0.18 : deckMotion === "shuffle" ? 0.32 : 0;
  const viewRotation = view === "deck" ? 0.02 : view === "roster" ? -0.045 : view === "missions" ? 0.04 : 0;
  const viewLift = view === "deck" ? -0.04 : view === "missions" ? 0.04 : 0;
  const evidenceNodes = useMemo(() => {
    const count = Math.min(Math.max(peopleCount || 5, 5), 12);
    const indexOffset = peopleCount > 0 ? currentIndex / peopleCount : 0;

    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count + indexOffset) * Math.PI * 2;
      const radius = 0.46 + (index % 4) * 0.18 + progress * 0.08;
      const active = index % count === currentIndex % count;

      return {
        id: `evidence-${index}`,
        active,
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.48, 0.02] as [number, number, number],
        size: active ? 0.044 : 0.024 + (index % 3) * 0.004,
      };
    });
  }, [currentIndex, peopleCount, progress]);

  useFrame((state, delta) => {
    if (!groupRef.current || !glassRef.current || !ringRef.current || reducedMotion) return;

    const pointerX = THREE.MathUtils.clamp(state.pointer.x, -0.72, 0.72);
    const pointerY = THREE.MathUtils.clamp(state.pointer.y, -0.72, 0.72);
    const targetRotation = new THREE.Euler(
      pointerY * -0.045,
      pointerX * 0.065 + motionBias + viewRotation,
      pointerX * -0.028,
    );
    easing.dampE(groupRef.current.rotation, targetRotation, 0.18, delta);
    easing.damp3(
      groupRef.current.position,
      [pointerX * 0.075, pointerY * 0.04 + viewLift, hasOpenedCase ? -0.32 - progress * 0.12 : -0.12],
      0.2,
      delta,
    );
    glassRef.current.rotation.z += delta * (0.012 + progress * 0.012);
    ringRef.current.rotation.z -= delta * (0.018 + progress * 0.016);
    ringRef.current.scale.setScalar(1 + progress * 0.035 + Math.sin(state.clock.elapsedTime * 0.7) * 0.006);
    if (folderRef.current) {
      folderRef.current.position.y = -0.46 + Math.sin(state.clock.elapsedTime * 0.68) * 0.024 - progress * 0.02;
      folderRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.36) * 0.013;
    }
  });

  return (
    <>
      <ambientLight intensity={1.35} />
      <directionalLight position={[-3, 4, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[2.2, -1.2, 3.4]} intensity={1.1} color="#efe3bd" />

      <group ref={groupRef} position={[0, 0, hasOpenedCase ? -0.32 : -0.12]}>
        <mesh position={[0, 0, -0.2]}>
          <boxGeometry args={[3.75, 5.5, 0.035]} />
          <meshPhysicalMaterial
            color="#f8f6ef"
            roughness={0.12}
            metalness={0.02}
            transmission={0.48}
            transparent
            opacity={0.44}
            thickness={0.45}
            ior={1.22}
            clearcoat={0.72}
            clearcoatRoughness={0.18}
          />
        </mesh>

        <group ref={ringRef} position={[0, hasOpenedCase ? 0.2 : 0.1, -0.04]}>
          <mesh>
            <torusGeometry args={[1.36, 0.006, 8, 132]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.52} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.82, 0.004, 8, 112]} />
            <meshBasicMaterial color="#9f967d" transparent opacity={0.32} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[1.04, 0.003, 8, 112]} />
            <meshBasicMaterial color="#cfc5a7" transparent opacity={0.24 + progress * 0.12} />
          </mesh>
          {evidenceNodes.map((node) => (
            <mesh key={node.id} position={node.position}>
              <sphereGeometry args={[node.size, 18, 18]} />
              <meshStandardMaterial
                color={node.active ? "#f6f1e2" : "#d9d1bd"}
                emissive={node.active ? "#efe5c6" : "#d6ccb0"}
                emissiveIntensity={node.active ? 0.34 : 0.16}
                roughness={0.24}
              />
            </mesh>
          ))}
          <mesh
            position={[Math.cos(progress * Math.PI * 2) * 1.36, Math.sin(progress * Math.PI * 2) * 0.65, 0.03]}
          >
            <sphereGeometry args={[0.034, 18, 18]} />
            <meshStandardMaterial color="#ffffff" emissive="#e9dcc0" emissiveIntensity={0.42} roughness={0.18} />
          </mesh>
        </group>

        <group ref={folderRef} position={[0, -0.44, 0]}>
          <mesh position={[-0.26, -0.1, 0.06]} rotation={[0, 0, -0.045]}>
            <boxGeometry args={[2.15, 3.04, 0.055]} />
            <meshStandardMaterial color="#dfcfaa" roughness={0.5} metalness={0.01} />
          </mesh>
          <mesh position={[0.2, 0.02, -0.01]} rotation={[0, 0, 0.055]}>
            <boxGeometry args={[2.02, 2.84, 0.048]} />
            <meshStandardMaterial color="#cdbc93" roughness={0.58} metalness={0.01} />
          </mesh>
          <mesh position={[0.45, 0.16, -0.07]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[1.84, 2.52, 0.036]} />
            <meshStandardMaterial color="#f4eddb" roughness={0.38} metalness={0.01} />
          </mesh>
          <mesh position={[1.2, 0.52, 0.02]} rotation={[0, 0, 0.06]}>
            <boxGeometry args={[0.32, 0.64, 0.04]} />
            <meshStandardMaterial color="#e7ddbe" roughness={0.44} metalness={0.01} />
          </mesh>
        </group>

        <mesh ref={glassRef} position={[0.84, 1.16, 0.12]} rotation={[0, 0, 0.25]}>
          <ringGeometry args={[0.16, 0.22, 48]} />
          <meshBasicMaterial color="#c8bea1" transparent opacity={0.34} side={THREE.DoubleSide} />
        </mesh>

        <group position={[-1.2, 1.78, 0.1]} rotation={[0, 0, -0.08]}>
          <mesh>
            <boxGeometry args={[0.86, 0.018, 0.018]} />
            <meshBasicMaterial color="#8f8878" transparent opacity={0.32} />
          </mesh>
          <mesh position={[0, -0.09, 0]}>
            <boxGeometry args={[0.54, 0.013, 0.014]} />
            <meshBasicMaterial color="#b7aa84" transparent opacity={0.36} />
          </mesh>
        </group>
      </group>
    </>
  );
}

function DossierStage3D(props: DossierStage3DProps) {
  return (
    <div className="dossier-stage-3d" aria-hidden="true">
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0.15, 6.4], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        performance={{ min: 0.65 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#ffffff", 0);
        }}
      >
        <DossierScene {...props} />
      </Canvas>
    </div>
  );
}

export default memo(DossierStage3D);
