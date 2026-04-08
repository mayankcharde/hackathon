import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const InteractiveNeuralVortex: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return undefined;

    const gl =
      (canvasEl.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvasEl.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      console.error("WebGL not supported");
      return undefined;
    }

    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;
      
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
        }
        return res.x + res.y;
      }
      
      void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = .5 * pow(1. - p, 2.);
        float t = .001 * u_time;
        vec3 color = vec3(0.);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.);
        noise += pow(noise, 10.);
        noise = max(.0, noise - .5);
        noise *= (1. - length(vUv - .5));
        color = vec3(0.5, 0.15, 0.65);
        color = mix(color, vec3(0.02, 0.7, 0.9), 0.32 + 0.16 * sin(2.0 * u_scroll_progress + 1.2));
        color += vec3(0.15, 0.0, 0.6) * sin(2.0 * u_scroll_progress + 1.5);
        color = color * noise;
        gl_FragColor = vec4(color, noise);
      }
    `;

    const compileShader = (
      ctx: WebGLRenderingContext,
      source: string,
      type: number,
    ): WebGLShader | null => {
      const shader = ctx.createShader(type);
      if (!shader) return null;
      ctx.shaderSource(shader, source);
      ctx.compileShader(shader);

      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error("Shader error:", ctx.getShaderInfoLog(shader));
        ctx.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return undefined;

    const program = gl.createProgram();
    if (!program) return undefined;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return undefined;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRatio = gl.getUniformLocation(program, "u_ratio");
    const uPointerPosition = gl.getUniformLocation(program, "u_pointer_position");
    const uScrollProgress = gl.getUniformLocation(program, "u_scroll_progress");

    const resizeCanvas = () => {
      const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
      canvasEl.width = window.innerWidth * devicePixelRatio;
      canvasEl.height = window.innerHeight * devicePixelRatio;
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
      if (uRatio) gl.uniform1f(uRatio, canvasEl.width / canvasEl.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const render = () => {
      const currentTime = performance.now();
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.2;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.2;

      if (uTime) gl.uniform1f(uTime, currentTime);
      if (uPointerPosition) {
        gl.uniform2f(
          uPointerPosition,
          pointer.current.x / window.innerWidth,
          1 - pointer.current.y / window.innerHeight,
        );
      }
      if (uScrollProgress) {
        gl.uniform1f(
          uScrollProgress,
          window.pageYOffset / (2 * window.innerHeight),
        );
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.tX = event.clientX;
      pointer.current.tY = event.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      pointer.current.tX = event.touches[0].clientX;
      pointer.current.tY = event.touches[0].clientY;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);

      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (vertexBuffer) gl.deleteBuffer(vertexBuffer);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden font-sans">
      <canvas
        ref={canvasRef}
        id="neuro"
        className="fixed inset-0 w-full h-full pointer-events-none opacity-95 z-0"
      />

      <section className="flex flex-col items-center justify-center flex-1 w-full px-6 z-10 mt-16">
        <div className="max-w-3xl w-full nv-outline rounded-3xl px-7 md:px-10 py-12 md:py-14 text-center backdrop-blur-md nv-animate">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full nv-chip mb-6">
            AI-Powered Recovery Network
          </div>

          <h1 className="nv-heading nv-h1 mb-4">
            Lost Today. Returned <span className="nv-gradient">Smarter</span> Tomorrow.
          </h1>

          <p className="nv-heading nv-h2 mb-9 text-white/70 max-w-2xl mx-auto">
            FoundIt transforms every QR scan into a trusted return flow with verified finder identity,
            private real-time messaging, and modern safety controls built for everyday life.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link
              to="/register"
              className="inline-block w-full sm:w-auto px-8 py-4 rounded-xl nv-outline-btn nv-cta font-semibold text-white"
            >
              Protect My Items
            </Link>
            <Link
              to="/scan"
              className="inline-block w-full sm:w-auto px-8 py-4 rounded-xl nv-outline-btn font-semibold text-white/90"
            >
              Scan Lost Item
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left sm:text-center">
            <div className="nv-stat">
              <p className="nv-stat-title">Private by Design</p>
              <p className="nv-stat-sub">No public phone numbers exposed</p>
            </div>
            <div className="nv-stat">
              <p className="nv-stat-title">Instant Connections</p>
              <p className="nv-stat-sub">Owner and finder chat in seconds</p>
            </div>
            <div className="nv-stat">
              <p className="nv-stat-title">Trusted Verification</p>
              <p className="nv-stat-sub">Proof-based return workflow</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes nvSlideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nv-animate {
          animation: nvSlideInUp 0.8s both;
        }

        .nv-heading {
          font-family: 'Sora', 'Geist', ui-sans-serif, system-ui, sans-serif;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        .nv-h1 {
          font-size: 38px;
          line-height: 1.08;
          font-weight: 700;
        }

        @media (min-width: 768px) {
          .nv-h1 { font-size: 58px; }
        }

        .nv-h2 {
          font-size: 18px;
          line-height: 1.35;
          font-weight: 400;
        }

        .nv-gradient {
          background: linear-gradient(100deg, #8df7e5 0%, #4bc6ff 55%, #b8f6ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .nv-chip {
          border: 1px solid rgba(148, 238, 255, 0.35);
          background: rgba(19, 41, 72, 0.45);
          color: rgba(212, 247, 255, 0.95);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .nv-outline,
        .nv-outline-btn {
          border: 2px solid rgba(255, 255, 255, 0.14);
          background: rgba(8, 16, 32, 0.32);
          box-shadow: none;
        }

        .nv-cta {
          background: linear-gradient(100deg, rgba(77, 234, 210, 0.28), rgba(56, 189, 248, 0.3));
          border-color: rgba(132, 235, 255, 0.6);
        }

        .nv-outline-btn:hover {
          border-color: rgba(56, 189, 248, 0.65);
          background: rgba(14, 165, 233, 0.22);
        }

        .nv-stat {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(8, 16, 32, 0.28);
          border-radius: 16px;
          padding: 14px;
        }

        .nv-stat-title {
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin: 0 0 4px;
        }

        .nv-stat-sub {
          color: rgba(226, 232, 240, 0.72);
          font-size: 12px;
          line-height: 1.35;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default InteractiveNeuralVortex;