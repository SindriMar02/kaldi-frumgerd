import * as THREE from 'three';

// Kaldi 330ml longneck, measured off their own product photography (1.png, alpha
// silhouette half-width sampled every ~4mm against body radius 30mm — same method as
// the engine's can profile). Total measured height 236.8mm.
//
// Cleaned per the engine's antialiasing lesson: the raw cap rows jitter r 11.9..14.2
// because the crimp scallops alias at 1620px — a crown cap is rotationally smooth at
// this scale, so the cap is authored smooth. The r17.3 plateau at h148..166 is real
// (the neck band sits there), kept.
//
// ORDER MATTERS: authored bottom-up so LatheGeometry face normals point OUT.

const S = 0.01;
const vec = p => p.map(([r, y]) => new THREE.Vector2(r * S, y * S));

// Glass, base ring to lip. Ends by closing inward UNDER the cap (rim -> centre, same
// direction of travel as the can END fix, so the closing disc faces outward/up).
export const GLASS = vec([
  [15.0, 0.0], [21.0, 0.4], [24.5, 1.2], [26.3, 2.5], [28.0, 4.5], [28.9, 6.5],
  [29.5, 9.0], [29.8, 12.0], [29.9, 20.0], [29.9, 60.0], [29.9, 100.0], [30.0, 118.0],
  /* shoulder smoothed against the photo: the first pass broke into a cone here */
  [29.9, 123.0], [29.6, 126.0], [28.9, 130.0], [27.8, 133.5], [26.2, 137.0],
  [24.2, 140.5], [22.0, 143.5], [20.0, 146.0], [18.6, 148.5],
  [17.6, 151.5], [17.3, 156.0], [17.3, 165.0],
  [16.9, 170.0], [16.4, 176.0], [15.8, 182.0], [15.2, 188.0], [14.6, 194.0],
  [14.0, 200.0], [13.6, 205.0], [13.3, 210.0], [13.1, 214.0], [13.1, 221.0],
  [9.0, 221.0], [0.0, 221.0],
]);

// Concave base dome, authored bottom-up from the centre push-up out to the base ring,
// so the underside normals face DOWN/OUT (the transparent-bottom trap, third time).
export const BOTTLE_BASE = vec([
  [0.0, 6.0], [6.0, 5.2], [10.0, 3.6], [13.0, 1.8], [15.0, 0.0],
]);

// Crown cap, built from the photograph rather than imagined. What the real cap is:
// a BRIGHT pale-gold smooth dome that overhangs, a fairly smooth skirt that widens
// going DOWN, and 21 separated droplet teeth at the bottom with dark notches between
// them — the glass shows through the notches, so the teeth must be real silhouette,
// not a displacement ripple. (The displaced-ripple version read as cloth.)
export function buildCrownCap(){
  const S = .01;
  // dome + rim + smooth upper skirt as a lathe (all smooth on the real cap)
  const dome = new THREE.LatheGeometry([
    [0.0, 231.6],[4.5, 231.5],[9.0, 231.3],[12.6, 230.9],[14.2, 230.3],
    [14.85,229.6],[15.05,228.9],[15.10,228.2],
  ].map(([r,y]) => new THREE.Vector2(r*S, y*S)), 168);

  // the toothed skirt: a parametric sheet whose BOTTOM EDGE is the tooth wave
  const FL = 21, COLS = FL*14, ROWS = 8;
  const yTop = 228.2, teethTop = 224.6, teethDepth = 2.6;
  const rTop = 15.10, rBot = 15.75;             // the skirt flares outward downward
  const pos = [], uvs = [], idx = [];
  for (let j = 0; j <= ROWS; j++){
    const v = j / ROWS;
    for (let i = 0; i <= COLS; i++){
      const th = i / COLS * Math.PI * 2;
      const w = Math.pow(.5 + .5*Math.cos(FL*th), .8);     // 1 at tooth centre, 0 at notch
      /* the photo's teeth are broad rounded droplets, not points: the DEPTH follows a
         flattened wave (sqrt) so each tooth bottoms out wide, while the notch stays
         narrow */
      const yBot = teethTop - teethDepth * Math.sqrt(w);
      const y = yTop + (yBot - yTop) * v;
      let r = rTop + (rBot - rTop) * v;
      r += .18 * w * v;                                    // teeth bulge a whisker
      if (v > .82) r -= (v - .82) * 2.2 * w;               // tips curl inward to grip
      pos.push(Math.cos(th)*r*S, y*S, Math.sin(th)*r*S);
      uvs.push(i/COLS, v);
    }
  }
  for (let j = 0; j < ROWS; j++)
    for (let i = 0; i < COLS; i++){
      const a = j*(COLS+1)+i, b = a+1, c = a+COLS+1, d = c+1;
      idx.push(a,c,b, b,c,d);
    }
  const skirt = new THREE.BufferGeometry();
  skirt.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  skirt.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  skirt.setIndex(idx);
  skirt.computeVertexNormals();
  return { dome, skirt };
}

// Where things live on the glass (mm from bottle bottom):
export const BODY_R = 30.0;          // body radius
export const NECK_R = 17.3;          // neck-band zone radius
export const BOTTLE_H = 231.6;       // to cap top (true crown proportions)
export const FILL_LINE = 195.0;      // headspace above -> glass reads lighter amber
export const LABEL_LO = 26.0, LABEL_HI = 121.0;   // default die-cut body-label band
export const NECK_LO = 162.0, NECK_HI = 182.0;    // measured off the gold rows directly
