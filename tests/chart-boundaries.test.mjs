import test from "node:test";
import assert from "node:assert/strict";
for (const id of ["quiet-workspace","midnight-ledger"]) {
  const { validSeries, lineCoordinates, barGeometry } = await import("../systems/"+id+"/web/chart-data.js");
  test(id+" 图表保留边界含义", () => {
    assert.deepEqual(lineCoordinates([]),[]);
    assert.equal(lineCoordinates([0])[0].x,320);
    assert.equal(lineCoordinates([0,0])[1].y,110);
    for (const input of [[NaN],[Infinity],[null],["1"],[undefined]]) assert.equal(validSeries(input),false);
    for(const point of lineCoordinates([-Number.MAX_VALUE,Number.MAX_VALUE])) assert.ok(Number.isFinite(point.y));
    for(const bar of barGeometry([{value:-Number.MAX_VALUE},{value:Number.MAX_VALUE}])) assert.equal(bar.height,50);
    const bars = barGeometry([{value:-5},{value:0},{value:5}]);
    assert.deepEqual(bars.map(b=>b.height),[50,0,50]);
    assert.equal(bars[0].top,50);
    assert.equal(bars[2].top,0);
  });
}
