import { useEffect, useRef } from "react";
import Lottie from "lottie-react";

// Animation JSON simplifiée pour workflow de commande
const orderWorkflowAnimation = {
  v: "5.7.1",
  meta: { g: "LottieFiles AE 0.1.20" },
  fr: 30,
  ip: 0,
  op: 180,
  w: 500,
  h: 300,
  nm: "Order Workflow",
  ddd: 0,
  assets: [],
  layers: [
    // Background
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Background",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [250, 150, 0] },
        a: { a: 0, k: [250, 150, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "rc",
          d: 1,
          s: { a: 0, k: [500, 300] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 }
        }, {
          ty: "fl",
          c: { a: 0, k: [0.95, 0.97, 1, 1] },
          o: { a: 0, k: 100 }
        }]
      }]
    },
    // Step 1: Command
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Step 1",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 1, k: [
          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 0, s: [80, 150, 0], to: [0, 0, 0], ti: [0, 0, 0] },
          { t: 60, s: [80, 150, 0] }
        ]},
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "rc",
          d: 1,
          s: { a: 0, k: [60, 60] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 8 }
        }, {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.6, 1, 1] },
          o: { a: 0, k: 100 }
        }, {
          ty: "st",
          c: { a: 0, k: [0.1, 0.4, 0.8, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 }
        }]
      }]
    },
    // Step 2: Writing
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Step 2",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 1, k: [
          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 60, s: [250, 150, 0], to: [0, 0, 0], ti: [0, 0, 0] },
          { t: 120, s: [250, 150, 0] }
        ]},
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "rc",
          d: 1,
          s: { a: 0, k: [60, 60] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 8 }
        }, {
          ty: "fl",
          c: { a: 0, k: [1, 0.8, 0.2, 1] },
          o: { a: 0, k: 100 }
        }, {
          ty: "st",
          c: { a: 0, k: [0.8, 0.6, 0.1, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 }
        }]
      }]
    },
    // Step 3: Validation
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Step 3",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 1, k: [
          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 120, s: [420, 150, 0], to: [0, 0, 0], ti: [0, 0, 0] },
          { t: 180, s: [420, 150, 0] }
        ]},
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "rc",
          d: 1,
          s: { a: 0, k: [60, 60] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 8 }
        }, {
          ty: "fl",
          c: { a: 0, k: [0.2, 0.8, 0.3, 1] },
          o: { a: 0, k: 100 }
        }, {
          ty: "st",
          c: { a: 0, k: [0.1, 0.6, 0.2, 1] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 }
        }]
      }]
    },
    // Arrows
    {
      ddd: 0,
      ind: 5,
      ty: 4,
      nm: "Arrow 1",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [155, 150, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "sh",
          ks: {
            a: 0,
            k: {
              c: false,
              v: [[-10, -3], [10, -3], [10, 3], [20, 0], [10, -3]],
              i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
              o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
            }
          }
        }, {
          ty: "fl",
          c: { a: 0, k: [0.5, 0.5, 0.5, 1] },
          o: { a: 0, k: 100 }
        }]
      }]
    },
    {
      ddd: 0,
      ind: 6,
      ty: 4,
      nm: "Arrow 2",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [335, 150, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [{
        ty: "gr",
        it: [{
          ty: "sh",
          ks: {
            a: 0,
            k: {
              c: false,
              v: [[-10, -3], [10, -3], [10, 3], [20, 0], [10, -3]],
              i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
              o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
            }
          }
        }, {
          ty: "fl",
          c: { a: 0, k: [0.5, 0.5, 0.5, 1] },
          o: { a: 0, k: 100 }
        }]
      }]
    }
  ]
};

export function OrderWorkflowAnimation() {
  const lottieRef = useRef<any>();

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.8);
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <Lottie
        lottieRef={lottieRef}
        animationData={orderWorkflowAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: 'auto' }}
      />
      <div className="flex justify-between text-center mt-4 px-4">
        <div className="flex-1">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">1</div>
          <p className="text-xs font-medium">Commande</p>
        </div>
        <div className="flex-1">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">2</div>
          <p className="text-xs font-medium">Rédaction</p>
        </div>
        <div className="flex-1">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">3</div>
          <p className="text-xs font-medium">Livraison</p>
        </div>
      </div>
    </div>
  );
}