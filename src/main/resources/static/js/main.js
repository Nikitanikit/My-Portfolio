import * as THREE from "three";

const canvas = document.querySelector("#hero-canvas");
const art = document.querySelector(".hero-art");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && art) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (error) {
    console.warn("WebGL is unavailable; the CSS hero artwork remains visible.", error);
  }

  if (renderer) {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(art.clientWidth, art.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, art.clientWidth / art.clientHeight, 0.1, 100);
    camera.position.z = 7.2;

    scene.add(new THREE.AmbientLight(0xffffff, 1.35));
    const keyLight = new THREE.PointLight(0xd9ffab, 32, 20);
    keyLight.position.set(3, 3, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x91a8ff, 20, 20);
    rimLight.position.set(-4, -2, 1);
    scene.add(rimLight);

    const sculpture = new THREE.Group();
    scene.add(sculpture);

    const coreGeometry = new THREE.IcosahedronGeometry(1.02, 4);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x6d755f,
      metalness: 0.82,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      emissive: 0x1c2810,
      emissiveIntensity: 0.45
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    sculpture.add(core);

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xc6ff63, metalness: 0.72, roughness: 0.28,
      emissive: 0x263c0d, emissiveIntensity: 0.55
    });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.025, 12, 180), ringMaterial);
    ringA.rotation.set(1.03, 0.28, 0.25);
    sculpture.add(ringA);

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(1.72, 0.012, 8, 180),
      new THREE.MeshStandardMaterial({ color: 0xe9edf3, metalness: 0.85, roughness: 0.3 })
    );
    ringB.rotation.set(0.22, 1.08, -0.45);
    sculpture.add(ringB);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.22, 2),
      new THREE.MeshBasicMaterial({ color: 0xc6ff63, wireframe: true, transparent: true, opacity: 0.16 })
    );
    sculpture.add(wire);

    const beadMaterial = new THREE.MeshStandardMaterial({
      color: 0xc6ff63, metalness: 0.45, roughness: 0.2,
      emissive: 0x557c21, emissiveIntensity: 0.7
    });
    const beads = [];
    for (let i = 0; i < 7; i++) {
      const bead = new THREE.Mesh(new THREE.SphereGeometry(i % 3 === 0 ? 0.065 : 0.035, 18, 18), beadMaterial);
      const angle = (i / 7) * Math.PI * 2;
      bead.position.set(Math.cos(angle) * 1.85, Math.sin(angle) * 1.2, Math.sin(angle * 1.7) * 0.5);
      sculpture.add(bead);
      beads.push({ mesh: bead, angle });
    }

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    for (let i = 0; i < 220; i++) {
      starPositions.push((Math.random() - 0.5) * 6.5, (Math.random() - 0.5) * 6.5, (Math.random() - 0.5) * 2.5 - 0.7);
    }
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xe4e8dc, size: 0.012, transparent: true, opacity: 0.55 }));
    scene.add(stars);

    let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
    let artIsVisible = !("IntersectionObserver" in window);
    let rafId = null;
    const onPointerMove = (event) => {
      if (reducedMotion) return;
      const rect = art.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };
    const onPointerLeave = () => { targetX = 0; targetY = 0; };
    art.addEventListener("pointermove", onPointerMove, { passive: true });
    art.addEventListener("pointerleave", onPointerLeave, { passive: true });

    const resize = () => {
      const width = Math.max(art.clientWidth, 1);
      const height = Math.max(art.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (reducedMotion) renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(art);

    const clock = new THREE.Clock();
    const shouldAnimate = () => !reducedMotion && artIsVisible && !document.hidden;
    const stopRendering = () => {
      if (rafId === null) return;
      cancelAnimationFrame(rafId);
      rafId = null;
    };
    const render = () => {
      rafId = null;
      if (!shouldAnimate()) return;
      const t = clock.getElapsedTime();
      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;
      sculpture.rotation.y = t * 0.13 + pointerX;
      sculpture.rotation.x = Math.sin(t * 0.22) * 0.1 + pointerY;
      ringA.rotation.z += 0.0017;
      ringB.rotation.x += 0.001;
      core.rotation.y = -t * 0.09;
      beads.forEach(({ mesh, angle }, index) => {
        mesh.position.y = Math.sin(t * 0.55 + angle) * 1.25;
        mesh.position.x = Math.cos(angle + t * 0.12) * (1.7 + (index % 2) * 0.2);
      });
      stars.rotation.z = t * 0.008;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    };
    const updateRendering = () => {
      if (shouldAnimate()) {
        if (rafId === null) render();
      } else {
        stopRendering();
      }
    };
    const onVisibilityChange = () => updateRendering();
    document.addEventListener("visibilitychange", onVisibilityChange);

    const visibilityObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => {
        artIsVisible = entries.some(entry => entry.isIntersecting);
        updateRendering();
      }, { threshold: 0.01 })
      : null;
    visibilityObserver?.observe(art);

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      updateRendering();
    }

    window.addEventListener("pagehide", () => {
      stopRendering();
      observer.disconnect();
      visibilityObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      art.removeEventListener("pointermove", onPointerMove);
      art.removeEventListener("pointerleave", onPointerLeave);
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringMaterial.dispose();
      starGeometry.dispose();
    }, { once: true });
  }
}
