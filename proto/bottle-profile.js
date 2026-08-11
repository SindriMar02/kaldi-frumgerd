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

// Gold crown cap: a real crown is ~11mm tall — the silhouette measurement read 20mm
// because specular halo at the top aliased into the alpha. Authored at true cap
// proportions instead; smooth silhouette, the 21 crimp flutes are left to the metal.
export const CAP = vec([
  [15.0, 219.5], [15.2, 221.5], [15.2, 227.0], [14.8, 229.3], [13.6, 230.6],
  [11.0, 231.3], [6.0, 231.6], [0.0, 231.6],
]);

// Where things live on the glass (mm from bottle bottom):
export const BODY_R = 30.0;          // body radius
export const NECK_R = 17.3;          // neck-band zone radius
export const BOTTLE_H = 231.6;       // to cap top (true crown proportions)
export const FILL_LINE = 195.0;      // headspace above -> glass reads lighter amber
export const LABEL_LO = 26.0, LABEL_HI = 121.0;   // default die-cut body-label band
export const NECK_LO = 162.0, NECK_HI = 182.0;    // measured off the gold rows directly
