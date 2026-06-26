import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";

type DossierStage3DProps = {
  hasOpenedCase: boolean;
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

function DossierScene({ hasOpenedCase, view, deckMotion }: DossierStage3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const folderRef = useRef<THREE.Group>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotionPreference();

  const accentColor = view === "deck" ? "#c7b987" : view === "missions" ? "#b8d9c9" : "#d0c49a";
  const motionBias = deckMotion === "next" ? -0.18 : deckMotion === "previous" ? 0.18 : deckMotion === "shuffle" ? 0.32 : 0;

  useFrame((state, delta) => {
    if (!groupRef.current || !glassRef.current || !ringRef.current || reducedMotion) return;

    const pointerX = THREE.MathUtils.clamp(state.pointer.x, -0.72, 0.72);
    const pointerY = THREE.MathUtils.clamp(state.pointer.y, -0.72, 0.72);
    const targetRotation = new THREE.Euler(pointerY * -0.055, pointerX * 0.08 + motionBias, pointerX * -0.035);
    easing.dampE(groupRef.current.rotation, targetRotation, 0.18, delta);
    easing.damp3(groupRef.current.position, [pointerX * 0.09, pointerY * 0.05, hasOpenedCase ? -0.32 : -0.12], 0.2, delta);
    glassRef.current.rotation.z += delta * 0.018;
    ringRef.current.rotation.z -= delta * 0.025;
    if (folderRef.current) {
      folderRef.current.position.y = -0.44 + Math.sin(state.clock.elapsedTime * 0.85) * 0.035;
      folderRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.42) * 0.018;
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
          {[-1.05, -0.38, 0.42, 1.08].map((x, index) => (
            <mesh key={x} position={[x, Math.sin(index) * 0.28, 0.02]}>
              <sphereGeometry args={[index === 2 ? 0.038 : 0.03, 16, 16]} />
              <meshStandardMaterial color="#f2ead4" emissive="#eadfbd" emissiveIntensity={0.22} roughness={0.2} />
            </mesh>
          ))}
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
