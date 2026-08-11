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

// Gold crown cap. A crown's silhouette is NOT a smooth cone: a flat top disc
// overhangs a skirt of 21 scalloped lobes that bulge outward and hang lower than the
// slots between them. The profile below carries the disc and the rim roll; the flutes
// themselves are applied as a radial + vertical displacement in crownCapGeometry(),
// because a lathe is rotationally symmetric by definition.
export const CAP = vec([
  [14.95, 219.4],   // skirt bottom edge (scalloped by the displacement)
  [15.05, 220.6],
  [15.10, 222.5],
  [15.15, 224.5],
  [15.20, 226.2],   // top of the flute zone
  [15.35, 227.4],   // the disc overhangs the skirt
  [15.40, 228.4],   // flat rim band: the crisp horizontal highlight in the photo
  [15.20, 229.4],   // rim rolls over
  [14.60, 230.2],
  [12.80, 230.9],
  [ 9.00, 231.3],
  [ 4.50, 231.5],
  [ 0.00, 231.6],
]);

export const CAP_FLUTES = 21;          // the real count on a crown cap
export const CAP_FLUTE_LO = 219.4;     // mm: flutes are full strength here
export const CAP_FLUTE_HI = 227.2;     // mm: and gone by here

// Where things live on the glass (mm from bottle bottom):
export const BODY_R = 30.0;          // body radius
export const NECK_R = 17.3;          // neck-band zone radius
export const BOTTLE_H = 231.6;       // to cap top (true crown proportions)
export const FILL_LINE = 195.0;      // headspace above -> glass reads lighter amber
export const LABEL_LO = 26.0, LABEL_HI = 121.0;   // default die-cut body-label band
export const NECK_LO = 162.0, NECK_HI = 182.0;    // measured off the gold rows directly
